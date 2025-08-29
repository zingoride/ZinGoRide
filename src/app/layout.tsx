import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/sidebar-nav";
import { Toaster } from "@/components/ui/toaster";
import { RiderStatusProvider } from "@/context/RiderStatusContext";
import { Header } from "@/components/header";
import { RideProvider } from "@/context/RideContext";

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
        <RiderStatusProvider>
          <RideProvider>
            <SidebarProvider>
              <Sidebar>
                <SidebarNav />
              </Sidebar>
              <SidebarInset>
                <Header />
                <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </RideProvider>
        </RiderStatusProvider>
        <Toaster />
      </body>
    </html>
  );
}
