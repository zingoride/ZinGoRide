
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
import { Bike, Car, Upload } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

const translations = {
    ur: {
        title: "Meri Gaari",
        description: "Apni gaari ki tafseelat yahan update karein.",
        vehicleType: "Gaari ki Qisam",
        make: "Make/Company",
        model: "Model",
        licensePlate: "License Plate",
        saveButton: "Gaari Ki Maloomat Save Karein",
        regBook: "Registration Book",
        uploadRegBook: "Registration Book Upload Karein",
    },
    en: {
        title: "My Vehicle",
        description: "Update your vehicle details here.",
        vehicleType: "Vehicle Type",
        make: "Make/Company",
        model: "Model",
        licensePlate: "License Plate",
        saveButton: "Save Vehicle Information",
        regBook: "Registration Book",
        uploadRegBook: "Upload Registration Book",
    }
}

export function VehicleDetails() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex justify-center items-center bg-muted/50 rounded-lg p-4">
            <Image src="https://picsum.photos/300/200" width={300} height={200} alt="Vehicle Image" className="rounded-md" data-ai-hint="white car" />
        </div>
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="vehicle-type">{t.vehicleType}</Label>
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
                <Label htmlFor="make">{t.make}</Label>
                <Input id="make" defaultValue="Toyota" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="model">{t.model}</Label>
                <Input id="model" defaultValue="Corolla" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="license-plate">{t.licensePlate}</Label>
                <Input id="license-plate" defaultValue="KHI-1234" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="registration-book">{t.regBook}</Label>
                <Button variant="outline" className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    {t.uploadRegBook}
                </Button>
                <Input id="registration-book" type="file" className="hidden" />
             </div>
        </div>
      </CardContent>
       <CardFooter className="border-t px-6 py-4">
        <Button>{t.saveButton}</Button>
      </CardFooter>
    </Card>
  )
}
