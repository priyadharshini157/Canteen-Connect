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

    if (isLoading) return <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-amber-50/40 via-orange-50/40 to-red-50/40 flex items-center justify-center p-8 text-center text-slate-500 font-bold text-xl">👤 Loading your profile details...</div>;

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-amber-50/40 via-orange-50/40 to-red-50/40 py-10 px-4">
            <div className="max-w-3xl mx-auto p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-orange-100">
                <div className="flex items-center justify-between border-b border-orange-100 pb-5 mb-8">
                    <h2 className="text-3xl font-black text-slate-800 flex items-center gap-2.5">
                        <span className="text-4xl">👑</span> My Canteen Profile
                    </h2>
                    <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-extrabold px-3.5 py-1 rounded-full text-xs uppercase tracking-wider shadow-sm">
                        {profile?.role || 'User'}
                    </span>
                </div>
                
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-amber-50/40 p-6 rounded-2xl border border-amber-100/60">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-tr from-amber-200 to-orange-200 border-4 border-white shadow-lg flex items-center justify-center">
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-black text-orange-600">{profile?.username?.[0]?.toUpperCase()}</span>
                                )}
                            </div>
                            <label className="absolute bottom-1 right-1 bg-gradient-to-r from-orange-500 to-amber-500 p-2.5 rounded-full cursor-pointer hover:from-orange-600 hover:to-amber-600 transition shadow-md text-slate-950 transform hover:scale-105">
                                <svg className="w-4 h-4 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-2xl font-black text-slate-800">{profile?.username}</h3>
                            <p className="text-slate-500 font-medium mt-0.5">{profile?.email}</p>
                            <p className="text-xs text-orange-600 font-extrabold mt-2 flex items-center justify-center sm:justify-start gap-1">
                                <span>✨ Active Member</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1"><span>📱</span> Phone Number</label>
                            <input 
                                type="tel" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-slate-50/50 font-medium text-slate-800"
                                placeholder="+91 9876543210"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1"><span>🖼️</span> Profile Picture Status</label>
                            <input 
                                type="text" 
                                disabled
                                value={profilePic ? "Image uploaded successfully ✅" : "No custom picture uploaded"}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-semibold"
                            />
                            <p className="text-xs text-slate-400 mt-1.5 font-medium">Click the camera icon on your avatar to upload a photo.</p>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end border-t border-slate-100">
                        <button 
                            type="submit" 
                            disabled={isSaving}
                            className="px-8 py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-base rounded-xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 transform hover:-translate-y-0.5"
                        >
                            {isSaving ? 'Saving Changes...' : 'Save Profile Details ✨'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
