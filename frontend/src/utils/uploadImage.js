import api from '../services/api';

export const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        // We now upload through the backend to securely use the API Secret
        const res = await api.post('/menu/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return res.data.url;
    } catch (error) {
        console.error("Backend upload error", error);
        alert("Failed to upload image. Please check backend logs or Cloudinary credentials.");
        return null;
    }
};
