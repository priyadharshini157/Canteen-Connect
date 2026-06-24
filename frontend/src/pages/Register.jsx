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
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
                            <input 
                                type="text" 
                                placeholder="priya123" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                            <input 
                                type="text" 
                                placeholder="Priyadharshini S" 
                                value={fullName} 
                                onChange={e => setFullName(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                placeholder="priya@example.com" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                            <input 
                                type="tel" 
                                placeholder="+91 9876543210" 
                                value={phone} 
                                onChange={e => setPhone(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Roll Number</label>
                            <input 
                                type="text" 
                                placeholder="21CS101" 
                                value={rollNo} 
                                onChange={e => setRollNo(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1">Department</label>
                            <input 
                                type="text" 
                                placeholder="Computer Science" 
                                value={department} 
                                onChange={e => setDepartment(e.target.value)} 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            />
                        </div>
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
                        Sign Up
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-slate-600">
                        Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
