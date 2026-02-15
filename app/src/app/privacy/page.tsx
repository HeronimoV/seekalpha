import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — SeekAlpha",
  description: "Privacy Policy for SeekAlpha. We believe in privacy-first — no KYC, no personal data collection.",
};

export default function PrivacyPage() {
  return (
    <div className="py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: February 15, 2026</p>

      <div className="prose prose-invert max-w-none space-y-6 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Our Commitment to Privacy</h2>
          <p>
            SeekAlpha is built with a privacy-first philosophy. We do not require registration, email addresses, phone numbers, or any form of KYC (Know Your Customer). Your Solana wallet is your identity.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">What We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Wallet Addresses</strong> — Public blockchain data. Your wallet address is visible on-chain by nature of the Solana blockchain. We do not link it to any personal identity.
            </li>
            <li>
              <strong className="text-white">Usage Analytics</strong> — Anonymous, aggregated data such as page views and feature usage to improve the platform. No personally identifiable information is collected.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">What We Do NOT Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>No names, emails, or phone numbers</li>
            <li>No KYC or identity verification</li>
            <li>No IP address logging or tracking</li>
            <li>No financial information beyond public on-chain data</li>
            <li>No social media profiles or personal data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Cookies & Local Storage</h2>
          <p>
            SeekAlpha uses browser localStorage for user preferences only, such as:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Onboarding completion status</li>
            <li>Gamification data (badges, streaks)</li>
            <li>Wallet connection preferences</li>
          </ul>
          <p className="mt-2">
            We do not use tracking cookies. No data is sent to third-party advertising or analytics platforms that identify individual users.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Third-Party Services</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Solana RPC Nodes</strong> — We connect to Solana&apos;s devnet RPC to read and write blockchain data. RPC providers may log standard connection metadata.
            </li>
            <li>
              <strong className="text-white">Vercel</strong> — Our hosting provider. Standard web server logs may be collected by Vercel per their privacy policy.
            </li>
            <li>
              <strong className="text-white">Wallet Providers</strong> — Phantom and other wallet extensions operate independently. Please review their respective privacy policies.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Data Retention</h2>
          <p>
            On-chain data (predictions, stakes, market outcomes) is permanently stored on the Solana blockchain by its nature. We do not control or delete blockchain data. Local browser data can be cleared by you at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Your Rights</h2>
          <p>
            Since we collect virtually no personal data, traditional data subject rights (access, deletion, portability) largely do not apply. You may:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Clear localStorage at any time to remove local preferences</li>
            <li>Disconnect your wallet at any time</li>
            <li>Use the Platform without creating any account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Your continued use of SeekAlpha constitutes acceptance of any changes.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
          <p>
            Questions about this Privacy Policy? Reach us through:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Twitter: <a href="https://twitter.com/Seek_Alpha_" target="_blank" rel="noopener noreferrer" className="text-seek-teal hover:underline">@Seek_Alpha_</a></li>
            <li>Discord: <a href="https://discord.gg/ZAYhF4hSZv" target="_blank" rel="noopener noreferrer" className="text-seek-teal hover:underline">discord.gg/ZAYhF4hSZv</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
