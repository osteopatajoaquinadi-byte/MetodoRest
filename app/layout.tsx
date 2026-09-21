import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://metodorest.cl"),
  title: {
    default: "Método R.E.S.T. — Protocolo de 21 días para dormir mejor",
    template: "%s | Método R.E.S.T.",
  },
  description:
    "Protocolo de 21 días para dormir mejor, basado en fisiología del sueño y regulación del estrés. Creado por un kinesiólogo y osteópata.",
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "R.E.S.T.",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icons/app-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/app-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://metodorest.cl",
    siteName: "Método R.E.S.T.",
    title: "Método R.E.S.T. — Protocolo de 21 días para dormir mejor",
    description: "Protocolo de 21 días basado en fisiología del sueño y regulación del estrés.",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Método R.E.S.T." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Método R.E.S.T. — Protocolo de 21 días para dormir mejor",
    description: "Protocolo de 21 días basado en fisiología del sueño y regulación del estrés.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${dmSans.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#060E0E" />
      </head>
      <body className="min-h-screen bg-rest-bg text-rest-text font-[family-name:var(--font-dm-sans)] antialiased">
        <GoogleAnalytics />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
