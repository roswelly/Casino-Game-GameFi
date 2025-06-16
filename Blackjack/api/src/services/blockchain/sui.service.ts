import { JsonRpcProvider, Connection } from '@mysten/sui.js';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { BlockchainService, BlockchainConfig, GameState } from './types';

export class SuiService implements BlockchainService {
    private provider: JsonRpcProvider;
    private packageId: string;
    private wallet: Ed25519Keypair;

    constructor(config: BlockchainConfig) {
        this.provider = new JsonRpcProvider(new Connection({ fullnode: config.rpcUrl }));
        this.packageId = config.contractAddress;
        // In production, use proper wallet management
        this.wallet = new Ed25519Keypair();
    }

    async initializeGame(): Promise<string> {
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${this.packageId}::game::initialize`,
        });

        const result = await this.provider.signAndExecuteTransactionBlock({
            signer: this.wallet,
            transactionBlock: tx,
            options: {
                showEffects: true,
                showEvents: true,
            },
        });

        return result.digest;
    }

    async startGame(gameId: string, playerAddress: string): Promise<void> {
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${this.packageId}::game::start_game`,
            arguments: [tx.object(gameId)],
        });

        await this.provider.signAndExecuteTransactionBlock({
            signer: this.wallet,
            transactionBlock: tx,
        });
    }

    async placeBet(gameId: string, amount: string): Promise<void> {
        const tx = new TransactionBlock();
        const [coin] = tx.splitCoins(tx.gas, [tx.pure(BigInt(amount))]);

        tx.moveCall({
            target: `${this.packageId}::game::place_bet`,
            arguments: [tx.object(gameId), coin],
        });

        await this.provider.signAndExecuteTransactionBlock({
            signer: this.wallet,
            transactionBlock: tx,
        });
    }

    async hit(gameId: string): Promise<void> {
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${this.packageId}::game::hit`,
            arguments: [tx.object(gameId)],
        });

        await this.provider.signAndExecuteTransactionBlock({
            signer: this.wallet,
            transactionBlock: tx,
        });
    }

    async stand(gameId: string): Promise<void> {
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${this.packageId}::game::stand`,
            arguments: [tx.object(gameId)],
        });

        await this.provider.signAndExecuteTransactionBlock({
            signer: this.wallet,
            transactionBlock: tx,
        });
    }

    async doubleDown(gameId: string): Promise<void> {
        const tx = new TransactionBlock();
        tx.moveCall({
            target: `${this.packageId}::game::double_down`,
            arguments: [tx.object(gameId)],
        });

        await this.provider.signAndExecuteTransactionBlock({
            signer: this.wallet,
            transactionBlock: tx,
        });
    }

    async getGameState(gameId: string): Promise<GameState> {
        const game = await this.provider.getObject({
            id: gameId,
            options: {
                showContent: true,
            },
        });

        const content = game.data?.content as any;
        return {
            gameId,
            player: content.fields.player,
            dealer: content.fields.casino,
            status: content.fields.status,
            bet: content.fields.bet,
            playerCards: content.fields.player_cards.map((card: any) => ({
                suit: card.fields.suit,
                number: card.fields.number
            })),
            dealerCards: content.fields.dealer_cards.map((card: any) => ({
                suit: card.fields.suit,
                number: card.fields.number
            }))
        };
    }
} 