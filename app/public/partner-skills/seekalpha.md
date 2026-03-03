---
name: seekalpha
description: "Browse and bet on prediction markets on Solana via SeekAlpha — the first prediction market on the Solana dApp Store. Use when: user wants to see prediction markets, check odds, place a bet/prediction, view their predictions, check platform stats, or find flash markets. Don't use when: user wants crypto prices without betting (use crypto-prices skill), wants to swap tokens (use solana_swap tool), or wants wallet balance (use solana_balance tool)."
version: "1.0.0"
emoji: "\U0001F52E"
image: "https://seekalpha.bet/icon-512.png"
requires:
  bins: []
  env: []
allowed-tools:
  - web_fetch
  - solana_address
  - solana_balance
  - solana_send
---

# SeekAlpha — Prediction Markets on Solana

> **Third-party dApp.** SeekAlpha (seekalpha.bet) is a prediction market platform on Solana mainnet. Bets involve real SOL and are non-reversible once placed on-chain. Winnings depend on market outcomes and are not guaranteed. A 3% platform fee applies to winnings. Max bet: 0.25 SOL. Use at your own risk. DYOR. NFA.

Predict outcomes and win SOL. Binary YES/NO markets across crypto, sports, politics, culture, and memes. Flash markets resolve in 24 hours.

**Base URL:** `http://76.13.125.160/seekalpha`

## Use when

- "Show me prediction markets", "what markets are live?"
- "What are the hottest predictions?", "trending markets"
- "What are the odds on [topic]?"
- "Place a bet", "I want to predict", "bet YES/NO on [market]"
- "Show my predictions", "did I win?", "my bets"
- "Flash markets", "what's closing soon?"
- "SeekAlpha stats"

## Don't use when

- Crypto prices without betting → use crypto-prices skill
- Token swaps → use solana_swap tool
- Wallet balance → use solana_balance tool

---

## Flow 1: Browse Active Markets

When user asks to see markets, what's live, or what they can bet on.

### Steps

**Step 1 — Fetch active markets:**

```
web_fetch({ url: "http://76.13.125.160/seekalpha/api/markets?status=active" })
```

**Step 2 — Present markets nicely:**

For each market, show:
- 🔮 **Title**
- 📊 Odds: YES X% / NO Y%
- 💰 Volume: X SOL
- ⏰ Closes: [date/time]
- ⚡ Type: Standard or Flash

Example format:
```
🔮 Active Prediction Markets:

1. Will BTC close above $100K?
   📊 YES 65% / NO 35% | 💰 0.5 SOL | ⏰ Closes Mar 15
   
2. Will Real Madrid win Champions League?
   📊 YES 50% / NO 50% | 💰 0.2 SOL | ⚡ Standard
```

Ask: "Want to place a prediction on any of these?"

---

## Flow 2: Hot / Trending Markets

When user asks for hottest, trending, or most popular markets.

```
web_fetch({ url: "http://76.13.125.160/seekalpha/api/hot" })
```

Show top 5 markets sorted by volume. Same format as Flow 1.

---

## Flow 3: Flash Markets (24hr)

When user asks about flash markets, quick bets, or what's closing soon.

```
web_fetch({ url: "http://76.13.125.160/seekalpha/api/flash" })
```

Highlight the urgency: "⚡ These resolve in 24 hours — act fast!"

For closing soon:
```
web_fetch({ url: "http://76.13.125.160/seekalpha/api/closing-soon" })
```

---

## Flow 4: Place a Prediction (Bet)

When user wants to bet/predict on a market. **This involves real SOL.**

### Prerequisites

User must specify:
- **Which market** (by name or number from a listing)
- **Position:** YES or NO
- **Amount:** in SOL (max 0.25 SOL)

Ask for any missing info.

### Steps

**Step 1 — Get market info:**

```
web_fetch({ url: "http://76.13.125.160/seekalpha/api/bet-info/<marketId>" })
```

Save the returned `marketAddress`, `vaultAddress`, `programId`.

**Step 2 — Get user's wallet address:**

```
solana_address({})
```

**Step 3 — Check user's balance:**

```
solana_balance({})
```

Verify they have enough SOL (bet amount + ~0.01 SOL for fees/rent).

**Step 4 — Confirm with user before placing bet:**

Show them:
- Market: [title]
- Position: YES or NO
- Amount: X SOL (~$Y USD)
- Current odds: YES X% / NO Y%
- Potential payout if correct (approximate): show `(totalPool + betAmount) * (betAmount / (winningPool + betAmount))` minus 3% fee
- ⚠️ "This bet is final and non-reversible. Proceed?"

**Wait for explicit user approval. NEVER place a bet without confirmation.**

**Step 5 — Place the bet on-chain:**

The user needs to send SOL to the market vault AND call the program instruction. Since SeekerClaw can send SOL:

Use `solana_send` to transfer the bet amount to the vault address:

```
solana_send({
  to: "<vaultAddress from bet-info>",
  amount: <amount in SOL>
})
```

⚠️ **IMPORTANT NOTE:** Direct SOL transfer to vault is a simplified flow. For full on-chain prediction tracking, the user should use the SeekAlpha website (seekalpha.bet) to place bets through the proper Anchor program instruction, which creates a Prediction account. Tell the user:

"I've sent your SOL to the market vault! For the best experience and to track your prediction in your portfolio, you can also place bets directly at **seekalpha.bet** where the full on-chain flow is handled automatically."

**Step 6 — Confirm:**

Show transaction signature and link to Solana Explorer.
"Your prediction is placed! 🔮 Check your portfolio at seekalpha.bet/portfolio"

### Error handling

| Issue | Action |
|-------|--------|
| Insufficient balance | Tell user they need more SOL |
| Market not active | Tell user market has closed or been resolved |
| Amount > 0.25 SOL | Tell user max bet is 0.25 SOL |
| Amount <= 0 | Ask for valid amount |

---

## Flow 5: Check My Predictions

When user asks about their bets, predictions, or if they won.

**Step 1 — Get wallet address:**

```
solana_address({})
```

**Step 2 — Fetch predictions:**

```
web_fetch({ url: "http://76.13.125.160/seekalpha/api/predictions/<walletAddress>" })
```

**Step 3 — Show results:**

For each prediction:
- 🔮 Market: [title]
- 📍 Position: YES/NO
- 💰 Amount: X SOL
- Status: Active / Won ✅ / Lost ❌
- Claimed: Yes/No

If they won and haven't claimed: "You can claim your winnings at seekalpha.bet/portfolio 🎉"

---

## Flow 6: Platform Stats

When user asks about SeekAlpha stats, how big the platform is, etc.

```
web_fetch({ url: "http://76.13.125.160/seekalpha/api/stats" })
```

Show:
- Total markets created
- Active markets
- Total volume in SOL
- Max bet: 0.25 SOL
- Platform fee: 3%

---

## Flow 7: Specific Market Lookup

When user asks about odds or details for a specific market.

First fetch all markets, then find the best match by title keywords:

```
web_fetch({ url: "http://76.13.125.160/seekalpha/api/markets?status=active" })
```

Search through results for matching title. Show full details including description (resolution criteria).

---

## Important Rules

1. **ALWAYS confirm before placing a bet.** Show amount, market, position, and get explicit "yes" approval.
2. **Max bet is 0.25 SOL.** Never let user exceed this.
3. **Bets are non-reversible.** Make this clear.
4. **Not financial advice.** Always include NFA/DYOR disclaimer when discussing specific markets.
5. **Link to seekalpha.bet** for the full experience — portfolio tracking, leaderboard, achievements.
6. **3% fee on winnings only.** No fees on losing bets, deposits, or withdrawals.

## Links

- **Website:** https://seekalpha.bet
- **Twitter:** https://x.com/Seek_Alpha_
- **Discord:** https://discord.gg/ZAYhF4hSZv
- **Telegram:** https://t.me/seekalpha
- **dApp Store:** Available on Solana dApp Store (Seeker phone)
