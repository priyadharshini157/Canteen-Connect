import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <span className="font-bold text-xl tracking-tight">Smart Canteen</span>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-6">
                            {user && (
                                <>
                                    <Link to="/dashboard" className="hover:text-blue-400 transition-colors font-medium">Dashboard</Link>
                                    <Link to="/menu" className="hover:text-blue-400 transition-colors font-medium">Menu</Link>
                                    <Link to="/history" className="text-blue-300 hover:text-blue-200 transition-colors font-medium">My Orders</Link>
                                </>
                            )}
                            {user?.role === 'admin' && (
                                <>
                                    <Link to="/admin" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">Admin Panel</Link>
                                    <Link to="/kds" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold">KDS</Link>
                                </>
                            )}
                            
                            {user ? (
                                <div className="flex items-center space-x-4 ml-4 border-l border-slate-600 pl-4">
                                    <Link to="/profile" className="flex items-center gap-2 hover:bg-slate-700 px-3 py-1.5 rounded-full transition-colors border border-slate-600 text-sm">
                                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                                            {user.username?.[0]?.toUpperCase()}
                                        </div>
                                        <span className="font-medium text-slate-200">Profile</span>
                                    </Link>
                                    <button onClick={handleLogout} className="bg-rose-500 hover:bg-rose-600 px-4 py-1.5 rounded-md font-bold transition-colors shadow-sm text-sm">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4 ml-4">
                                    <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">Login</Link>
                                    <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-md font-bold transition-colors shadow-sm">Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}