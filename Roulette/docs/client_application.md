# Client Application

The client application is a command-line interface (CLI) that allows players to interact with the on-chain roulette game. It is built with Node.js and TypeScript.

## Key Features

- **User-Friendly Interface**: The client uses the `inquirer` library to provide an interactive and easy-to-use CLI.
- **TypeScript**: The codebase is written in TypeScript, which provides static typing for improved code quality and maintainability.
- **Communication with On-Chain Program**: The client uses the `@solana/web3.js` library to communicate with the deployed on-chain program, sending transactions to place bets and receive payouts.

## How It Works

1.  **Prompts for User Input**: The client prompts the user for their bet amount and guess.
2.  **Builds a Transaction**: It builds a transaction with the necessary instruction to call the `playGame` function in the on-chain program.
3.  **Serializes Instruction Data**: The instruction data (bet amount and guess) is serialized using `borsh` to a format that the on-chain program can understand.
4.  **Sends and Confirms Transaction**: It sends the transaction to the Solana network and waits for confirmation.
5.  **Displays Results**: It displays the transaction signature and a message indicating whether the transaction was successful.

## Setup and Usage

- **Navigate to the `roulette` directory:**
  ```
  cd roulette
  ```
- **Install dependencies:**
  ```
  npm install
  ```
- **Update the `programId`:**
  Open `src/index.ts` and replace `"YOUR_PROGRAM_ID"` with the ID of your deployed on-chain program.
- **Build the client:**
  ```
  npm run build
  ```
- **Run the game:**
  ```
  npm start
  ``` 