import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Veriflow — Verify every email before you send',
    template: '%s | Veriflow',
  },
  description:
    'Industrial-grade email verification. Detect spam traps, fix typos, protect your sender score.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Veriflow',
    title: 'Veriflow — Verify every email before you send',
    description: 'Industrial-grade email verification. Detect spam traps, fix typos, protect your sender score.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-slate-950 antialiased text-white selection:bg-blue-500/30 selection:text-white bg-dot-grid">
        {children}
      </body>
    </html>
  );
}
