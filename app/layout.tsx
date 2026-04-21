import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio — Workspace",
  description: "Projects, clients, and teams — all in one place.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
