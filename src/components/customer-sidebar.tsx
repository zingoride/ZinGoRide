
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  User,
  History,
  Settings,
  Wallet,
  PlusCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useLogo } from "@/context/LogoContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { WalletTopUpDialog } from "./wallet-top-up-dialog";
import { useWallet } from "@/context/WalletContext";


const translations = {
  ur: {
    bookARide: "Book a Ride",
    myRides: "My Rides",
    profile: "Profile",
    settings: "Settings",
    walletBalance: "Wallet Balance",
    addFunds: "Raqam Shamil Karein",
  },
  en: {
    bookARide: "Book a Ride",
    myRides: "My Rides",
    profile: "Profile",
    settings: "Settings",
    walletBalance: "Wallet Balance",
    addFunds: "Add Funds",
  },
};

export function CustomerSidebar() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { LogoComponent } = useLogo();
  const { balance } = useWallet();
  const t = translations[language];

  const menuItems = [
    { href: "/customer", label: t.bookARide, icon: Car },
    { href: "/customer/my-rides", label: t.myRides, icon: History },
    { href: "/customer/profile", label: t.profile, icon: User },
    { href: "/customer/settings", label: t.settings, icon: Settings },
  ];

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/customer" className="flex items-center gap-2 font-semibold">
          <LogoComponent className="h-6 w-6" />
          <span className="">ZinGo Ride</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {menuItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === href && "bg-muted text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 space-y-3">
         <WalletTopUpDialog userType="Customer" trigger={
            <Button variant="outline" className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> {t.addFunds}
            </Button>
          }/>
        <div className="rounded-lg border bg-card p-3 text-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Wallet className="h-5 w-5" />
                    <span className="font-semibold">{t.walletBalance}</span>
                </div>
                <Badge variant="secondary">PKR {balance.toFixed(2)}</Badge>
            </div>
        </div>
      </div>
    </div>
  );
}
