
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import type { User } from '@/app/(admin)/admin/users/page';
import { Separator } from './ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Download } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { useToast } from '@/hooks/use-toast';


type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

interface Document {
  name: string;
  url: string;
  approvalStatus: ApprovalStatus;
}

interface DocumentViewerProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  // onApprovalChange is no longer needed as component handles its own updates
}

export function DocumentViewer({ user, isOpen, onOpenChange }: DocumentViewerProps) {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>(user.documents || []);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (docName: string, newStatus: ApprovalStatus) => {
    setUpdating(true);
    try {
      const userRef = doc(db, 'users', user.id);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) throw new Error("User not found");

      const currentDocs: Document[] = userSnap.data().documents || [];
      const updatedDocs = currentDocs.map(d => 
        d.name === docName ? { ...d, approvalStatus: newStatus } : d
      );

      await updateDoc(userRef, { documents: updatedDocs });
      
      setDocuments(updatedDocs); // Update local state to reflect change immediately
      toast({ title: `Document ${newStatus.toLowerCase()}`, description: `${docName} has been marked as ${newStatus.toLowerCase()}.` });

    } catch (error) {
      console.error("Error updating document status:", error);
      toast({ variant: 'destructive', title: 'Update Failed' });
    } finally {
      setUpdating(false);
    }
  };
  
  const statusConfig: { [key in ApprovalStatus]: { variant: any; label: string; icon: React.ElementType } } = {
    Pending: { variant: 'secondary', label: 'Pending', icon: AlertCircle },
    Approved: { variant: 'default', label: 'Approved', icon: CheckCircle2 },
    Rejected: { variant: 'destructive', label: 'Rejected', icon: XCircle },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Rider Documents: {user.name}</DialogTitle>
          <DialogDescription>
            Review and approve/reject the documents submitted by the rider.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-6">
            {user.vehicle && (
              <div>
                <h4 className="font-semibold mb-2 text-center text-lg">Vehicle Information</h4>
                <Card className="bg-muted/50">
                  <CardContent className="p-4 grid grid-cols-3 gap-2 text-sm">
                    <div><span className="font-semibold">Make:</span> {user.vehicle.make}</div>
                    <div><span className="font-semibold">Model:</span> {user.vehicle.model}</div>
                    <div><span className="font-semibold">License:</span> {user.vehicle.licensePlate}</div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <Separator />
            
            <Carousel className="w-full">
              <CarouselContent>
                {documents.map((doc, index) => {
                  const config = statusConfig[doc.approvalStatus];
                  const Icon = config.icon;
                  return (
                    <CarouselItem key={index}>
                      <div className="p-1">
                         <Card>
                          <CardHeader>
                              <CardTitle className="text-center text-lg flex items-center justify-center gap-2">
                                {doc.name} 
                                <Badge variant={config.variant} className="ml-2">
                                  <Icon className="h-4 w-4 mr-1" />
                                  {config.label}
                                </Badge>
                              </CardTitle>
                          </CardHeader>
                          <CardContent className="flex aspect-[16/9] items-center justify-center p-2">
                             <Image 
                                  src={doc.url} 
                                  alt={doc.name} 
                                  width={400} 
                                  height={250} 
                                  className="rounded-lg object-contain max-h-full"
                                  data-ai-hint="document id card"
                              />
                          </CardContent>
                          <CardFooter className="flex justify-center gap-2">
                             <Button variant="destructive" size="sm" onClick={() => handleStatusChange(doc.name, 'Rejected')} disabled={updating}>Reject</Button>
                             <Button size="sm" onClick={() => handleStatusChange(doc.name, 'Approved')} disabled={updating}>Approve</Button>
                             <Button asChild variant="outline" size="sm">
                                <a href={doc.url} download target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" /> Download
                                </a>
                             </Button>
                          </CardFooter>
                         </Card>
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
        </div>
        <DialogFooter className="sm:justify-end gap-2">
           <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
