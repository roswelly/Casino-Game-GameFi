import { ethers } from 'ethers';
import { BlockchainService, BlockchainConfig, GameState } from './types';
import { BlackjackGame__factory } from '../../contracts/evm/typechain';

export class EVMService implements BlockchainService {
    private provider: ethers.JsonRpcProvider;
    private contract: ethers.Contract;
    private wallet: ethers.Wallet;

    constructor(config: BlockchainConfig) {
        this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
        if (config.privateKey) {
            this.wallet = new ethers.Wallet(config.privateKey, this.provider);
        }
        this.contract = BlackjackGame__factory.connect(config.contractAddress, this.provider);
    }

    async initializeGame(): Promise<string> {
        const tx = await this.contract.initialize();
        const receipt = await tx.wait();
        return receipt.hash;
    }

    async startGame(gameId: string, playerAddress: string): Promise<void> {
        const tx = await this.contract.startGame();
        await tx.wait();
    }

    async placeBet(gameId: string, amount: string): Promise<void> {
        const tx = await this.contract.placeBet({ value: ethers.parseEther(amount) });
        await tx.wait();
    }

    async hit(gameId: string): Promise<void> {
        const tx = await this.contract.hit();
        await tx.wait();
    }

    async stand(gameId: string): Promise<void> {
        const tx = await this.contract.stand();
        await tx.wait();
    }

    async doubleDown(gameId: string): Promise<void> {
        const tx = await this.contract.doubleDown();
        await tx.wait();
    }

    async getGameState(gameId: string): Promise<GameState> {
        const game = await this.contract.getGameState();
        return {
            gameId,
            player: game.player,
            dealer: game.dealer,
            status: game.status.toString(),
            bet: ethers.formatEther(game.bet),
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