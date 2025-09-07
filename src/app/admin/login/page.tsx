
'use client';

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

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
import { Shield, Loader2 } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const translations = {
  ur: {
    title: "Admin Login",
    description: "Login karne ke liye apna email aur password darj karein.",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
    loginSuccess: "Admin kamyabi se login ho gaya!",
    loginError: "Ghalat email ya password.",
  },
  en: {
    title: "Admin Login",
    description: "Enter your email and password to login.",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
    loginSuccess: "Admin logged in successfully!",
    loginError: "Incorrect email or password.",
  },
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'info@zingoride.vercel.app');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // In a real production app, you might want to check if the user
      // has admin privileges from your database (e.g., Firestore custom claims).
      // For this prototype, we will assume if they can log in here, they are an admin.
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_logged_in', 'true');
      }
      toast({ title: t.loginSuccess });
      router.push('/admin/dashboard');
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: t.loginError,
        description: "Please check your credentials or create the admin user in Firebase Authentication.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
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
              <Input id="email" type="email" placeholder="info@zingoride.vercel.app" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t.passwordLabel}</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
