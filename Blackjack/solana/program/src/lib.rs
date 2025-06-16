use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod blackjack {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        game.casino = ctx.accounts.casino.key();
        game.status = GameStatus::New as u8;
        game.bet = 0;
        Ok(())
    }

    pub fn start_game(ctx: Context<StartGame>) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(game.status == GameStatus::New as u8, BlackjackError::InvalidGameState);
        game.player = ctx.accounts.player.key();
        game.status = GameStatus::WaitingForBet as u8;
        Ok(())
    }

    pub fn place_bet(ctx: Context<PlaceBet>, amount: u64) -> Result<()> {
        let game = &mut ctx.accounts.game;
        require!(game.status == GameStatus::WaitingForBet as u8, BlackjackError::InvalidGameState);
        require!(amount % 100 == 0, BlackjackError::InvalidBetAmount);

        // Transfer tokens from player to game
        let transfer_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.player_token_account.to_account_info(),
                to: ctx.accounts.game_token_account.to_account_info(),
                authority: ctx.accounts.player.to_account_info(),
            },
        );
        token::transfer(transfer_ctx, amount)?;

        game.bet = amount;
        game.status = GameStatus::WaitingForDeal as u8;
        Ok(())
    }

    // Add more game logic functions here (deal, hit, stand, etc.)
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = casino, space = 8 + Game::LEN)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub casino: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StartGame<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub game: Account<'info, Game>,
    #[account(mut)]
    pub player: Signer<'info>,
    #[account(mut)]
    pub player_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub game_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Game {
    pub casino: Pubkey,
    pub player: Pubkey,
    pub status: u8,
    pub bet: u64,
    pub dealer_cards: Vec<Card>,
    pub player_cards: Vec<Card>,
}

impl Game {
    pub const LEN: usize = 32 + 32 + 1 + 8 + (4 + 2 * 52) + (4 + 2 * 52);
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct Card {
    pub suit: u8,
    pub number: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum GameStatus {
    New,
    WaitingForBet,
    WaitingForDeal,
    PlayerTurn,
    DealerTurn,
    Finished,
}

#[error_code]
pub enum BlackjackError {
    #[msg("Invalid game state")]
    InvalidGameState,
    #[msg("Invalid bet amount")]
    InvalidBetAmount,
} 