'use strict';

const GameResult = require('./gameResult.js');

/**
 * Calculates game results and other related game information such as
 * naturals and pairs.
 */
class BaccaratResultsEngine {

    /**
     * Calculates results for the baccarat game based on the hand
     * that happened in the game.
     * @param {Hand} hand The hand for the baccarat game played.
     * @return {GameResult} The game result calculated from the hand.
     */
    calculateGameResult(hand) {
        let result = {
            outcome: GameResult.Tie,
            natural: GameResult.NoNatural,
            pair: GameResult.NoPair,
        };

        result.outcome = this.calculateOutcome(hand);
        result.natural = this.calculateNatural(result.outcome, hand);
        result.pair = this.calculatePairs(hand);

        return result;
    }

    /**
     * Calculates the winning main bet for this game.
     * @param {Hand} The hand for the baccarat game played.
     * @return {String} The outcome
     */
    calculateOutcome({playerCards = [], bankerCards = []}) {
        let playerValue = this.calculateHandValue(playerCards);
        let bankerValue = this.calculateHandValue(bankerCards);

        let difference = bankerValue - playerValue;

        if (difference === 0) return GameResult.Tie;
        else if (difference > 0) return GameResult.Banker;
        else return GameResult.Player;
    }

    /**
     * Calculates the winning natural bets for this game.
     * @param {String} outcome The outcome for the game played
     * @param {Hand} hand The hand for the baccarat game played.
     * @return {String}
     */
    calculateNatural(outcome, {playerCards = [], bankerCards = []}) {
        let cardsToCheck;

        switch (outcome) {
            case GameResult.Player:
                cardsToCheck = playerCards;
                break;
            case GameResult.Banker:
                cardsToCheck = bankerCards;
                break;
            default:
                return GameResult.NoNatural;
        }

        if (cardsToCheck.length === 2) {
            let handValue = this.calculateHandValue(cardsToCheck);

            if (handValue === 8)
                return outcome + '8';
            else if (handValue === 9)
                return outcome + '9';
        }

        return GameResult.NoNatural;
    }

    /**
     * Calculates the winning pair bets for the game.
     * @param {Hand} hand The hand for the baccarat game played.
     * @return {String}
     */
    calculatePairs({playerCards = {}, bankerCards = {}}) {
        const isPlayerPair = this.calculatePair(playerCards);
        const isBankerPair = this.calculatePair(bankerCards);

        if (isPlayerPair && isBankerPair)
            return GameResult.BothPair;
        else if (isPlayerPair)
            return GameResult.PlayerPair;
        else if (isBankerPair)
            return GameResult.BankerPair;
        else
            return GameResult.NoPair;
    }

    /**
     * @private
     * @param {Card[]} cards The cards to calculate a pair on
     * @return {Boolean} Calculates rather or not this set of cards is a pair
     */
    calculatePair(cards = []) {
        if (cards.length !== 2)
            return false;

        let [firstCard, secondCard] = cards;

        return firstCard.value === secondCard.value;
    }

    /**
     * Calculates the hand value for the cards played in a baccarat game.
     * @param {Card[]} cards A collection of cards to calculate the baccarat
     *  hand value for.
     * @return {Number} The card value of the cards.
     */
    calculateHandValue(cards = []) {
        let cardsValue = cards.reduce((handValue, card) => {
            return BaccaratResultsEngine.valueForCard(card) + handValue;
        }, 0);

        return cardsValue % 10;
    }

    /**
     * @param {Card} card The card to calculate a baccarat hand value for
     * @return {Number} The baccarat hand value
     */
    static valueForCard({suit, value = 0}) {
        switch (value) {
            case 'A': return 1;
            case '2': return 2;
            case '3': return 3;
            case '4': return 4;
            case '5': return 5;
            case '6': return 6;
            case '7': return 7;
            case '8': return 8;
            case '9': return 9;
            case '10':
            case 'J':
            case 'Q':
            case 'K':
                return 0;
            default: return 0;
        }
    }
}

module.exports = BaccaratResultsEngine;
