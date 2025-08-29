
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


export function CustomerHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background px-4 sm:px-6 h-16 flex items-center">
       <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
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
                <DropdownMenuLabel>Ahmad Ali</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/customer/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/customer/my-rides">My Rides</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/customer/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/login">Logout</Link>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>

      </div>
    </header>
  );
}
