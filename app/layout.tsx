import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IT Helpdesk AI Assistant",
  description: "AI-powered helpdesk",
  icons: {
    icon: "https://favicon.io/emoji-favicons/high-voltage/favicon.ico",
    apple: "https://favicon.io/emoji-favicons/high-voltage/apple-touch-icon.png",
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
        <link
          rel="icon"
          type="image/x-icon"
          href="https://favicon.io/emoji-favicons/high-voltage/favicon.ico"
        />
        <link
          rel="apple-touch-icon"
          href="https://favicon.io/emoji-favicons/high-voltage/apple-touch-icon.png"
        />
        <Script
          id="apollo-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function initApollo(){
                var n=Math.random().toString(36).substring(7),
                o=document.createElement("script");
                o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n;
                o.async=!0;
                o.defer=!0;
                o.onload=function(){
                  window.trackingFunctions.onLoad({appId:"6a0d771b4031c90018bc595b"})
                };
                document.head.appendChild(o);
              }
              initApollo();
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}