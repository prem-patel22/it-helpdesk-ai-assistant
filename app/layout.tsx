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
      <head>
        {/* Apollo Tracking Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              function initApollo(){
                var n=Math.random().toString(36).substring(7);
                var o=document.createElement("script");
                o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n;
                o.async=true;
                o.defer=true;
                o.onload=function(){
                  window.trackingFunctions.onLoad({appId:"6a0d771b4031c90018bc595b"})
                };
                document.head.appendChild(o)
              }
              initApollo();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}