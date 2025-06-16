import { BlockchainType, BlockchainService, BlockchainConfig } from './types';
import { EVMService } from './evm.service';
import { SolanaService } from './solana.service';
import { SuiService } from './sui.service';

export class BlockchainServiceFactory {
    static createService(config: BlockchainConfig): BlockchainService {
        switch (config.type) {
            case BlockchainType.EVM:
                return new EVMService(config);
            case BlockchainType.SOLANA:
                return new SolanaService(config);
            case BlockchainType.SUI:
                return new SuiService(config);
            default:
                throw new Error(`Unsupported blockchain type: ${config.type}`);
        }
    }
} 