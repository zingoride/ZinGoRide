
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  Users,
  Package2,
  Settings,
  LayoutDashboard
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

const translations = {
  ur: {
    dashboard: "Dashboard",
    rides: "Rides",
    users: "Users",
    settings: "Settings",
  },
  en: {
    dashboard: "Dashboard",
    rides: "Rides",
    users: "Users",
    settings: "Settings",
  },
};

export function AdminSidebar() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = translations[language];

  const menuItems = [
    { href: "/admin", label: t.dashboard, icon: LayoutDashboard },
    { href: "/admin/rides", label: t.rides, icon: Car },
    { href: "/admin/users", label: t.users, icon: Users },
    { href: "/admin/settings", label: t.settings, icon: Settings },
  ];

  return (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6" />
          <span className="">ZinGo Admin</span>
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
                pathname.startsWith(href) && href !== '/admin' || pathname === href ? "bg-muted text-primary" : ""
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
