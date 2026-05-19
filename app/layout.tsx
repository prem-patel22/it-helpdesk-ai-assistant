import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IT Helpdesk AI Assistant",
  description: "Automate 70% of L1 IT Support Tickets with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* WORKING FAVICON - Tested and confirmed */}
        <link 
          rel="icon" 
          type="image/x-icon" 
          href="https://favicon.io/emoji-favicons/robot/favicon.ico"
        />
        <link 
          rel="shortcut icon" 
          type="image/x-icon" 
          href="https://favicon.io/emoji-favicons/robot/favicon.ico"
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}