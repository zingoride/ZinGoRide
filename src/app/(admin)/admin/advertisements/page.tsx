
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Trash2, Upload, Megaphone, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { db } from '@/lib/firebase';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { uploadToCloudinary } from '@/app/actions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


interface Advertisement {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    targetUrl: string;
    isActive: boolean;
    createdAt: any;
}

const translations = {
  ur: {
    title: 'Live Ishtiharat (Advertisements)',
    description: 'Yahan se live ishtiharat manage karein jo customer app mein nazar aayengi.',
    newAd: 'Naya Ishtihar Banayein',
    adTitle: 'Ishtihar ka Unwan',
    adTitlePlaceholder: 'e.g., 50% Off on First Ride!',
    adDesc: 'Tafseel',
    adDescPlaceholder: 'Ishtihar ke baray mein mukhtasir tafseel...',
    adImage: 'Ishtihar ki Tasveer',
    uploadImage: 'Tasveer Upload Karein',
    targetUrl: 'Target URL',
    targetUrlPlaceholder: 'https://example.com/offer',
    saveAd: 'Ishtihar Mehfooz Karein',
    saving: 'Mehfooz ho raha hai...',
    successTitle: 'Kamyabi!',
    successDesc: 'Ishtihar kamyabi se mehfooz ho gaya hai.',
    errorTitle: 'Ghalti!',
    errorDesc: 'Ishtihar mehfooz karne mein masla hua.',
    currentAds: 'Mojooda Ishtiharat',
    noAds: 'Abhi tak koi ishtihar nahi banaya gaya.',
    activate: 'Active Karein',
    deleteAd: 'Ishtihar Delete Karein',
    confirmDelete: 'Kya aap waqai is ishtihar ko delete karna chahte hain?',
    deleteSuccess: 'Ishtihar kamyabi se delete ho gaya.',
    deleteError: 'Ishtihar delete karne mein masla hua.',
    uploading: 'Uploading...',
  },
  en: {
    title: 'Live Advertisements',
    description: 'Manage live ads that will be displayed in the customer app.',
    newAd: 'Create New Advertisement',
    adTitle: 'Advertisement Title',
    adTitlePlaceholder: 'e.g., 50% Off on First Ride!',
    adDesc: 'Description',
    adDescPlaceholder: 'A short description about the ad...',
    adImage: 'Advertisement Image',
    uploadImage: 'Upload Image',
    targetUrl: 'Target URL',
    targetUrlPlaceholder: 'https://example.com/offer',
    saveAd: 'Save Advertisement',
    saving: 'Saving...',
    successTitle: 'Success!',
    successDesc: 'Advertisement has been saved successfully.',
    errorTitle: 'Error!',
    errorDesc: 'There was a problem saving the advertisement.',
    currentAds: 'Current Advertisements',
    noAds: 'No advertisements have been created yet.',
    activate: 'Activate',
    deleteAd: 'Delete Ad',
    confirmDelete: 'Are you sure you want to delete this advertisement?',
    deleteSuccess: 'Advertisement deleted successfully.',
    deleteError: 'Failed to delete advertisement.',
    uploading: 'Uploading...',
  },
};

export default function AdvertisementsPage() {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];

  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  useEffect(() => {
    const adsCollection = collection(db, "advertisements");
    const q = query(adsCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const adsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Advertisement));
        setAds(adsList);
        setLoading(false);
    }, (error) => {
        console.error("Error fetching ads: ", error);
        toast({ variant: 'destructive', title: t.errorTitle, description: "Could not fetch advertisements." });
        setLoading(false);
    });
    return () => unsubscribe();
  }, [toast, t.errorTitle]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTargetUrl('');
    setImageFile(null);
    setImagePreview(null);
  }

  const handleSaveAd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile) {
        toast({ variant: 'destructive', title: t.errorTitle, description: "Please upload an image." });
        return;
    }
    setSaving(true);
    setUploading(true);
    try {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('folder', 'advertisements');
        const uploadResult = await uploadToCloudinary(formData);

        if (!uploadResult.success || !uploadResult.url) {
            throw new Error(uploadResult.error || 'Image upload failed');
        }
        setUploading(false);

        await addDoc(collection(db, 'advertisements'), {
            title,
            description,
            targetUrl,
            imageUrl: uploadResult.url,
            isActive: false,
            createdAt: new Date(),
        });
        
        toast({ title: t.successTitle, description: t.successDesc });
        resetForm();

    } catch (error: any) {
        console.error(error);
        toast({ variant: 'destructive', title: t.errorTitle, description: error.message || t.errorDesc });
    } finally {
        setSaving(false);
        setUploading(false);
    }
  };
  
  const toggleAdStatus = async (ad: Advertisement) => {
    const adDocRef = doc(db, 'advertisements', ad.id);
    if (ad.isActive) {
        // If this ad is active, just deactivate it.
         await updateDoc(adDocRef, { isActive: false });
    } else {
        // If activating this ad, deactivate all others first.
        const activeAds = ads.filter(a => a.isActive);
        const batch = ads.map(a => {
            if(a.isActive) return updateDoc(doc(db, 'advertisements', a.id), {isActive: false})
            return Promise.resolve()
        });
        await Promise.all(batch);
        await updateDoc(adDocRef, { isActive: true });
    }
  };

  const handleDeleteAd = async (adId: string) => {
    try {
        await deleteDoc(doc(db, 'advertisements', adId));
        toast({ title: t.successTitle, description: t.deleteSuccess });
    } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: t.errorTitle, description: t.deleteError });
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3 items-start">
      <div className="md:col-span-1 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.newAd}</CardTitle>
          </CardHeader>
          <form onSubmit={handleSaveAd}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ad-title">{t.adTitle}</Label>
                <Input id="ad-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.adTitlePlaceholder} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-desc">{t.adDesc}</Label>
                <Textarea id="ad-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.adDescPlaceholder} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-url">{t.targetUrl}</Label>
                <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="ad-url" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} placeholder={t.targetUrlPlaceholder} required className="pl-8" />
                </div>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="ad-image">{t.adImage}</Label>
                 <div className="h-40 w-full border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/50">
                    {imagePreview ? (
                        <Image src={imagePreview} alt="Ad preview" width={200} height={150} className="object-contain max-h-full rounded-md" />
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <ImageIcon className="h-10 w-10 mx-auto" />
                            <p className="mt-2 text-sm">Upload an image</p>
                        </div>
                    )}
                 </div>
                 <Button asChild variant="outline" size="sm">
                     <label className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        {t.uploadImage}
                        <input id="ad-image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                     </label>
                 </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {uploading ? t.uploading : saving ? t.saving : t.saveAd}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.currentAds}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : ads.length > 0 ? (
              <div className="space-y-4">
                {ads.map((ad) => (
                  <Card key={ad.id} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-muted/30">
                    <Image src={ad.imageUrl} alt={ad.title} width={150} height={100} className="rounded-md object-cover md:w-1/3" />
                    <div className="flex-1">
                      <h3 className="font-bold">{ad.title}</h3>
                      <p className="text-sm text-muted-foreground">{ad.description}</p>
                      <a href={ad.targetUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary underline truncate">{ad.targetUrl}</a>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex items-center space-x-2">
                            <Switch id={`switch-${ad.id}`} checked={ad.isActive} onCheckedChange={() => toggleAdStatus(ad)} />
                            <Label htmlFor={`switch-${ad.id}`}>{t.activate}</Label>
                        </div>
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" /> {t.deleteAd}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>{t.deleteAd}</AlertDialogTitle>
                                <AlertDialogDescription>{t.confirmDelete}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteAd(ad.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-16">
                <Megaphone className="h-12 w-12 mx-auto mb-4" />
                <p>{t.noAds}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

