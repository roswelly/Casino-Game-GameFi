export = Hand;
/**
 * Represents the player and banker cards for a game of baccarat.
 */
declare class Hand {
  /**
   *
   * @param {Card[]} playerCards The players cards from the game
   * @param {Card[]} bankerCards The bankers cards from the game
   */
  constructor(playerCards?: Card[], bankerCards?: Card[]);
  playerCards: Card[];
  bankerCards: Card[];
}
import Card = require("./card.js");
