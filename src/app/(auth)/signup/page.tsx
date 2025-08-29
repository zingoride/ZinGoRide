
'use client';

import Link from "next/link"

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
    title: "Customer Sign Up",
    description: "Naya account banane ke liye apni maloomat darj karein.",
    fullNameLabel: "Poora Naam",
    emailLabel: "Email",
    passwordLabel: "Password",
    createAccountButton: "Create an account",
    loginPrompt: "Pehle se account hai?",
    loginLink: "Login",
    riderPrompt: "Rider ho?",
    riderLink: "Yahan signup karein.",
  },
  en: {
    title: "Customer Sign Up",
    description: "Enter your information to create an account.",
    fullNameLabel: "Full Name",
    emailLabel: "Email",
    passwordLabel: "Password",
    createAccountButton: "Create an account",
    loginPrompt: "Already have an account?",
    loginLink: "Login",
    riderPrompt: "Are you a rider?",
    riderLink: "Sign up here.",
  },
};

export default function SignupPage() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-muted/50 p-4">
        <div className="flex items-center gap-2 mb-6">
            <Package2 className="h-8 w-8" />
            <span className="text-2xl font-semibold">ZinGo Ride</span>
        </div>
        <Card className="w-full">
        <CardHeader>
            <CardTitle className="text-xl">{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="full-name">{t.fullNameLabel}</Label>
                <Input id="full-name" placeholder="Ahmad Ali" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">{t.emailLabel}</Label>
                <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">{t.passwordLabel}</Label>
                <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
                {t.createAccountButton}
            </Button>
            </div>
            <div className="mt-4 text-center text-sm">
                {t.loginPrompt}{" "}
                <Link href="/login" className="underline">
                    {t.loginLink}
                </Link>
            </div>
            <Separator className="my-4" />
             <div className="text-center text-sm">
                 <Link href="/rider-signup" className="underline">
                    {t.riderPrompt} {t.riderLink}
                </Link>
            </div>
        </CardContent>
        </Card>
     </div>
  )
}
