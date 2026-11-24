import type { Metadata, Viewport } from "next";
import { DM_Sans, IBM_Plex_Mono, Spectral } from "next/font/google";
import "./globals.css";

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yağmurdan Önce — Akıllı Pompa Konuşlandırma · Çankaya / Ankara",
  description:
    "Wilo × imece Water AI Hackathon 2026: Sağanak başlamadan riskli alt geçitleri öngören, sabit ve mobil pompaları birlikte yöneten yapay zekâ destekli karar sistemi.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#132825",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${spectral.variable} ${dmSans.variable} ${ibmPlexMono.variable} antialiased`}
    >
      <body className="min-h-[100dvh] bg-[var(--paper)] text-[var(--ink)] selection:bg-[#236a52]/20 selection:text-[#132825]">
        {children}
      </body>
    </html>
  );
}
