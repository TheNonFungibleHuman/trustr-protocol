import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trustr - Trustless Escrow for Humans & AI Agents",
  description: "Policy-governed escrow payment protocol for freelance work and AI agent services. Built on Base with MetaMask, Locus, Uniswap, and Venice AI.",
  keywords: ["escrow", "crypto payments", "AI agents", "freelance", "Base", "blockchain", "smart contracts"],
  authors: [{ name: "Trustr Protocol" }],
  openGraph: {
    title: "Trustr - Trustless Payments for the Agent Economy",
    description: "Guaranteed payment on delivery for humans and AI agents",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
