const expect = require('chai').expect;
const Shoe = require('../src/shoe.js');

describe('Shoe', function() {
    let shoe;

    beforeEach(function() {
        shoe = new Shoe(1);
        shoe.createDecks();
        shoe.shuffle();
    });

    describe('constructor#', function() {
        describe('When called with 1 deck', function() {
            it('Should set cards length to 52', function() {
                expect(shoe.cards.length).to.equal(52);
            });
        });

        describe('When set to 16 cards', function() {
            it ('Should not notify of cut card reached (1 more game can be played).', function() {
                shoe.cards = Array(16).keys;

                expect(shoe.cutCardReached, false);
            });
        })

        describe('When set to 15 cards', function() {
            it ('Should notify of cut card reached.', function() {
                shoe.cards = Array(15).keys;

                expect(shoe.cutCardReached, true);
            });
        })

    });
});
