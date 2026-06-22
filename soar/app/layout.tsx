import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { CartProvider } from "./components/cart/CartProvider";
import "./globals.css";

// Fraunces — high-contrast editorial serif (fashion-house display).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
  display: "swap",
});
// Hanken Grotesk — refined grotesque for UI, labels and body (brand grotesque).
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://borntosoar.com"),
  title: { default: "SOAR — Born to soar", template: "%s — SOAR" },
  description:
    "SOAR — Collection One. An edition of 200, individually numbered, made once. Drawn in Alberta, Canada.",
  applicationName: "SOAR",
  keywords: ["SOAR", "Born to soar", "Drop 001", "Collection One", "streetwear", "Alberta", "Canada", "limited edition", "numbered"],
  openGraph: {
    title: "SOAR — Born to soar",
    description: "Collection One. An edition of 200, individually numbered, made once.",
    siteName: "SOAR",
    type: "website",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "SOAR — Born to soar",
    description: "Collection One. An edition of 200, individually numbered, made once.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f3ef",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hanken.variable}`}>
      <body>
        <link rel="preconnect" href="https://cdn.shopify.com" crossOrigin="anonymous" />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
          Skip to content
        </a>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
