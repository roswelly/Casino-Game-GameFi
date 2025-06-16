enum Suit {
    NONE = '',
    SPADE = 'S',
    CLUB = 'C',
    HEART = 'H',
    DIAMOND = 'D'
}

export interface Card {
    suit: Suit
    num: number
    src: string
}

export const EMPTY_CARD: Card = {suit: Suit.NONE, num: 0, src: `cards/back.png`}

export function getRandomCard(): string {
    const suits = Array(Suit.SPADE, Suit.HEART, Suit.CLUB, Suit.DIAMOND)
    const suit = suits[Math.floor(Math.random() * suits.length)]
    const num = Math.floor(Math.random() * 13) + 1
    return `${suit}${num}`
}
