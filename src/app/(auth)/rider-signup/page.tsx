
'use client';

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { setDoc, doc, getDoc } from "firebase/firestore";

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
import { Loader2, Gift, DollarSign, Clock, LifeBuoy } from "lucide-react";

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
    whyDrive: "ZinGo ke saath drive kyun karein?",
    earnMore: "Zyada Kamayein",
    earnMoreDesc: "Hamari kam commission rates aur zyada demand ke saath apni kamai ko barhayein.",
    flexibleHours: "Apni Marzi Ke Auqaat",
    flexibleHoursDesc: "Jab dil chahay drive karein. Koi pabandi nahi, aap apne boss khud hain.",
    support247: "24/7 Support",
    support247Desc: "Humari dedicated support team har waqt aapki madad ke liye tayyar hai.",
    terms: "account bana kar, aap hamari",
    termsLink: "Terms of Service",
    privacy: "aur",
    privacyLink: "Privacy Policy",
    agree: "se ittefaq karte hain."
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
    whyDrive: "Why Drive with ZinGo?",
    earnMore: "Earn More",
    earnMoreDesc: "Maximize your earnings with our low commission rates and high demand.",
    flexibleHours: "Flexible Hours",
    flexibleHoursDesc: "Drive whenever you want. No fixed schedules, you are your own boss.",
    support247: "24/7 Support",
    support247Desc: "Our dedicated support team is always available to help you on the road.",
    terms: "By creating an account, you agree to our",
    termsLink: "Terms of Service",
    privacy: "and",
    privacyLink: "Privacy Policy",
    agree: "."
  },
};

type ConfigType = {
    termsOfServiceUrl?: string;
    privacyPolicyUrl?: string;
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
  const [config, setConfig] = useState<ConfigType>({});
  const t = translations[language];

  useEffect(() => {
    const fetchConfig = async () => {
        const configRef = doc(db, 'configs', 'appConfig');
        const configSnap = await getDoc(configRef);
        if (configSnap.exists()) {
            setConfig(configSnap.data());
        }
    };
    fetchConfig();
  }, []);

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
            <div className="mt-4 text-center text-xs text-muted-foreground">
                {t.terms}{" "}
                <Link href={config.termsOfServiceUrl || '#'} target="_blank" className="underline underline-offset-4">
                    {t.termsLink}
                </Link>{" "}
                {t.privacy}{" "}
                <Link href={config.privacyPolicyUrl || '#'} target="_blank" className="underline underline-offset-4">
                    {t.privacyLink}
                </Link>
                {t.agree}
            </div>
            <Separator className="my-4" />
            <div className="mt-4 text-center text-sm">
                {t.loginPrompt}{" "}
                <Link href="/rider-login" className="underline">
                    {t.loginLink}
                </Link>
            </div>
             <div className="text-center text-sm mt-2">
                 <Link href="/signup" className="underline">
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

    