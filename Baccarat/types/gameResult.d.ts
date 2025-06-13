export = GameResult;
/**
 * @property {GameResultOutcomes} outcome The outcome of the game
 * @property {GameResultNatural} natural The status of a natural bet on this game
 * @property {GameResultPair} pair The status of the pair bet on this game
 */
declare class GameResult {
  outcome: GameResultOutcomes;
  natural: GameResultNatural;
  pair: GameResultPair;
}
declare namespace GameResult {
  const Tie: string;
  const Banker: string;
  const Player: string;
  const PlayerNatural8: string;
  const PlayerNatural9: string;
  const BankerNatural8: string;
  const BankerNatural9: string;
  const NoNatural: string;
  const PlayerPair: string;
  const BankerPair: string;
  const BothPair: string;
  const NoPair: string;
}

import {
  GameResultOutcomes,
  GameResultNatural,
  GameResultPair,
} from "./gameResultEnums";
