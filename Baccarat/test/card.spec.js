const expect = require('chai').expect;
const Card = require('../src/card.js');

describe('Card', function() {
    describe('constructor#', function() {
        describe('When called without a suit and value parameter', function() {
            let card;
            beforeEach(function() {
                card = new Card();
            });

            it('Should set suit to a diamond', function() {
                expect(card.suit).to.equal('diamond');
            });

            it('Should set value to an ace', function() {
                expect(card.value).to.equal('A');
            });
        });

        describe('When called with a suit and value parameter', function() {
            it('Should set the suit and rank to the correct parameters'
              , function() {
                let card = new Card('spade', '3');

                expect(card.suit).to.equal('spade');
                expect(card.value).to.equal('3');
            });
        });
    });
});
