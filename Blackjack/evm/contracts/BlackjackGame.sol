// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/Strings.sol";

contract BlackjackGame {

    modifier onlyCasino(){
        require(msg.sender == casinoWallet, "Only Casino");
        _;
    }

    modifier onlyPlayer(){
        require(msg.sender == playerWallet, "Only Player");
        _;
    }

    uint randNonce = 0;

    enum GameStatus {
        NUEVO,
        ESPERANDO_APUESTA,
        ESPERANDO_REPARTIR,
        ESPERANDO_JUGADOR,
        ESPERANDO_DEALER,
        FINALIZADO
    }

    event Chat(string text);

    struct Card {
        uint suit;
        uint number;
    }

    struct Game {
        address player;
        GameStatus status;
        uint bet;
        Card[] dealerCards;
        Card[] playerCards;
    }

    Game public _game;

    address payable public playerWallet;
    address payable public casinoWallet;

    constructor() payable {
        casinoWallet = payable(msg.sender);
        _game.status = GameStatus.NUEVO;
        _game.bet = 0;
    }

    function getStatus() public view returns (Game memory) {
        return _game;
    }

    function iniciar() public payable {
        require(_game.status == GameStatus.NUEVO);
        playerWallet = payable(msg.sender);
        _game.player = playerWallet;
        _game.status = GameStatus.ESPERANDO_APUESTA;
        emit Chat('Juego iniciado');
    }

    function apostar() public payable onlyPlayer {
        require(_game.status == GameStatus.ESPERANDO_APUESTA, 'Estado Invalido');
        uint chips = msg.value;
        require(chips % 100 == 0, 'Cantidad de chips invalida');

        casinoRecibeChips();
        _game.bet = chips;
        _game.status = GameStatus.ESPERANDO_REPARTIR;
        emit Chat(string.concat('Apuesta de ', Strings.toString(chips), ' chips iniciada'));
    }

    function repartir() public payable onlyPlayer {
        require(_game.status == GameStatus.ESPERANDO_REPARTIR);
        require(_game.bet == msg.value, string.concat('El valor de la apuesta debe ser ', toString(_game.bet)));

        repartirPlayer();
        repartirPlayer();

        repartirDealer();

        _game.status = GameStatus.ESPERANDO_JUGADOR;
        calcularJuego();
    }

    function pedir() public onlyPlayer {
        require(_game.status == GameStatus.ESPERANDO_JUGADOR);
        repartirPlayer();
        _game.status = GameStatus.ESPERANDO_JUGADOR;
        calcularJuego();
    }

    //Las propias reglas del blackjack obligan al crupier a pedir carta si tiene menos de 16 puntos y plantarse si cuenta con entre 17 y 21 puntos
    //Si la banca no logra el blackjack, se paga 3 a 2 (2.5 unidades por cada apostada)
    //Si la banca consigue el blackjack, el pago es 1 a 1
    //Si resulta en empate se anulan las apuestas y se devuelve lo apostado a cada jugador.
    function doblar() public payable onlyPlayer {
        require(_game.status == GameStatus.ESPERANDO_JUGADOR && _game.playerCards.length == 2, 'Solo se puede doblar con 2 cartas en la mano');
        uint newBet = _game.bet * 2;

        require(_game.bet == msg.value, string.concat('El valor agregado a doblar debe ser ', toString(_game.bet)));
        _game.bet = newBet;
        casinoRecibeChips();

        emit Chat(string.concat('El jugador dobla la apuesta a ', Strings.toString(_game.bet), ' chips'));

        repartirPlayer();

        _game.status = GameStatus.ESPERANDO_DEALER;
        calcularJuego();
        calcularFinal();
    }

    function quedarse() public onlyPlayer {
        require(_game.status == GameStatus.ESPERANDO_JUGADOR);
        emit Chat(string.concat('Jugador decide no pedir mas cartas'));
        _game.status == GameStatus.ESPERANDO_DEALER;
        calcularJuego();
        calcularFinal();
    }

    function rendirse() public onlyPlayer {
        require(_game.status == GameStatus.ESPERANDO_JUGADOR);
        uint devolucion = _game.bet / 2;
        casinoPagaChips(devolucion);
        emit Chat(string.concat('El jugador se retira de la partida, se le devuelven ', Strings.toString(devolucion), ' chips'));
        _game.status = GameStatus.FINALIZADO;
    }

    function repartirDealer() private {
        Card memory carta = getRandomCard();
        _game.dealerCards.push(carta);
        emit Chat(string.concat('Se reparte ', getCardText(carta), ' al dealer'));
    }

    function repartirPlayer() private {
        Card memory playerCard = getRandomCard();
        _game.playerCards.push(playerCard);
        emit Chat(string.concat('Se reparte ', getCardText(playerCard), ' al jugador'));
    }

    function calcularJuego() private {
        //BlackJack
        if (getPuntajePlayer() == 21 && _game.playerCards.length == 2) {
            emit Chat(string.concat('El jugador gana el juego con Blackjack. Se paga al jugador'));
            _game.status = GameStatus.FINALIZADO;
            uint pago = (_game.bet * 3) / 2;
            casinoPagaChips(pago);
            return;
        }

        if (getPuntajeDealer() > 21) {
            emit Chat(string.concat('El dealer perdio el juego. Se paga al jugador'));
            _game.status = GameStatus.FINALIZADO;
            uint pago = (_game.bet * 3) / 2;
            casinoPagaChips(pago);
            return;
        }

        if (getPuntajePlayer() > 21) {
            uint puntaje = getPuntajePlayer();
            emit Chat(string.concat('El jugador perdio el juego con ', Strings.toString(puntaje), ' puntos'));
            _game.status = GameStatus.FINALIZADO;
            return;
        }
    }

    function calcularFinal() private {
        if (_game.status == GameStatus.FINALIZADO) {
            return;
        }
        while (getPuntajeDealer() < 17) {
            repartirDealer();
        }
        if (getPuntajeDealer() > 21) {
            emit Chat(string.concat('El dealer perdio el juego. Se paga al jugador'));
            _game.status = GameStatus.FINALIZADO;
            uint pago = (_game.bet * 3) / 2;
            casinoPagaChips(pago);
            return;
        }
        emit Chat(string.concat('El dealer se queda con puntaje ', Strings.toString(getPuntajeDealer())));
        emit Chat(string.concat('El jugador se queda con puntaje ', Strings.toString(getPuntajePlayer())));

        if (getPuntajeDealer() == getPuntajePlayer()) {
            emit Chat(string.concat('Empate. El jugador recibe de vuelta su apuesta'));
            _game.status = GameStatus.FINALIZADO;
            uint pago = _game.bet;
            casinoPagaChips(pago);
            return;
        }

        if (getPuntajeDealer() > getPuntajePlayer()) {
            uint puntaje = getPuntajePlayer();
            emit Chat(string.concat('El jugador perdio el juego con ', Strings.toString(puntaje), ' puntos'));
            _game.status = GameStatus.FINALIZADO;
            return;
        }

        if (getPuntajeDealer() < getPuntajePlayer()) {
            emit Chat(string.concat('El dealer perdio el juego. Se paga al jugador'));
            _game.status = GameStatus.FINALIZADO;
            uint pago = _game.bet * 2;
            casinoPagaChips(pago);
        }
    }

    function getPuntajeDealer() private view returns (uint){
        return getPuntaje(_game.dealerCards);
    }

    function getPuntajePlayer() private view returns (uint){
        return getPuntaje(_game.playerCards);
    }

    function getPuntaje(Card[] memory cards) public pure returns (uint)  {
        uint aces = 0;
        for (uint i = 0; i < cards.length; i++) {
            if (cards[i].number == 1) {
                aces++;
            }
        }
        uint puntaje = 0;
        for (uint i = 0; i < cards.length; i++) {
            if (cards[i].number == 1) {
                puntaje = puntaje + 11;
            } else {
                if (cards[i].number >= 10) {
                    puntaje = puntaje + 10;
                } else {
                    puntaje = puntaje + cards[i].number;
                }
            }
        }
        for (uint i = 0; i < aces; i++) {
            if (puntaje > 21) {
                puntaje = puntaje - 10;
            }
        }
        return puntaje;
    }

    function casinoRecibeChips() private {
        uint chips = msg.value;
        string memory chipsStr = Strings.toString(chips);
        string memory playerAddress = toString(playerWallet);
        (bool sent, bytes memory _data) = casinoWallet.call{value : chips}("");
        if (sent) {
            emit Chat(string.concat('Recepcion de ', chipsStr, ' chips del jugador ', playerAddress));
        } else {
            emit Chat(string.concat('Error de recepcion de ', chipsStr, ' chips del jugador ', playerAddress));
        }
    }

    function casinoPagaChips(uint chips) private {
        string memory chipsStr = Strings.toString(chips);
        string memory playerAddress = toString(playerWallet);
        (bool sent, bytes memory _data) = playerWallet.call{value : chips}("");
        if (sent) {
            emit Chat(string.concat('Pago de ', chipsStr, ' chips a Jugador ', playerAddress));
        } else {
            emit Chat(string.concat('Error de pago de ', chipsStr, ' chips a Jugador ', playerAddress));
        }
    }

    function gameStatus() public view returns (string memory){
        return getStatusText(_game.status);
    }

    function getStatusText(GameStatus status) private pure returns (string memory){
        if (status == GameStatus.NUEVO)
            return "Nuevo";
        if (status == GameStatus.ESPERANDO_APUESTA)
            return "Esperando Apuesta";
        if (status == GameStatus.ESPERANDO_REPARTIR)
            return "Esperando Repartir";
        if (status == GameStatus.ESPERANDO_JUGADOR)
            return "Esperando Jugador";
        if (status == GameStatus.FINALIZADO)
            return "Finalizado";
        return "Error";
    }

    function getCardText(Card memory card) private pure returns (string memory){
        string memory numberText;
        if (card.number == 1)
            numberText = "As";
        if (card.number > 1 && card.number < 11)
            numberText = Strings.toString(card.number);
        if (card.number == 11)
            numberText = "J";
        if (card.number == 12)
            numberText = "Q";
        if (card.number == 13)
            numberText = "K";

        string memory suitText;
        if (card.suit == 0)
            suitText = "Pica";
        if (card.suit == 1)
            suitText = "Corazon";
        if (card.suit == 2)
            suitText = "Trebol";
        if (card.suit == 3)
            suitText = "Diamante";
        return string.concat(numberText, ' de ', suitText);
    }

    function getRandomCard() private returns (Card memory){
        Card memory card;
        card.suit = randomVal(4);
        card.number = randomVal(13) + 1;
        return card;
    }

    function randomVal(uint max) private returns (uint){
        randNonce++;
        return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % max;
    }

    function toString(address account) public pure returns (string memory) {
        return toString(abi.encodePacked(account));
    }

    function toString(uint256 value) public pure returns (string memory) {
        return toString(abi.encodePacked(value));
    }

    function toString(bytes32 value) public pure returns (string memory) {
        return toString(abi.encodePacked(value));
    }

    function toString(bool value) public pure returns (string memory) {
        return toString(abi.encodePacked(value));
    }

    function toString(bytes memory data) public pure returns (string memory) {
        bytes memory alphabet = "0123456789ABCDEF";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2 + i * 2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3 + i * 2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }

}