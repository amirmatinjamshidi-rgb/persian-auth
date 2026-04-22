import type { Metadata } from "next";
import "./globals.css";
import "../src/styles.css";

export const metadata: Metadata = {
  title: "persian-auth",
  description: "Persian (Farsi) authentication components for React",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
