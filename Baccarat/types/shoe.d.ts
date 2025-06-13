export = Shoe;
/**
 * Baccarat shoe
 */
declare class Shoe {
  /**
   * Shoe constructor
   * @param {number} decks - Count of decks to be included in the shoe
   * @constructor
   */
  constructor(decks: number);
  /**
   * Cards left
   * @return {number} Count of cards left
   */
  get cardsLeft(): number;
  /**
   * Number of cards before the cut card
   * @return {number} Count of cards left before cut card
   */
  get cardsBeforeCutCard(): number;
  /**
   * Has the cut card been reached
   * @return {boolean} true if the cut card has been reached, false otherwise
   */
  get cutCardReached(): boolean;
  decks: number;
  cards: Card[];
  /**
   * Creates the cards array
   */
  createDecks(): void;
  /**
   * Shuffles the cards array
   */
  shuffle(): void;
  /**
   * Draws the next card
   * @return {Card} Card drawn
   */
  draw(): Card;
  /**
   * To string
   * @return {string} String representation of the shoe
   */
  toString(): string;
  /**
   * Creates a card from the value passed in
   * @param {number} value - The integer value to be converted
   * @return {Card} Card created
   */
  createCard(value: number): Card;
}
import Card = require("./card.js");
