
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
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';

const translations = {
  ur: {
    toggleMenu: "Menu Kholein",
    myAccount: "Admin Account",
    settings: "Settings",
    logout: "Logout",
  },
  en: {
    toggleMenu: "Toggle Menu",
    myAccount: "Admin Account",
    settings: "Settings",
    logout: "Logout",
  }
};

export function AdminHeader() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const t = translations[language];

  const handleLogout = async () => {
    await auth.signOut();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_logged_in');
    }
    router.push('/admin/login');
  };

  return (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
          <Button
              variant="secondary"
              size="icon"
              className="overflow-hidden rounded-full"
          >
              <Avatar>
              <AvatarImage
                  src={user?.photoURL || "https://picsum.photos/100/100?random=admin"}
                  alt="Admin Avatar"
                  data-ai-hint="portrait man glasses"
              />
              <AvatarFallback>{user?.displayName?.charAt(0) || 'A'}</AvatarFallback>
              </Avatar>
          </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user?.displayName || t.myAccount}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin/settings">{t.settings}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            {t.logout}
          </DropdownMenuItem>
          </DropdownMenuContent>
      </DropdownMenu>
  );
}
