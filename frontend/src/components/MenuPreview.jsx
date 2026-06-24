import { useState, useEffect } from 'react';
import api from '../services/api';

export default function MenuPreview() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await api.get('/menu');
                setItems(res.data);
            } catch (error) {
                console.error("Failed to fetch preview menu", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenu();
    }, []);

    if (isLoading) {
        return <div className="h-full flex items-center justify-center text-white/70">Loading today's menu...</div>;
    }

    if (items.length === 0) {
        return <div className="h-full flex items-center justify-center text-white/70">No menu items available right now.</div>;
    }

    return (
        <div className="h-full flex flex-col p-8">
            <h2 className="text-3xl font-black text-white mb-6 text-center tracking-tight">Today's Delicious Menu</h2>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col transform hover:scale-[1.02] transition-transform">
                            {item.image_url && (
                                <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover rounded-lg mb-3 shadow-md" />
                            )}
                            <div className="mt-auto">
                                <h3 className="text-lg font-bold text-white leading-tight mb-1">{item.name}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs font-semibold px-2 py-1 bg-white/20 rounded-md text-emerald-100">{item.category}</span>
                                    <span className="text-lg font-black text-emerald-300">₹{item.price.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <p className="text-center text-white/60 mt-4 text-sm">Log in or create an account to place an order!</p>
        </div>
    );
}
