# Solana Roulette Game

This project is a simple, command-line-based roulette game built on the Solana blockchain. It features a Rust-based on-chain program and a TypeScript client application.

## contact

-[telegram](https://t.me/caterpillardev)
-[twitter](https://x.com/caterpillardev)

## Project Structure

- `program-rust/`: Contains the Rust-based on-chain program (smart contract).
- `roulette/`: Contains the Node.js/TypeScript client application for interacting with the on-chain program.
- `docs/`: Contains detailed documentation for the project.

## How It Works

The game's logic is handled by the on-chain program, which ensures a fair and transparent experience. The client application provides a user-friendly command-line interface for players to place their bets.

When a player places a bet, the client application sends a transaction to the on-chain program. The program then:
1.  Receives the player's bet and guess.
2.  Transfers the bet amount from the player's wallet to a treasury account (a Program Derived Address).
3.  Generates a pseudo-random number using the block's timestamp.
4.  If the player's guess is correct, it transfers a 2x payout from the treasury to the player's wallet.

