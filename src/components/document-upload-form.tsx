
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
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { Separator } from "./ui/separator"

const translations = {
    ur: {
        title: "Dastavezaat Upload Karein",
        description: "Apni tasdeeq ke liye zaroori dastavezaat upload karein.",
        cnicFront: "Shanakhti Card (Front)",
        cnicBack: "Shanakhti Card (Back)",
        drivingLicense: "Driving License",
        upload: "Upload Karein",
        saveButton: "Dastavezaat Mehfooz Karein",
    },
    en: {
        title: "Upload Documents",
        description: "Upload the required documents for your verification.",
        cnicFront: "CNIC (Front Side)",
        cnicBack: "CNIC (Back Side)",
        drivingLicense: "Driving License",
        upload: "Upload",
        saveButton: "Save Documents",
    }
}

const documentPlaceholders = {
    cnicFront: {
        url: 'https://picsum.photos/seed/cnic-front-placeholder/400/250',
        hint: 'id card front'
    },
    cnicBack: {
        url: 'https://picsum.photos/seed/cnic-back-placeholder/400/250',
        hint: 'id card back'
    },
    license: {
        url: 'https://picsum.photos/seed/license-placeholder/400/250',
        hint: 'driving license'
    }
}

export function DocumentUploadForm() {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        
        {/* CNIC Front */}
        <div className="grid md:grid-cols-2 gap-4 items-center">
            <div>
                <Label htmlFor="cnic-front-upload" className="font-semibold">{t.cnicFront}</Label>
                 <div className="mt-2">
                    <Button asChild variant="outline">
                        <label htmlFor="cnic-front-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            {t.upload}
                        </label>
                    </Button>
                    <input id="cnic-front-upload" type="file" className="hidden" />
                 </div>
            </div>
            <div className="flex justify-center items-center bg-muted/50 rounded-lg p-2 h-[150px]">
                <Image src={documentPlaceholders.cnicFront.url} width={250} height={150} alt="CNIC Front Preview" className="rounded-md object-contain max-h-full" data-ai-hint={documentPlaceholders.cnicFront.hint} />
            </div>
        </div>

        <Separator />

        {/* CNIC Back */}
        <div className="grid md:grid-cols-2 gap-4 items-center">
            <div>
                <Label htmlFor="cnic-back-upload" className="font-semibold">{t.cnicBack}</Label>
                 <div className="mt-2">
                    <Button asChild variant="outline">
                        <label htmlFor="cnic-back-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            {t.upload}
                        </label>
                    </Button>
                    <input id="cnic-back-upload" type="file" className="hidden" />
                 </div>
            </div>
            <div className="flex justify-center items-center bg-muted/50 rounded-lg p-2 h-[150px]">
                <Image src={documentPlaceholders.cnicBack.url} width={250} height={150} alt="CNIC Back Preview" className="rounded-md object-contain max-h-full" data-ai-hint={documentPlaceholders.cnicBack.hint} />
            </div>
        </div>

        <Separator />

        {/* Driving License */}
        <div className="grid md:grid-cols-2 gap-4 items-center">
            <div>
                <Label htmlFor="license-upload" className="font-semibold">{t.drivingLicense}</Label>
                 <div className="mt-2">
                    <Button asChild variant="outline">
                        <label htmlFor="license-upload" className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            {t.upload}
                        </label>
                    </Button>
                    <input id="license-upload" type="file" className="hidden" />
                 </div>
            </div>
            <div className="flex justify-center items-center bg-muted/50 rounded-lg p-2 h-[150px]">
                <Image src={documentPlaceholders.license.url} width={250} height={150} alt="License Preview" className="rounded-md object-contain max-h-full" data-ai-hint={documentPlaceholders.license.hint} />
            </div>
        </div>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button>{t.saveButton}</Button>
      </CardFooter>
    </Card>
  )
}
