import type React from "react";
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Suporte da Galera 🎮",
  description:
    "Sistema de tickets para quando o servidor cair e o admin estiver sumido",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${jetbrainsMono.className} font-mono antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
