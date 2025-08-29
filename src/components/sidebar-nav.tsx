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
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

const menuItems = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/earnings", label: "Kamai", icon: BarChart3 },
  { href: "/history", label: "Tareekh", icon: History },
  { href: "/profile", label: "Profile", icon: User },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden md:flex">
            <Package2 className="h-6 w-6" />
            <span className="text-lg font-semibold">ZinGo Ride</span>
          </Button>
          <div className="md:ml-auto">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <Link href={href} passHref>
                <SidebarMenuButton
                  isActive={pathname === href}
                  tooltip={label}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <Separator className="my-2" />
         <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton>
                <Bell className="h-5 w-5" />
                <span>Ittila'at</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
