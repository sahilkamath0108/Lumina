// "use client"

import type { Metadata } from "next";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { UserProvider } from "@/context/userContext";
import ReactQueryProvider from "@/utils/providers/queryProvider";
import { Suspense } from "react";
import Loading from "./loading";
import { GlobalLoader } from "@/components/ui/global-loader";
import { ThemeProvider } from "@/components/ui/theme-provider"
import { DM_Sans, IBM_Plex_Mono, Playfair_Display } from "next/font/google";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Lumina",
  description: "Discover conference sessions, save your lineup, and complete registration in one flow.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${dmSans.variable} ${playfair.variable} ${plexMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <Suspense fallback={<Loading />}>
            <ReactQueryProvider>
              <UserProvider>
                <LayoutWrapper>
                  <GlobalLoader />
                  {children}
                </LayoutWrapper>
              </UserProvider>
            </ReactQueryProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
