import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { BlockchainService, BlockchainConfig, GameState } from './types';
import { IDL } from '../../contracts/solana/blackjack';

export class SolanaService implements BlockchainService {
    private connection: Connection;
    private program: Program;
    private provider: AnchorProvider;

    constructor(config: BlockchainConfig) {
        this.connection = new Connection(config.rpcUrl);
        const wallet = new Keypair(); // In production, use proper wallet management
        this.provider = new AnchorProvider(this.connection, wallet, {});
        this.program = new Program(IDL, new PublicKey(config.contractAddress), this.provider);
    }

    async initializeGame(): Promise<string> {
        const gameAccount = Keypair.generate();
        const tx = await this.program.methods
            .initialize()
            .accounts({
                game: gameAccount.publicKey,
                casino: this.provider.wallet.publicKey,
                systemProgram: PublicKey.systemProgramId,
            })
            .signers([gameAccount])
            .rpc();

        return tx;
    }

    async startGame(gameId: string, playerAddress: string): Promise<void> {
        const tx = await this.program.methods
            .startGame()
            .accounts({
                game: new PublicKey(gameId),
                player: new PublicKey(playerAddress),
            })
            .rpc();

        await this.connection.confirmTransaction(tx);
    }

    async placeBet(gameId: string, amount: string): Promise<void> {
        const tx = await this.program.methods
            .placeBet(new BN(amount))
            .accounts({
                game: new PublicKey(gameId),
                player: this.provider.wallet.publicKey,
            })
            .rpc();

        await this.connection.confirmTransaction(tx);
    }

    async hit(gameId: string): Promise<void> {
        const tx = await this.program.methods
            .hit()
            .accounts({
                game: new PublicKey(gameId),
                player: this.provider.wallet.publicKey,
            })
            .rpc();

        await this.connection.confirmTransaction(tx);
    }

    async stand(gameId: string): Promise<void> {
        const tx = await this.program.methods
            .stand()
            .accounts({
                game: new PublicKey(gameId),
                player: this.provider.wallet.publicKey,
            })
            .rpc();

        await this.connection.confirmTransaction(tx);
    }

    async doubleDown(gameId: string): Promise<void> {
        const tx = await this.program.methods
            .doubleDown()
            .accounts({
                game: new PublicKey(gameId),
                player: this.provider.wallet.publicKey,
            })
            .rpc();

        await this.connection.confirmTransaction(tx);
    }

    async getGameState(gameId: string): Promise<GameState> {
        const game = await this.program.account.game.fetch(new PublicKey(gameId));
        return {
            gameId,
            player: game.player.toString(),
            dealer: game.casino.toString(),
            status: game.status.toString(),
            bet: game.bet.toString(),
            playerCards: game.playerCards.map((card: any) => ({
                suit: card.suit,
                number: card.number
            })),
            dealerCards: game.dealerCards.map((card: any) => ({
                suit: card.suit,
                number: card.number
            }))
        };
    }
} 