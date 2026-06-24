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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-6">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            placeholder="you@example.com" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors mt-2 shadow-md">
                        Sign In
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-slate-600">
                        Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}