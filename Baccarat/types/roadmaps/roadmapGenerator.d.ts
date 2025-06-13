export = RoadmapGenerator;

/**
 * Generator for common baccarat roadmaps.
 */
declare class RoadmapGenerator {
  constructor();
  /**
   * Calculates a bead plate based on games played.
   * @param {GameResult[]} gameResults The game results to
   *  calculate the roadmap from.
   * @param {BeadPlateConfig} config The configuration object for drawing options.
   * @return {BeadPlate} A data representation of how a bead plate can
   *  be drawn from this calculation.
   */
  beadPlate(gameResults: GameResult[], config?: BeadPlateConfig): BeadPlate;

  /**
   * Calculates a big road based on games played.
   * @param {GameResult[]} gameResults The game results to calculate the
   *  roadmap from.
   * @param {BigRoadConfig} config The configuration object for drawing options.
   * @return {BigRoad} A data representation of how a big road can
   *  be drawn from this calculation.
   */
  bigRoad(gameResults: GameResult[], config?: BigRoadConfig): BigRoad;

  /**
   * Big road column definitions
   * @private
   * @param {BigRoad} bigRoad The big road data
   * @return {ColumnDictionary} Map of columns
   */
  bigRoadColumnDefinitions(bigRoad: BigRoad): ColumnDictionary;

  /**
   * Derived road using the given cycle
   * @private
   * @param {BigRoad} bigRoad The big road data
   * @param {number} cycleLength The big road data
   * @return {BigEyeRoad} A new list of big road items whose view is scrolled
   * to have the amount of drawing columns visible.
   */
  private derivedRoad(bigRoad: BigRoad, cycleLength: number): BigEyeRoad;

  /**
   * Generates the big eye road - derived road with a cycle of 1
   * @public
   * @param {BigRoad} bigRoad The big road data
   * @return {BigEyeRoad} A new list of derived road items
   */
  public bigEyeRoad(bigRoad: BigRoad): BigEyeRoad;

  /**
   * Generates the small road - derived road with a cycle of 2
   * @public
   * @param {BigRoad} bigRoad The big road data
   * @return {SmallRoad} A new list of derived road items
   */
  public smallRoad(bigRoad: BigRoad): SmallRoad;

  /**
   * Generates the cockroach pig road - derived road with a cycle of 3
   * @public
   * @param {BigRoad} bigRoad The big road data
   * @return {CockroachPigRoad} A new list of derived road items
   */
  public cockroachPig(bigRoad: BigRoad): CockroachPigRoad;

  /**
   * Scrolls the big road drawing to only show the specified amount of
   * drawing columns.
   * @private
   * @param {BigRoad} results The big road data
   * @param {number} highestDrawingColumn The highest column reached in
   * the big road supplied.
   * @param {number} drawingColumns The amount of columns to show in the
   * big road
   * @return {BigRoad} A new list of big road items whose view is scrolled
   * to have the amount of drawing columns visible.
   */
  private scrollBigRoad(
    results: BigRoad,
    highestDrawingColumn: number,
    drawingColumns: number
  ): BigRoad;

  /**
   * Generates the column number for the game number of a game based
   * on the column size of the table to be drawn.
   * @private
   * @param {number} gameNumber The game number of the item in the sequence.
   * @param {number} columnSize The column size of the drawn table
   * @return {number} The column number that this gameNumber is drawn to.
   */
  private columnForGameNumber(gameNumber: number, columnSize: number): number;

  /**
   * Generates the row number for the game number of a game based
   * on the column size of the table to be drawn.
   * @private
   * @param {number} gameNumber The game number of the item in the sequence.
   * @param {number} columnSize The column size of the drawn table
   * @return {number} The row number that this gameNumber is drawn to.
   */
  private rowForGameNumber(gameNumber: number, columnSize: number): number;
}
import GameResult = require("../gameResult");
import {
  BigRoad,
  BigRoadConfig,
  BigEyeRoad,
  SmallRoad,
  CockroachPigRoad,
  ColumnDictionary,
  BeadPlateConfig,
  BeadPlate,
} from "./interfaces";
