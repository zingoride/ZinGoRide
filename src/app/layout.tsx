
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
import { ThemeColorProvider } from "@/context/ThemeColorContext";
import { AuthProvider } from "@/context/AuthContext";
import { WalletProvider } from "@/context/WalletContext";
import { FcmTokenManager } from "@/components/fcm-token-manager";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ZinGo Ride: Rider App",
  description: "Bykea, Careem, Uber jaisi mukammal application.",
  manifest: "/manifest.json",
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
          <ThemeColorProvider>
            <LanguageProvider>
              <AuthProvider>
                <LogoProvider>
                    <WalletProvider>
                        <RiderStatusProvider>
                            <RideProvider>
                              <FcmTokenManager />
                              {children}
                            </RideProvider>
                        </RiderStatusProvider>
                    </WalletProvider>
                </LogoProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeColorProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
