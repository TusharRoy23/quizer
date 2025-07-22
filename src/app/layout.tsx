import type { Metadata } from "next";
import "./globals.css";
import GridShape from "@/components/layouts/GridShape";
import Header from "@/components/common/Header";
import React from "react";
import Providers from "@/store/Providers";

export const metadata: Metadata = {
  title: "Quizer",
  description: "Dummy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <div className="relative min-h-screen">
            <GridShape className="absolute inset-0 w-full h-full -z-10" />
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
