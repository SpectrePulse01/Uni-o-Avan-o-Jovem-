import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "União Avanço Jovem — U.A.J.",
  description:
    "Conheça a União Avanço Jovem, seus integrantes e propostas para o Grêmio Estudantil.",
  openGraph: {
    title: "União Avanço Jovem — U.A.J.",
    description:
      "União que escuta. Avanço que acontece. Conheça nossa chapa e nossas 7 propostas.",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/uaj-hero-classroom-v4.webp",
        width: 1672,
        height: 941,
        alt: "Estudantes reunidos em sala de aula trocando ideias para a escola.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "União Avanço Jovem — U.A.J.",
    description: "Conheça nossa chapa e nossas 7 propostas para a escola.",
    images: ["/uaj-hero-classroom-v4.webp"],
  },
  icons: {
    icon: "/uaj-bandeira.jpg",
    shortcut: "/uaj-bandeira.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
