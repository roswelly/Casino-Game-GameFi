/* eslint-disable max-len */
/* eslint-disable no-console */
const RoadmapGenerator = require('./src/roadmaps/roadmapGenerator');
const BaccaratGameEngine = require('./src/gameEngine/baccaratGameEngine');

const roadmapGenerator = new RoadmapGenerator();

// Create game engine (8 decks default)
const gameEngine = new BaccaratGameEngine();
gameEngine.shoe.createDecks();
gameEngine.shoe.shuffle();
let burnCard = gameEngine.burnCards();
console.log('burnCard = ', JSON.stringify(burnCard));

const gameResults = [];
for (let i = 0; i < 20; i += 1) {
  if (gameEngine.isBurnNeeded) {
    gameEngine.shoe.shuffle();
    // Burn card is the first card drawn that determined the burn cards to use.
    let burnCard = gameEngine.burnCards();
    console.log('burnCard = ', JSON.stringify(burnCard));
  }

  const hand = gameEngine.dealGame();
  // console.log('   Hand = ', JSON.stringify(hand));

  const result = gameEngine.resultsEngine.calculateGameResult(hand);
  console.log('result = ', JSON.stringify(result));

  gameResults.push(result);

  const beadPlate = roadmapGenerator.beadPlate(gameResults, {
    columns: 20,
    rows: 6,
  });
  const bigRoad = roadmapGenerator.bigRoad(gameResults);
  console.log('beadPlate = ', JSON.stringify(beadPlate));
  console.log('bigRoad = ', JSON.stringify(bigRoad));

  const bigEye = roadmapGenerator.bigEyeRoad(bigRoad);
  console.log('bigEye = ', JSON.stringify(bigEye));

  const smallRoad = roadmapGenerator.smallRoad(bigRoad);
  console.log('smallRoad = ', JSON.stringify(smallRoad));

  const cockroachPig = roadmapGenerator.cockroachPig(bigRoad);
  console.log('cockroachPig = ', JSON.stringify(cockroachPig));
}

console.log('gameResults = ', JSON.stringify(gameResults));
