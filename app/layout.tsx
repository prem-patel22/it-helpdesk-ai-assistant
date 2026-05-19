import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IT Helpdesk AI Assistant",
  description: "Automate 70% of L1 IT Support Tickets with AI",
  icons: {
    icon: "https://favicon.io/emoji-favicons/robot/favicon.ico",
    shortcut: "https://favicon.io/emoji-favicons/robot/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}