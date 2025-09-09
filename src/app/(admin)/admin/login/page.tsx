
'use client';

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

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
    creatingAdmin: "Admin account banaya ja raha hai...",
    adminCreated: "Pehla admin account kamyabi se ban gaya!",
  },
  en: {
    title: "Admin Login",
    description: "Enter your email and password to login.",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
    loginSuccess: "Admin logged in successfully!",
    loginError: "Incorrect email or password.",
    creatingAdmin: "Creating admin account...",
    adminCreated: "First-time admin account created successfully!",
  },
};

export default function AdminLoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_ADMIN_EMAIL || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_logged_in', 'true');
      }
      toast({ title: t.loginSuccess });
      router.push('/admin/dashboard');
    } catch (error: any) {
      // First-time admin setup logic: only create if user does not exist
      if (error.code === 'auth/user-not-found' && email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          try {
              toast({ title: t.creatingAdmin });
              const userCredential = await createUserWithEmailAndPassword(auth, email, password);
              const user = userCredential.user;
              await setDoc(doc(db, "users", user.uid), {
                  name: "Admin",
                  email: email,
                  type: 'Admin',
                  status: 'Active',
                  approvalStatus: 'Approved',
                  createdAt: new Date(),
                  walletBalance: 0,
              });
              if (typeof window !== 'undefined') {
                localStorage.setItem('admin_logged_in', 'true');
              }
              toast({ title: t.adminCreated });
              router.push('/admin/dashboard');

          } catch (creationError: any) {
             console.error("Admin creation error:", creationError);
             toast({
                variant: "destructive",
                title: "Admin Creation Failed",
                description: creationError.message,
              });
          }
      } else {
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: t.loginError,
          description: "Please check your credentials.",
        });
      }
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
              <Input id="email" type="email" placeholder="admin@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t.passwordLabel}</Label>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
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
