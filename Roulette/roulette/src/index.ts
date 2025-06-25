import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { playGame } from "./solana";

const init = () => {
    console.log(
        chalk.green(
            figlet.textSync("SOL Stake", {
                font: "Standard",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
    console.log(chalk.yellow`The max bidding amount is 2.5 SOL here`);
};

// This is a dummy secret key for demonstration purposes.
// In a real application, this should be handled securely.
const userSecretKey: Uint8Array = Uint8Array.from([
    229, 65, 12, 110, 128, 101, 62, 119, 239, 95, 26,
    67, 178, 99, 40, 77, 46, 151, 163, 227, 167, 5,
    138, 101, 140, 195, 212, 161, 105, 216, 79, 73, 6,
    85, 188, 71, 255, 12, 214, 102, 84, 170, 129, 127,
    64, 57, 133, 22, 10, 9, 135, 34, 75, 223, 107,
    252, 253, 22, 242, 135, 180, 245, 221, 155
]);

const userWallet: Keypair = Keypair.fromSecretKey(userSecretKey);

// Replace with your deployed program ID
const programId: PublicKey = new PublicKey("YOUR_PROGRAM_ID");

interface IAnswers {
    SOL: number;
    GUESS: number;
}

const askQuestions = (): Promise<IAnswers> => {
    const questions = [
        {
            name: "SOL",
            type: "number",
            message: "What is the amount of SOL you want to stake?",
        },
        {
            type: "number",
            name: "GUESS",
            message: "Guess a random number from 1 to 5 (both 1 and 5 included)",
        }
    ];
    return inquirer.prompt(questions);
};

const gameExecution = async () => {
    init();
    const answers = await askQuestions();
    const { SOL, GUESS } = answers;

    if (SOL && GUESS) {
        try {
            const betAmountLamports = SOL * LAMPORTS_PER_SOL;
            console.log(chalk.blue`Placing your bet...`);
            const signature = await playGame(userWallet, programId, betAmountLamports, GUESS);
            console.log(chalk.green`Transaction successful with signature: ${signature}`);
            console.log(chalk.yellow`Check the transaction log to see if you won!`);
        } catch (error) {
            if (error instanceof Error) {
                console.error(chalk.red`Transaction failed: ${error.message}`);
            } else {
                console.error(chalk.red`An unknown error occurred`);
            }
        }
    }
}

gameExecution(); 