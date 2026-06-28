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
        <nav className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white shadow-xl sticky top-0 z-50 border-b border-amber-500/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 font-extrabold text-2xl tracking-tight hover:opacity-90 transition-opacity">
                            <span className="text-3xl filter drop-shadow">🍔</span>
                            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">Canteen Connect</span>
                        </Link>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-6">
                            {user && (
                                <>
                                    <Link to="/dashboard" className="hover:text-amber-400 transition-colors font-semibold">Dashboard</Link>
                                    <Link to="/menu" className="hover:text-amber-400 transition-colors font-semibold">Our Menu 🍕</Link>
                                    <Link to="/history" className="text-amber-300/80 hover:text-amber-300 transition-colors font-semibold">My Orders</Link>
                                </>
                            )}
                            {user?.role === 'admin' && (
                                <>
                                    <Link to="/admin" className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-lg hover:bg-amber-500/30 transition-all font-bold text-sm">👑 Admin Panel</Link>
                                    <Link to="/kds" className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg hover:bg-emerald-500/30 transition-all font-bold text-sm animate-pulse">📺 Live KDS</Link>
                                </>
                            )}
                            
                            {user ? (
                                <div className="flex items-center space-x-4 ml-4 border-l border-amber-500/30 pl-4">
                                    <Link to="/profile" className="flex items-center gap-2 hover:bg-amber-950/60 px-3 py-1.5 rounded-full transition-colors border border-amber-500/40 text-sm shadow-inner">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-extrabold text-xs">
                                            {user.username?.[0]?.toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-amber-100">Profile</span>
                                    </Link>
                                    <button onClick={handleLogout} className="bg-rose-600 hover:bg-rose-500 px-4 py-1.5 rounded-lg font-bold transition-all shadow-md hover:shadow-rose-500/20 text-sm">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4 ml-4">
                                    <Link to="/login" className="text-amber-100 hover:text-amber-400 font-semibold transition-colors">Sign In</Link>
                                    <Link to="/register" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-5 py-2 rounded-full font-extrabold transition-all shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5">Order Now 🍽️</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-amber-300 hover:text-white focus:outline-none"
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
                <div className="md:hidden bg-slate-900 border-t border-amber-500/30">
                    <div className="px-3 pt-3 pb-4 space-y-2">
                        {user && (
                            <>
                                <Link to="/dashboard" onClick={closeMenu} className="block px-3 py-2 rounded-lg text-base font-semibold text-amber-100 hover:bg-amber-950/50">Dashboard</Link>
                                <Link to="/menu" onClick={closeMenu} className="block px-3 py-2 rounded-lg text-base font-semibold text-amber-100 hover:bg-amber-950/50">Our Menu 🍕</Link>
                                <Link to="/history" onClick={closeMenu} className="block px-3 py-2 rounded-lg text-base font-semibold text-amber-300/80 hover:bg-amber-950/50">My Orders</Link>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <>
                                <Link to="/admin" onClick={closeMenu} className="block px-3 py-2 rounded-lg text-base font-bold text-amber-400 hover:bg-amber-950/50">👑 Admin Panel</Link>
                                <Link to="/kds" onClick={closeMenu} className="block px-3 py-2 rounded-lg text-base font-bold text-emerald-400 hover:bg-amber-950/50">📺 Live KDS</Link>
                            </>
                        )}
                        
                        {user ? (
                            <div className="mt-4 pt-4 border-t border-amber-500/30">
                                <Link to="/profile" onClick={closeMenu} className="block px-3 py-2 rounded-lg text-base font-semibold text-amber-100 hover:bg-amber-950/50">My Profile</Link>
                                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-lg text-base font-bold text-rose-400 hover:bg-amber-950/50 mt-2">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="mt-4 pt-4 border-t border-amber-500/30 space-y-2">
                                <Link to="/login" onClick={closeMenu} className="block px-3 py-2 rounded-lg text-base font-semibold text-amber-100 hover:bg-amber-950/50">Sign In</Link>
                                <Link to="/register" onClick={closeMenu} className="block px-3 py-2.5 rounded-full text-base font-extrabold text-center text-slate-950 bg-gradient-to-r from-amber-500 to-orange-500 shadow-md">Order Now 🍽️</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}