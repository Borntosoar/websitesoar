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
  title: { default: "SOAR — Collection One", template: "%s — SOAR" },
  description:
    "Growth begins where comfort ends. SOAR — Drop 001. A limited first release, designed in Alberta, Canada.",
  applicationName: "SOAR",
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
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
