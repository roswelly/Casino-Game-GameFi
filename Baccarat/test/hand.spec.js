const expect = require('chai').expect;
const Hand = require('../src/hand.js');

describe('Hand', function() {
    describe('constructor#', function() {
        describe('When called without a player hand supplied', function() {
            it('Should set the hand to an empty list', function() {
              let hand = new Hand();

              expect(hand.playerCards).to.eql([]);
            });
        });

        describe('When called without a banker hand supplied', function() {
            it('Should set the hand to an empty list', function() {
              let hand = new Hand();

              expect(hand.bankerCards).to.eql([]);
            });
        });
    });
});
