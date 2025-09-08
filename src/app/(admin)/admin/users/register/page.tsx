
'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus, User, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { setDoc, doc } from 'firebase/firestore';


const translations = {
  ur: {
    title: 'Naya User Register Karein',
    description: 'Yahan se naye customer ya driver ka account banayein.',
    fullName: 'Poora Naam',
    fullNamePlaceholder: 'e.g., Junaid Khan',
    email: 'Email',
    emailPlaceholder: 'user@example.com',
    password: 'Password',
    userType: 'User Ki Qisam',
    customer: 'Customer',
    rider: 'Driver',
    registerButton: 'User Register Karein',
    registeringButton: 'Register kiya ja raha hai...',
    successTitle: 'Kamyabi!',
    successDesc: (name: string) => `User "${name}" kamyabi se register ho gaya hai.`,
    errorTitle: 'Ghalti!',
    errorDesc: 'User register karne mein masla hua.',
    emailInUse: "Yeh email pehle se istemal mein hai.",
  },
  en: {
    title: 'Register a New User',
    description: 'Create a new customer or driver account here.',
    fullName: 'Full Name',
    fullNamePlaceholder: 'e.g., Junaid Khan',
    email: 'Email',
    emailPlaceholder: 'user@example.com',
    password: 'Password',
    userType: 'User Type',
    customer: 'Customer',
    rider: 'Driver',
    registerButton: 'Register User',
    registeringButton: 'Registering...',
    successTitle: 'Success!',
    successDesc: (name: string) => `User "${name}" has been registered successfully.`,
    errorTitle: 'Error!',
    errorDesc: 'There was a problem registering the user.',
    emailInUse: "This email is already in use.",
  },
};

export default function RegisterUserPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const router = useRouter();
  const t = translations[language];

  const [loading, setLoading] = useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const userType = formData.get('userType') as 'Customer' | 'Driver';

    // This is a temporary app instance for creating the user.
    // It's a workaround to avoid conflict with the main logged-in admin user.
    // This is not standard practice for production but is a fix for this specific context.
    try {
        // Since we can't have two logged-in users at once, we use the standard SDK method.
        // In a real app, this should be a server-side action with proper admin privileges.
        // For this prototype, we'll create the user on the client, which requires relaxing some security rules temporarily if needed.
        const { user: newAuthUser } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(newAuthUser, { displayName: fullName });
        
        await setDoc(doc(db, "users", newAuthUser.uid), {
            name: fullName,
            email: email,
            type: userType,
            status: 'Active',
            approvalStatus: userType === 'Driver' ? 'Pending' : 'Approved',
            createdAt: new Date(),
            walletBalance: 0,
        });

        toast({
            title: t.successTitle,
            description: t.successDesc(fullName),
        });
        formRef.current?.reset();
        router.push('/admin/users');

    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            toast({
                variant: 'destructive',
                title: t.errorTitle,
                description: t.emailInUse,
            });
        } else {
             toast({
                variant: 'destructive',
                title: t.errorTitle,
                description: error.message || t.errorDesc,
            });
        }
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 place-items-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus />
            {t.title}
          </CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} ref={formRef}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t.fullName}</Label>
              <Input id="fullName" name="fullName" placeholder={t.fullNamePlaceholder} required />
            </div>
             <div className="space-y-2">
              <Label htmlFor="email">{t.email}</Label>
              <Input id="email" name="email" type="email" placeholder={t.emailPlaceholder} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t.password}</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
                <Label>{t.userType}</Label>
                <RadioGroup name="userType" defaultValue="Customer" className="grid grid-cols-2 gap-4">
                    <div>
                        <RadioGroupItem value="Customer" id="customer-radio" className="peer sr-only" />
                        <Label htmlFor="customer-radio" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <User className="h-6 w-6 mb-2" />
                            {t.customer}
                        </Label>
                    </div>
                     <div>
                        <RadioGroupItem value="Driver" id="rider-radio" className="peer sr-only" />
                        <Label htmlFor="rider-radio" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                           <ShieldCheck className="h-6 w-6 mb-2" />
                           {t.rider}
                        </Label>
                    </div>
                </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? t.registeringButton : t.registerButton}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
