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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#9333EA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SeekAlpha" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        `}} />
      </head>
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
                    <a href="https://discord.gg/ZAYhF4hSZv" target="_blank" className="block hover:text-white transition">Discord</a>
                    <a href="https://t.me/+PQI6FKeLWm5iYmIx" target="_blank" className="block hover:text-white transition">Telegram</a>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-3">Legal</h4>
                  <div className="space-y-2 text-sm text-gray-500">
                    <a href="/terms" className="block hover:text-white transition">Terms of Service</a>
                    <a href="/privacy" className="block hover:text-white transition">Privacy Policy</a>
                  </div>
                  <h4 className="font-semibold text-sm mb-3 mt-4">Powered By</h4>
                  <div className="space-y-2 text-sm text-gray-500">
                    <a href="https://solana.com" target="_blank" className="block hover:text-white transition">◎ Solana</a>
                    <a href="https://solanamobile.com/seeker" target="_blank" className="block hover:text-white transition">Seeker</a>
                  </div>
                </div>
              </div>
              <div className="text-center text-xs text-gray-600 pt-6 border-t border-seek-border">
                <p>SeekAlpha © {new Date().getFullYear()} — Predict. Earn. Defy the Market.</p>
                <p className="mt-1">seekalpha.sol · seekalpha.bet</p>
                <p className="mt-2 text-gray-700">Built with ❤️ on Solana ◎</p>
              </div>
            </div>
          </footer>
        </ToastProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
