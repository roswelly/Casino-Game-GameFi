'use strict';

/**
 * Represents the player and banker cards for a game of baccarat.
 */
class Hand {
    /**
     *
     * @param {Card[]} playerCards The players cards from the game
     * @param {Card[]} bankerCards The bankers cards from the game
     */
    constructor(playerCards = [], bankerCards = []) {
        this.playerCards = playerCards;
        this.bankerCards = bankerCards;
    }
}

module.exports = Hand;
