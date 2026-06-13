import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import { Providers } from "@/components/ui/providers";
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
  title: { default: "SOAR — Born To Soar", template: "%s — SOAR" },
  description:
    "A movement for those who refuse limitations. Premium essentials, released in limited drops. The box was never real — born to soar.",
  applicationName: "SOAR",
  keywords: ["SOAR", "Born To Soar", "streetwear", "premium essentials", "limited drops"],
  openGraph: {
    title: "SOAR — Born To Soar",
    description: "A movement for those who refuse limitations. Premium essentials in limited drops.",
    siteName: "SOAR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOAR — Born To Soar",
    description: "A movement for those who refuse limitations.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="bg-espresso text-bone antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
