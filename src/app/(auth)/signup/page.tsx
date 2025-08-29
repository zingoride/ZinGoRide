import Link from "next/link"

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
import { Package2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function SignupPage() {
  return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-muted/50 p-4">
        <div className="flex items-center gap-2 mb-6">
            <Package2 className="h-8 w-8" />
            <span className="text-2xl font-semibold">ZinGo Ride</span>
        </div>
        <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-xl">Customer Sign Up</CardTitle>
            <CardDescription>
            Naya account banane ke liye apni maloomat darj karein.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="full-name">Poora Naam</Label>
                <Input id="full-name" placeholder="Ahmad Ali" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
                Create an account
            </Button>
            </div>
            <div className="mt-4 text-center text-sm">
                Pehle se account hai?{" "}
                <Link href="/login" className="underline">
                    Login
                </Link>
            </div>
            <Separator className="my-4" />
             <div className="text-center text-sm">
                 <Link href="/rider-signup" className="underline">
                    Rider ho? Yahan signup karein.
                </Link>
            </div>
        </CardContent>
        </Card>
     </div>
  )
}
