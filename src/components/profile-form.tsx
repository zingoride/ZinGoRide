
"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const translations = {
    ur: {
        myProfile: "Mera Profile",
        description: "Apni zaati maloomat yahan update karein.",
        fullName: "Poora Naam",
        phoneNumber: "Phone Number",
        email: "Email",
        saveChanges: "Tabdeelian Mehfooz Karein",
        saving: "Saving...",
        updateSuccess: "Profile kamyabi se update ho gaya.",
        updateError: "Profile update karne mein masla hua."
    },
    en: {
        myProfile: "My Profile",
        description: "Update your personal information here.",
        fullName: "Full Name",
        phoneNumber: "Phone Number",
        email: "Email",
        saveChanges: "Save Changes",
        saving: "Saving...",
        updateSuccess: "Profile updated successfully.",
        updateError: "Error updating profile."
    }
}

export function ProfileForm() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const t = translations[language];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      if (user) {
          setFullName(user.displayName || '');
          // In a real app, phone would be fetched from user's document in Firestore
          setPhone('+92 300 1234567'); 
      }
  }, [user]);

  const handleSaveChanges = async () => {
      if (!user) return;
      setLoading(true);
      try {
          // Update Firebase Auth profile
          if (auth.currentUser) {
              await updateProfile(auth.currentUser, { displayName: fullName });
          }

          // Update Firestore document
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
              name: fullName,
              phone: phone, // Assuming phone is stored in Firestore
          });

          toast({ title: t.updateSuccess });

      } catch (error) {
          console.error("Error updating profile:", error);
          toast({ variant: "destructive", title: t.updateError });
      } finally {
          setLoading(false);
      }
  }

  if (!user) {
      return null; // Or a loading skeleton
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.myProfile}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
                <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} data-ai-hint="portrait man" />
                <AvatarFallback>{(user.displayName || 'U').charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
                <p className="text-lg font-semibold">{user.displayName}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
        </div>
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name">{t.fullName}</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">{t.phoneNumber}</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input id="email" type="email" value={user.email || ''} disabled />
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSaveChanges} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? t.saving : t.saveChanges}
        </Button>
      </CardFooter>
    </Card>
  )
}
