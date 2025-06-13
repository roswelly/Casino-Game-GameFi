'use strict';

/**
 * @property {string} outcome The outcome of the game
 * @property {string} natural The status of a natural bet on this game
 * @property {string} pair The status of the pair bet on this game
 */
class GameResult {
}

/**
 * A tie win outcome
 */
GameResult.Tie = 'tie';
/**
 * A banker win outcome
 */
GameResult.Banker = 'banker';
/**
 * A player win outcome
 */
GameResult.Player = 'player';

/**
 * A player natural 8
 */
GameResult.PlayerNatural8 = 'player8';
/**
 * A player natural 9
 */
GameResult.PlayerNatural9 = 'player9';
/**
 * A banker natural 8
 */
GameResult.BankerNatural8 = 'banker8';
/**
 * A banker natural 9
 */
GameResult.BankerNatural9 = 'banker9';
/**
 * A no natural result
 */
GameResult.NoNatural = 'none';

/**
 * A player pair
 */
GameResult.PlayerPair = 'player';
/**
 * A banker pair
 */
GameResult.BankerPair = 'banker';
/**
 * A pair for both player and banker
 */
GameResult.BothPair = 'both';
/**
 * A no pair result
 */
GameResult.NoPair = 'none';

module.exports = GameResult;
