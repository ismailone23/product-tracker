import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import 'react-loading-skeleton/dist/skeleton.css'
import { TRPCProvider } from "@/trpc/react";
import { auth } from "@/lib/auth/auth";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Super Faster Technology",
  description: "Super Faster Technology, Charger, Whole sale",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCProvider>
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
        </TRPCProvider>
      </body>
    </html>
  );
}
