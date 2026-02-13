"use client";

export default function AboutPage() {
  return (
    <div className="py-12 max-w-3xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">🔮</div>
        <h1 className="text-4xl font-bold mb-3">
          <span className="bg-gradient-to-r from-seek-purple to-seek-teal bg-clip-text text-transparent">
            About SeekAlpha
          </span>
        </h1>
        <p className="text-gray-400 text-lg">
          The first prediction market built for the Solana Seeker ecosystem.
        </p>
      </div>

      {/* What is SeekAlpha */}
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">What is SeekAlpha?</h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            SeekAlpha is a decentralized prediction market where you bet on the future. Will SOL hit $200?
            Will a new memecoin break records? Will your team win the championship? Put your money where
            your conviction is.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Built natively on Solana for lightning-fast, low-cost transactions. Designed specifically
            for the Seeker phone and the Solana Mobile dApp Store.
          </p>
        </section>

        {/* How it Works */}
        <section>
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-seek-card border border-seek-border rounded-xl p-5 text-center">
              <div className="text-3xl mb-3">1️⃣</div>
              <h3 className="font-semibold mb-2">Browse Markets</h3>
              <p className="text-sm text-gray-400">
                Explore prediction markets across crypto, sports, politics, tech, memes, and more.
              </p>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-5 text-center">
              <div className="text-3xl mb-3">2️⃣</div>
              <h3 className="font-semibold mb-2">Place Your Prediction</h3>
              <p className="text-sm text-gray-400">
                Connect your wallet, choose YES or NO, and stake your SOL. See your potential payout instantly.
              </p>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-5 text-center">
              <div className="text-3xl mb-3">3️⃣</div>
              <h3 className="font-semibold mb-2">Win & Collect</h3>
              <p className="text-sm text-gray-400">
                When the market resolves, winners split the pool proportionally. Claim your winnings on-chain.
              </p>
            </div>
          </div>
        </section>

        {/* Fee Structure */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Fees</h2>
          <div className="bg-seek-card border border-seek-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400">Platform fee on resolved markets</span>
              <span className="text-2xl font-bold text-seek-teal">3%</span>
            </div>
            <p className="text-sm text-gray-400">
              We only take a fee when a market resolves and winners are paid out. No fees on deposits,
              no fees on losing bets, no hidden charges. Just 3% of the winning payout — one of the
              lowest in the industry.
            </p>
          </div>
        </section>

        {/* Why SeekAlpha */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Why SeekAlpha?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-seek-card border border-seek-border rounded-xl p-5">
              <div className="text-xl mb-2">⚡</div>
              <h3 className="font-semibold mb-1">Built on Solana</h3>
              <p className="text-sm text-gray-400">Sub-second transactions, near-zero fees. No more waiting or paying $50 in gas.</p>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-5">
              <div className="text-xl mb-2">📱</div>
              <h3 className="font-semibold mb-1">Seeker Native</h3>
              <p className="text-sm text-gray-400">Designed for the Solana Seeker phone. Mobile-first, always.</p>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-5">
              <div className="text-xl mb-2">🔒</div>
              <h3 className="font-semibold mb-1">Fully On-Chain</h3>
              <p className="text-sm text-gray-400">All bets and payouts are handled by a smart contract. Transparent and trustless.</p>
            </div>
            <div className="bg-seek-card border border-seek-border rounded-xl p-5">
              <div className="text-xl mb-2">💰</div>
              <h3 className="font-semibold mb-1">Low Fees</h3>
              <p className="text-sm text-gray-400">3% platform fee — only on winnings. That's it. No tricks.</p>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Roadmap</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-seek-teal"></div>
                <div className="w-0.5 h-full bg-seek-border"></div>
              </div>
              <div className="pb-6">
                <div className="text-sm text-seek-teal font-medium">Phase 1 — Now</div>
                <h3 className="font-semibold">Launch MVP on Devnet</h3>
                <p className="text-sm text-gray-400">Core prediction market, wallet integration, curated markets.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-seek-purple"></div>
                <div className="w-0.5 h-full bg-seek-border"></div>
              </div>
              <div className="pb-6">
                <div className="text-sm text-seek-purple font-medium">Phase 2 — Q1 2026</div>
                <h3 className="font-semibold">Mainnet Launch + dApp Store</h3>
                <p className="text-sm text-gray-400">Deploy smart contract to mainnet, submit to Seeker dApp Store, real SOL markets.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                <div className="w-0.5 h-full bg-seek-border"></div>
              </div>
              <div className="pb-6">
                <div className="text-sm text-gray-500 font-medium">Phase 3 — Q2 2026</div>
                <h3 className="font-semibold">User-Created Markets + Oracles</h3>
                <p className="text-sm text-gray-400">Anyone can create markets, automated resolution via Pyth/Switchboard oracles.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-gray-600"></div>
              </div>
              <div>
                <div className="text-sm text-gray-500 font-medium">Phase 4 — Q3 2026</div>
                <h3 className="font-semibold">Social + Tournaments</h3>
                <p className="text-sm text-gray-400">Leaderboards, prediction tournaments, social features, mobile push notifications.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Links */}
        <section className="text-center pt-4">
          <h2 className="text-2xl font-bold mb-6">Join the Community</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://twitter.com/Seek_Alpha_"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-seek-card border border-seek-border hover:border-seek-purple transition text-sm font-medium"
            >
              🐦 Twitter / X
            </a>
            <a
              href="https://seekalpha.bet"
              className="px-6 py-3 rounded-xl bg-seek-card border border-seek-border hover:border-seek-teal transition text-sm font-medium"
            >
              🌐 seekalpha.bet
            </a>
            <a
              href="https://github.com/HeronimoV/seekalpha"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-seek-card border border-seek-border hover:border-gray-400 transition text-sm font-medium"
            >
              💻 GitHub
            </a>
            <a
              href="https://discord.gg/seekalpha"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-seek-card border border-seek-border hover:border-indigo-400 transition text-sm font-medium"
            >
              💬 Discord
            </a>
            <a
              href="https://t.me/+PQI6FKeLWm5iYmIx"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-seek-card border border-seek-border hover:border-blue-400 transition text-sm font-medium"
            >
              ✈️ Telegram
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
