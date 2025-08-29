"use client"

import Image from "next/image"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Bike, Car } from "lucide-react"

export function VehicleDetails() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meri Gaari</CardTitle>
        <CardDescription>
          Apni gaari ki tafseelat yahan update karein.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex justify-center items-center bg-muted/50 rounded-lg p-4">
            <Image src="https://picsum.photos/300/200" width={300} height={200} alt="Vehicle Image" className="rounded-md" data-ai-hint="white car" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="vehicle-type">Gaari ki Qisam</Label>
                <Select defaultValue="car">
                    <SelectTrigger id="vehicle-type" aria-label="Select vehicle type">
                        <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="car">
                            <div className="flex items-center gap-2">
                                <Car className="h-4 w-4" /> Car
                            </div>
                        </SelectItem>
                        <SelectItem value="bike">
                             <div className="flex items-center gap-2">
                                <Bike className="h-4 w-4" /> Bike
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="make">Make/Company</Label>
                <Input id="make" defaultValue="Toyota" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" defaultValue="Corolla" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="license-plate">License Plate</Label>
                <Input id="license-plate" defaultValue="KHI-1234" />
            </div>
        </div>
      </CardContent>
       <CardFooter className="border-t px-6 py-4">
        <Button>Gaari Ki Maloomat Save Karein</Button>
      </CardFooter>
    </Card>
  )
}
