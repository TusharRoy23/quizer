import type { Metadata } from "next";
import "./globals.css";
import GridShape from "@/components/layouts/GridShape";
import Header from "@/components/common/Header";
import React from "react";
import Providers from "@/store/Providers";
import QueryProvider from "@/hooks/query-provider";
import { Inter, Roboto } from 'next/font/google';

export const metadata: Metadata = {
  title: "Quizer",
  description: "Dummy",
};

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        <Providers>
          <QueryProvider>
            <Header />
            <div className="relative min-h-screen">
              <GridShape className="absolute inset-0 w-full h-full -z-10" />
              <div className="flex flex-col items-center justify-center min-h-screen p-6">
                {children}
              </div>
            </div>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}
