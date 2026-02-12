import type { Metadata } from "next";
import { WalletProvider } from "@/components/WalletProvider";
import { ToastProvider } from "@/components/Toast";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeekAlpha — Prediction Markets on Solana",
  description: "Predict. Earn. Defy the Market. The first prediction market built for Solana Seeker.",
  keywords: ["prediction market", "solana", "seeker", "crypto", "betting", "defi", "web3"],
  openGraph: {
    title: "SeekAlpha — Prediction Markets on Solana",
    description: "Predict. Earn. Defy the Market. The first prediction market built for Solana Seeker.",
    url: "https://seekalpha.bet",
    siteName: "SeekAlpha",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SeekAlpha — Prediction Markets on Solana",
    description: "Predict. Earn. Defy the Market. The first prediction market built for Solana Seeker.",
    creator: "@Seek_Alpha_",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <WalletProvider>
          <ToastProvider>
          <Navbar />
          <main className="max-w-6xl mx-auto px-4">{children}</main>
          <footer className="border-t border-seek-border mt-16 py-10 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold text-sm mb-3">Product</h4>
                  <div className="space-y-2 text-sm text-gray-500">
                    <a href="/" className="block hover:text-white transition">Markets</a>
                    <a href="/portfolio" className="block hover:text-white transition">Portfolio</a>
                    <a href="/leaderboard" className="block hover:text-white transition">Leaderboard</a>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-3">Resources</h4>
                  <div className="space-y-2 text-sm text-gray-500">
                    <a href="/about" className="block hover:text-white transition">About</a>
                    <a href="/faq" className="block hover:text-white transition">FAQ</a>
                    <a href="https://github.com/HeronimoV/seekalpha" target="_blank" className="block hover:text-white transition">GitHub</a>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-3">Community</h4>
                  <div className="space-y-2 text-sm text-gray-500">
                    <a href="https://twitter.com/Seek_Alpha_" target="_blank" className="block hover:text-white transition">Twitter / X</a>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-3">Powered By</h4>
                  <div className="space-y-2 text-sm text-gray-500">
                    <a href="https://solana.com" target="_blank" className="block hover:text-white transition">Solana</a>
                    <a href="https://solanamobile.com/seeker" target="_blank" className="block hover:text-white transition">Seeker</a>
                  </div>
                </div>
              </div>
              <div className="text-center text-xs text-gray-600 pt-6 border-t border-seek-border">
                <p>SeekAlpha © 2026 — Predict. Earn. Defy the Market.</p>
                <p className="mt-1">seekalpha.sol · seekalpha.bet</p>
              </div>
            </div>
          </footer>
        </ToastProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
