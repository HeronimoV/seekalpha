import { Metadata } from "next";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.id;
  
  return {
    title: `Market #${id} — SeekAlpha`,
    description: "Predict. Earn. Defy the Market. Place your prediction on SeekAlpha — the first prediction market on Solana Seeker.",
    openGraph: {
      title: `Market #${id} — SeekAlpha Prediction Market`,
      description: "Place your prediction on-chain. SOL-native, 3% fee, no KYC. Built for Solana Seeker.",
      url: `https://seekalpha.bet/market/${id}`,
      siteName: "SeekAlpha",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `Market #${id} — SeekAlpha`,
      description: "Place your prediction on-chain. SOL-native, 3% fee, no KYC.",
      creator: "@Seek_Alpha_",
    },
  };
}

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
