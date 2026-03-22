import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Trustr - Trustless Escrow for Humans & AI Agents",
  description: "Policy-governed escrow payment protocol for freelance work and AI agent services. Built on Base with MetaMask, Locus, Uniswap, and Venice AI.",
  keywords: ["escrow", "crypto payments", "AI agents", "freelance", "Base", "blockchain", "smart contracts", "The Synthesis Hackathon"],
  authors: [{ name: "Trustr Protocol" }],
  creator: "Trustr Protocol",
  openGraph: {
    title: "Trustr - Trustless Payments for the Agent Economy",
    description: "Guaranteed payment on delivery for humans and AI agents",
    type: "website",
    locale: "en_US",
    siteName: "Trustr",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trustr - Trustless Escrow Protocol",
    description: "Guaranteed payment on delivery for humans and AI agents",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
