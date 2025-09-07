
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { sendBroadcastNotification } from '@/app/actions';
import { useLanguage } from '@/context/LanguageContext';

const translations = {
  ur: {
    title: 'Broadcast Notification Bhejein',
    description: 'Tamam application users ko ek notification bhejein.',
    notificationTitle: 'Notification ka Unwan',
    notificationTitlePlaceholder: 'e.g., Khas Offer!',
    notificationMessage: 'Notification ka Pegham',
    notificationMessagePlaceholder: 'Apna pegham yahan likhein...',
    sendButton: 'Notification Bhejein',
    sendingButton: 'Bheja ja raha hai...',
    successTitle: 'Notification Bhej Di Gayi!',
    successDesc: 'Aapka pegham tamam users ko bhej diya gaya hai.',
    errorTitle: 'Ghalti!',
    errorDesc: 'Notification bhejne mein masla hua.',
  },
  en: {
    title: 'Send Broadcast Notification',
    description: 'Send a notification to all application users.',
    notificationTitle: 'Notification Title',
    notificationTitlePlaceholder: 'e.g., Special Offer!',
    notificationMessage: 'Notification Message',
    notificationMessagePlaceholder: 'Type your message here...',
    sendButton: 'Send Notification',
    sendingButton: 'Sending...',
    successTitle: 'Notification Sent!',
    successDesc: 'Your message has been sent to all users.',
    errorTitle: 'Error!',
    errorDesc: 'There was a problem sending the notification.',
  },
};

export default function NotificationsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await sendBroadcastNotification(formData);

    if (result.success) {
      toast({
        title: t.successTitle,
        description: t.successDesc,
      });
      formRef.current?.reset();
    } else {
      toast({
        variant: 'destructive',
        title: t.errorTitle,
        description: result.error || t.errorDesc,
      });
    }

    setLoading(false);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} ref={formRef}>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">{t.notificationTitle}</Label>
              <Input
                id="title"
                name="title"
                placeholder={t.notificationTitlePlaceholder}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">{t.notificationMessage}</Label>
              <Textarea
                id="message"
                name="message"
                placeholder={t.notificationMessagePlaceholder}
                className="min-h-[120px]"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              {loading ? t.sendingButton : t.sendButton}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
