import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kontrollplan | Quality WorX",
  description: "Digital kontrollplan för byggprojekt – kontrollpunkter, ansvar och export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
