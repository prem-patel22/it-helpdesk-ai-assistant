import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script"; // 1. Import the Script component
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IT Helpdesk AI Assistant",
  description: "AI-powered helpdesk",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 2. Add the Apollo Script component here */}
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