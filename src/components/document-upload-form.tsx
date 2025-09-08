
"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import { Separator } from "./ui/separator"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { uploadToCloudinary } from "@/app/actions"
import { Badge } from "./ui/badge"

const translations = {
    ur: {
        title: "Dastavezaat Upload Karein",
        description: "Apni tasdeeq ke liye zaroori dastavezaat upload karein.",
        cnicFront: "Shanakhti Card (Front)",
        cnicBack: "Shanakhti Card (Back)",
        drivingLicense: "Driving License",
        chooseFile: "File Chunein",
        uploading: "Uploading...",
        uploadDocument: "Dastavezaat Upload Karein",
        saveSuccess: "Dastavezaat kamyabi se upload ho gaye.",
        saveError: "Dastavezaat upload karne mein masla hua.",
        selectFile: "Pehle file chunein",
        status: "Status",
        pending: "Pending",
        approved: "Manzoor",
        rejected: "Mustarad",
        alreadyUploaded: "Pehle se upload hai. Dobara upload karne se yeh tabdeel ho jayega.",
    },
    en: {
        title: "Upload Documents",
        description: "Upload the required documents for your verification.",
        cnicFront: "CNIC (Front Side)",
        cnicBack: "CNIC (Back Side)",
        drivingLicense: "Driving License",
        chooseFile: "Choose File",
        uploading: "Uploading...",
        uploadDocument: "Upload Document",
        saveSuccess: "Document uploaded successfully.",
        saveError: "Error uploading document.",
        selectFile: "Please select a file first",
        status: "Status",
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        alreadyUploaded: "Already uploaded. Re-uploading will replace the existing document.",
    }
}

type DocumentType = 'cnicFront' | 'cnicBack' | 'license';
type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

interface UserDocument {
    name: string;
    url: string;
    uploadedAt: Date;
    approvalStatus: ApprovalStatus;
}

type FileState = { [key in DocumentType]?: File | null };
type PreviewState = { [key in DocumentType]?: string | null };
type UploadingState = { [key in DocumentType]?: boolean };
type ExistingDocState = { [key in DocumentType]?: UserDocument | null };


export function DocumentUploadForm() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const t = translations[language];

  const [files, setFiles] = useState<FileState>({});
  const [previews, setPreviews] = useState<PreviewState>({});
  const [uploading, setUploading] = useState<UploadingState>({});
  const [existingDocs, setExistingDocs] = useState<ExistingDocState>({});

  useEffect(() => {
    const fetchUserDocuments = async () => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(userDocRef);
            if (docSnap.exists()) {
                const userData = docSnap.data();
                const userDocs: UserDocument[] = userData.documents || [];
                const docMap: ExistingDocState = {};
                userDocs.forEach(d => {
                    if (d.name === t.cnicFront) docMap.cnicFront = d;
                    if (d.name === t.cnicBack) docMap.cnicBack = d;
                    if (d.name === t.drivingLicense) docMap.license = d;
                });
                setExistingDocs(docMap);
                setPreviews({
                    cnicFront: docMap.cnicFront?.url,
                    cnicBack: docMap.cnicBack?.url,
                    license: docMap.license?.url,
                });
            }
        }
    };
    fetchUserDocuments();
  }, [user, t.cnicFront, t.cnicBack, t.drivingLicense]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: DocumentType) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const handleUpload = async (type: DocumentType, docName: string) => {
    const file = files[type];
    if (!file || !user) {
      toast({ variant: "destructive", title: t.selectFile });
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', `documents/${user.uid}`);
      
      const result = await uploadToCloudinary(formData);

      if (!result.success || !result.url) {
        throw new Error(result.error || 'Upload failed');
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const currentDocs: UserDocument[] = userDoc.data()?.documents || [];

      // Remove the old document if it exists, and add the new one
      const newDocs = currentDocs.filter(d => d.name !== docName);
      newDocs.push({
          name: docName,
          url: result.url,
          uploadedAt: new Date(),
          approvalStatus: 'Pending',
      });
      
      await setDoc(userDocRef, { documents: newDocs }, { merge: true });
      
      toast({ title: t.saveSuccess });
      
      // Refresh the existing docs state
      setExistingDocs(prev => ({...prev, [type]: { name: docName, url: result.url!, uploadedAt: new Date(), approvalStatus: 'Pending' }}));

    } catch (error) {
      console.error("Error uploading file: ", error);
      toast({ variant: "destructive", title: t.saveError });
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
      setFiles(prev => ({ ...prev, [type]: null }));
    }
  }

  const statusConfig = {
    Pending: { variant: 'secondary', label: t.pending, icon: AlertCircle, className: 'bg-yellow-100 text-yellow-800' },
    Approved: { variant: 'default', label: t.approved, icon: CheckCircle2, className: 'bg-green-100 text-green-800' },
    Rejected: { variant: 'destructive', label: t.rejected, icon: XCircle, className: 'bg-red-100 text-red-800' },
  };
  

  const renderUploadSection = (type: DocumentType, label: string, placeholderUrl: string, hint: string) => {
      const docStatus = existingDocs[type]?.approvalStatus;
      const config = docStatus ? statusConfig[docStatus] : null;
      const Icon = config?.icon;
      const isFileSelected = !!files[type];

      return (
        <div className="grid md:grid-cols-2 gap-4 items-center">
            <div>
                <Label htmlFor={`${type}-upload`} className="font-semibold">{label}</Label>
                {config && Icon && (
                    <Badge variant={config.variant as any} className={`${config.className} mt-1`}>
                        <Icon className="h-4 w-4 mr-1" />
                        {config.label}
                    </Badge>
                )}
                {existingDocs[type] && <p className="text-xs text-muted-foreground mt-2">{t.alreadyUploaded}</p>}
                
                <div className="mt-2 flex gap-2">
                    <Button asChild variant="outline">
                        <label className="cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                            {t.chooseFile}
                            <input id={`${type}-upload`} type="file" className="hidden" onChange={(e) => handleFileChange(e, type)} accept="image/*" />
                        </label>
                    </Button>
                    <Button onClick={() => handleUpload(type, label)} disabled={!isFileSelected || uploading[type]}>
                        {uploading[type] ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {uploading[type] ? t.uploading : t.uploadDocument}
                    </Button>
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
      )
  };

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
