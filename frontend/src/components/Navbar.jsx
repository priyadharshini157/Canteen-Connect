import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        navigate('/login');
    };

    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="bg-slate-800 text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" onClick={closeMenu} className="font-bold text-xl tracking-tight text-white hover:text-blue-300 transition-colors">
                            Smart Canteen
                        </Link>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-6">
                            <Link to="/" className="text-emerald-400 hover:text-emerald-300 transition-colors font-bold">Portfolio</Link>
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

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-300 hover:text-white focus:outline-none"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-700 border-t border-slate-600">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-bold text-emerald-400 hover:bg-slate-600">Portfolio</Link>
                        {user && (
                            <>
                                <Link to="/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-600">Dashboard</Link>
                                <Link to="/menu" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-600">Menu</Link>
                                <Link to="/history" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-blue-300 hover:bg-slate-600">My Orders</Link>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <>
                                <Link to="/admin" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-amber-400 hover:bg-slate-600">Admin Panel</Link>
                                <Link to="/kds" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-emerald-400 hover:bg-slate-600">KDS</Link>
                            </>
                        )}
                        
                        {user ? (
                            <div className="mt-4 pt-4 border-t border-slate-600">
                                <Link to="/profile" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-600">My Profile</Link>
                                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-bold text-rose-400 hover:bg-slate-600 mt-2">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="mt-4 pt-4 border-t border-slate-600">
                                <Link to="/login" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-slate-600">Login</Link>
                                <Link to="/register" onClick={closeMenu} className="block px-3 py-2 rounded-md text-base font-bold text-emerald-400 hover:bg-slate-600">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}