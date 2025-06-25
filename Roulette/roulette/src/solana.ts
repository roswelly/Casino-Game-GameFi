import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    SYSVAR_CLOCK_PUBKEY,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction,
    clusterApiUrl
} from "@solana/web3.js";
import * as borsh from "borsh";

class PlayInstruction {
    bet_amount: number;
    guess: number;

    constructor(properties: { bet_amount: number, guess: number }) {
        this.bet_amount = properties.bet_amount;
        this.guess = properties.guess;
    }
}

const PlayInstructionSchema = new Map([
    [PlayInstruction, { kind: 'struct', fields: [['bet_amount', 'u64'], ['guess', 'u8']] }],
]);

export async function playGame(player: Keypair, programId: PublicKey, betAmount: number, guess: number): Promise<string> {
    const instruction = new PlayInstruction({
        bet_amount: betAmount,
        guess: guess,
    });

    const buffer = borsh.serialize(PlayInstructionSchema, instruction);

    const [treasuryPda] = await PublicKey.findProgramAddress(
        [Buffer.from("roulette_treasury")],
        programId
    );

    const transaction = new Transaction().add(
        new TransactionInstruction({
            keys: [
                { pubkey: player.publicKey, isSigner: true, isWritable: true },
                { pubkey: treasuryPda, isSigner: false, isWritable: true },
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
                { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
            ],
            programId,
            data: Buffer.from(buffer),
        })
    );

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const signature = await sendAndConfirmTransaction(connection, transaction, [player]);
    return signature;
} 