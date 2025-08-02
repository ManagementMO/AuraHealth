import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Aura Health - Pre-Consultation Check-in",
  description: "Secure pre-consultation patient check-in system with AI-powered emotional analysis for healthcare providers.",
  keywords: ["healthcare", "telemedicine", "patient check-in", "emotional analysis", "pre-consultation"],
  authors: [{ name: "Aura Health" }],
  robots: "noindex, nofollow", // Privacy-focused for healthcare
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-neutral-50 text-neutral-900`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
