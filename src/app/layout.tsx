import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "VotePath AI — Understand Elections Clearly. Vote Confidently.",
    template: "%s | VotePath AI",
  },
  description:
    "Personalized guidance for voter registration, voting steps, timelines, eligibility, and election day procedures. Your AI-powered civic companion.",
  keywords: [
    "voter registration",
    "election guide",
    "how to vote",
    "election timeline",
    "voting eligibility",
    "civic tech",
    "election assistant",
  ],
  authors: [{ name: "VotePath AI" }],
  creator: "VotePath AI",
  metadataBase: new URL("https://votepath-ai.web.app"),
  openGraph: {
    title: "VotePath AI — Understand Elections Clearly. Vote Confidently.",
    description:
      "Interactive civic-tech assistant for election education, voter registration, and personalized voting guidance.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VotePath AI",
    description: "Your AI-powered civic companion for election guidance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
