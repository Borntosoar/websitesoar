import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Archivo_Black } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const archivo = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo-black" });

export const metadata: Metadata = {
  title: { default: "SOAR — Born To Soar", template: "%s — SOAR" },
  description:
    "Growth begins where comfort ends. True success comes from having the courage to rise above limitations.",
  applicationName: "SOAR",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
