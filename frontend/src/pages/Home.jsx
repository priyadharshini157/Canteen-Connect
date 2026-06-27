import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('features');

    const signatureDishes = [
        {
            name: "Gourmet Chicken Rice",
            price: "₹90",
            rating: "4.9 ★",
            reviews: "1.2k+ Orders",
            image: "/images/chicken_rice.png",
            badge: "Bestseller 🔥",
            desc: "Aromatic basmati rice tossed with tender spiced chicken, egg chunks, and fresh scallions."
        },
        {
            name: "Spicy Schezwan Noodles",
            price: "₹70",
            rating: "4.8 ★",
            reviews: "850+ Orders",
            image: "/images/noodles.png",
            badge: "Chef's Special ⭐",
            desc: "Wok-tossed noodles in fiery authentic schezwan sauce with crunchy garden vegetables."
        },
        {
            name: "Malabar Flaky Parotta",
            price: "₹15",
            rating: "4.9 ★",
            reviews: "2.5k+ Orders",
            image: "/images/paroto.png",
            badge: "Must Try 👑",
            desc: "Multi-layered, super crispy and soft South Indian flatbread served piping hot."
        },
        {
            name: "Creamy Curd Rice",
            price: "₹50",
            rating: "4.7 ★",
            reviews: "920+ Orders",
            image: "/images/curd_rice.png",
            badge: "Comfort Food ❄️",
            desc: "Soothing yogurt rice tempered with mustard seeds, curry leaves, ginger, and pomegranate."
        },
        {
            name: "Special Egg Noodles",
            price: "₹80.50",
            rating: "4.8 ★",
            reviews: "640+ Orders",
            image: "/images/egg_noodles.png",
            badge: "High Protein 💪",
            desc: "Classic stir-fried noodles loaded with double scrambled farm eggs and aromatic spices."
        },
        {
            name: "Garden Veg Rice",
            price: "₹60",
            rating: "4.6 ★",
            reviews: "510+ Orders",
            image: "/images/veg_rice.png",
            badge: "Healthy Choice 🥗",
            desc: "Light and flavorful fried rice packed with fresh carrots, beans, and spring onions."
        }
    ];

    const features = [
        {
            icon: "⚡",
            title: "Live Token Board (KDS)",
            desc: "No more crowding around the counter. Watch your order status update in real-time on digital screens from Preparing to Ready."
        },
        {
            icon: "📲",
            title: "Contactless QR Pickup",
            desc: "Every order gets an encrypted unique QR code. Simply flash your phone at the counter for instant, error-free verification."
        },
        {
            icon: "💳",
            title: "Razorpay & UPI Checkout",
            desc: "Pay seamlessly with GPay, PhonePe, Paytm, or Cards. Instant bank verification guarantees your order is queued immediately."
        },
        {
            icon: "📊",
            title: "Smart KDS & Analytics",
            desc: "Chefs manage tickets effortlessly on a dedicated touch interface while administrators track revenue and product trends."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
            
            {/* Hero Section with Glowing Gradients */}
            <div className="relative pt-20 pb-28 md:pt-32 md:pb-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Background Glow Orbs */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-600/30 to-blue-600/30 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
                <div className="absolute top-10 right-10 w-72 h-72 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none -z-10"></div>
                
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800 text-emerald-400 text-sm font-semibold mb-8 shadow-inner backdrop-blur-md animate-bounce">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        Next-Gen Campus Dining Showcase
                    </div>
                    
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-8 leading-tight">
                        Revolutionizing Food with <br />
                        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                            Smart Canteen Connect
                        </span>
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
                        Experience the supreme standard of digital cafeteria management. Skip long lines with real-time Kitchen Display synchronization, instant UPI payments, and ultra-fast QR code meal collection.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Link 
                            to={user ? "/menu" : "/login"} 
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 text-center flex items-center justify-center gap-2"
                        >
                            <span>Explore Live Menu</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                        </Link>
                        
                        <Link 
                            to="/dashboard" 
                            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 font-bold text-lg transition-all duration-200 text-center flex items-center justify-center gap-2 shadow-sm"
                        >
                            <span className="text-amber-400 animate-pulse">●</span> View Live Token Board
                        </Link>
                    </div>

                    {/* Quick Stats Bar */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl max-w-4xl mx-auto shadow-2xl">
                        <div className="p-3 text-center border-r border-slate-800/60 last:border-none">
                            <p className="text-3xl font-black text-white">&lt; 3 mins</p>
                            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Avg. Wait Time</p>
                        </div>
                        <div className="p-3 text-center border-r border-slate-800/60 last:border-none">
                            <p className="text-3xl font-black text-emerald-400">100%</p>
                            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Digital & Contactless</p>
                        </div>
                        <div className="p-3 text-center border-r border-slate-800/60 last:border-none">
                            <p className="text-3xl font-black text-blue-400">Zero</p>
                            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Queue Mishaps</p>
                        </div>
                        <div className="p-3 text-center">
                            <p className="text-3xl font-black text-amber-400">Live KDS</p>
                            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Real-Time Sync</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature Portfolio Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm">Culinary Portfolio</span>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mt-2 tracking-tight">Our Signature Showcase</h2>
                    <p className="text-slate-400 mt-4 text-lg">Every meal cooked fresh, verified digitally, and handed over piping hot.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {signatureDishes.map((dish, index) => (
                        <div key={index} className="group relative bg-slate-900/60 rounded-3xl border border-slate-800 hover:border-slate-700 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col">
                            <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                                <img 
                                    src={dish.image} 
                                    alt={dish.name} 
                                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out" 
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-bold text-emerald-400 shadow-md">
                                    {dish.badge}
                                </div>
                                <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold shadow-md">
                                    {dish.rating} ({dish.reviews})
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow justify-between">
                                <div>
                                    <div className="flex justify-between items-baseline mb-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{dish.name}</h3>
                                        <span className="text-2xl font-black text-emerald-400">{dish.price}</span>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-6">{dish.desc}</p>
                                </div>

                                <Link 
                                    to={user ? "/menu" : "/login"} 
                                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white font-bold text-sm transition-all duration-200 text-center flex items-center justify-center gap-2 border border-slate-700 hover:border-emerald-500"
                                >
                                    <span>Order This Item</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Smart Architecture Showcase Section */}
            <div className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/30 border-y border-slate-800/80 relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">System Capabilities</span>
                        <h2 className="text-4xl sm:text-5xl font-black text-white mt-2 tracking-tight">Engineered for High-Volume Dining</h2>
                        <p className="text-slate-400 mt-4 text-lg">A flawless blend of IoT kitchen displays, lightning-fast web sockets, and secure online gateways.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feat, idx) => (
                            <div key={idx} className="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 relative group overflow-hidden shadow-lg">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full group-hover:scale-110 transition-transform pointer-events-none"></div>
                                <div className="text-4xl mb-6 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 w-fit inline-block shadow-inner">{feat.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{feat.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Interactive Workflow Banner */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
                <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-emerald-900/40 via-slate-900 to-blue-900/40 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
                    <div className="absolute -top-24 -right-24 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Ready to Experience Digital Dining?</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-lg">
                        Join thousands of students and staff enjoying fresh, hot food with zero wait times and complete transparency.
                    </p>
                    <Link 
                        to={user ? "/menu" : "/register"} 
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-lg shadow-xl shadow-emerald-500/30 hover:scale-105 transition-all duration-200"
                    >
                        <span>{user ? "Go to Food Menu" : "Create Account & Order"}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-900 text-center text-slate-500 text-sm">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-lg tracking-tight">Smart Canteen</span>
                        <span className="text-emerald-500 font-semibold">• Portfolio Edition</span>
                    </div>
                    <p>© {new Date().getFullYear()} Smart Canteen Connect. Powered by MERN & FastAPI.</p>
                    <div className="flex gap-6">
                        <Link to="/dashboard" className="hover:text-slate-300 transition-colors">Live Board</Link>
                        <Link to="/menu" className="hover:text-slate-300 transition-colors">Menu</Link>
                        <Link to="/login" className="hover:text-slate-300 transition-colors">Login</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
