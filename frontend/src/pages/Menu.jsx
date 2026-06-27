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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
            
            {/* Main Menu Section */}
            <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="text-3xl font-bold text-slate-800">Today's Menu</h2>
                    
                    {/* Search and Filter UI */}
                    <div className="flex gap-4 w-full sm:w-auto">
                        <input 
                            type="text" 
                            placeholder="Search food..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                        />
                        <select 
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredItems.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col group">
                            {item.image_url ? (
                                <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                                <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
                                    <span className="text-slate-400 font-medium">No Image</span>
                                </div>
                            )}
                            <div className="p-5 flex flex-col flex-grow bg-white z-10">
                                <h3 className="text-lg font-bold text-slate-800 mb-1">{item.name}</h3>
                                <p className="text-emerald-500 font-bold text-lg mb-4">₹{item.price.toFixed(2)}</p>
                                <button onClick={() => addToCart(item)} className="mt-auto w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-sm hover:shadow">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredItems.length === 0 && <p className="text-slate-500 col-span-full text-center py-10 text-lg">No food items found matching your criteria.</p>}
                </div>
            </div>

            {/* Floating Cart Sidebar */}
            {cart.length > 0 && (
                <div className="w-full md:w-80 lg:w-96 bg-white p-6 rounded-2xl shadow-xl h-fit md:sticky top-24 border border-slate-100 shrink-0">
                    <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-4 mb-5">Your Cart</h3>
                    
                    <div className="flex flex-col gap-4">
                        {cart.map(item => (
                            <div key={item.name} className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold text-sm">{item.quantity}x</span>
                                    <span className="font-medium text-slate-700">{item.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    <button onClick={() => removeFromCart(item.name)} className="text-rose-400 hover:text-rose-600 font-bold p-1 transition-colors">✕</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-5 border-t border-slate-200 flex justify-between items-center text-lg">
                        <span className="font-bold text-slate-800">Total:</span>
                        <span className="font-black text-emerald-500 text-2xl">₹{cartTotal.toFixed(2)}</span>
                    </div>

                    <button 
                        onClick={handleCheckout} 
                        disabled={isProcessing}
                        className={`w-full mt-6 text-white py-3.5 rounded-xl font-bold text-lg transition-all shadow-md ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-lg transform hover:-translate-y-0.5'}`}
                    >
                        {isProcessing ? 'Processing...' : 'Pay with Razorpay'}
                    </button>
                </div>
            )}
        </div>
    );
}