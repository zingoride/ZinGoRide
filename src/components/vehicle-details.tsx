
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
import { Bike, Car, Upload, Loader2 } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { db, storage } from "@/lib/firebase"
import { doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

const translations = {
    ur: {
        title: "Meri Gaari",
        description: "Apni gaari ki tafseelat yahan update karein.",
        vehicleType: "Gaari ki Qisam",
        make: "Make/Company",
        model: "Model",
        licensePlate: "License Plate",
        saveButton: "Gaari Ki Maloomat Save Karein",
        saving: "Saving...",
        regBook: "Registration Book",
        uploadRegBook: "Registration Book Upload Karein",
        vehicleUpdated: "Gaari ki maloomat update ho gayi.",
        updateError: "Update karne mein masla hua.",
    },
    en: {
        title: "My Vehicle",
        description: "Update your vehicle details here.",
        vehicleType: "Vehicle Type",
        make: "Make/Company",
        model: "Model",
        licensePlate: "License Plate",
        saveButton: "Save Vehicle Information",
        saving: "Saving...",
        regBook: "Registration Book",
        uploadRegBook: "Upload Registration Book",
        vehicleUpdated: "Vehicle information updated.",
        updateError: "Failed to update information.",
    }
}

export function VehicleDetails() {
  const { language } = useLanguage();
  const t = translations[language];
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [vehicleType, setVehicleType] = useState("car");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveVehicleInfo = async () => {
      if (!user) return;
      setLoading(true);
      
      const vehicleData = {
          type: vehicleType,
          make,
          model,
          licensePlate,
      };

      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { vehicle: vehicleData });
        toast({ title: t.vehicleUpdated });
      } catch (error) {
        console.error("Error updating vehicle info: ", error);
        toast({ variant: "destructive", title: t.updateError });
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
      <CardContent className="grid gap-6">
        <div className="flex justify-center items-center bg-muted/50 rounded-lg p-4">
            <Image src={`https://picsum.photos/seed/${licensePlate || 'vehicle'}/300/200`} width={300} height={200} alt="Vehicle Image" className="rounded-md" data-ai-hint="white car" />
        </div>
        <div className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="vehicle-type">{t.vehicleType}</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
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
                         <SelectItem value="rickshaw">
                             <div className="flex items-center gap-2">
                                Rickshaw
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="make">{t.make}</Label>
                <Input id="make" value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g. Toyota" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="model">{t.model}</Label>
                <Input id="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Corolla" />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="license-plate">{t.licensePlate}</Label>
                <Input id="license-plate" value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} placeholder="e.g. KHI-1234" />
            </div>
        </div>
      </CardContent>
       <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSaveVehicleInfo} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? t.saving : t.saveButton}
        </Button>
      </CardFooter>
    </Card>
  )
}
