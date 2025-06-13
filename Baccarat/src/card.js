'use strict';

/**
 * Represents a single playing card.
 */
class Card {
    /**
     *
     * @param {String} suit The suit of the card
     * @param {String} value The value of the card
     */
    constructor(suit = 'diamond', value = 'A') {
        this.suit = suit;
        this.value = value;
    }

    /**
     * Returns a string representation of this card.
     * @return {String} The string representation of the card.
     */
    toString() {
        let suit = Card.StandardSuitUnicodeStrings[this.suit] || this.suit;

        return `[Card ${suit} ${this.value}]`;
    }
}

/**
 * Default values for cards in a standard playing deck.
 */
Card.DefaultValues = ['A', '2', '3', '4',
'5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

/**
 * Default suits for cards in a standard playing deck.
 */
Card.DefaultSuits = ['club', 'diamond', 'heart', 'spade'];

/**
 * Unicode conversion table for the standard suits of a playing deck.
 */
Card.StandardSuitUnicodeStrings = {
	heart: '♥',
	diamond: '♦',
	club: '♣',
	spade: '♠',
};

module.exports = Card;
