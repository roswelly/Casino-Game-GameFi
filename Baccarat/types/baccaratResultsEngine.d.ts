export = BaccaratResultsEngine;
/**
 * Calculates game results and other related game information such as
 * naturals and pairs.
 */
declare class BaccaratResultsEngine {
  /**
   * @param {Card} card The card to calculate a baccarat hand value for
   * @return {Number} The baccarat hand value
   */
  static valueForCard(card: Card): number;
  /**
   * Calculates results for the baccarat game based on the hand
   * that happened in the game.
   * @param {Hand} hand The hand for the baccarat game played.
   * @return {GameResult} The game result calculated from the hand.
   */
  calculateGameResult(hand: Hand): GameResult;
  /**
   * Calculates the winning main bet for this game.
   * @param {Hand} The hand for the baccarat game played.
   * @return {String} The outcome
   */
  calculateOutcome(hand: Hand): string;
  /**
   * Calculates the winning natural bets for this game.
   * @param {String} outcome The outcome for the game played
   * @param {Hand} hand The hand for the baccarat game played.
   * @return {String}
   */
  calculateNatural(outcome: string, hand: Hand): string;
  /**
   * Calculates the winning pair bets for the game.
   * @param {Hand} hand The hand for the baccarat game played.
   * @return {String}
   */
  calculatePairs(hand: Hand): string;
  /**
   * @private
   * @param {Card[]} cards The cards to calculate a pair on
   * @return {Boolean} Calculates rather or not this set of cards is a pair
   */
  private calculatePair;
  /**
   * Calculates the hand value for the cards played in a baccarat game.
   * @param {Card[]} cards A collection of cards to calculate the baccarat
   *  hand value for.
   * @return {Number} The card value of the cards.
   */
  calculateHandValue(cards: Card[]): number;
}
import GameResult = require("./gameResult.js");
import Hand = require("./hand.js");
import Card = require("./card.js");
