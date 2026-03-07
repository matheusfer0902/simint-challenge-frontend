import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Poke Center",
  description: "Sistema de gerenciamento de Pokémons para treinadores e pesquisadores.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
