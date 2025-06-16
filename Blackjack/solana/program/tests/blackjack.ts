import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Blackjack } from "../target/types/blackjack";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { expect } from "chai";

describe("blackjack", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Blackjack as Program<Blackjack>;
  const casino = anchor.web3.Keypair.generate();
  const player = anchor.web3.Keypair.generate();
  const game = anchor.web3.Keypair.generate();

  it("Initializes the game", async () => {
    const tx = await program.methods
      .initialize()
      .accounts({
        game: game.publicKey,
        casino: casino.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([casino, game])
      .rpc();

    const gameAccount = await program.account.game.fetch(game.publicKey);
    expect(gameAccount.casino.toString()).to.equal(casino.publicKey.toString());
    expect(gameAccount.status).to.equal(0); // New
  });

  it("Starts a new game", async () => {
    const tx = await program.methods
      .startGame()
      .accounts({
        game: game.publicKey,
        player: player.publicKey,
      })
      .signers([player])
      .rpc();

    const gameAccount = await program.account.game.fetch(game.publicKey);
    expect(gameAccount.player.toString()).to.equal(player.publicKey.toString());
    expect(gameAccount.status).to.equal(1); // WaitingForBet
  });

  // Add more tests for other game actions
}); 