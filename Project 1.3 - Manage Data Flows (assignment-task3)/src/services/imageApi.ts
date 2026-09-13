import axios, { AxiosResponse } from 'axios';

// Photos are hosted on Cloudinary. The course starter used ImgBB, but ImgBB kept
// rejecting uploads for a new account ("forbidden", error 103), so this was swapped.
//
// Uses an unsigned upload preset, so no secret key lives in the app. Set these in .env:
//   EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
//   EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const imageApi = axios.create({
    baseURL: `https://api.cloudinary.com/v1_1/${cloudName}`,
});

// Resolves to the hosted image URL
export const uploadImage = async (imageBase64: string): Promise<string> => {
    const body = new URLSearchParams({
        file: `data:image/jpeg;base64,${imageBase64}`,
        upload_preset: uploadPreset ?? '',
    }).toString();

    const response: AxiosResponse = await imageApi.post('/image/upload', body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data.secure_url;
};
