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

export function ProfileForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mera Profile</CardTitle>
        <CardDescription>
          Apni zaati maloomat yahan update karein.
        </CardDescription>
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
        <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Poora Naam</Label>
                <Input id="name" defaultValue="Ali Khan" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+92 300 1234567" />
            </div>
        </div>
        <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="ali.khan@zingo.com" />
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>Tabdeelian Mehfooz Karein</Button>
      </CardFooter>
    </Card>
  )
}
