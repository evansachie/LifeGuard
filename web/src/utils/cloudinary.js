import axios from 'axios';

const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

// Function to encode string to UTF-8 bytes
const stringToUTF8Bytes = (str) => {
  const arr = [];
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    if (char < 0x80) {
      arr.push(char);
    } else if (char < 0x800) {
      arr.push(0xc0 | (char >> 6), 
               0x80 | (char & 0x3f));
    } else if (char < 0xd800 || char >= 0xe000) {
      arr.push(0xe0 | (char >> 12), 
               0x80 | ((char >> 6) & 0x3f), 
               0x80 | (char & 0x3f));
    } else {
      i++;
      char = 0x10000 + (((char & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      arr.push(0xf0 | (char >> 18),
               0x80 | ((char >> 12) & 0x3f),
               0x80 | ((char >> 6) & 0x3f),
               0x80 | (char & 0x3f));
    }
  }
  return new Uint8Array(arr);
};

const generateSignature = async (timestamp, folder) => {
  const str = `folder=${folder}&timestamp=${timestamp}&upload_preset=${CLOUDINARY_UPLOAD_PRESET}${CLOUDINARY_API_SECRET}`;
  const msgUint8 = stringToUTF8Bytes(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const uploadToCloudinary = async (file, folder = 'profile_photos') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);
    formData.append('api_key', CLOUDINARY_API_KEY);
    
    // Generate timestamp and signature
    const timestamp = Math.round((new Date()).getTime() / 1000);
    formData.append('timestamp', timestamp);
    
    // Add signature
    const signature = await generateSignature(timestamp, folder);
    formData.append('signature', signature);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.data && response.data.secure_url) {
      console.log('Image uploaded successfully:', response.data.secure_url);
      return response.data.secure_url;
    } else {
      throw new Error('Invalid response from Cloudinary');
    }
  } catch (error) {
    console.error('Error uploading image:', error.response?.data || error.message);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

export { uploadToCloudinary };
