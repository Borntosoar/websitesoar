import type { Metadata } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { EntranceGate } from "@/components/ui/entrance-gate";
import "./globals.css";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const serif = Newsreader({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500"],
  variable: "--font-serif",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "SOAR® — Rise Above",
  description:
    "Premium essentials, released in limited drops. Growth begins where comfort ends.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="bg-espresso text-bone antialiased">
        {children}
        <EntranceGate />
      </body>
    </html>
  );
}
