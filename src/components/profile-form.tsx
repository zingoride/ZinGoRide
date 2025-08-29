
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

const translations = {
    ur: {
        myProfile: "Mera Profile",
        description: "Apni zaati maloomat yahan update karein.",
        fullName: "Poora Naam",
        phoneNumber: "Phone Number",
        email: "Email",
        saveChanges: "Tabdeelian Mehfooz Karein",
    },
    en: {
        myProfile: "My Profile",
        description: "Update your personal information here.",
        fullName: "Full Name",
        phoneNumber: "Phone Number",
        email: "Email",
        saveChanges: "Save Changes",
    }
}

export function ProfileForm() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.myProfile}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
                <AvatarImage src="https://picsum.photos/100/100" data-ai-hint="portrait man" />
                <AvatarFallback>ZR</AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
                <p className="text-lg font-semibold">Ali Khan</p>
                <p className="text-sm text-muted-foreground">ali.khan@zingo.com</p>
            </div>
        </div>
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name">{t.fullName}</Label>
                <Input id="name" defaultValue="Ali Khan" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">{t.phoneNumber}</Label>
                <Input id="phone" type="tel" defaultValue="+92 300 1234567" />
            </div>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="email">{t.email}</Label>
            <Input id="email" type="email" defaultValue="ali.khan@zingo.com" />
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>{t.saveChanges}</Button>
      </CardFooter>
    </Card>
  )
}
