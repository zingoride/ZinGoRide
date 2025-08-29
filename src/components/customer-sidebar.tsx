
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  User,
  Package2,
  History,
  Settings,
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
import { Button } from "./ui/button";

const menuItems = [
  { href: "/customer", label: "Book a Ride", icon: Car },
  { href: "/customer/my-rides", label: "My Rides", icon: History },
  { href: "/customer/profile", label: "Profile", icon: User },
];

export function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="hidden md:flex">
            <Package2 className="h-6 w-6" />
            <span className="text-lg font-semibold">ZinGo Ride</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map(({ href, label, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <Link href={href}>
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
         <SidebarMenu>
          <SidebarMenuItem>
             <Link href="#">
                <SidebarMenuButton tooltip="Settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                </SidebarMenuButton>
              </Link>
          </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
