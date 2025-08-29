
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { RiderStatusProvider } from "@/context/RiderStatusContext";
import { RideProvider } from "@/context/RideContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/components/theme-provider";
import { LogoProvider } from "@/context/LogoContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ZinGo Ride: Rider App",
  description: "Bykea, Careem, Uber jaisi mukammal application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <LogoProvider>
              <RiderStatusProvider>
                <RideProvider>
                  {children}
                </RideProvider>
              </RiderStatusProvider>
            </LogoProvider>
          </LanguageProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
