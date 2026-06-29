import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Menu() {
    const [menuItems, setMenuItems] = useState([]);
    const [cart, setCart] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Search & Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');

    const defaultItems = [
        {"name": "Chicken Rice", "price": 90.0, "category": "Lunch", "image_url": "/images/chicken_rice.png"},
        {"name": "Noodles", "price": 70.0, "category": "Lunch", "image_url": "/images/noodles.png"},
        {"name": "Veg Rice", "price": 60.0, "category": "Lunch", "image_url": "/images/veg_rice.png"},
        {"name": "Veg Noodles", "price": 65.5, "category": "Lunch", "image_url": "/images/veg_noodles.png"},
        {"name": "Egg Noodles", "price": 80.5, "category": "Lunch", "image_url": "/images/egg_noodles.png"},
        {"name": "Parotta", "price": 15.0, "category": "Dinner", "image_url": "/images/paroto.png"},
        {"name": "Curd Rice", "price": 50.0, "category": "Lunch", "image_url": "/images/curd_rice.png"},
        {"name": "Rose Milk", "price": 30.0, "category": "Drinks", "image_url": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"},
        {"name": "Tea", "price": 10.0, "category": "Drinks", "image_url": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80"},
        {"name": "Cold Coffee", "price": 40.0, "category": "Drinks", "image_url": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80"}
    ];

    useEffect(() => {
        api.get('/menu').then(res => {
            const dbItems = res.data || [];
            
            // Create a map of DB items by lowercased name
            const dbMap = new Map();
            dbItems.forEach(item => {
                if (item.name) dbMap.set(item.name.toLowerCase().trim(), item);
            });

            // Merge default items with DB items
            const merged = defaultItems.map(def => {
                const found = dbMap.get(def.name.toLowerCase().trim());
                if (found) {
                    dbMap.delete(def.name.toLowerCase().trim());
                    return {
                        ...def,
                        ...found,
                        image_url: found.image_url || def.image_url
                    };
                }
                return def;
            });

            // Append any extra manually added items from DB that weren't in defaultItems
            dbMap.forEach(extra => {
                merged.push({
                    ...extra,
                    image_url: extra.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
                });
            });

            setMenuItems(merged);
        }).catch(err => {
            console.error("Database connection failed, using default UI items.", err);
            setMenuItems(defaultItems);
        });
    }, []);

    const addToCart = (item) => {
        const existing = cart.find(c => c.name === item.name);
        if (existing) {
            setCart(cart.map(c => c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (name) => {
        setCart(cart.filter(c => c.name !== name));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            // 1. Create Razorpay order on backend
            const orderRes = await api.post('/orders/create_razorpay_order', { amount: cartTotal });
            const { razorpay_order_id, amount, currency } = orderRes.data;

            // 2. Initialize Razorpay Checkout
            const options = {
                key: orderRes.data.key_id, // Dynamically fetched from backend environment
                amount: amount,
                currency: currency,
                name: "Smart Canteen",
                description: "Order Payment",
                order_id: razorpay_order_id,
                handler: async function (response) {
                    try {
                        // 3. Verify payment and create order in DB
                        const verifyPayload = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            items: cart.map(c => ({ menu_id: c.name, quantity: c.quantity, name: c.name, image_url: c.image_url, category: c.category })),
                            total_price: cartTotal
                        };
                        const verifyRes = await api.post('/orders/verify_payment', verifyPayload);
                        alert(`Order placed successfully! Your token is #${verifyRes.data.token_number}`);
                        setCart([]); // Clear cart
                    } catch (err) {
                        const errorMsg = err.response?.data?.detail || 'Payment verification failed.';
                        alert('Payment verification failed: ' + errorMsg);
                        console.error(err);
                    }
                },
                prefill: {
                    name: "Student",
                    email: "student@example.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#10b981"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert('Payment failed. Please try again.');
                console.error(response.error);
            });
            rzp.open();
        } catch (error) {
            alert('Error initiating checkout.');
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Filter Logic
    const categories = ['All', ...new Set(menuItems.map(item => item.category))];
    const filteredItems = menuItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-amber-50/40 via-orange-50/40 to-red-50/40 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
                
                {/* Main Menu Section */}
                <div className="flex-1">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-orange-100">
                        <div>
                            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
                                <span className="text-4xl animate-bounce">🍕</span> Today's Canteen Menu
                            </h2>
                            <p className="text-slate-500 text-sm font-medium mt-1">Freshly prepared hot meals & refreshing beverages</p>
                        </div>
                        
                        {/* Search and Filter UI */}
                        <div className="flex gap-3 w-full sm:w-auto">
                            <div className="relative flex-1 sm:flex-none">
                                <span className="absolute left-3 top-3 text-slate-400">🔍</span>
                                <input 
                                    type="text" 
                                    placeholder="Search delicious food..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-inner font-medium text-slate-800 min-w-[220px]"
                                />
                            </div>
                            <select 
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white font-bold text-slate-700 shadow-sm cursor-pointer"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? '🍽️ All Categories' : cat}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredItems.map((item, idx) => (
                            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-orange-100/80 flex flex-col group transform hover:-translate-y-1">
                                <div className="relative overflow-hidden h-48">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-48 bg-amber-100 flex items-center justify-center">
                                            <span className="text-amber-500 font-bold text-lg">🍔 No Image</span>
                                        </div>
                                    )}
                                    <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                                        {item.category || 'Food'}
                                    </span>
                                </div>
                                <div className="p-5 flex flex-col flex-grow bg-white z-10">
                                    <h3 className="text-xl font-extrabold text-slate-800 mb-1 group-hover:text-orange-600 transition-colors">{item.name}</h3>
                                    <p className="text-emerald-600 font-black text-2xl mb-4">₹{item.price.toFixed(2)}</p>
                                    <button onClick={() => addToCart(item)} className="mt-auto w-full py-3 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold rounded-xl transition-all shadow-md hover:shadow-orange-500/25 active:scale-95 flex items-center justify-center gap-2 text-base">
                                        <span>Add to Cart</span> <span className="text-lg">➕</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredItems.length === 0 && (
                            <div className="col-span-full bg-white/80 rounded-2xl p-12 text-center border border-orange-100">
                                <span className="text-5xl block mb-3">🍽️</span>
                                <p className="text-slate-600 font-bold text-xl">No food items found matching your criteria.</p>
                                <p className="text-slate-400 text-sm mt-1">Try searching for something else like Rice, Noodles, or Drinks!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Floating Cart Sidebar */}
                {cart.length > 0 && (
                    <div className="w-full md:w-80 lg:w-96 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl h-fit md:sticky top-24 border-2 border-orange-200 shrink-0 animate-fadeIn">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                                <span>🛒</span> Your Cart
                            </h3>
                            <span className="bg-orange-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full">
                                {cart.reduce((a, b) => a + b.quantity, 0)} Items
                            </span>
                        </div>
                        
                        <div className="flex flex-col gap-3 max-h-[40vh] overflow-y-auto custom-scrollbar pr-1">
                            {cart.map(item => (
                                <div key={item.name} className="flex justify-between items-center bg-amber-50/50 p-3 rounded-xl border border-amber-100/60">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-gradient-to-tr from-orange-500 to-amber-500 text-slate-950 px-2.5 py-1 rounded-lg font-black text-xs shadow-sm">{item.quantity}x</span>
                                        <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-slate-700">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        <button onClick={() => removeFromCart(item.name)} className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white font-bold flex items-center justify-center transition-all text-xs">✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-5 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
                            <span className="font-extrabold text-slate-700 text-lg">Total Amount:</span>
                            <span className="font-black text-emerald-600 text-3xl tracking-tight">₹{cartTotal.toFixed(2)}</span>
                        </div>

                        <button 
                            onClick={handleCheckout} 
                            disabled={isProcessing}
                            className={`w-full mt-6 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-2 ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 shadow-emerald-500/30 transform hover:-translate-y-0.5 active:scale-95'}`}
                        >
                            <span>{isProcessing ? 'Processing Payment...' : 'Proceed to Pay ⚡'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}