
'use client';

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

type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

interface Document {
  name: string;
  url: string;
}

interface User {
  id: string;
  name: string;
  documents: Document[];
  approvalStatus: ApprovalStatus;
}

interface DocumentViewerProps {
  user: User;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onApprovalChange: (userId: string, status: ApprovalStatus) => void;
}

export function DocumentViewer({ user, isOpen, onOpenChange, onApprovalChange }: DocumentViewerProps) {

  const handleApprove = () => {
    onApprovalChange(user.id, 'Approved');
    onOpenChange(false);
  };

  const handleReject = () => {
    onApprovalChange(user.id, 'Rejected');
    onOpenChange(false);
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Rider Documents: {user.name}</DialogTitle>
          <DialogDescription>
            Review the documents submitted by the rider. Current status: {user.approvalStatus}
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
            <Carousel className="w-full">
              <CarouselContent>
                {user.documents.map((doc, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                       <Card>
                        <CardHeader>
                            <CardTitle className="text-center text-lg">{doc.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex aspect-[16/9] items-center justify-center p-2">
                           <Image 
                                src={doc.url} 
                                alt={doc.name} 
                                width={400} 
                                height={250} 
                                className="rounded-lg object-cover"
                                data-ai-hint="document id card"
                            />
                        </CardContent>
                       </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
        </div>
        <DialogFooter className="sm:justify-between gap-2">
           <div>
             <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
             </Button>
           </div>
           <div className='flex gap-2'>
             <Button variant="destructive" onClick={handleReject}>
                Reject
             </Button>
             <Button onClick={handleApprove}>
                Approve
             </Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Add these imports to your component if they are missing
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
