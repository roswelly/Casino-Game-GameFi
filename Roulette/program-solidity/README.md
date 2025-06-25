# BNB Smart Chain Roulette Contract

This directory contains the Solidity smart contract for the roulette game, designed to be deployed on the BNB Smart Chain (BSC).

## How to Compile and Deploy

You can use a development environment like [Remix](https://remix.ethereum.org/) or [Hardhat](https://hardhat.org/) to compile and deploy this contract.

### Using Remix (Recommended for Beginners)

1.  **Open Remix**: Go to the [Remix IDE](https://remix.ethereum.org/).
2.  **Create a New File**: Create a new file named `Roulette.sol` and paste the contract code into it.
3.  **Compile the Contract**:
    -   Go to the "Solidity Compiler" tab (the third icon on the left).
    -   Select a compiler version that is compatible with `^0.8.0` (e.g., `0.8.20`).
    -   Click the "Compile Roulette.sol" button.
4.  **Deploy the Contract**:
    -   Go to the "Deploy & Run Transactions" tab (the fourth icon on the left).
    -   Select "Injected Provider - MetaMask" from the "Environment" dropdown. Make sure your MetaMask is connected to the BNB Smart Chain (mainnet or testnet).
    -   Click the "Deploy" button.
    -   Confirm the transaction in MetaMask.

### Using Hardhat

If you prefer a local development environment, you can use Hardhat.

1.  **Set Up a Hardhat Project**:
    ```bash
    mkdir hardhat-roulette
    cd hardhat-roulette
    npm init -y
    npm install --save-dev hardhat
    npx hardhat
    ```
    (Select "Create a TypeScript project" and follow the prompts.)
2.  **Add the Contract**: Place the `Roulette.sol` file in the `contracts` directory of your Hardhat project.
3.  **Configure Hardhat**: Update `hardhat.config.ts` to connect to the BNB Smart Chain. You will need to add the BSC network details and your private key (use a `.env` file for security).
4.  **Create a Deployment Script**: Create a new script in the `scripts` directory to deploy your contract.
5.  **Deploy**:
    ```bash
    npx hardhat run scripts/deploy.ts --network bsc_testnet
    ```

## After Deployment

-   **Fund the Contract**: Send some BNB to the contract address so it has enough funds to pay out winnings.
-   **Interact with the Contract**: You can use the Remix interface or build a client application (using libraries like `ethers.js` or `web3.js`) to interact with the deployed contract's `play` function. 