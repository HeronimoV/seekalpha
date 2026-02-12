import type { Metadata } from "next";
import { WalletProvider } from "@/components/WalletProvider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeekAlpha — Prediction Markets on Solana",
  description: "Predict. Earn. Defy the Market. The first prediction market built for Solana Seeker.",
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
          <Navbar />
          <main className="max-w-6xl mx-auto px-4">{children}</main>
          <footer className="text-center py-8 text-sm text-gray-600 border-t border-seek-border mt-16">
            <p>SeekAlpha © 2026 — Built on Solana for the Seeker dApp Store</p>
            <p className="mt-1">seekalpha.sol · seekalpha.bet</p>
          </footer>
        </WalletProvider>
      </body>
    </html>
  );
}
