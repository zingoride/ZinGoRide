
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
import { Package2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/context/LanguageContext";

const translations = {
  ur: {
    title: "Rider Login",
    description: "Login karne ke liye apna email aur password darj karein.",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
    signupPrompt: "Naya account banana hai?",
    signupLink: "Sign up",
    customerPrompt: "Customer ho?",
    customerLink: "Yahan login karein.",
  },
  en: {
    title: "Rider Login",
    description: "Enter your email and password to login.",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
    signupPrompt: "Don't have an account?",
    signupLink: "Sign up",
    customerPrompt: "Are you a customer?",
    customerLink: "Login here.",
  },
};

export default function RiderLoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/50 p-4">
        <div className="flex items-center gap-2 mb-6">
            <Package2 className="h-8 w-8" />
            <span className="text-2xl font-semibold">ZinGo Ride</span>
        </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t.emailLabel}</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
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
                {t.signupPrompt}{" "}
                <Link href="/rider-signup" className="underline">
                    {t.signupLink}
                </Link>
            </div>
             <Separator className="my-4"/>
             <div className="text-center text-sm">
                 <Link href="/login" className="underline">
                    {t.customerPrompt} {t.customerLink}
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
