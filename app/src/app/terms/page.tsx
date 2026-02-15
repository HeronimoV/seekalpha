import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — SeekAlpha",
  description: "Terms of Service for SeekAlpha, a decentralized prediction market on Solana.",
};

export default function TermsPage() {
  return (
    <div className="py-12 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: February 15, 2026</p>

      <div className="prose prose-invert max-w-none space-y-6 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-semibold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using SeekAlpha (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform. SeekAlpha is a decentralized application (dApp) deployed on the Solana blockchain.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">2. Description of Service</h2>
          <p>
            SeekAlpha is a decentralized prediction market that allows users to stake SOL tokens on the outcomes of real-world events. All predictions are recorded on the Solana blockchain. The Platform operates through smart contracts and does not custody user funds at any point.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">3. Eligibility</h2>
          <p>
            You must be at least 18 years of age to use SeekAlpha. By using the Platform, you represent and warrant that you meet this age requirement and that your use complies with all applicable laws in your jurisdiction. Access may be restricted in certain jurisdictions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">4. Wallet Responsibility</h2>
          <p>
            You are solely responsible for the security of your Solana wallet, private keys, and seed phrases. SeekAlpha does not have access to your wallet and cannot recover lost funds. All transactions are irreversible once confirmed on the blockchain.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">5. No Financial Advice</h2>
          <p>
            Nothing on SeekAlpha constitutes financial, investment, legal, or tax advice. Prediction markets involve risk, and you may lose your entire stake. Always do your own research and never stake more than you can afford to lose.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">6. Risk Acknowledgment</h2>
          <p>
            You acknowledge and accept the inherent risks of blockchain technology, including but not limited to: smart contract vulnerabilities, network congestion, volatile token prices, potential loss of funds, and regulatory uncertainty. SeekAlpha is provided &ldquo;as is&rdquo; without warranties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">7. Platform Fees</h2>
          <p>
            SeekAlpha charges a 3% fee on winning claims. This fee is deducted automatically by the smart contract at the time of claiming. Solana network transaction fees also apply and are paid by the user.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">8. Market Resolution</h2>
          <p>
            Markets are resolved by designated administrators based on publicly verifiable information. While we strive for accurate and timely resolution, disputes may arise. Resolution decisions made on-chain are final. We are working toward decentralized oracle-based resolution in future versions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">9. Prohibited Conduct</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Use the Platform for money laundering or illegal activities</li>
            <li>Attempt to exploit, hack, or manipulate smart contracts</li>
            <li>Use bots or automated systems to gain unfair advantage</li>
            <li>Create markets with misleading or unresolvable outcomes</li>
            <li>Circumvent geographic or age restrictions</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, SeekAlpha, its contributors, and affiliates shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of the Platform, including loss of funds, data, or profits.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">11. Modification of Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated date. Continued use of the Platform after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with applicable laws. Any disputes shall be resolved through good-faith negotiation. The decentralized nature of the Platform may affect jurisdictional applicability.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-white mb-2">13. Contact</h2>
          <p>
            For questions about these Terms, reach out via our community channels:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Twitter: <a href="https://twitter.com/Seek_Alpha_" target="_blank" rel="noopener noreferrer" className="text-seek-teal hover:underline">@Seek_Alpha_</a></li>
            <li>Discord: <a href="https://discord.gg/ZAYhF4hSZv" target="_blank" rel="noopener noreferrer" className="text-seek-teal hover:underline">discord.gg/ZAYhF4hSZv</a></li>
            <li>Telegram: <a href="https://t.me/+PQI6FKeLWm5iYmIx" target="_blank" rel="noopener noreferrer" className="text-seek-teal hover:underline">SeekAlpha Telegram</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
}
