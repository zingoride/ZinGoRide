
'use client';

import Link from "next/link"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

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
    adminUpdated: "User ko admin bana diya gaya hai!",
    notAdmin: "Aap admin nahi hain.",
    userNotFound: "Is email se koi user nahi mila.",
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
    adminUpdated: "User has been promoted to Admin!",
    notAdmin: "You are not an admin.",
    userNotFound: "No user found with this email.",
  },
};

const ADMIN_EMAIL = 'info@zingoride.vercel.app';
const ADMIN_UID = 'xMGCQ5b3oic287oK9yTzKSgyTkj2';

export default function AdminLoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState('info@zingoride.vercel.app');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const t = translations[language];
  
  const ensureAdminUser = async (user: any) => {
      // Security Check: Only allow the specific admin user
      if (user.email !== ADMIN_EMAIL || user.uid !== ADMIN_UID) {
          await auth.signOut(); // Sign out the unauthorized user immediately
          throw new Error(t.notAdmin);
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.type !== 'Admin') {
              await updateDoc(userDocRef, { type: 'Admin', approvalStatus: 'Approved' });
              toast({ title: t.adminUpdated });
          }
      } else {
           await setDoc(userDocRef, {
              name: "Admin",
              email: email,
              type: 'Admin',
              status: 'Active',
              approvalStatus: 'Approved',
              createdAt: new Date(),
              walletBalance: 5000,
          });
          toast({ title: t.adminCreated });
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_logged_in', 'true');
      }
      toast({ title: t.loginSuccess });
      router.push('/admin/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Security check: Only allow the specified email to even attempt login
    if (email !== ADMIN_EMAIL) {
        toast({
            variant: "destructive",
            title: t.loginError,
            description: t.notAdmin,
        });
        setLoading(false);
        return;
    }

    try {
      // Step 1: Always try to sign in first.
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // If sign-in is successful, ensure the user is the correct admin.
      await ensureAdminUser(userCredential.user);

    } catch (error: any) {
      // Step 2: Handle errors.
      if (error.code === 'auth/user-not-found' && email === ADMIN_EMAIL) {
          // Case: The admin user does not exist at all in Firebase Auth. Create it.
          try {
              toast({ title: t.creatingAdmin });
              const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
              // Now that the auth user is created, ensure it's the correct admin.
              await ensureAdminUser(newUserCredential.user);
          } catch (creationError: any) {
             console.error("Admin creation error:", creationError);
             toast({
                variant: "destructive",
                title: "Admin Creation Failed",
                description: creationError.message,
              });
          }
      } else if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            // Case: The user exists, but the password is wrong.
            toast({
                variant: "destructive",
                title: t.loginError,
                description: "Please check your credentials.",
            });
      } else {
        // Case: Other errors (network, custom error from ensureAdminUser, etc.)
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "An unexpected error occurred",
          description: error.message,
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
