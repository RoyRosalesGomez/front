import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers"; // ← este es el boundary client

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AgroGlobal - Plataforma Agrícola Digital",
  description:
    "Sistema integral para conectar agricultores, clientes y administradores en un ecosistema digital innovador",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
