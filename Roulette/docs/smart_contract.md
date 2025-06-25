# On-Chain Program (Smart Contract)

The on-chain program is the core of the Solana Roulette game. It is written in Rust and handles all the game's logic in a decentralized and trustless manner.

## Key Features

- **Decentralized Game Logic**: All game mechanics, from receiving bets to paying out winnings, are executed on the Solana blockchain.
- **Program Derived Address (PDA)**: A PDA is used as a treasury account to hold the game's funds. This ensures that the funds are controlled by the program itself, not by an external wallet.
- **Pseudo-Random Number Generation**: The program uses the block's timestamp to generate a pseudo-random number for each game. While not cryptographically secure, this is a common and simple method for on-chain games.

## How It Works

The program's entry point is the `process_instruction` function, which is called every time a transaction is sent to the program. This function handles the following steps:

1.  **Deserializes Instruction Data**: It deserializes the instruction data to get the player's bet amount and guess.
2.  **Transfers Bet to Treasury**: It transfers the bet amount from the player's wallet to the treasury PDA.
3.  **Generates Random Number**: It gets the current block's timestamp from the `Clock` sysvar and uses it to generate a number between 1 and 5.
4.  **Determines Winner**: It compares the player's guess to the generated number.
5.  **Pays Out Winnings**: If the player wins, it transfers a 2x payout from the treasury PDA to the player's wallet.

## Building and Deploying

- **Build the program:**
  ```
  cd program-rust
  cargo build-bpf
  ```
- **Deploy the program:**
  ```
  solana program deploy target/deploy/solana_roulette.so
  ```
  After deploying, you will get a `programId` that you'll need for the client application. 