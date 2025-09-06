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
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Lock } from "lucide-react"

const translations = {
    ur: {
        title: "Password Ka Intezam",
        description: "Apna password yahan tabdeel karein.",
        currentPassword: "Mojooda Password",
        newPassword: "Naya Password",
        confirmNewPassword: "Naye Password Ki Tasdeeq Karein",
        updateButton: "Password Update Karein",
        updating: "Updating...",
        updateSuccess: "Password kamyabi se update ho gaya hai.",
        updateError: "Password update karne mein masla hua.",
        reauthError: "Mojooda password ghalat hai.",
        passwordMismatch: "Naye passwords match nahi karte.",
    },
    en: {
        title: "Password Management",
        description: "Change your password here.",
        currentPassword: "Current Password",
        newPassword: "New Password",
        confirmNewPassword: "Confirm New Password",
        updateButton: "Update Password",
        updating: "Updating...",
        updateSuccess: "Password updated successfully.",
        updateError: "Error updating password.",
        reauthError: "Incorrect current password.",
        passwordMismatch: "New passwords do not match.",
    }
}

export function PasswordManagementForm() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const t = translations[language];

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordUpdate = async () => {
      if (!user || !user.email) return;
      if (newPassword !== confirmPassword) {
          toast({ variant: "destructive", title: t.passwordMismatch });
          return;
      }
      setLoading(true);
      
      try {
          const credential = EmailAuthProvider.credential(user.email, currentPassword);
          // Re-authenticate the user
          await reauthenticateWithCredential(user, credential);
          
          // Update the password
          await updatePassword(user, newPassword);

          toast({ title: t.updateSuccess });
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');

      } catch (error: any) {
          console.error("Error updating password:", error);
          if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
             toast({ variant: "destructive", title: t.reauthError });
          } else {
             toast({ variant: "destructive", title: t.updateError, description: error.message });
          }
      } finally {
          setLoading(false);
      }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
          <div className="grid gap-2">
              <Label htmlFor="current-password">{t.currentPassword}</Label>
              <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="pl-8" />
              </div>
          </div>
          <div className="grid gap-2">
              <Label htmlFor="new-password">{t.newPassword}</Label>
              <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-8" />
              </div>
          </div>
          <div className="grid gap-2">
              <Label htmlFor="confirm-password">{t.confirmNewPassword}</Label>
              <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-8" />
              </div>
          </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handlePasswordUpdate} disabled={loading || !currentPassword || !newPassword || !confirmPassword}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? t.updating : t.updateButton}
        </Button>
      </CardFooter>
    </Card>
  )
}
