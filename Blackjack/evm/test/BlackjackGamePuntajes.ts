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

    describe("Pruebas de Puntajes", function () {

        it("Debe devolver puntaje 4 (2 cartas)", async function () {
            const cards = [{suit: 1, number: 2}, {suit: 2, number: 2}];
            const puntaje = (await blackjackCasino.callStatic.getPuntaje(cards)).toNumber();
            expect(puntaje).equals(4);
        });

        it("Debe devolver puntaje 20 (1 carta, 1 as)", async function () {
            const cards = [{suit: 1, number: 9}, {suit: 2, number: 1}];
            const puntaje = (await blackjackCasino.callStatic.getPuntaje(cards)).toNumber();
            expect(puntaje).equals(20);
        });

        it("Debe devolver puntaje 21 (2 cartas, 1 as)", async function () {
            const cards = [{suit: 1, number: 12}, {suit: 2, number: 13}, {suit: 2, number: 1}];
            const puntaje = (await blackjackCasino.callStatic.getPuntaje(cards)).toNumber();
            expect(puntaje).equals(21);
        });

        it("Debe devolver 21 (2 cartas, 2 aces)", async function () {
            const cards = [{suit: 1, number: 4}, {suit: 2, number: 5}, {suit: 2, number: 1}, {suit: 2, number: 1}];
            const puntaje = (await blackjackCasino.callStatic.getPuntaje(cards)).toNumber();
            expect(puntaje).equals(21);
        });

        it("Debe devolver Blackjack", async function () {
            const cards = [{suit: 1, number: 12}, {suit: 2, number: 1}];
            const puntaje = (await blackjackCasino.callStatic.getPuntaje(cards)).toNumber();
            expect(puntaje).equals(21);
        });

        it("Debe devolver 22", async function () {
            const cards = [{suit: 1, number: 12}, {suit: 2, number: 13}, {suit: 2, number: 1}, {suit: 2, number: 1}];
            const puntaje = (await blackjackCasino.callStatic.getPuntaje(cards)).toNumber();
            expect(puntaje).equals(22);
        });

    });
});
