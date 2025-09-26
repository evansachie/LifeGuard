import axios from 'axios';
import { getErrorMessage } from './errorHandler';

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY as string;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET as string;

// Function to encode string to UTF-8 bytes
const stringToUTF8Bytes = (str: string): Uint8Array => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

const generateSignature = async (timestamp: number, folder: string): Promise<string> => {
  const str = `folder=${folder}&timestamp=${timestamp}&upload_preset=${CLOUDINARY_UPLOAD_PRESET}${CLOUDINARY_API_SECRET}`;
  const msgUint8 = stringToUTF8Bytes(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8 as BufferSource);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

interface CloudinaryResponse {
  secure_url: string;
  [key: string]: unknown;
}

const uploadToCloudinary = async (
  file: File,
  folder: string = 'profile_photos'
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    formData.append('api_key', CLOUDINARY_API_KEY);

    // Generate timestamp and signature
    const timestamp = Math.round(new Date().getTime() / 1000);
    formData.append('timestamp', timestamp.toString());

    // Add signature
    const signature = await generateSignature(timestamp, folder);
    formData.append('signature', signature);

    const response = await axios.post<CloudinaryResponse>(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data && response.data.secure_url) {
      console.log('Image uploaded successfully:', response.data.secure_url);
      return response.data.secure_url;
    } else {
      throw new Error('Invalid response from Cloudinary');
    }
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error, 'Failed to upload image to Cloudinary');
    console.error('Error uploading image:', error);
    throw new Error(errorMessage);
  }
};

export { uploadToCloudinary };
