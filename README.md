# SeekAlpha 🔮

**Predict. Earn. Defy the Market.**

SeekAlpha is a decentralized prediction market built on Solana for the Seeker dApp Store. Bet on outcomes, earn rewards, and prove you know the market better than everyone else.

## 🏗️ Architecture

- **`programs/`** — Solana smart contract (Anchor framework)
- **`app/`** — Mobile-first frontend (Next.js + Solana Mobile)
- **`tests/`** — Program integration tests

## 🚀 Quick Start

### Prerequisites
- [Rust](https://rustup.rs/) + Solana CLI
- [Anchor](https://www.anchor-lang.com/docs/installation)
- [Node.js 18+](https://nodejs.org/)

### Build & Test
```bash
# Install dependencies
npm install

# Build the Solana program
anchor build

# Run tests on localnet
anchor test

# Start the frontend
cd app && npm run dev
```

## 📱 Seeker dApp Store

SeekAlpha is built for the [Solana Seeker](https://solanamobile.com/seeker) phone and will be available on the Seeker dApp Store.

## 💰 How It Works

1. Browse active prediction markets
2. Connect your Solana wallet
3. Place your prediction (YES or NO)
4. If you're right when the market resolves, you win a share of the pool
5. Platform takes a small 3% fee on resolved markets

## 🔗 Links

- **Website:** [seekalpha.bet](https://seekalpha.bet)
- **Twitter:** [@Seek_Alpha_](https://twitter.com/Seek_Alpha_)
- **Domain:** seekalpha.sol

## License

MIT
