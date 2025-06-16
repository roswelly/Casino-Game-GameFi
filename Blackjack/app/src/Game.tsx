import {Card} from "./Card";

export interface Game {
    address: string
    player: string
    status: string
    bet: number
    dealerCards: Card[]
    playerCards: Card[]
    mensajes: string[]
}