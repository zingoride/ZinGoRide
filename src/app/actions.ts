
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

async function getUserByEmail(email: string): Promise<{ uid: string; name: string } | null> {
    const { auth, db } = getFirebaseAdmin();
    try {
        // Use Firebase Auth to get the user by email
        const userRecord = await auth.getUserByEmail(email);
        
        // Optionally, you can also fetch their name from Firestore if it's stored there
        const userDocRef = db.collection('users').doc(userRecord.uid);
        const userDoc = await userDocRef.get();
        const name = userDoc.exists ? userDoc.data()?.name : userRecord.displayName;

        return { uid: userRecord.uid, name: name || 'User' };
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            return null;
        }
        console.error("Error fetching user by email: ", error);
        return null;
    }
}


export async function manualTopUp(formData: FormData): Promise<{ success: boolean; error?: string }> {
    const userIdentifier = formData.get('userId') as string; // This can be email or UID
    const amount = Number(formData.get('amount'));
    const adminId = formData.get('adminId') as string;
    const adminName = formData.get('adminName') as string;

    if (!userIdentifier || !amount || !adminId) {
        return { success: false, error: "User Identifier, amount, and admin ID are required." };
    }

    if (amount <= 0) {
        return { success: false, error: "Amount must be positive." };
    }

    const { db } = getFirebaseAdmin();
    
    try {
        let userId: string;
        let userName: string;

        // Check if the identifier is an email
        if (userIdentifier.includes('@')) {
            const userAccount = await getUserByEmail(userIdentifier);
            if (!userAccount) {
                return { success: false, error: "User with this email not found." };
            }
            userId = userAccount.uid;
            userName = userAccount.name;
        } else {
            // Assume it's a UID
            userId = userIdentifier;
            const userDoc = await db.collection('users').doc(userId).get();
            if (!userDoc.exists) {
                return { success: false, error: "User with this ID not found." };
            }
            userName = userDoc.data()?.name || 'User';
        }

        const userRef = db.collection('users').doc(userId);

        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new Error("User not found in transaction");
            }
            
            // Increment user's wallet balance
            transaction.update(userRef, { walletBalance: FieldValue.increment(amount) });
            
            // Create a record of the manual transaction
            const transactionRef = db.collection('walletTransactions').doc();
            transaction.set(transactionRef, {
                type: 'admin_topup',
                userId: userId,
                userName: userName,
                amount: amount,
                status: 'Completed',
                adminId: adminId,
                adminName: adminName,
                createdAt: FieldValue.serverTimestamp(),
            });
        });

        return { success: true };
    } catch (error: any) {
        console.error("Error in manual top-up: ", error);
        return { success: false, error: error.message };
    }
}

export async function registerNewUser(formData: FormData): Promise<{ success: boolean; error?: string; userId?: string }> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;
    const userType = formData.get('userType') as 'Customer' | 'Driver';

    if (!email || !password || !fullName || !userType) {
        return { success: false, error: "All fields are required." };
    }

    const { auth, db } = getFirebaseAdmin();

    try {
        // 1. Create user in Firebase Authentication
        const userRecord: UserRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: fullName,
        });

        // 2. Create user document in Firestore
        const userDocRef = db.collection('users').doc(userRecord.uid);
        await userDocRef.set({
            name: fullName,
            email: email,
            type: userType,
            status: 'Active',
            approvalStatus: userType === 'Driver' ? 'Pending' : 'Approved',
            createdAt: FieldValue.serverTimestamp(),
            walletBalance: 0,
        });

        return { success: true, userId: userRecord.uid };

    } catch (error: any) {
        console.error("Error registering new user:", error);
        if (error.code === 'auth/email-already-exists') {
            return { success: false, error: 'The email address is already in use by another account.' };
        }
        return { success: false, error: error.message || 'An unknown server error occurred.' };
    }
}
