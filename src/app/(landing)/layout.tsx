import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";

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

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${pressStart2P.variable} font-sans`}>{children}</div>
  );
}
