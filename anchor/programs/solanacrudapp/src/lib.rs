#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod solanacrudapp {
    use super::*;

  pub fn close(_ctx: Context<CloseSolanacrudapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solanacrudapp.count = ctx.accounts.solanacrudapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solanacrudapp.count = ctx.accounts.solanacrudapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSolanacrudapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.solanacrudapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSolanacrudapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Solanacrudapp::INIT_SPACE,
  payer = payer
  )]
  pub solanacrudapp: Account<'info, Solanacrudapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSolanacrudapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub solanacrudapp: Account<'info, Solanacrudapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub solanacrudapp: Account<'info, Solanacrudapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Solanacrudapp {
  count: u8,
}
