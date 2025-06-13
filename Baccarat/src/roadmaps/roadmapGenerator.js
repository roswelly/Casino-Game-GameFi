/* eslint-disable max-len */
'use strict';

const _ = require('lodash');
const GameResult = require('../gameResult.js');

/**
 * Generator for common baccarat roadmaps.
 */
class RoadmapGenerator {

  /**
  * RoadmapGenerator
  * @constructor
  */
  constructor() {
  }

    /**
     * Calculates a bead plate based on games played.
     * @param {GameResult[]} gameResults The game results to
     *  calculate the roadmap from.
     * @param {BeadPlateConfig} config The configuration object for drawing options.
     * @return {BeadPlate} A data representation of how a bead plate can
     *  be drawn from this calculation.
     */
    beadPlate(gameResults = [], {columns = 6, rows = 6}) {
        const DisplayEntries = columns * rows;
        const ColumnSize = rows;

        // Get the selected amount of display entries from the most
        // recent games.
        gameResults = _.takeRight(gameResults, DisplayEntries);

        return _.range(0, gameResults.length)
                .map((index) =>
                  _.assign({}, {result: gameResults[index] || {}}, {
                    column: this.columnForGameNumber(index, ColumnSize),
                    row: this.rowForGameNumber(index, ColumnSize),
                }));
    }

    /**
     * Calculates a big road based on games played.
     * @param {GameResult[]} gameResults The game results to calculate the
     *  roadmap from.
     * @param {Object} config The configuration object for drawing options.
     * @return {Object} A data representation of how a big road can
     *  be drawn from this calculation.
     */
    bigRoad(gameResults = [], {columns = 12, rows = 6, scroll = true} = {}) {
        let tieStack = [];
        let placementMap = {};
        let logicalColumnNumber = 0;
        let lastItem;
        let returnList = [];
        let maximumColumnReached = 0;

        // Build the logical column definitions that doesn't represent
        // the actual "drawn" roadmap.
        gameResults.forEach((gameResult) => {
            if (gameResult.outcome === GameResult.Tie) {
                tieStack.push(gameResult);
            } else {
                if (lastItem) {
                    // Add the ties that happened in between the last placed
                    // big road item  and this new big road item to the
                    // last entered big road item.
                    let lastItemInResults = _.last(returnList);
                    if (lastItem.outcome === GameResult.Tie) {
                        if (lastItemInResults) {
                            lastItemInResults.ties = _.cloneDeep(tieStack);
                            tieStack = [];
                            if (lastItemInResults.result.outcome !== gameResult.outcome) {
                                logicalColumnNumber++;
                            }
                        }
                    } else if (lastItem.outcome !== gameResult.outcome) {
                        // If this item is different from the outcome of
                        // the last game then we must place it in another column
                        // lastItem is not tie so we can clear the tieStack
                        logicalColumnNumber++;
                        tieStack = [];
                    } else {
                        // If this item is the same as the outcome of current game and not a tie, then we must clear the tie stack
                        tieStack = []
                    }
                }

                let probeColumn = logicalColumnNumber;
                let probeRow = 0;
                let done = false;

                while (!done) {
                    let keySearch = `${probeColumn}.${probeRow}`;
                    let keySearchBelow = `${probeColumn}.${probeRow + 1}`;

                    // Position available at current probe location
                    if (!_.get(placementMap, keySearch)) {
                        let newEntry = _.merge({}, {
                            row: probeRow,
                            column: probeColumn,
                            logicalColumn: logicalColumnNumber,
                            ties: _.cloneDeep(tieStack),
                        }, {result: gameResult});
                        _.set(placementMap, keySearch, newEntry);
                        returnList.push(placementMap[probeColumn][probeRow]);

                        done = true;
                    } else if (probeRow + 1 >= rows) {
                        // The spot below would go beyond the table bounds.
                        probeColumn++;
                    } else if (!_.get(placementMap, keySearchBelow)) {
                        // The spot below is empty.
                        probeRow++;
                    } else if (_.get(placementMap,
                     keySearchBelow).result.outcome === gameResult.outcome) {
                        // The result below is the same outcome.
                        probeRow++;
                    } else {
                        probeColumn++;
                    }
                }

                maximumColumnReached = Math.max(maximumColumnReached,
                  probeColumn);
            }

            lastItem = gameResult;
        });

        // There were no outcomes added to the placement map.
        // We only have ties.
        if (_.isEmpty(returnList) && tieStack.length > 0) {
            returnList.push({
                 ties: _.cloneDeep(tieStack),
                 column: 0,
                 row: 0,
                 logicalColumn: 0,
                 result: {}});
        } else if (!_.isEmpty(returnList)) {
            _.last(returnList).ties = _.cloneDeep(tieStack);
        }

        if (scroll) {
            returnList = this.scrollBigRoad(returnList,
              maximumColumnReached, columns);
        }

        return returnList;
    }

    /**
     * Big road column definitions
     * @private
     * @param {BigRoad} bigRoad The big road data
     * @return {ColumnDictionary} Map of columns
     */
    bigRoadColumnDefinitions(bigRoad) {
        let columnDictionary = {};

        bigRoad.forEach((item) => {
            if (!_.has(columnDictionary, item.logicalColumn)) {
                columnDictionary[item.logicalColumn] = {
                    logicalColumn: item.logicalColumn,
                    logicalColumnDepth: 1,
                    outcome: item.result.outcome,
                };
            } else {
                columnDictionary[item.logicalColumn].logicalColumnDepth++;
            }
        });

        // console.log('columnDictionary = ', JSON.stringify(columnDictionary));
        return columnDictionary;
    }


    /**
     * Derived road using the given cycle
     * @private
     * @param {BigRoad} bigRoad The big road data
     * @param {int} cycleLength Cycle used to calculate the derived road
     * @return {DerivedRoad} A new list of derived road items (i.e., list of red/blue)
     */
    derivedRoad(bigRoad, cycleLength) {
        let columnDefinitions = this.bigRoadColumnDefinitions(bigRoad);

        /*
            1.    Let k be the Cycle of the roadmap.  k = 1 for big eye road.
            2.    Assume that the last icon added to the 大路 (Big Road) is on row m of column n.
            2.a.    If m >= 2, we compare with column (n-k).
            2.a.1.    If there is no such column (i.e. before the 1st column) …  No need to add any icon.
            2.a.2.    If there is such a column, and the column has p icons.
            2.a.2.1.    If m <= p  …  The answer is red.
            2.a.2.2.    If m = p + 1  …  The answer is blue.
            2.a.2.3.    If m > p + 1  … The answer is red.
            2.b.    If m = 1, reverse the result (Banker to Player, and vice versa), determine the result as in rule 2.a above, and reverse the answer (Red to blue, and vice versa) to get the real answer.
        */

        let k = cycleLength;
        let outcomes = [];

        Object.values(columnDefinitions).forEach((bigRoadColumn) => {
            let outcome = 'blue';
            let n = bigRoadColumn.logicalColumn;

            for (let m = 0; m < bigRoadColumn.logicalColumnDepth; m++) {
                let rowMDepth = m + 1;

                if (rowMDepth >= 2) {
                    let compareColumn = n - k;

                    // Step 2.a.1 - No column exists here.
                    if (compareColumn <= 0)
                        continue;

                    // Step 2.a.1
                    let pColumn = columnDefinitions[compareColumn];
                    if (!pColumn)
                        continue;

                    let p = pColumn.logicalColumnDepth;
                    if (rowMDepth <= p) {
                        outcome = 'red';
                    } else if (rowMDepth == (p + 1)) {
                        outcome = 'blue';
                    } else if (rowMDepth > (p + 1)) {
                        outcome = 'red';
                    }

                    outcomes.push(outcome);
                } else {
                    let kDistanceColumn = n - (k + 1);
                    let leftColumn = n - 1;

                    let kDistanceColumnDefinition = columnDefinitions[kDistanceColumn];
                    let leftColumnDefinition = columnDefinitions[leftColumn];

                    if (kDistanceColumnDefinition != null &&
                        leftColumnDefinition != null) {
                        if (kDistanceColumnDefinition.logicalColumnDepth == leftColumnDefinition.logicalColumnDepth)
                            outcome = 'red';
                        else
                            outcome = 'blue';

                        outcomes.push(outcome);
                    }
                }
            }
        });

        return outcomes;
    }

    /**
     * Generates the big eye road - derived road with a cycle of 1
     * @public
     * @param {BigRoad} bigRoad The big road data
     * @return {BigEyeRoad} A new list of derived road items
     */
    bigEyeRoad(bigRoad) {
        return this.derivedRoad(bigRoad, 1);
    }

    /**
     * Generates the small road - derived road with a cycle of 2
     * @public
     * @param {BigRoad} bigRoad The big road data
     * @return {SmallRoad} A new list of derived road items
     */
    smallRoad(bigRoad) {
        return this.derivedRoad(bigRoad, 2);
    }
    /**
     * Generates the cockroach pig - derived road with a cycle of 3
     * @public
     * @param {BigRoad} bigRoad The big road data
     * @return {CockroachPigRoad} A new list of derived road items
     */
    cockroachPig(bigRoad) {
        return this.derivedRoad(bigRoad, 3);
    }

    /**
     * Scrolls the big road drawing to only show the specified amount of
     * drawing columns.
     * @private
     * @param {GameResult[]} results The big road data
     * @param {number} highestDrawingColumn The highest column reached in
     * the big road supplied.
     * @param {number} drawingColumns The amount of columns to show in the
     * big road
     * @return {BigRoad} A new list of big road items whose view is scrolled
     * to have the amount of drawing columns visible.
     */
    scrollBigRoad(results = [], highestDrawingColumn, drawingColumns) {
        const highestDrawableIndex = drawingColumns - 1;
        const offset = Math.max(0, highestDrawingColumn - highestDrawableIndex);

        let validItems = results.filter(
          (value) => (value.column - offset) >= 0);

        validItems.forEach((value) => value.column -= offset);

        return validItems;
    }

    /**
     * Generates the column number for the game number of a game based
     * on the column size of the table to be drawn.
     * @private
     * @param {number} gameNumber The game number of the item in the sequence.
     * @param {number} columnSize The column size of the drawn table
     * @return {number} The column number that this gameNumber is drawn to.
     */
    columnForGameNumber(gameNumber, columnSize) {
        return Math.floor(gameNumber / columnSize);
    }

    /**
     * Generates the row number for the game number of a game based
     * on the column size of the table to be drawn.
     * @private
     * @param {number} gameNumber The game number of the item in the sequence.
     * @param {number} columnSize The column size of the drawn table
     * @return {number} The row number that this gameNumber is drawn to.
     */
    rowForGameNumber(gameNumber, columnSize) {
        return gameNumber % columnSize;
    }
}

module.exports = RoadmapGenerator;
