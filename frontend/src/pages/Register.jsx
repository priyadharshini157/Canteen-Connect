import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { 
                username, 
                email, 
                password,
                full_name: fullName,
                phone,
                roll_no: rollNo,
                department
            });
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (error) {
            let errorMsg = 'Registration failed.';
            if (error.response?.data?.detail) {
                if (Array.isArray(error.response.data.detail)) {
                    errorMsg = error.response.data.detail.map(err => err.msg).join(', ');
                } else {
                    errorMsg = error.response.data.detail;
                }
            }
            alert(errorMsg);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden py-8">
            {/* Background decorative food emojis */}
            <div className="absolute top-12 left-12 text-6xl opacity-10 select-none animate-pulse">🌮</div>
            <div className="absolute bottom-12 right-12 text-6xl opacity-10 select-none animate-bounce">🍦</div>
            <div className="absolute top-1/3 right-10 text-5xl opacity-10 select-none">🍩</div>

            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-orange-100 w-full max-w-2xl relative z-10">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-3xl shadow-lg shadow-orange-500/30 mb-3 transform rotate-3 hover:rotate-0 transition-transform">
                        🥪
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Canteen Account</h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Join now to enjoy hot lunches & instant token pickup!</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><span>👤</span> Username</label>
                            <input 
                                type="text" 
                                placeholder="student123" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium text-slate-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><span>🏷️</span> Full Name</label>
                            <input 
                                type="text" 
                                placeholder="John Doe" 
                                value={fullName} 
                                onChange={e => setFullName(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium text-slate-800"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><span>📧</span> Email Address</label>
                            <input 
                                type="email" 
                                placeholder="you@college.edu" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium text-slate-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><span>📱</span> Phone Number</label>
                            <input 
                                type="tel" 
                                placeholder="+91 9876543210" 
                                value={phone} 
                                onChange={e => setPhone(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium text-slate-800"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><span>🎓</span> Roll Number</label>
                            <input 
                                type="text" 
                                placeholder="21CS101" 
                                value={rollNo} 
                                onChange={e => setRollNo(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium text-slate-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><span>🏢</span> Department</label>
                            <input 
                                type="text" 
                                placeholder="Computer Science" 
                                value={department} 
                                onChange={e => setDepartment(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium text-slate-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1"><span>🔒</span> Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium text-slate-800"
                        />
                    </div>
                    <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold text-lg rounded-xl transition-all duration-200 mt-2 shadow-lg shadow-orange-500/25 transform hover:-translate-y-0.5 active:translate-y-0">
                        Sign Up for Canteen 🍕
                    </button>
                </form>
                <div className="mt-6 text-center pt-4 border-t border-slate-100">
                    <p className="text-slate-600 font-medium">
                        Already have an account? <Link to="/login" className="text-orange-600 font-extrabold hover:underline ml-1">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
