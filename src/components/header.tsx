
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
import { Bell, Menu, Search } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRiderStatus } from '@/context/RiderStatusContext';
import { useLanguage } from '@/context/LanguageContext';
import { SheetTrigger } from './ui/sheet';
import Link from 'next/link';

const translations = {
  ur: {
    toggleMenu: "Menu Kholein",
    search: "Search...",
    online: "Online",
    offline: "Offline",
    notifications: "Toggle notifications",
    myAccount: "Mera Account",
    settings: "Settings",
    support: "Support",
    logout: "Logout",
  },
  en: {
    toggleMenu: "Toggle Menu",
    search: "Search...",
    online: "Online",
    offline: "Offline",
    notifications: "Toggle notifications",
    myAccount: "My Account",
    settings: "Settings",
    support: "Support",
    logout: "Logout",
  }
};


export function Header() {
  const { isOnline, toggleStatus } = useRiderStatus();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t.toggleMenu}</span>
        </Button>
      </SheetTrigger>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder={t.search}
          className="w-full rounded-lg bg-secondary pl-8 h-9"
        />
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="online-status-switch" className="text-sm font-medium">
          {isOnline ? t.online : t.offline}
        </Label>
        <Switch
          id="online-status-switch"
          checked={isOnline}
          onCheckedChange={toggleStatus}
          aria-label="Online/Offline status"
        />
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-5 w-5" />
        <span className="sr-only">{t.notifications}</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Avatar>
              <AvatarImage
                src="https://picsum.photos/100/100"
                alt="Rider Avatar"
                data-ai-hint="portrait man"
              />
              <AvatarFallback>ZR</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t.myAccount}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">{t.settings}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>{t.support}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>{t.logout}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
