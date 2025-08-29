
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Menu, Package2 } from 'lucide-react';
import Link from 'next/link';
import { SheetTrigger } from './ui/sheet';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  ur: {
    toggleMenu: "Toggle Menu",
    myAccount: "Mera Account",
    profile: "Profile",
    myRides: "My Rides",
    settings: "Settings",
    logout: "Logout",
  },
  en: {
    toggleMenu: "Toggle Menu",
    myAccount: "My Account",
    profile: "Profile",
    myRides: "My Rides",
    settings: "Settings",
    logout: "Logout",
  }
};

export function CustomerHeader() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background px-4 sm:px-6 h-16 flex items-center">
       <SheetTrigger asChild>
        <Button size="icon" variant="outline">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t.toggleMenu}</span>
        </Button>
      </SheetTrigger>
      <div className="flex items-center justify-between w-full sm:ml-4">
        <Link href="/customer" className="flex items-center gap-2">
            <Package2 className="h-6 w-6" />
            <span className="text-lg font-semibold">ZinGo Ride</span>
        </Link>
        
        <div className="flex items-center gap-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                >
                    <Avatar>
                    <AvatarImage
                        src="https://picsum.photos/100/100?random=2"
                        alt="Customer Avatar"
                        data-ai-hint="portrait woman"
                    />
                    <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t.myAccount}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/customer/profile">{t.profile}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/customer/my-rides">{t.myRides}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/customer/settings">{t.settings}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/login">{t.logout}</Link>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

      </div>
    </header>
  );
}
