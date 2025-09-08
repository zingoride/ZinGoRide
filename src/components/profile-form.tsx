
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
import { useEffect, useState, useRef } from "react"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { uploadToCloudinary } from "@/app/actions"

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
        updateError: "Profile update karne mein masla hua.",
        changePicture: "Tasveer Tabdeel Karein",
        uploading: "Uploading...",
        uploadSuccess: "Tasveer kamyabi se update ho gayi.",
        uploadError: "Tasveer update karne mein masla hua."
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
        updateError: "Error updating profile.",
        changePicture: "Change Picture",
        uploading: "Uploading...",
        uploadSuccess: "Profile picture updated successfully.",
        uploadError: "Error updating profile picture."
    }
}

export function ProfileForm() {
  const { language } = useLanguage();
  const { user, setUser } = useAuth(); // Assuming setUser is available from AuthContext to update state
  const { toast } = useToast();
  const t = translations[language];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
      const loadUserData = async () => {
        if (user) {
            setFullName(user.displayName || '');
            const userDocRef = doc(db, "users", user.uid);
            try {
              const docSnap = await getDoc(userDocRef);
              if (docSnap.exists()) {
                  setPhone(docSnap.data().phone || '');
              }
            } catch (e) {
                console.error("Error loading user data", e);
            } finally {
                setFormLoading(false);
            }
        } else {
             setFormLoading(false);
        }
      }
      loadUserData();
  }, [user]);
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', `profile-pictures/${user.uid}`);
        
        const result = await uploadToCloudinary(formData);

        if (!result.success || !result.url) {
            throw new Error(result.error || 'Upload failed');
        }

        const photoURL = result.url;

        // Update Firebase Auth profile
        if (auth.currentUser) {
            await updateProfile(auth.currentUser, { photoURL });
        }
        
        // Update Firestore document
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { photoURL });

        // Optimistically update user in context
        if (setUser && auth.currentUser) {
            setUser(auth.currentUser);
        }

        toast({ title: t.uploadSuccess });

    } catch (error) {
        console.error("Error updating profile picture:", error);
        toast({ variant: "destructive", title: t.uploadError });
    } finally {
        setUploading(false);
    }
  }


  const handleSaveChanges = async () => {
      if (!user) return;
      setLoading(true);
      try {
          // Update Firebase Auth profile
          if (auth.currentUser && auth.currentUser.displayName !== fullName) {
              await updateProfile(auth.currentUser, { displayName: fullName });
          }

          // Update Firestore document
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
              name: fullName,
              phone: phone, // Assuming phone is stored in Firestore
          });
          
          if (setUser && auth.currentUser) {
            setUser(auth.currentUser);
          }

          toast({ title: t.updateSuccess });

      } catch (error) {
          console.error("Error updating profile:", error);
          toast({ variant: "destructive", title: t.updateError });
      } finally {
          setLoading(false);
      }
  }

  if (formLoading) {
    return (
        <Card>
            <CardHeader>
                 <Skeleton className="h-6 w-32" />
                 <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-36" />
                    </div>
                </div>
                <div className="space-y-4">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-4">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-4">
                     <Skeleton className="h-4 w-24" />
                     <Skeleton className="h-10 w-full" />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Skeleton className="h-10 w-28" />
            </CardFooter>
        </Card>
    )
  }

  if (!user) {
      return null;
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>{t.myProfile}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
                        <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} data-ai-hint="portrait man" />
                        <AvatarFallback>{(user.displayName || 'U').charAt(0)}</AvatarFallback>
                    </Avatar>
                    {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                    )}
                </div>
                
                <div className="grid gap-2">
                    <p className="text-xl font-semibold">{user.displayName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <Button variant="outline" size="sm" onClick={handleAvatarClick} disabled={uploading}>
                        <Upload className="mr-2 h-4 w-4" />
                        {uploading ? t.uploading : t.changePicture}
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/png, image/jpeg"
                    />
                </div>
            </div>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">{t.fullName}</Label>
                    <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">{t.phoneNumber}</Label>
                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 300 1234567" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">{t.email}</Label>
                    <Input id="email" type="email" value={user.email || ''} disabled />
                </div>
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
