export = Card;
/**
 * Represents a single playing card.
 */
declare class Card {
    /**
     *
     * @param {String} suit The suit of the card
     * @param {String} value The value of the card
     */
    constructor(suit?: string, value?: string);
    suit: string;
    value: string;
    /**
     * Returns a string representation of this card.
     * @return {String} The string representation of the card.
     */
    toString(): string;
}
declare namespace Card {
    const DefaultValues: string[];
    const DefaultSuits: string[];
    namespace StandardSuitUnicodeStrings {
        const heart: string;
        const diamond: string;
        const club: string;
        const spade: string;
    }
}
