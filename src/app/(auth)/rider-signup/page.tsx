
'use client';

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";

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
import { Loader2, Gift } from "lucide-react";

const translations = {
  ur: {
    title: "Rider Sign Up",
    description: "Naya account banane ke liye apni maloomat darj karein.",
    fullNameLabel: "Poora Naam",
    emailLabel: "Email",
    passwordLabel: "Password",
    referralCodeLabel: "Referral Code (Ikhtiyari)",
    referralCodePlaceholder: "Dost ka referral code darj karein",
    createAccountButton: "Create an account",
    loginPrompt: "Pehle se account hai?",
    loginLink: "Login",
    customerPrompt: "Customer ho?",
    customerLink: "Yahan signup karein.",
    signupSuccess: "Account kamyabi se ban gaya!",
    signupError: "Account banane mein masla hua.",
    emailInUse: "Yeh email pehle se istemal mein hai. Baraye meharbani login karein.",
  },
  en: {
    title: "Rider Sign Up",
    description: "Enter your information to create an account.",
    fullNameLabel: "Full Name",
    emailLabel: "Email",
    passwordLabel: "Password",
    referralCodeLabel: "Referral Code (Optional)",
    referralCodePlaceholder: "Enter friend's referral code",
    createAccountButton: "Create an account",
    loginPrompt: "Already have an account?",
    loginLink: "Login",
    customerPrompt: "Are you a customer?",
    customerLink: "Sign up here.",
    signupSuccess: "Account created successfully!",
    signupError: "Error creating account.",
    emailInUse: "This email is already in use. Please login instead.",
  },
};

export default function RiderSignupPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { LogoComponent } = useLogo();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName });
      
      // Create a user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: fullName,
        email: email,
        type: 'Driver',
        status: 'Active',
        approvalStatus: 'Pending',
        createdAt: new Date(),
        walletBalance: 0, // Initial balance
        referredBy: referralCode || null,
      });
      
      toast({
        title: t.signupSuccess,
      });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast({
            variant: "destructive",
            title: t.signupError,
            description: t.emailInUse,
        });
      } else {
        toast({
            variant: "destructive",
            title: t.signupError,
            description: error.message,
        });
      }
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
            <CardTitle className="text-xl">{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="full-name">{t.fullNameLabel}</Label>
                <Input id="full-name" placeholder="Ali Khan" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">{t.emailLabel}</Label>
                <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                 value={email} onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">{t.passwordLabel}</Label>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="referral-code">{t.referralCodeLabel}</Label>
                 <div className="relative">
                    <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="referral-code" placeholder={t.referralCodePlaceholder} value={referralCode} onChange={(e) => setReferralCode(e.target.value)} className="pl-8" />
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t.createAccountButton}
            </Button>
          </form>
            <div className="mt-4 text-center text-sm">
                {t.loginPrompt}{" "}
                <Link href="/rider-login" className="underline">
                    {t.loginLink}
                </Link>
            </div>
            <Separator className="my-4" />
             <div className="text-center text-sm">
                 <Link href="/signup" className="underline">
                    {t.customerPrompt} {t.customerLink}
                </Link>
            </div>
        </CardContent>
        </Card>
     </div>
  )
}
