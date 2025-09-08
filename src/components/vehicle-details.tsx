
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
import { Bike, Car, Loader2, Upload } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "./ui/skeleton"
import { uploadToCloudinary } from "@/app/actions"

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
        vehicleUpdated: "Gaari ki maloomat update ho gayi.",
        updateError: "Update karne mein masla hua.",
        loadingError: "Gaari ki maloomat load karne mein masla hua.",
        changeImage: "Tasveer Tabdeel Karein",
        uploading: "Uploading...",
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
        vehicleUpdated: "Vehicle information updated.",
        updateError: "Failed to update information.",
        loadingError: "Failed to load vehicle information.",
        changeImage: "Change Image",
        uploading: "Uploading...",
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
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists() && docSnap.data().vehicle) {
                    const vehicle = docSnap.data().vehicle;
                    setVehicleType(vehicle.type || 'car');
                    setMake(vehicle.make || '');
                    setModel(vehicle.model || '');
                    setLicensePlate(vehicle.licensePlate || '');
                    setImageUrl(vehicle.imageUrl || '');
                    setImagePreview(vehicle.imageUrl || null);
                }
            } catch (error) {
                console.error("Error fetching vehicle data: ", error);
                toast({ variant: "destructive", title: t.loadingError });
            } finally {
                setFormLoading(false);
            }
        } else {
            setFormLoading(false);
        }
    };
    fetchVehicleData();
  }, [user, toast, t.loadingError]);
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSaveVehicleInfo = async () => {
      if (!user) return;
      setLoading(true);
      
      let finalImageUrl = imageUrl;

      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append('file', imageFile);
          formData.append('folder', `vehicles/${user.uid}`);
          
          const result = await uploadToCloudinary(formData);

          if (!result.success || !result.url) {
            throw new Error(result.error || 'Upload failed');
          }
          finalImageUrl = result.url;
        } catch (error) {
            console.error("Error updating vehicle image:", error);
            toast({ variant: "destructive", title: t.updateError });
            setLoading(false);
            return;
        }
      }

      const vehicleData = {
          type: vehicleType,
          make,
          model,
          licensePlate,
          imageUrl: finalImageUrl,
      };

      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { vehicle: vehicleData });
        toast({ title: t.vehicleUpdated });
        setImageFile(null); // Reset file input after successful save
      } catch (error) {
        console.error("Error updating vehicle info: ", error);
        toast({ variant: "destructive", title: t.updateError });
      } finally {
        setLoading(false);
      }
  }

  if (formLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="grid gap-6">
                <Skeleton className="h-48 w-full" />
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
                <Skeleton className="h-10 w-36" />
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="relative flex justify-center items-center bg-muted/50 rounded-lg p-4 h-48 cursor-pointer" onClick={handleImageClick}>
            {imagePreview ? (
              <Image src={imagePreview} alt="Vehicle Image" layout="fill" className="rounded-md object-contain" />
            ) : (
              <div className="text-center text-muted-foreground">
                  <Car className="h-16 w-16 mx-auto" />
                  <p>Click to upload vehicle image</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
             <Button variant="secondary" size="sm" className="absolute bottom-4" onClick={(e) => { e.stopPropagation(); handleImageClick(); }}>
                <Upload className="mr-2 h-4 w-4" />
                {t.changeImage}
            </Button>
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
