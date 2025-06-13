/* eslint-disable max-len */
const expect = require('chai').expect;
const _ = require('lodash');
const RoadmapGenerator = require('../../src/roadmaps/roadmapGenerator.js');

describe('RoadmapGenerator', function() {
    let roadmapGenerator;

    beforeEach(function() {
        roadmapGenerator = new RoadmapGenerator();
    });

    describe('beadPlate#', function() {
        describe('When called with game results of [B, B, P, T, P, B]'
          , function() {
            let games;
            let config;
            beforeEach(function() {
                games = [{outcome: 'banker'}, {outcome: 'banker'},
                {outcome: 'player'}, {outcome: 'tie'}, {outcome: 'player'},
                {outcome: 'banker'}];
                config = {columns: 1, rows: 3};
            });

            describe('When configured with 3 rows and 1 column', function() {
                it(`Should return a scrolled bead plate of [T, P, B]
                 showing the last 3 entries`, function() {
                        let result = roadmapGenerator.beadPlate(games, config);

                        expect(result).to.eql([
                            {result: {outcome: 'tie'}, column: 0, row: 0},
                            {result: {outcome: 'player'}, column: 0, row: 1},
                            {result: {outcome: 'banker'}, column: 0, row: 2}]);
                    });
            });

            describe('When configured with 6 rows and 2 columns', function() {
                it('Should return a bead plate of [B, B, P, T, P, B]'
                    , function() {
                        let result = roadmapGenerator.beadPlate(games
                        , {columns: 2, rows: 6});

                        expect(result).to.eql([
                            {result: {outcome: 'banker'}, column: 0, row: 0},
                            {result: {outcome: 'banker'}, column: 0, row: 1},
                            {result: {outcome: 'player'}, column: 0, row: 2},
                            {result: {outcome: 'tie'}, column: 0, row: 3},
                            {result: {outcome: 'player'}, column: 0, row: 4},
                            {result: {outcome: 'banker'}, column: 0, row: 5}]);
                    });
            });
        });
    });

    describe('bigRoad#', function() {
        describe('When called with game results of [B, B, P, T, P, B]', function() {
            it('Should return a valid big road', function() {
                let games = [{outcome: 'banker'}, {outcome: 'banker'}, {outcome: 'player'},
                {outcome: 'tie'}, {outcome: 'player'}, {outcome: 'banker'}];

                let result = roadmapGenerator.bigRoad(games);

                expect(result).to.eql([
                    {result: {outcome: 'banker'}, column: 0, row: 0, logicalColumn: 0, ties: []},
                    {result: {outcome: 'banker'}, column: 0, row: 1, logicalColumn: 0, ties: []},
                    {result: {outcome: 'player'}, column: 1, row: 0, logicalColumn: 1,
                      ties: [{outcome: 'tie'}]},
                    {result: {outcome: 'player'}, column: 1, row: 1, logicalColumn: 1, ties: []},
                    {result: {outcome: 'banker'}, column: 2, row: 0, logicalColumn: 2, ties: []}]);
            });
        });

        describe('When called with game results of []', function() {
            it('Should return an empty big road', function() {
                let games = [];

                let result = roadmapGenerator.bigRoad(games);

                expect(result).to.eql([]);
            });
        });

        describe('When called with game results of all ties', function() {
            it('Should return a big road with a single tie entry', function() {
                let games = _.fill(Array(2), {outcome: 'tie'});

                let result = roadmapGenerator.bigRoad(games);

                expect(result).to.eql([
                    {result: { }, column: 0, row: 0, logicalColumn: 0,
                     ties: [{outcome: 'tie'}, {outcome: 'tie'}]},
                ]);
            });
        });

        describe('When called with game results starting with ties and ending with a player win', function() {
            it('Should return a big road with a single player win with ties', function() {
                let games = [{outcome: 'tie'}, {outcome: 'tie'}, {outcome: 'banker'}];

                let result = roadmapGenerator.bigRoad(games);

                expect(result).to.eql([{result: {outcome: 'banker'}, column: 0, row: 0,
                 logicalColumn: 0, ties: [{outcome: 'tie'}, {outcome: 'tie'}]}]);
            });
        });

        describe('When called with game results of [B * 9, P * 10]', function() {
            it('Should return a valid big road with a double dragon tail', function() {
                let games = _.concat(_.fill(Array(9), {outcome: 'banker'}),
                _.fill(Array(10), {outcome: 'player'}));

                let result = roadmapGenerator.bigRoad(games);

                expect(result).to.eql([
                    {result: {outcome: 'banker'}, column: 0, row: 0, logicalColumn: 0, ties: []},
                    {result: {outcome: 'banker'}, column: 0, row: 1, logicalColumn: 0, ties: []},
                    {result: {outcome: 'banker'}, column: 0, row: 2, logicalColumn: 0, ties: []},
                    {result: {outcome: 'banker'}, column: 0, row: 3, logicalColumn: 0, ties: []},
                    {result: {outcome: 'banker'}, column: 0, row: 4, logicalColumn: 0, ties: []},
                    {result: {outcome: 'banker'}, column: 0, row: 5, logicalColumn: 0, ties: []},
                    {result: {outcome: 'banker'}, column: 1, row: 5, logicalColumn: 0, ties: []},
                    {result: {outcome: 'banker'}, column: 2, row: 5, logicalColumn: 0, ties: []},
                    {result: {outcome: 'banker'}, column: 3, row: 5, logicalColumn: 0, ties: []},
                    {result: {outcome: 'player'}, column: 1, row: 0, logicalColumn: 1, ties: []},
                    {result: {outcome: 'player'}, column: 1, row: 1, logicalColumn: 1, ties: []},
                    {result: {outcome: 'player'}, column: 1, row: 2, logicalColumn: 1, ties: []},
                    {result: {outcome: 'player'}, column: 1, row: 3, logicalColumn: 1, ties: []},
                    {result: {outcome: 'player'}, column: 1, row: 4, logicalColumn: 1, ties: []},
                    {result: {outcome: 'player'}, column: 2, row: 4, logicalColumn: 1, ties: []},
                    {result: {outcome: 'player'}, column: 3, row: 4, logicalColumn: 1, ties: []},
                    {result: {outcome: 'player'}, column: 4, row: 4, logicalColumn: 1, ties: []},
                    {result: {outcome: 'player'}, column: 4, row: 5, logicalColumn: 1, ties: []},
                    {result: {outcome: 'player'}, column: 5, row: 5, logicalColumn: 1, ties: []}]);
            });
        });

        describe('When called with not enough columns to fit every result', function() {
            it('Should scroll to show a sliding window of results', function() {
                let games = [{outcome: 'banker'}, {outcome: 'banker'}, {outcome: 'player'},
                {outcome: 'tie'}, {outcome: 'player'}, {outcome: 'banker'}];

                let result = roadmapGenerator.bigRoad(games, {columns: 2});

                expect(result).to.eql([
                    {
                        result: {outcome: 'player'}, column: 0, row: 0, logicalColumn: 1,
                          ties: [{outcome: 'tie'}],
                    },
                    {result: {outcome: 'player'}, column: 0, row: 1, logicalColumn: 1, ties: []},
                    {result: {outcome: 'banker'}, column: 1, row: 0, logicalColumn: 2, ties: []}]);
            });
        });
    });

  describe('biyEye#', function() {
    describe('When called with 100 game results set A', function() {
      it('Should return expected big eye', function() {
        const expectedBigEye = ['blue', 'blue', 'red', 'red', 'red', 'blue', 'red', 'red', 'red', 'blue', 'blue', 'red', 'blue', 'red', 'blue', 'blue', 'blue', 'blue', 'red', 'red', 'blue'];
        const gameResults = [{'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'banker'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'player'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'both'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'player'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'player'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'both'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'banker'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'player'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}];
        const bigRoad = roadmapGenerator.bigRoad(gameResults);
        const result = roadmapGenerator.bigEyeRoad(bigRoad);

        expect(result).to.eql(expectedBigEye);
      });
    });

    describe('When called with 100 game results set B', function() {
      it('Should return expected big eye', function() {
        const expectedBigEye = ['red', 'red', 'blue', 'red', 'blue', 'blue', 'blue', 'blue', 'red', 'blue', 'blue', 'red', 'red', 'blue', 'red', 'red', 'red', 'blue', 'blue', 'red', 'red'];
        const gameResults = [{'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'player'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'player'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'banker'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'player'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'banker'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}];
        const bigRoad = roadmapGenerator.bigRoad(gameResults);
        const result = roadmapGenerator.bigEyeRoad(bigRoad);

        expect(result).to.eql(expectedBigEye);
      });
    });

    describe('When called with 100 game results set C', function() {
      it('Should return expected big eye', function() {
        const expectedBigEye = ['blue', 'red', 'blue', 'red', 'red', 'red', 'red', 'red', 'blue', 'red', 'blue', 'red', 'red', 'red', 'red', 'blue', 'blue', 'red', 'blue', 'blue', 'blue', 'red', 'red', 'blue'];
        const gameResults = [{'outcome': 'player', 'natural': 'player8', 'pair': 'player'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'player'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'banker'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'player'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'player'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'player'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'player'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'both'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'player'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'banker'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'banker'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}];
        const bigRoad = roadmapGenerator.bigRoad(gameResults);
        const result = roadmapGenerator.bigEyeRoad(bigRoad);

        expect(result).to.eql(expectedBigEye);
      });
    });

    describe('When called with 100 game results set D', function() {
      it('Should return expected big eye', function() {
        const expectedBigEye = ['blue', 'blue', 'red', 'blue', 'red', 'blue', 'red', 'blue', 'blue', 'blue', 'blue', 'red', 'blue', 'red', 'red', 'red', 'red', 'blue', 'blue', 'red', 'red', 'red', 'blue'];
        const gameResults = [{'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'player'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'player'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'banker'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}];
        const bigRoad = roadmapGenerator.bigRoad(gameResults);
        const result = roadmapGenerator.bigEyeRoad(bigRoad);

        expect(result).to.eql(expectedBigEye);
      });
    });

    describe('When called with 20 game results', function() {
      it('Should return expected big eye', function() {
        const expectedBigEye = ['red', 'blue', 'blue', 'blue', 'blue', 'red', 'red', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'red', 'blue', 'red'];
        const gameResults = [{'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'banker'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'tie', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'player'}, {'outcome': 'player', 'natural': 'player8', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}];
        const bigRoad = roadmapGenerator.bigRoad(gameResults);
        const result = roadmapGenerator.bigEyeRoad(bigRoad);

        expect(result).to.eql(expectedBigEye);
      });
    });

    describe('When called with 0 game result', function() {
      it('Should return expected big eye', function() {
        const expectedBigEye = [];
        const gameResults = [];
        const bigRoad = roadmapGenerator.bigRoad(gameResults);
        const result = roadmapGenerator.bigEyeRoad(bigRoad);

        expect(result).to.eql(expectedBigEye);
      });
    });

    describe('When called with 1 game result', function() {
      it('Should return expected big eye', function() {
        const expectedBigEye = [];
        const gameResults = [{'outcome': 'player', 'natural': 'none', 'pair': 'none'}];
        const bigRoad = roadmapGenerator.bigRoad(gameResults);
        const result = roadmapGenerator.bigEyeRoad(bigRoad);

        expect(result).to.eql(expectedBigEye);
      });
    });

    describe('When called with 5 game results blue', function() {
      it('Should return expected big eye', function() {
        const expectedBigEye = ['blue'];
        const gameResults = [{'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'player9', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}];
        const bigRoad = roadmapGenerator.bigRoad(gameResults);
        const result = roadmapGenerator.bigEyeRoad(bigRoad);

        expect(result).to.eql(expectedBigEye);
      });
    });

    describe('When called with 5 game results red', function() {
      it('Should return expected big eye', function() {
        const expectedBigEye = ['red'];
        const gameResults = [{'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'player', 'natural': 'none', 'pair': 'none'}, {'outcome': 'banker', 'natural': 'banker8', 'pair': 'none'}];
        const bigRoad = roadmapGenerator.bigRoad(gameResults);
        const result = roadmapGenerator.bigEyeRoad(bigRoad);

        expect(result).to.eql(expectedBigEye);
      });
    });
  });
});
