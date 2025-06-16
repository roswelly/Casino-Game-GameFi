enum Suit {
    NONE = '',
    SPADE = 'S',
    CLUB = 'C',
    HEART = 'H',
    DIAMOND = 'D'
}

export interface Card {
    suit: Suit
    number: number
    src: string
}

export const EMPTY_CARD: Card = {suit: Suit.NONE, number: 0, src: `cards/back.png`}

export function getCardFromString(card: Card): Card {
    return {
        suit: card.suit,
        number: card.number,
        src: `cards/${(card.suit)}${(card.number)}.png`
    }
}
