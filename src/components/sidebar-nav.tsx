
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  BarChart3,
  History,
  Settings,
  Wallet,
  PlusCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useLogo } from "@/context/LogoContext";
import { useWallet } from "@/context/WalletContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { WalletTopUpDialog } from "./wallet-top-up-dialog";

const translations = {
  ur: {
    dashboard: "Dashboard",
    earnings: "Kamai",
    history: "Tareekh",
    profile: "Profile",
    settings: "Settings",
    notifications: "Ittila'at",
    walletBalance: "Wallet Balance",
    addFunds: "Raqam Shamil Karein",
  },
  en: {
    dashboard: "Dashboard",
    earnings: "Earnings",
    history: "History",
    profile: "Profile",
    settings: "Settings",
    notifications: "Notifications",
    walletBalance: "Wallet Balance",
    addFunds: "Add Funds",
  },
};

export function SidebarNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { LogoComponent } = useLogo();
  const { balance } = useWallet();
  const t = translations[language];

  const menuItems = [
    { href: "/dashboard", label: t.dashboard, icon: Home },
    { href: "/earnings", label: t.earnings, icon: BarChart3 },
    { href: "/history", label: t.history, icon: History },
    { href: "/profile", label: t.profile, icon: User },
    { href: "/settings", label: t.settings, icon: Settings },
  ];

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <LogoComponent className="h-6 w-6 text-primary" />
          <span className="">ZinGo Ride</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                pathname === href && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
       <div className="mt-auto border-t border-sidebar-border p-4 space-y-3">
         <WalletTopUpDialog userType="Driver" trigger={
            <Button variant="secondary" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> {t.addFunds}
            </Button>
          }/>
        <div className="rounded-lg border border-sidebar-border bg-sidebar p-3 text-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    <span className="font-semibold">{t.walletBalance}</span>
                </div>
                <Badge variant={balance < 300 ? "destructive" : "secondary"}>PKR {balance.toFixed(2)}</Badge>
            </div>
        </div>
      </div>
    </div>
  );
}
