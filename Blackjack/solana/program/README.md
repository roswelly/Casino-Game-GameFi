# Solana Blackjack Game

This is the Solana implementation of the Blackjack game. It uses the Anchor framework for Solana program development.

## Prerequisites

1. Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

2. Install Solana CLI:
```bash
sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"
```

3. Install Anchor:
```bash
npm install -g @project-serum/anchor-cli
```

4. Install Node.js dependencies:
```bash
npm install
```

## Development

1. Start a local Solana validator:
```bash
solana-test-validator
```

2. Build the program:
```bash
anchor build
```

3. Deploy the program:
```bash
anchor deploy
```

4. Run tests:
```bash
anchor test
```

## Program Structure

- `src/lib.rs`: Main program logic
- `tests/`: TypeScript tests and client examples
- `Anchor.toml`: Program configuration

## Game Flow

1. Initialize game (casino)
2. Start game (player)
3. Place bet (player)
4. Deal cards
5. Player actions (hit, stand, double)
6. Dealer actions
7. Determine winner and payouts

## Integration with Frontend

The frontend can interact with this Solana program using the `@solana/web3.js` and `@project-serum/anchor` libraries. Example usage:

```typescript
import { Program, AnchorProvider } from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

// Initialize connection
const connection = new Connection("http://localhost:8899");
const provider = new AnchorProvider(connection, wallet, {});
const program = new Program(IDL, PROGRAM_ID, provider);

// Start a game
await program.methods
  .startGame()
  .accounts({
    game: gamePublicKey,
    player: wallet.publicKey,
  })
  .rpc();
```

## Security Considerations

1. All game logic is executed on-chain
2. Random number generation uses Solana's recent blockhash
3. Proper access control for casino and player roles
4. Token transfers are handled through SPL Token program

## License

MIT 