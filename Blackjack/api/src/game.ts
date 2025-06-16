import {getRandomCard} from "./Card";

interface GameStatus {
    dealer: {
        cards: string[]
        money: number
    }
    player: {
        cards: string[]
        money: number
    }
}

export class Game {
    private dMoney: number;
    private dCards: string[];

    private playerMoney: number;
    private playerCards: string[];

    constructor(dMoney: number, dCards: string[], playerMoney: number, playerCards: string[]) {
        this.dMoney = dMoney;
        this.dCards = dCards;
        this.playerMoney = playerMoney;
        this.playerCards = playerCards;
    }

    stateInit() {
        this.dCards.push(getRandomCard())
        this.playerCards.push(getRandomCard());
        this.playerCards.push(getRandomCard());
    }

    getStatus(): GameStatus {
        return {
            dealer: {
                money: this.dMoney,
                cards: this.dCards
            },
            player: {
                money: this.playerMoney,
                cards: this.playerCards
            },
        }
    }
}