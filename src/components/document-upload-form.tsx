
"use client"

import Image from "next/image"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Loader2 } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { Separator } from "./ui/separator"
import { useAuth } from "@/context/AuthContext"
import { storage, db } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { doc, updateDoc, arrayUnion } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"

const translations = {
    ur: {
        title: "Dastavezaat Upload Karein",
        description: "Apni tasdeeq ke liye zaroori dastavezaat upload karein.",
        cnicFront: "Shanakhti Card (Front)",
        cnicBack: "Shanakhti Card (Back)",
        drivingLicense: "Driving License",
        upload: "Upload Karein",
        uploading: "Uploading...",
        saveButton: "Dastavezaat Upload Karein",
        saveSuccess: "Dastavezaat kamyabi se upload ho gaye.",
        saveError: "Dastavezaat upload karne mein masla hua.",
        selectFile: "Pehle file chunein",
    },
    en: {
        title: "Upload Documents",
        description: "Upload the required documents for your verification.",
        cnicFront: "CNIC (Front Side)",
        cnicBack: "CNIC (Back Side)",
        drivingLicense: "Driving License",
        upload: "Upload",
        uploading: "Uploading...",
        saveButton: "Upload Document",
        saveSuccess: "Document uploaded successfully.",
        saveError: "Error uploading document.",
        selectFile: "Please select a file first",
    }
}

type DocumentType = 'cnicFront' | 'cnicBack' | 'license';
type FileState = {
    [key in DocumentType]?: File | null;
};
type PreviewState = {
    [key in DocumentType]?: string | null;
};
type UploadingState = {
    [key in DocumentType]?: boolean;
};

export function DocumentUploadForm() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const t = translations[language];

  const [files, setFiles] = useState<FileState>({});
  const [previews, setPreviews] = useState<PreviewState>({});
  const [uploading, setUploading] = useState<UploadingState>({});
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleUpload = async (type: DocumentType) => {
    const file = files[type];
    if (!file || !user) {
      toast({ variant: "destructive", title: t.selectFile });
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));

    try {
      const storageRef = ref(storage, `documents/${user.uid}/${type}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const userDocRef = doc(db, "users", user.uid);
      const documentData = {
          name: type === 'cnicFront' ? t.cnicFront : type === 'cnicBack' ? t.cnicBack : t.drivingLicense,
          url: downloadURL,
          uploadedAt: new Date(),
      };
      
      // We use arrayUnion to add to the array without duplicating.
      // For a more robust solution, one might first read the doc, filter out old docs of the same type, then update.
      await updateDoc(userDocRef, {
        documents: arrayUnion(documentData)
      });
      
      toast({ title: t.saveSuccess });

    } catch (error) {
      console.error("Error uploading file: ", error);
      toast({ variant: "destructive", title: t.saveError });
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  }
  

  const renderUploadSection = (type: DocumentType, label: string, placeholderUrl: string, hint: string) => (
      <div className="grid md:grid-cols-2 gap-4 items-center">
          <div>
              <Label htmlFor={`${type}-upload`} className="font-semibold">{label}</Label>
              <div className="mt-2 flex gap-2">
                  <Button asChild variant="outline">
                      <label htmlFor={`${type}-upload`} className="cursor-pointer">
                          <Upload className="mr-2 h-4 w-4" />
                          {t.upload}
                      </label>
                  </Button>
                  <input id={`${type}-upload`} type="file" className="hidden" onChange={(e) => handleFileChange(e, type)} accept="image/*" />
                  {files[type] && (
                     <Button onClick={() => handleUpload(type)} disabled={uploading[type]}>
                        {uploading[type] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {uploading[type] ? t.uploading : t.saveButton}
                    </Button>
                  )}
              </div>
          </div>
          <div className="flex justify-center items-center bg-muted/50 rounded-lg p-2 h-[150px]">
              <Image 
                src={previews[type] || placeholderUrl} 
                width={250} 
                height={150} 
                alt={`${label} Preview`} 
                className="rounded-md object-contain max-h-full" 
                data-ai-hint={hint} 
              />
          </div>
      </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        
        {renderUploadSection('cnicFront', t.cnicFront, 'https://picsum.photos/seed/cnic-front-placeholder/400/250', 'id card front')}
        
        <Separator />

        {renderUploadSection('cnicBack', t.cnicBack, 'https://picsum.photos/seed/cnic-back-placeholder/400/250', 'id card back')}

        <Separator />

        {renderUploadSection('license', t.drivingLicense, 'https://picsum.photos/seed/license-placeholder/400/250', 'driving license')}
        
      </CardContent>
    </Card>
  )
}
