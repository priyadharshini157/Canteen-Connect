import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/menu');
        } catch (error) {
            if (!error.response) {
                alert('Server is offline or unreachable.');
            } else if (error.response.status === 500) {
                alert('Database Error! MongoDB is not running on your machine. Please start MongoDB.');
            } else if (error.response.status === 401 || error.response.status === 400) {
                alert('Login failed. Incorrect email or password. Are you sure you registered?');
            } else {
                alert('Login failed: ' + (error.response?.data?.detail || 'Unknown error'));
            }
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
            {/* Background decorative food emojis */}
            <div className="absolute top-10 left-10 text-6xl opacity-10 select-none animate-pulse">🍕</div>
            <div className="absolute bottom-10 right-10 text-6xl opacity-10 select-none animate-bounce">🍔</div>
            <div className="absolute top-20 right-20 text-5xl opacity-10 select-none">🍟</div>
            <div className="absolute bottom-20 left-20 text-5xl opacity-10 select-none">🥪</div>

            <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-orange-100 w-full max-w-md relative z-10">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-3xl shadow-lg shadow-orange-500/30 mb-3 transform -rotate-6 hover:rotate-0 transition-transform">
                        🍱
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Canteen Login</h2>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Order fresh, hot meals without waiting in line!</p>
                </div>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                            <span>👤</span> Email or Username
                        </label>
                        <input 
                            type="text" 
                            placeholder="Enter your email or username" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-medium text-slate-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                            <span>🔒</span> Password
                        </label>
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
                        Sign In to Canteen 🍽️
                    </button>
                </form>
                <div className="mt-6 text-center pt-4 border-t border-slate-100">
                    <p className="text-slate-600 font-medium">
                        Hungry for snacks? <Link to="/register" className="text-orange-600 font-extrabold hover:underline ml-1">Create an Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}