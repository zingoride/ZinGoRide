
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  Users,
  Settings,
  LayoutDashboard,
  CreditCard,
  Banknote,
  Map,
  Bell,
  Megaphone,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { useLogo } from "@/context/LogoContext";

const translations = {
  ur: {
    dashboard: "Dashboard",
    rides: "Rides",
    users: "Users",
    settings: "Settings",
    walletRequests: "Wallet Requests",
    payouts: "Payouts",
    liveMap: "Live Map",
    notifications: "Notifications",
    advertisements: "Ishtiharat",
  },
  en: {
    dashboard: "Dashboard",
    rides: "Rides",
    users: "Users",
    settings: "Settings",
    walletRequests: "Wallet Requests",
    payouts: "Payouts",
    liveMap: "Live Map",
    notifications: "Notifications",
    advertisements: "Advertisements",
  },
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const { LogoComponent } = useLogo();
  const t = translations[language];

  const menuItems = [
    { href: "/admin/dashboard", label: t.dashboard, icon: LayoutDashboard },
    { href: "/admin/live-map", label: t.liveMap, icon: Map },
    { href: "/admin/rides", label: t.rides, icon: Car },
    { href: "/admin/users", label: t.users, icon: Users },
    { href: "/admin/notifications", label: t.notifications, icon: Bell },
    { href: "/admin/advertisements", label: t.advertisements, icon: Megaphone },
    { href: "/admin/wallet-requests", label: t.walletRequests, icon: CreditCard },
    { href: "/admin/payouts", label: t.payouts, icon: Banknote },
    { href: "/admin/settings", label: t.settings, icon: Settings },
  ];

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4 lg:h-[60px] lg:px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <LogoComponent className="h-6 w-6 text-primary" />
          <span className="">ZinGo Admin</span>
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
                pathname.startsWith(href) ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
