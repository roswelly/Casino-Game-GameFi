use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    program_error::ProgramError,
    pubkey::Pubkey,
    system_instruction,
    sysvar::{clock::Clock, Sysvar},
};

use borsh::{BorshDeserialize, BorshSerialize};
use std::convert::TryInto;

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct PlayInstruction {
    pub bet_amount: u64,
    pub guess: u8,
}

entrypoint!(process_instruction);

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    msg!("Starting Roulette Program");

    let accounts_iter = &mut accounts.iter();
    let player_account = next_account_info(accounts_iter)?;
    let treasury_pda = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;
    let clock_sysvar = next_account_info(accounts_iter)?;

    if !player_account.is_signer {
        msg!("Player account must be a signer");
        return Err(ProgramError::MissingRequiredSignature);
    }

    let instruction = PlayInstruction::try_from_slice(instruction_data)?;
    msg!("Instruction: {:?}", instruction);

    invoke(
        &system_instruction::transfer(player_account.key, treasury_pda.key, instruction.bet_amount),
        &[
            player_account.clone(),
            treasury_pda.clone(),
            system_program.clone(),
        ],
    )?;

    let clock = Clock::from_account_info(clock_sysvar)?;
    let random_ish: u64 = clock.unix_timestamp.try_into().unwrap_or(1);
    let random_number = (random_ish % 5) + 1;
    msg!("Random number: {}", random_number);

    if u64::from(instruction.guess) == random_number {
        msg!("Winner!");
        let payout = instruction.bet_amount * 2;

        if **treasury_pda.lamports.borrow() < payout {
            msg!("Treasury does not have enough funds for payout");
            return Err(ProgramError::InsufficientFunds);
        }

        let (pda, bump_seed) = Pubkey::find_program_address(&[b"roulette_treasury"], program_id);
        if pda != *treasury_pda.key {
            msg!("Invalid treasury PDA");
            return Err(ProgramError::InvalidSeeds);
        }

        invoke_signed(
            &system_instruction::transfer(treasury_pda.key, player_account.key, payout),
            &[
                treasury_pda.clone(),
                player_account.clone(),
                system_program.clone(),
            ],
            &[&[b"roulette_treasury", &[bump_seed]]],
        )?;
        msg!("Paid out {} lamports to player", payout);
    } else {
        msg!("Loser! Better luck next time.");
    }

    Ok(())
} 