import { useState, useEffect } from 'react';
import api from '../services/api';
import { uploadImageToCloudinary } from '../utils/uploadImage';

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [phone, setPhone] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/auth/profile');
            setProfile(res.data);
            setPhone(res.data.phone || '');
            setProfilePic(res.data.profile_picture || '');
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await api.put('/auth/profile', { phone, profile_picture: profilePic });
            alert('Profile updated successfully!');
            fetchProfile();
        } catch (error) {
            alert('Failed to update profile.');
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsSaving(true);
            const uploadedUrl = await uploadImageToCloudinary(file);
            if (uploadedUrl) {
                setProfilePic(uploadedUrl);
            }
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading profile...</div>;

    return (
        <div className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">My Profile</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-200 border-4 border-slate-100 flex items-center justify-center">
                            {profilePic ? (
                                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-4xl text-slate-400">{profile?.username?.[0]?.toUpperCase()}</span>
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-md">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{profile?.username}</h3>
                        <p className="text-slate-500">{profile?.email}</p>
                        <span className="inline-block mt-1 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                            {profile?.role}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Phone Number</label>
                        <input 
                            type="tel" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-2">Profile Picture Status</label>
                        <input 
                            type="text" 
                            disabled
                            value={profilePic ? "Image uploaded successfully" : "No custom picture"}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 text-slate-500"
                        />
                        <p className="text-xs text-slate-500 mt-1">Click the camera icon on your avatar to change your picture.</p>
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button 
                        type="submit" 
                        disabled={isSaving}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md disabled:bg-slate-400"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
