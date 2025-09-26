'use client';

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useLanguage } from './LanguageContext';

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

const translations = {
  ur: {
    pinRequired: "PIN Zaroori Hai",
    enterPin: "Jaari rakhne ke liye apna 4-digit admin PIN darj karein.",
    pinPlaceholder: "Admin PIN",
    cancel: "Cancel",
    verify: "Tasdeeq Karein",
    verifying: "Tasdeeq ho rahi hai...",
    invalidPin: "Ghalat PIN. Dobara koshish karein.",
    pinNotSet: "Admin PIN set nahi hai. Baraye meharbani settings mein ja kar set karein.",
  },
  en: {
    pinRequired: "PIN Required",
    enterPin: "Please enter your 4-digit admin PIN to continue.",
    pinPlaceholder: "Admin PIN",
    cancel: "Cancel",
    verify: "Verify",
    verifying: "Verifying...",
    invalidPin: "Invalid PIN. Please try again.",
    pinNotSet: "Admin PIN is not set. Please set it in the settings.",
  },
};

interface PinVerificationContextType {
  isPinSet: () => boolean;
  isSessionActive: () => boolean;
  requestPinVerification: (action: () => void) => void;
}

const PinVerificationContext = createContext<PinVerificationContextType | undefined>(undefined);

export function PinVerificationProvider({ children }: { children: ReactNode }) {
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [lastVerificationTime, setLastVerificationTime] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPin, setCurrentPin] = useState('');
  const [actionToExecute, setActionToExecute] = useState<(() => void) | null>(null);
  const [adminPin, setAdminPin] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const fetchPin = async () => {
      const configRef = doc(db, 'configs', 'appConfig');
      const docSnap = await getDoc(configRef);
      const pin = docSnap.exists() ? docSnap.data().adminPin : null;
      setAdminPin(pin || null);
    };
    fetchPin();
  }, []);

  const isPinSet = () => adminPin !== null && adminPin !== '';

  const isSessionActive = () => {
    const now = Date.now();
    return isPinVerified && lastVerificationTime !== null && (now - lastVerificationTime < SESSION_TIMEOUT);
  };
  
  const requestPinVerification = (action: () => void) => {
    setActionToExecute(() => action);
    setIsDialogOpen(true);
  };
  
  const handleVerify = async () => {
    setIsVerifying(true);
    if (currentPin === adminPin) {
        setIsPinVerified(true);
        setLastVerificationTime(Date.now());
        toast({ title: "PIN Verified" });
        
        setIsDialogOpen(false);
        setCurrentPin('');
        
        if (actionToExecute) {
            actionToExecute();
            setActionToExecute(null);
        }
    } else {
        toast({ variant: 'destructive', title: t.invalidPin });
    }
    setIsVerifying(false);
  }

  const handleCancel = () => {
    setIsDialogOpen(false);
    setActionToExecute(null);
    setCurrentPin('');
  }

  return (
    <PinVerificationContext.Provider value={{ isPinSet, isSessionActive, requestPinVerification }}>
      {children}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t.pinRequired}</DialogTitle>
                <DialogDescription>{t.enterPin}</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                 <Input 
                    type="password"
                    maxLength={4}
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder={t.pinPlaceholder}
                 />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={handleCancel}>{t.cancel}</Button>
                <Button onClick={handleVerify} disabled={isVerifying || currentPin.length !== 4}>
                    {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isVerifying ? t.verifying : t.verify}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </PinVerificationContext.Provider>
  );
}

export function usePinVerification() {
  const context = useContext(PinVerificationContext);
  if (context === undefined) {
    throw new Error('usePinVerification must be used within a PinVerificationProvider');
  }
  return context;
}
