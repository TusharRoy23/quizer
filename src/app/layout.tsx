import type { Metadata } from "next";
import "./globals.css";
import GridShape from "@/components/layouts/GridShape";
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
          <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
            <GridShape />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
