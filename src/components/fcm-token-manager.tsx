
'use client';

import { useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { db, app as firebaseApp } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export function FcmTokenManager() {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const retrieveToken = async () => {
      // This function can only be run in the browser
      if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !user) {
        return;
      }
      
      try {
        const messaging = getMessaging(firebaseApp);

        // Check for notification permission
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          
          // Get the token
          const currentToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });

          if (currentToken) {
            console.log('FCM Token:', currentToken);
            // Save the token to Firestore
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, { fcmToken: currentToken }, { merge: true });
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        } else {
          console.log('Unable to get permission to notify.');
        }

        // Handle foreground messages
        onMessage(messaging, (payload) => {
          console.log('Message received. ', payload);
          toast({
            title: payload.notification?.title,
            description: payload.notification?.body,
          });
        });

      } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
      }
    };

    if (user) {
      retrieveToken();
    }
  }, [user, toast]);

  return null; // This component does not render anything
}
