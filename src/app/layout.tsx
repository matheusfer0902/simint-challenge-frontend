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
  title: "Poke Center",
  description:
    "Exclusive system for trainers and researchers. Register, organize and track your Pokémons with the efficiency of a Pokémon Center.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} font-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}