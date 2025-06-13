const expect = require('chai').expect;

const Card = require('../src/card.js');
const Hand = require('../src/hand.js');
const BaccaratResultsEngine = require('../src/baccaratResultsEngine.js');

describe('BaccaratResultsEngine', function() {
    let engine;

    beforeEach(function() {
        engine = new BaccaratResultsEngine();
    });

    describe('calculateGameResult#', function() {
        describe('When called with a hand of P:[10, 8] B:[A, 8]', function() {
            it('Should return a banker win, banker9 natural', function() {
                const playerCards = [new Card('', '10'), new Card('', '8')];
                const bankerCards = [new Card('', 'A'), new Card('', '8')];
                const hand = new Hand(playerCards, bankerCards);

                let result = engine.calculateGameResult(hand);

                expect(result).to.eql({
                    outcome: 'banker',
                    natural: 'banker9',
                    pair: 'none',
                });
            });
        });

        describe('When called with a hand of P:[10, 8] B:[A, 7]', function() {
            it('Should return a tie win', function() {
                const playerCards = [new Card('', '10'), new Card('', '8')];
                const bankerCards = [new Card('', 'A'), new Card('', '7')];
                const hand = new Hand(playerCards, bankerCards);

                let result = engine.calculateGameResult(hand);

                expect(result).to.eql({
                    outcome: 'tie',
                    natural: 'none',
                    pair: 'none',
                });
            });
        });

        describe('When called with a hand of P:[4, 4] B:[5, 5]', function() {
            it('Should return a player win and both pairs', function() {
                const playerCards = [new Card('', '4'), new Card('', '4')];
                const bankerCards = [new Card('', '5'), new Card('', '5')];
                const hand = new Hand(playerCards, bankerCards);

                let result = engine.calculateGameResult(hand);

                expect(result).to.eql({
                    outcome: 'player',
                    natural: 'player8',
                    pair: 'both',
                });
            });
        });
    });

    describe('calculateHandValue#', function() {
        describe('When called with a hand of [10, Jack, King]', function() {
            it('Should have a value of 0', function() {
                let value = engine.calculateHandValue([new Card('', '10'),
                 new Card('', 'J'), new Card('', 'K')]);

                expect(value).to.equal(0);
            });
        });

        describe('When called with an empty hand', function() {
            it('Should have a value of 0', function() {
                let value = engine.calculateHandValue([]);

                expect(value).to.equal(0);
            });
        });
    });
});
