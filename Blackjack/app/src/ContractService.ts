import {BlackjackGame} from "../../blockchain/typechain-types/contracts/BlackjackGame";
import {BigNumber, ethers} from "ethers";
import BlackjackJson from "./contracts/BlackjackGame.json";
import {CardSuit} from "./CardSuit";
import {Game} from "./Game";
import {GameStatus} from "./GameStatus";

class ContractService {

    private readonly contractAddress: string;
    private readonly provider: any;

    constructor(contractAddress: string, provider: any) {
        this.contractAddress = contractAddress;
        this.provider = provider;
    }

    private getAttachedContract(): BlackjackGame {
        const signer = this.provider.getSigner();
        const contract = new ethers.Contract(this.contractAddress, BlackjackJson.abi, signer);
        return contract as any as BlackjackGame;
    }

    async pedir() {
        const contract: BlackjackGame = this.getAttachedContract();
        const respuestaPedido = await contract.pedir({gasLimit: 30_000_000});
        await respuestaPedido.wait();
        return await this.getNewGameStatus(contract);
    }

    async stand() {
        const contract: BlackjackGame = this.getAttachedContract();
        const respuestaQuedarse = await contract.quedarse({gasLimit: 30_000_000})
        await respuestaQuedarse.wait();
        return await this.getNewGameStatus(contract);
    }

    private readonly gasLimit = 30_000_000;

    async doblar(nuevaApuesta: number) {
        const contract: BlackjackGame = this.getAttachedContract();
        const respuestaRendirse = await contract.doblar({value: nuevaApuesta, gasLimit: this.gasLimit})
        await respuestaRendirse.wait();
        return await this.getNewGameStatus(contract);
    }

    async rendirse() {
        const contract: BlackjackGame = this.getAttachedContract();
        const respuestaRendirse = await contract.rendirse({gasLimit: this.gasLimit})
        await respuestaRendirse.wait();
        return await this.getNewGameStatus(contract);
    }

    async iniciar(betMoney: number) {
        const contract: BlackjackGame = this.getAttachedContract();
        const respuestaApostar = await contract.apostar({value: betMoney, gasLimit: this.gasLimit});
        await respuestaApostar.wait();
        const respuestaRepartir = await contract.repartir({value: betMoney, gasLimit: this.gasLimit});
        await respuestaRepartir.wait();
        return await this.getNewGameStatus(contract);
    }

    getCards(nombre: string, cards: any) {
        return cards.map((c: any) => ({
            suit: CardSuit[BigNumber.from(c.suit).toNumber()],
            number: BigNumber.from(c.number).toNumber()
        }))
    }

    async getNewGameStatus(contract: BlackjackGame) {
        const gameFullStatus = await contract.getStatus();
        console.log('GameFullStatus:', gameFullStatus);
        const mensajes = await contract.queryFilter({topics: []});

        const newGame: Game = {
            address: this.contractAddress,
            player: gameFullStatus.player,
            status: GameStatus[gameFullStatus.status],
            bet: parseInt(gameFullStatus.bet._hex, 16),
            dealerCards: this.getCards('Dealer', gameFullStatus.dealerCards),
            playerCards: this.getCards('Player', gameFullStatus.playerCards),
            mensajes: mensajes.map(m => m.args?.text)
        };
        console.log('New Game: ', newGame);
        return newGame;
    }
}

export {ContractService}

