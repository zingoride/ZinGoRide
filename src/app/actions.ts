
"use server";

import {
  suggestDynamicTips as suggestDynamicTipsFlow,
  type SuggestDynamicTipsInput,
  type SuggestDynamicTipsOutput,
} from "@/ai/flows/suggest-dynamic-tips";
import { v2 as cloudinary } from 'cloudinary';

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

    console.log("--- Sending Broadcast Notification ---");
    console.log("Title:", title);
    console.log("Message:", message);
    console.log("------------------------------------");

    // In a real application, you would integrate with Firebase Cloud Messaging (FCM) here.
    // 1. You would need to set up the Firebase Admin SDK.
    // 2. Collect FCM tokens from all user devices and store them.
    // 3. Use the Admin SDK to send a message to a topic (e.g., 'all_users') or to all tokens.
    // For this prototype, we'll just simulate a successful sending.
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate success
    return { success: true };
}
