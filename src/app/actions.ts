
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
