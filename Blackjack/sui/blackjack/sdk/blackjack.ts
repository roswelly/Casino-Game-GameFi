import { JsonRpcProvider, Connection } from '@mysten/sui.js';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromHEX } from '@mysten/sui.js/utils';

export class BlackjackGame {
    private provider: JsonRpcProvider;
    private packageId: string;
    private gameId: string;

    constructor(
        rpcUrl: string,
        packageId: string,
        gameId: string
    ) {
        this.provider = new JsonRpcProvider(new Connection({ fullnode: rpcUrl }));
        this.packageId = packageId;
        this.gameId = gameId;
    }

    async initializeGame(signer: Ed25519Keypair) {
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${this.packageId}::game::initialize`,
        });

        const result = await this.provider.signAndExecuteTransactionBlock({
            signer,
            transactionBlock: tx,
            options: {
                showEffects: true,
                showEvents: true,
            },
        });

        return result;
    }

    async startGame(signer: Ed25519Keypair) {
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${this.packageId}::game::start_game`,
            arguments: [tx.object(this.gameId)],
        });

        const result = await this.provider.signAndExecuteTransactionBlock({
            signer,
            transactionBlock: tx,
            options: {
                showEffects: true,
                showEvents: true,
            },
        });

        return result;
    }

    async placeBet(signer: Ed25519Keypair, betAmount: bigint) {
        const tx = new TransactionBlock();
        
        // Create chip coin
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(betAmount)]);

        tx.moveCall({
            target: `${this.packageId}::game::place_bet`,
            arguments: [
                tx.object(this.gameId),
                coin,
            ],
        });

        const result = await this.provider.signAndExecuteTransactionBlock({
            signer,
            transactionBlock: tx,
            options: {
                showEffects: true,
                showEvents: true,
            },
        });

        return result;
    }

    async getGameState() {
        const game = await this.provider.getObject({
            id: this.gameId,
            options: {
                showContent: true,
            },
        });

        return game;
    }
}
