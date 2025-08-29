
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  Package2,
  BarChart3,
  Bell,
  History,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Separator } from "./ui/separator";

const translations = {
  ur: {
    dashboard: "Dashboard",
    earnings: "Kamai",
    history: "Tareekh",
    profile: "Profile",
    notifications: "Ittila'at",
  },
  en: {
    dashboard: "Dashboard",
    earnings: "Earnings",
    history: "History",
    profile: "Profile",
    notifications: "Notifications",
  },
};

export function SidebarNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language];

  const menuItems = [
    { href: "/", label: t.dashboard, icon: Home },
    { href: "/earnings", label: t.earnings, icon: BarChart3 },
    { href: "/history", label: t.history, icon: History },
    { href: "/profile", label: t.profile, icon: User },
  ];

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
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
       <div className="mt-auto p-4">
        <Separator className="my-2" />
        <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 text-muted-foreground">
            <Bell className="h-4 w-4" />
            {t.notifications}
        </Button>
       </div>
    </div>
  );
}
