# Sui Blackjack Game

This is the Sui implementation of the Blackjack game using the Move language and Sui blockchain.

## Prerequisites

1. Install Sui CLI:
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui
```

2. Install Move Analyzer:
```bash
cargo install --git https://github.com/move-language/move move-analyzer
```

3. Install Node.js dependencies for SDK:
```bash
cd sdk
npm install
```

## Development

1. Start a local Sui network:
```bash
sui start
```

2. Build the Move package:
```bash
sui move build
```

3. Deploy the package:
```bash
sui client publish --gas-budget 100000000
```

4. Run tests:
```bash
sui move test
```

## Project Structure

- `sources/`: Move source files
  - `blackjack.move`: Main game logic
- `sdk/`: TypeScript SDK
  - `blackjack.ts`: SDK implementation
- `Move.toml`: Package configuration

## Game Flow

1. Initialize game (casino)
2. Start game (player)
3. Place bet (player)
4. Deal cards
5. Player actions (hit, stand, double)
6. Dealer actions
7. Determine winner and payouts

## Using the SDK

```typescript
import { BlackjackGame } from './sdk/blackjack';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromHEX } from '@mysten/sui.js/utils';

// Initialize game
const game = new BlackjackGame(
    'https://fullnode.devnet.sui.io:443',
    '0x...', // package ID
    '0x...'  // game object ID
);

// Start a game
const playerKeypair = Ed25519Keypair.fromSecretKey(fromHEX('...'));
await game.startGame(playerKeypair);

// Place a bet
await game.placeBet(playerKeypair, BigInt(1000));
```

## Security Considerations

1. All game logic is executed on-chain
2. Random number generation uses Sui's on-chain randomness
3. Proper access control for casino and player roles
4. Coin transfers are handled through Sui's native coin system

## License

MIT 