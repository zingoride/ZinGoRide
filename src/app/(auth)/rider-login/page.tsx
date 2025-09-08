
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
import { Loader2, DollarSign, Clock, LifeBuoy } from "lucide-react";

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
    loginSuccess: "Kamyabi se login ho gaya!",
    loginError: "Login karne mein masla hua.",
    whyDrive: "ZinGo ke saath drive kyun karein?",
    earnMore: "Zyada Kamayein",
    earnMoreDesc: "Hamari kam commission rates aur zyada demand ke saath apni kamai ko barhayein.",
    flexibleHours: "Apni Marzi Ke Auqaat",
    flexibleHoursDesc: "Jab dil chahay drive karein. Koi pabandi nahi, aap apne boss khud hain.",
    support247: "24/7 Support",
    support247Desc: "Humari dedicated support team har waqt aapki madad ke liye tayyar hai.",
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
    loginSuccess: "Logged in successfully!",
    loginError: "Error logging in.",
    whyDrive: "Why Drive with ZinGo?",
    earnMore: "Earn More",
    earnMoreDesc: "Maximize your earnings with our low commission rates and high demand.",
    flexibleHours: "Flexible Hours",
    flexibleHoursDesc: "Drive whenever you want. No fixed schedules, you are your own boss.",
    support247: "24/7 Support",
    support247Desc: "Our dedicated support team is always available to help you on the road.",
  },
};

export default function RiderLoginPage() {
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
      router.push('/dashboard');
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/50 p-4">
      <div className="flex items-center gap-2 mb-6">
        <LogoComponent className="h-8 w-8" />
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
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t.passwordLabel}</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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

      <div className="mt-8 pt-8 border-t border-border/50 text-center max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">{t.whyDrive}</h2>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full">
                <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mt-4">{t.earnMore}</h3>
            <p className="text-muted-foreground mt-2 text-sm">{t.earnMoreDesc}</p>
            </div>
            <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full">
                <Clock className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mt-4">{t.flexibleHours}</h3>
            <p className="text-muted-foreground mt-2 text-sm">{t.flexibleHoursDesc}</p>
            </div>
            <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-4 rounded-full">
                <LifeBuoy className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mt-4">{t.support247}</h3>
            <p className="text-muted-foreground mt-2 text-sm">{t.support247Desc}</p>
            </div>
        </div>
      </div>
    </div>
  )
}
