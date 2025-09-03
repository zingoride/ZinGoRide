
'use client';

import Link from "next/link"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext";

const translations = {
  ur: {
    title: "Admin Login",
    description: "Login karne ke liye apna email aur password darj karein.",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
  },
  en: {
    title: "Admin Login",
    description: "Enter your email and password to login.",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
  },
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd perform authentication here.
    // For now, we'll just set a dummy session item and redirect.
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_logged_in', 'true');
    }
    router.push('/admin/dashboard');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/50 p-4">
        <div className="flex items-center gap-2 mb-6">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-semibold">ZinGo Admin</span>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t.emailLabel}</Label>
              <Input id="email" type="email" placeholder="info@zingoride.vercel.app" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t.passwordLabel}</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              {t.loginButton}
            </Button>
          </form>
            <div className="mt-4 text-center text-sm">
                 <Link href="/login" className="underline">
                    Back to Customer Login
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}

