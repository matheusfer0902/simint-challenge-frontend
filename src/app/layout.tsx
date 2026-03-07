import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import { AuthProvider } from "@/contexts/auth.context";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poke Center — Sistema de Gerenciamento",
  description:
    "Sistema exclusivo para treinadores e pesquisadores. Cadastre, organize e acompanhe seus Pokémons com a eficiência de um Centro Pokémon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${pressStart2P.variable} font-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}