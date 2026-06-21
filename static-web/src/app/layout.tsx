import type { Metadata, Viewport } from "next";
import { Anton, Archivo, Space_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart/cart";
import "./globals.css";

const display = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const sans = Archivo({ subsets: ["latin"], variable: "--font-sans" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: { default: "STATIC — Cut Through The Noise", template: "%s — STATIC" },
  description: "Everything is noise until you cut through it. STATIC — limited drops, precision streetwear.",
  applicationName: "STATIC",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body><CartProvider>{children}</CartProvider></body>
    </html>
  );
}
