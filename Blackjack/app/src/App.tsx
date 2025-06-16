import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import {Navegacion} from "./Navegacion"
import React, {useEffect, useReducer, useState} from "react"
import {Card, EMPTY_CARD, getCardFromString} from "./Card";
import {DealerDeck} from "./DealerDeck";
import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";
import PlayerInfo from "./PlayerInfo";
import {inicializarWallet} from "./WalletUtils"
import {Game} from "./Game";
import {ContractService} from "./ContractService";

export const App = () => {

    async function reset() {
        fetch("http://localhost:8080/new", {credentials: "include"})
            .then(res => res.json())
            .then(async (address: string) => {
                console.log('Respuesta HTTP /new: ', address)
                setContractAddress(address)

                updateDealer1(EMPTY_CARD)
                updateDealer2(EMPTY_CARD)
                updateDealer3(EMPTY_CARD)
                updateDealer4(EMPTY_CARD)

                updatePlayer1(EMPTY_CARD)
                updatePlayer2(EMPTY_CARD)
                updatePlayer3(EMPTY_CARD)
                updatePlayer4(EMPTY_CARD)
                const game: Game = {
                    playerCards: [],
                    dealerCards: [],
                    mensajes: [],
                    bet: 0,
                    player: '',
                    address: contractAddress,
                    status: "NUEVO",
                }
                updateUi(game)
            });
    }

    function updateUi(game: Game) {
        setMensajes(game.mensajes)
        setJuegoStatus(game.status)
        setCards(game)
    }

    async function iniciarJuego() {
        if (dealer2.number !== 0 || player2.number !== 0) {
            console.error("Estado Invalido")
            return
        }
        const contractService = new ContractService(contractAddress, provider);
        const gameStatus = await contractService.iniciar(betMoney);
        updateUi(gameStatus);
    }

    function setCards(game: Game) {
        if (dealer1.number === 0 && game.dealerCards.length > 0) {
            updateDealer1(getCardFromString(game.dealerCards[0]))
        }
        if (dealer2.number === 0 && game.dealerCards.length > 1) {
            updateDealer2(getCardFromString(game.dealerCards[1]))
        }
        if (dealer3.number === 0 && game.dealerCards.length > 2) {
            updateDealer3(getCardFromString(game.dealerCards[2]))
        }
        if (dealer4.number === 0 && game.dealerCards.length > 3) {
            updateDealer4(getCardFromString(game.dealerCards[3]))
        }

        if (player1.number === 0 && game.playerCards.length > 0) {
            updatePlayer1(getCardFromString(game.playerCards[0]))
        }
        if (player2.number === 0 && game.playerCards.length > 1) {
            updatePlayer2(getCardFromString(game.playerCards[1]))
        }
        if (player3.number === 0 && game.playerCards.length > 2) {
            updatePlayer3(getCardFromString(game.playerCards[2]))
        }
        if (player4.number === 0 && game.playerCards.length > 3) {
            updatePlayer4(getCardFromString(game.playerCards[3]))
        }
        if (player5.number === 0 && game.playerCards.length > 4) {
            updatePlayer5(getCardFromString(game.playerCards[4]))
        }
    }

    async function pedir() {
        const contractService = new ContractService(contractAddress, provider);
        const gameStatus = await contractService.pedir();
        updateUi(gameStatus)
    }

    async function stand() {
        const contractService = new ContractService(contractAddress, provider);
        const gameStatus = await contractService.stand();
        updateUi(gameStatus)
    }

    async function double() {
        const nuevaApuesta = betMoney * 2;
        const contractService = new ContractService(contractAddress, provider);
        const gameStatus = await contractService.doblar(nuevaApuesta);
        updateBetMoney(nuevaApuesta);
        updateUi(gameStatus)
    }

    async function rendirse() {
        const contractService = new ContractService(contractAddress, provider);
        const gameStatus = await contractService.rendirse();
        updateUi(gameStatus)
    }

    let mensajesIniciales: string[] = [];

    const [playerAddress, setPlayerAddress] = useState("")

    const [dealer1, updateDealer1] = useReducer((state: Card, updates: Card) => ({...state, ...updates}), EMPTY_CARD)
    const [dealer2, updateDealer2] = useReducer((state: Card, updates: Card) => ({...state, ...updates}), EMPTY_CARD)
    const [dealer3, updateDealer3] = useReducer((state: Card, updates: Card) => ({...state, ...updates}), EMPTY_CARD)
    const [dealer4, updateDealer4] = useReducer((state: Card, updates: Card) => ({...state, ...updates}), EMPTY_CARD)
    const [player1, updatePlayer1] = useReducer((state: Card, updates: Card) => ({...state, ...updates}), EMPTY_CARD)
    const [player2, updatePlayer2] = useReducer((state: Card, updates: Card) => ({...state, ...updates}), EMPTY_CARD)
    const [player3, updatePlayer3] = useReducer((state: Card, updates: Card) => ({...state, ...updates}), EMPTY_CARD)
    const [player4, updatePlayer4] = useReducer((state: Card, updates: Card) => ({...state, ...updates}), EMPTY_CARD)
    const [player5, updatePlayer5] = useReducer((state: Card, updates: Card) => ({...state, ...updates}), EMPTY_CARD)
    const [juegoStatus, setJuegoStatus] = useState("NO INICIADO");
    const [betMoney, updateBetMoney] = useState(0)
    const [contractAddress, setContractAddress] = useState("")
    const [mensajes, setMensajes] = useState(mensajesIniciales)
    const [provider, setProvider] = useState(null as any);

    useEffect(() => inicializarWallet(setProvider, setPlayerAddress), []);

    function getMensaje(i: number, mensaje: string) {
        return <div key={"mensaje_" + i}>{mensaje}</div>;
    }

    function getListaMensajes() {
        const regexp = new RegExp("0x.*");
        const mensajeComponente = [];
        for (let i = 0; i < mensajes.length; i++) {
            const mensajeSinAddress = mensajes[i].replace(regexp, '');
            const mensaje = getMensaje(i, mensajeSinAddress);
            mensajeComponente.push(mensaje)
        }
        return <div id="mensajes">{mensajeComponente}</div>
    }

    function getJuegoStatus() {
        const style = {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#FFFFFF",
            fontWeight: "bold"
        };
        return <div style={style}>{juegoStatus.replaceAll("_", " ")}</div>;
    }

    function isJuegoCorriendo() {
        // @ts-ignore
        return juegoStatus != "FINALIZADO" && juegoStatus != "NUEVO" && juegoStatus != 'NO INICIADO';
    }

    function jugadorConCartas() {
        return player1.number !== 0;
    }

    function puedeIniciar() {
        return juegoStatus == "NUEVO" && !jugadorConCartas() && betMoney % 100 === 0;
    }

    function puedePedir() {
        return isJuegoCorriendo() && jugadorConCartas();
    }

    function puedeQuedarse() {
        return isJuegoCorriendo() && jugadorConCartas();
    }

    function puedeCambiarApuesta() {
        return juegoStatus == "NUEVO" && !jugadorConCartas();
    }

    function puedeDoblar() {
        return isJuegoCorriendo() && jugadorConCartas() && player2.number !== 0 && player3.number === 0;
    }

    function puedeRetirarse() {
        return isJuegoCorriendo() && jugadorConCartas() && player2.number !== 0 && player3.number === 0;
    }

    function getBoard() {

        return <div>
            <DealerDeck/>
            <DealerHand card1={dealer1.src} card2={dealer2.src} card3={dealer3.src}
                        card4={dealer4.src} card5={player5.src}/>

            <PlayerHand card1={player1.src} card2={player2.src} card3={player3.src}
                        card4={player4.src} card5={player5.src}/>
            <PlayerInfo/>
            <div>Contrato: {contractAddress}</div>
            <div>Apuesta: {betMoney} wei</div>

            <div>
                <button onClick={() => reset()}>Nuevo Juego</button>
            </div>
            <Row>
                <Col>
                    <button onClick={() => iniciarJuego()} disabled={!puedeIniciar()}>Iniciar</button>
                    <input type={"number"} disabled={!puedeCambiarApuesta()} value={betMoney}
                           onChange={(x) => updateBetMoney(parseInt(x.target.value))}/>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div></div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <button onClick={() => pedir()} disabled={!puedePedir()}>Pedir Carta</button>
                    <button onClick={() => stand()} disabled={!puedeQuedarse()}>Quedarse</button>
                    <button onClick={() => double()} disabled={!puedeDoblar()}>Doblar</button>
                    <button onClick={() => rendirse()} disabled={!puedeRetirarse()}>Retirarse</button>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    {getJuegoStatus()}
                </Col>
            </Row>
        </div>
    }

    return (
        <Container fluid>
            <Row>
                <Col style={{background: "#EEEEEE"}}><Navegacion/></Col>
            </Row>
            <Row>
                <Col lg={1}></Col>
                <Col lg={7} style={{background: "#4aa37a"}}>{getBoard()}</Col>
                <Col lg={3} style={{background: "#dfeae1"}}>{getListaMensajes()}</Col>
                <Col lg={1}></Col>
            </Row>
        </Container>
    )
}
