
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

export default function RiderLoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/50 p-4">
        <div className="flex items-center gap-2 mb-6">
            <Package2 className="h-8 w-8" />
            <span className="text-2xl font-semibold">ZinGo Ride</span>
        </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Rider Login</CardTitle>
          <CardDescription>
            Login karne ke liye apna email aur password darj karein.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
           <Button type="submit" className="w-full">
            Login
          </Button>
            <div className="mt-4 text-center text-sm">
                Naya account banana hai?{" "}
                <Link href="/rider-signup" className="underline">
                    Sign up
                </Link>
            </div>
             <Separator />
             <div className="text-center text-sm">
                 <Link href="/login" className="underline">
                    Customer ho? Yahan login karein.
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
