
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
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/context/LanguageContext";
import { useLogo } from "@/context/LogoContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Car, ShieldCheck, Tag } from "lucide-react";

const translations = {
  ur: {
    title: "Customer Login",
    description: "Login karne ke liye apna email aur password darj karein.",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
    signupPrompt: "Naya account banana hai?",
    signupLink: "Sign up",
    riderPrompt: "Rider ho?",
    riderLink: "Yahan login karein.",
    loginSuccess: "Kamyabi se login ho gaya!",
    loginError: "Login karne mein masla hua.",
    whyRide: "ZinGo ke saath safar kyun karein?",
    fastBooking: "Tez aur Aasan Booking",
    fastBookingDesc: "Chand seconds mein ride book karein. Sirf apni manzil darj karein aur hum aapke liye driver dhoond lenge.",
    safeReliable: "Mehfooz aur Qabil-e-Aitmaad",
    safeReliableDesc: "Hamare tamam drivers tasdeeq-shuda hain. Live tracking aur 24/7 support ke saath mehfooz safar karein.",
    transparentPricing: "Shaffaf Qeemat",
    transparentPricingDesc: "Ride book karne se pehle kiraya dekhein. Koi posheeda charges nahi.",
  },
  en: {
    title: "Customer Login",
    description: "Enter your email and password to login.",
    emailLabel: "Email",
    passwordLabel: "Password",
    loginButton: "Login",
    signupPrompt: "Don't have an account?",
    signupLink: "Sign up",
    riderPrompt: "Are you a rider?",
    riderLink: "Login here.",
    loginSuccess: "Logged in successfully!",
    loginError: "Error logging in.",
    whyRide: "Why Ride with ZinGo?",
    fastBooking: "Fast & Easy Booking",
    fastBookingDesc: "Book a ride in seconds. Just enter your destination and we'll find a driver for you.",
    safeReliable: "Safe & Reliable",
    safeReliableDesc: "All our drivers are verified. Travel safely with live tracking and 24/7 support.",
    transparentPricing: "Transparent Pricing",
    transparentPricingDesc: "Know the fare before you book a ride. No hidden charges.",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { LogoComponent } = useLogo();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: t.loginSuccess,
      });
      router.push('/customer');
    } catch (error: any) {
       console.error(error);
      toast({
        variant: "destructive",
        title: t.loginError,
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="flex items-center gap-2 mb-6">
        <LogoComponent className="h-8 w-8 text-primary" />
        <span className="text-2xl font-semibold">ZinGo Ride</span>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t.emailLabel}</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t.passwordLabel}</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.loginButton}
            </Button>
          </form>
            <div className="mt-4 text-center text-sm">
                {t.signupPrompt}{" "}
                <Link href="/signup" className="underline">
                    {t.signupLink}
                </Link>
            </div>
             <Separator className="my-4" />
             <div className="text-center text-sm">
                 <Link href="/rider-login" className="underline">
                    {t.riderPrompt} {t.riderLink}
                </Link>
            </div>
        </CardContent>
      </Card>
      <div className="mt-8 pt-8 border-t border-border/50 text-center max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">{t.whyRide}</h2>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full">
                <Car className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mt-4">{t.fastBooking}</h3>
            <p className="text-muted-foreground mt-2 text-sm">{t.fastBookingDesc}</p>
            </div>
            <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full">
                <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mt-4">{t.safeReliable}</h3>
            <p className="text-muted-foreground mt-2 text-sm">{t.safeReliableDesc}</p>
            </div>
            <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full">
                <Tag className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mt-4">{t.transparentPricing}</h3>
            <p className="text-muted-foreground mt-2 text-sm">{t.transparentPricingDesc}</p>
            </div>
        </div>
      </div>
    </div>
  )
}
