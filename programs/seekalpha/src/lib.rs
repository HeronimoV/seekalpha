use anchor_lang::prelude::*;

declare_id!("SeekA1pha111111111111111111111111111111111");

pub const PLATFORM_FEE_BPS: u16 = 300; // 3%

#[program]
pub mod seekalpha {
    use super::*;

    /// Initialize the platform config (admin only, once)
    pub fn initialize(ctx: Context<Initialize>, treasury: Pubkey) -> Result<()> {
        let config = &mut ctx.accounts.config;
        config.admin = ctx.accounts.admin.key();
        config.treasury = treasury;
        config.market_count = 0;
        config.fee_bps = PLATFORM_FEE_BPS;
        Ok(())
    }

    /// Create a new prediction market
    pub fn create_market(
        ctx: Context<CreateMarket>,
        title: String,
        description: String,
        resolution_time: i64,
    ) -> Result<()> {
        require!(title.len() <= 128, SeekAlphaError::TitleTooLong);
        require!(description.len() <= 512, SeekAlphaError::DescriptionTooLong);

        let clock = Clock::get()?;
        require!(
            resolution_time > clock.unix_timestamp,
            SeekAlphaError::InvalidResolutionTime
        );

        let config = &mut ctx.accounts.config;
        let market = &mut ctx.accounts.market;

        market.id = config.market_count;
        market.creator = ctx.accounts.creator.key();
        market.title = title;
        market.description = description;
        market.yes_pool = 0;
        market.no_pool = 0;
        market.resolution_time = resolution_time;
        market.resolved = false;
        market.outcome = None;
        market.created_at = clock.unix_timestamp;
        market.bump = ctx.bumps.market;

        config.market_count += 1;

        Ok(())
    }

    /// Place a prediction (bet) on a market
    pub fn place_prediction(
        ctx: Context<PlacePrediction>,
        amount: u64,
        position: bool, // true = YES, false = NO
    ) -> Result<()> {
        require!(amount > 0, SeekAlphaError::ZeroAmount);

        let market = &mut ctx.accounts.market;
        let clock = Clock::get()?;

        require!(!market.resolved, SeekAlphaError::MarketResolved);
        require!(
            clock.unix_timestamp < market.resolution_time,
            SeekAlphaError::MarketExpired
        );

        // Transfer SOL from user to market vault
        let transfer_ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.vault.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.vault.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // Update pool totals
        if position {
            market.yes_pool = market.yes_pool.checked_add(amount).unwrap();
        } else {
            market.no_pool = market.no_pool.checked_add(amount).unwrap();
        }

        // Record user's position
        let prediction = &mut ctx.accounts.prediction;
        prediction.user = ctx.accounts.user.key();
        prediction.market = market.key();
        prediction.amount = amount;
        prediction.position = position;
        prediction.claimed = false;
        prediction.bump = ctx.bumps.prediction;

        Ok(())
    }

    /// Resolve a market (admin only)
    pub fn resolve_market(
        ctx: Context<ResolveMarket>,
        outcome: bool, // true = YES won, false = NO won
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;

        require!(!market.resolved, SeekAlphaError::MarketResolved);

        let clock = Clock::get()?;
        require!(
            clock.unix_timestamp >= market.resolution_time,
            SeekAlphaError::MarketNotExpired
        );

        market.resolved = true;
        market.outcome = Some(outcome);

        Ok(())
    }

    /// Claim winnings from a resolved market
    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
        let market = &ctx.accounts.market;
        let prediction = &mut ctx.accounts.prediction;
        let config = &ctx.accounts.config;

        require!(market.resolved, SeekAlphaError::MarketNotResolved);
        require!(!prediction.claimed, SeekAlphaError::AlreadyClaimed);
        require!(
            prediction.position == market.outcome.unwrap(),
            SeekAlphaError::LostPrediction
        );

        let total_pool = market.yes_pool.checked_add(market.no_pool).unwrap();
        let winning_pool = if market.outcome.unwrap() {
            market.yes_pool
        } else {
            market.no_pool
        };

        // Calculate user's share of the total pool
        let gross_winnings = (prediction.amount as u128)
            .checked_mul(total_pool as u128)
            .unwrap()
            .checked_div(winning_pool as u128)
            .unwrap() as u64;

        // Deduct platform fee
        let fee = gross_winnings
            .checked_mul(config.fee_bps as u64)
            .unwrap()
            .checked_div(10_000)
            .unwrap();
        let net_winnings = gross_winnings.checked_sub(fee).unwrap();

        // Transfer winnings from vault to user
        let market_id = market.id.to_le_bytes();
        let seeds = &[b"vault", market_id.as_ref(), &[ctx.bumps.vault]];
        let signer_seeds = &[&seeds[..]];

        // Transfer net winnings to user
        **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= net_winnings;
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += net_winnings;

        // Transfer fee to treasury
        if fee > 0 {
            **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= fee;
            **ctx.accounts.treasury.to_account_info().try_borrow_mut_lamports()? += fee;
        }

        prediction.claimed = true;

        Ok(())
    }
}

// ── Accounts ──────────────────────────────────────────

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + PlatformConfig::INIT_SPACE,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, PlatformConfig>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateMarket<'info> {
    #[account(
        mut,
        seeds = [b"config"],
        bump,
        has_one = admin,
    )]
    pub config: Account<'info, PlatformConfig>,
    #[account(
        init,
        payer = creator,
        space = 8 + Market::INIT_SPACE,
        seeds = [b"market", config.market_count.to_le_bytes().as_ref()],
        bump
    )]
    pub market: Account<'info, Market>,
    /// CHECK: Vault PDA that holds the market's SOL
    #[account(
        seeds = [b"vault", config.market_count.to_le_bytes().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,
    #[account(mut)]
    pub creator: Signer<'info>,
    /// Admin must create markets for now (curated)
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlacePrediction<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(
        init,
        payer = user,
        space = 8 + Prediction::INIT_SPACE,
        seeds = [b"prediction", market.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub prediction: Account<'info, Prediction>,
    /// CHECK: Vault PDA
    #[account(
        mut,
        seeds = [b"vault", market.id.to_le_bytes().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveMarket<'info> {
    #[account(
        seeds = [b"config"],
        bump,
        has_one = admin,
    )]
    pub config: Account<'info, PlatformConfig>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(
        seeds = [b"config"],
        bump,
    )]
    pub config: Account<'info, PlatformConfig>,
    pub market: Account<'info, Market>,
    #[account(
        mut,
        has_one = user,
        has_one = market,
    )]
    pub prediction: Account<'info, Prediction>,
    /// CHECK: Vault PDA
    #[account(
        mut,
        seeds = [b"vault", market.id.to_le_bytes().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,
    /// CHECK: Treasury receives fees
    #[account(
        mut,
        address = config.treasury,
    )]
    pub treasury: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// ── State ─────────────────────────────────────────────

#[account]
#[derive(InitSpace)]
pub struct PlatformConfig {
    pub admin: Pubkey,
    pub treasury: Pubkey,
    pub market_count: u64,
    pub fee_bps: u16,
}

#[account]
#[derive(InitSpace)]
pub struct Market {
    pub id: u64,
    pub creator: Pubkey,
    #[max_len(128)]
    pub title: String,
    #[max_len(512)]
    pub description: String,
    pub yes_pool: u64,
    pub no_pool: u64,
    pub resolution_time: i64,
    pub resolved: bool,
    pub outcome: Option<bool>,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Prediction {
    pub user: Pubkey,
    pub market: Pubkey,
    pub amount: u64,
    pub position: bool,
    pub claimed: bool,
    pub bump: u8,
}

// ── Errors ────────────────────────────────────────────

#[error_code]
pub enum SeekAlphaError {
    #[msg("Title too long (max 128 chars)")]
    TitleTooLong,
    #[msg("Description too long (max 512 chars)")]
    DescriptionTooLong,
    #[msg("Resolution time must be in the future")]
    InvalidResolutionTime,
    #[msg("Market already resolved")]
    MarketResolved,
    #[msg("Market has expired")]
    MarketExpired,
    #[msg("Market not yet expired")]
    MarketNotExpired,
    #[msg("Market not resolved yet")]
    MarketNotResolved,
    #[msg("Amount must be greater than 0")]
    ZeroAmount,
    #[msg("Winnings already claimed")]
    AlreadyClaimed,
    #[msg("You lost this prediction")]
    LostPrediction,
}
