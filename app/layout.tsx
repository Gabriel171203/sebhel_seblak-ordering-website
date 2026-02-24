import type { Metadata } from "next";
// import localFont from "next/font/local"; // Removing localFont for now as I am using Google Fonts in globals.css
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SEBHEL - Seblak Level Pedas",
  description: "Seblak paling enak dan pedas yang bikin kangen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
