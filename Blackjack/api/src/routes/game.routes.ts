import { Router, Request, Response } from 'express';
import { BlockchainServiceFactory } from '../services/blockchain/factory';
import { BlockchainType } from '../services/blockchain/types';

const router = Router();

// Initialize game
router.post('/initialize', async (req: Request, res: Response) => {
    try {
        const { blockchainType, rpcUrl, contractAddress } = req.body;
        const service = BlockchainServiceFactory.createService({
            type: blockchainType as BlockchainType,
            rpcUrl,
            contractAddress
        });

        const gameId = await service.initializeGame();
        res.json({ gameId });
    } catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});

// Start game
router.post('/:gameId/start', async (req: Request, res: Response) => {
    try {
        const { blockchainType, rpcUrl, contractAddress, playerAddress } = req.body;
        const service = BlockchainServiceFactory.createService({
            type: blockchainType as BlockchainType,
            rpcUrl,
            contractAddress
        });

        await service.startGame(req.params.gameId, playerAddress);
        res.json({ success: true });
    } catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});

// Place bet
router.post('/:gameId/bet', async (req: Request, res: Response) => {
    try {
        const { blockchainType, rpcUrl, contractAddress, amount } = req.body;
        const service = BlockchainServiceFactory.createService({
            type: blockchainType as BlockchainType,
            rpcUrl,
            contractAddress
        });

        await service.placeBet(req.params.gameId, amount);
        res.json({ success: true });
    } catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});

// Hit
router.post('/:gameId/hit', async (req: Request, res: Response) => {
    try {
        const { blockchainType, rpcUrl, contractAddress } = req.body;
        const service = BlockchainServiceFactory.createService({
            type: blockchainType as BlockchainType,
            rpcUrl,
            contractAddress
        });

        await service.hit(req.params.gameId);
        res.json({ success: true });
    } catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});

// Stand
router.post('/:gameId/stand', async (req: Request, res: Response) => {
    try {
        const { blockchainType, rpcUrl, contractAddress } = req.body;
        const service = BlockchainServiceFactory.createService({
            type: blockchainType as BlockchainType,
            rpcUrl,
            contractAddress
        });

        await service.stand(req.params.gameId);
        res.json({ success: true });
    } catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});

// Double down
router.post('/:gameId/double', async (req: Request, res: Response) => {
    try {
        const { blockchainType, rpcUrl, contractAddress } = req.body;
        const service = BlockchainServiceFactory.createService({
            type: blockchainType as BlockchainType,
            rpcUrl,
            contractAddress
        });

        await service.doubleDown(req.params.gameId);
        res.json({ success: true });
    } catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});

// Get game state
router.get('/:gameId', async (req: Request, res: Response) => {
    try {
        const { blockchainType, rpcUrl, contractAddress } = req.query;
        const service = BlockchainServiceFactory.createService({
            type: blockchainType as BlockchainType,
            rpcUrl: rpcUrl as string,
            contractAddress: contractAddress as string
        });

        const gameState = await service.getGameState(req.params.gameId);
        res.json(gameState);
    } catch (error: unknown) {
        res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
});

export default router; 