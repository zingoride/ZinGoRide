
"use server";

import {
  suggestDynamicTips as suggestDynamicTipsFlow,
  type SuggestDynamicTipsInput,
  type SuggestDynamicTipsOutput,
} from "@/ai/flows/suggest-dynamic-tips";
import { v2 as cloudinary } from 'cloudinary';
import { getFirebaseAdmin } from "@/lib/firebase-admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { UserRecord } from "firebase-admin/auth";

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function suggestDynamicTips(
  input: SuggestDynamicTipsInput
): Promise<SuggestDynamicTipsOutput> {
  return suggestDynamicTipsFlow(input);
}


export async function uploadToCloudinary(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'No file provided.' };
  }
  
  const folder = formData.get('folder') as string || 'general';

  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: `zingo-ride/${folder}` },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result as any);
            }
        ).end(buffer);
    });

    return { success: true, url: result.secure_url };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return { success: false, error: error.message };
  }
}

export async function sendBroadcastNotification(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const title = formData.get('title') as string;
    const message = formData.get('message') as string;

    if (!title || !message) {
        return { success: false, error: "Title and message are required." };
    }
    
    try {
        const { db, messaging } = getFirebaseAdmin();
        
        // 1. Get all users from Firestore
        const usersSnapshot = await db.collection("users").get();
        
        // 2. Filter out users who have an FCM token
        const tokens: string[] = [];
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.fcmToken) {
                tokens.push(userData.fcmToken);
            }
        });
        
        if (tokens.length === 0) {
            return { success: true, error: "No users have enabled notifications." };
        }
        
        // 3. Send a multicast message to all tokens
        // Note: sendMulticast can send to up to 500 tokens at once.
        // For a larger audience, you would need to batch these requests.
        const response = await messaging.sendMulticast({
            tokens,
            notification: {
                title: title,
                body: message,
            },
            webpush: {
                fcmOptions: {
                    link: '/login' // Optional: Link to open when notification is clicked
                }
            }
        });
        
        console.log(`Successfully sent message to ${response.successCount} users.`);
        if (response.failureCount > 0) {
            console.log(`Failed to send to ${response.failureCount} users.`);
            // You can inspect response.responses for detailed errors
        }

        // 4. (Optional) Save the notification to a collection for history
        await db.collection("notifications").add({
            title,
            message,
            sentAt: FieldValue.serverTimestamp(),
            sentTo: tokens.length,
            successCount: response.successCount,
        });

        return { success: true };

    } catch (error: any) {
        console.error("Error sending broadcast notification: ", error);
        return { success: false, error: error.message };
    }
}

export async function getUserByEmailOrId(identifier: string): Promise<{ uid: string; name: string } | null> {
    const { db } = getFirebaseAdmin();
    const usersRef = db.collection('users');

    try {
        if (identifier.includes('@')) {
            const q = usersRef.where('email', '==', identifier);
            const querySnapshot = await q.get();
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                return { uid: userDoc.id, name: userDoc.data()?.name || 'User' };
            }
        } else {
            const userDoc = await usersRef.doc(identifier).get();
            if (userDoc.exists) {
                return { uid: userDoc.id, name: userDoc.data()?.name || 'User' };
            }
        }
        return null;
    } catch (error) {
        console.error("Error fetching user by email/id: ", error);
        return null;
    }
}

export async function performManualTopUp(formData: FormData): Promise<{ success: boolean; message: string; }> {
    const { db } = getFirebaseAdmin();
    const userIdentifier = formData.get('userId') as string;
    const amount = Number(formData.get('amount'));
    const adminId = formData.get('adminId') as string;
    const adminName = formData.get('adminName') as string;
    
    if (!userIdentifier || !amount || amount <= 0 || !adminId) {
        return { success: false, message: 'All fields are required and amount must be positive.' };
    }
    
    try {
        const userToCredit = await getUserByEmailOrId(userIdentifier);
        if (!userToCredit) {
            return { success: false, message: 'User not found.' };
        }

        const userRef = db.collection('users').doc(userToCredit.uid);
        const adminRef = db.collection('users').doc(adminId);

        await db.runTransaction(async (transaction) => {
            const adminDoc = await transaction.get(adminRef);
            if (!adminDoc.exists() || (adminDoc.data()?.walletBalance || 0) < amount) {
                throw new Error('Insufficient admin funds.');
            }

            transaction.update(adminRef, { walletBalance: FieldValue.increment(-amount) });
            transaction.update(userRef, { walletBalance: FieldValue.increment(amount) });
            
            const transactionRef = db.collection('walletTransactions').doc();
            transaction.set(transactionRef, {
                type: 'admin_topup',
                userId: userToCredit.uid,
                userName: userToCredit.name,
                amount: amount,
                status: 'Completed',
                adminId: adminId,
                adminName: adminName,
                createdAt: FieldValue.serverTimestamp(),
            });
        });

        return { success: true, message: `PKR ${amount} has been added to ${userToCredit.name}'s wallet.` };
    } catch (error: any) {
        console.error("Error in manual top-up: ", error);
        return { success: false, message: error.message };
    }
}
    

    