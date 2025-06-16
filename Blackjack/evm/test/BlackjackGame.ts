import {expect} from "chai"
import {ethers} from "hardhat"
import {BlackjackGame} from "../typechain-types"
import {ContractReceipt, Event} from "ethers";
import {Result} from "@ethersproject/abi";
import dotenv from "dotenv";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";

dotenv.config();

const chai = require('chai');
chai.use(require('chai-string'))


function getSingleEventText(receipt: ContractReceipt) {
    const events = receipt.events;
    const event = events?.at(0) as Event;
    const args = event.args as Result;
    return args[0];
}

function getMultipleEventsText(receipt: ContractReceipt) {
    let eventsText = []
    const events = receipt.events as Event[];
    for (let event of events) {
        const args = event.args as Result;
        for (let arg of args) {
            eventsText.push(arg)
        }
    }
    return eventsText;
}

async function getBalance(signer: SignerWithAddress) {
    return await ethers.provider.getBalance(signer.address);
}

describe("Blackjack Game", function () {
    let contract: any
    let casinoSigner: SignerWithAddress;
    let playerSigner: SignerWithAddress;

    let blackjackCasino: BlackjackGame
    let blackjackPlayer: BlackjackGame

    beforeEach(async function () {
        const signers = await ethers.getSigners();
        casinoSigner = (signers.filter(s => s.address == process.env.ADDRESS))[0];
        playerSigner = (signers.filter(s => s.address == process.env.PLAYER_ADDRESS))[0];

        contract = await ethers.getContractFactory("BlackjackGame", casinoSigner)
        blackjackCasino = await contract.deploy()
        blackjackPlayer = blackjackCasino.connect(playerSigner);

    });

    describe("Blackjack Tests", function () {
        it("Debe finalizar correctamente", async function () {
            const amount = 200;

            const balancePlayer1 = await getBalance(playerSigner);

            const iniciarTransaction = await blackjackPlayer.iniciar();
            const balancePlayer2 = await getBalance(playerSigner);
            expect(balancePlayer2.lt(balancePlayer1));

            const iniciarReceipt = await iniciarTransaction.wait();
            const iniciarText = getSingleEventText(iniciarReceipt);
            expect(iniciarText).eq('Juego iniciado')
            const balancePlayer3 = await getBalance(playerSigner);
            expect(balancePlayer3.lt(balancePlayer2));

            const apostarTransaction = await blackjackPlayer.apostar({value: amount});
            const apostarReceipt = await apostarTransaction.wait()
            const apostarText = getSingleEventText(apostarReceipt)
            expect(apostarText).equalIgnoreCase('Recepcion de 200 chips del jugador ' + playerSigner.address)
            const balancePlayer4 = await getBalance(playerSigner);
            expect(balancePlayer4.lt(balancePlayer3));

            const repartirTransaccion = await blackjackPlayer.repartir({value: amount});
            const repartirReceipt = await repartirTransaccion.wait();
            const eventos = getMultipleEventsText(repartirReceipt);
            for (const evento of eventos) {
                console.log('Evento: ', evento);
            }

            const balancePlayer5 = await getBalance(playerSigner);
            expect(balancePlayer5.lt(balancePlayer4));

            expect(eventos.length).equals(3)
            for (const evento of eventos) {
                console.log("Evento: " + evento);
            }

            const status = await blackjackCasino.gameStatus();
            expect(status).equals("Esperando Jugador")
        });

        it("Debe fallar por chips invalidos", async function () {
            const blackjackGameSigned = blackjackCasino.connect(playerSigner);
            const iniciarTransaction = await blackjackGameSigned.iniciar();
            const iniciarReceipt = await iniciarTransaction.wait();
            const iniciarText = getSingleEventText(iniciarReceipt);
            expect(iniciarText).equals('Juego iniciado')

            try {
                await blackjackGameSigned.apostar({value: 101});
            } catch ({message}) {
                console.log('Message: ', message)
                expect(message).to.contain('Cantidad de chips invalida')
            }
        });
    });
});
