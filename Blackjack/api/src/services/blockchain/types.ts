export enum BlockchainType {
    EVM = 'evm',
    SOLANA = 'solana',
    SUI = 'sui'
}

export interface GameState {
    gameId: string;
    player: string;
    dealer: string;
    status: string;
    bet: string;
    playerCards: Card[];
    dealerCards: Card[];
}

export interface Card {
    suit: number;
    number: number;
}

export interface BlockchainService {
    initializeGame(): Promise<string>;
    startGame(gameId: string, playerAddress: string): Promise<void>;
    placeBet(gameId: string, amount: string): Promise<void>;
    hit(gameId: string): Promise<void>;
    stand(gameId: string): Promise<void>;
    doubleDown(gameId: string): Promise<void>;
    getGameState(gameId: string): Promise<GameState>;
}

export interface BlockchainConfig {
    type: BlockchainType;
    rpcUrl: string;
    contractAddress: string;
    privateKey?: string;
} 