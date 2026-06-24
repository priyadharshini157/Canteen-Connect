import { useState, useEffect } from 'react';
import api from '../services/api';

export default function KitchenDisplay() {
    const [orders, setOrders] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/active');
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching active orders:", err);
        }
    };

    useEffect(() => {
        fetchOrders();
        
        // Timer to re-render elapsed times every minute
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        
        // Connect to WebSocket
        let ws;
        try {
            ws = new WebSocket(import.meta.env.VITE_WS_URL);
            ws.onmessage = () => {
                fetchOrders(); // Refresh whenever there's a token update
            };
        } catch (e) {
            console.error("KDS WS Error:", e);
        }

        return () => {
            clearInterval(timer);
            if (ws) ws.close();
        };
    }, []);

    const bumpOrder = async (orderId) => {
        try {
            await api.put(`/orders/${orderId}/status?new_status=Ready`);
            // The WS will broadcast, causing a re-fetch
        } catch (err) {
            alert('Error bumping order');
        }
    };

    // Calculate aggregated items for the sidebar
    const productCounts = {};
    orders.forEach(order => {
        if (order.status === 'Preparing') {
            order.items.forEach(item => {
                productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
            });
        }
    });

    const getHeaderColor = (createdAt) => {
        const orderTime = new Date(createdAt);
        // Time diff in minutes. Adding a fallback to UTC if needed, but assuming server sends correct string.
        const diffMinutes = Math.floor((currentTime - orderTime) / 60000) || 0;
        if (diffMinutes < 5) return '#10b981'; // Green
        if (diffMinutes < 15) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    const formatTime = (isoString) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex bg-slate-900 text-white font-sans h-[calc(100vh-64px)] -mx-4 sm:-mx-6 lg:-mx-8">
            {/* Sidebar */}
            <div className="w-64 bg-slate-800 border-r border-slate-900 flex flex-col shrink-0">
                <div className="p-4 bg-rose-600 font-black text-xl text-center tracking-widest shadow-md z-10">
                    KDS
                </div>
                <div className="p-4 border-b border-slate-700 flex justify-between text-slate-400 text-sm font-bold tracking-wider">
                    <span>PRODUCT</span>
                    <span>QTY</span>
                </div>
                <div className="p-4 overflow-y-auto flex-1">
                    {Object.entries(productCounts).map(([name, qty]) => (
                        <div key={name} className="flex justify-between items-center mb-4 text-lg">
                            <span className="font-medium text-slate-300 truncate pr-2">{name}</span>
                            <span className="font-black text-blue-400 bg-blue-900/30 px-2 rounded">{qty}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-900">
                <div className="flex flex-wrap gap-6 items-start">
                    {orders.map(order => {
                        const headerColor = getHeaderColor(order.created_at);
                        const isRed = headerColor === '#ef4444';
                        const isOrange = headerColor === '#f59e0b';
                        const headerClass = isRed ? 'bg-rose-500' : isOrange ? 'bg-amber-500' : 'bg-emerald-500';
                        
                        return (
                            <div key={order._id} className="w-80 bg-white text-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
                                {/* Ticket Header */}
                                <div className={`${headerClass} text-white px-5 py-3 flex justify-between items-center shadow-sm`}>
                                    <span className="text-2xl font-black">{formatTime(order.created_at)}</span>
                                    <div className="text-right">
                                        <div className="text-sm font-bold opacity-90 uppercase tracking-wider">Token</div>
                                        <div className="text-xl font-black">#{order.token_number}</div>
                                    </div>
                                </div>
                                
                                {/* Ticket Items */}
                                <div className="p-5 flex-1 min-h-[150px] bg-slate-50">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="pb-3 mb-3 border-b border-dashed border-slate-300 flex items-start last:border-0 last:mb-0 last:pb-0">
                                            <span className="font-black text-xl text-slate-400 mr-3 w-8">{item.quantity}x</span>
                                            <span className="text-lg font-bold text-slate-700 leading-tight pt-0.5">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Ticket Action */}
                                <div className="p-3 bg-white border-t border-slate-200">
                                    {order.status === 'Preparing' ? (
                                        <button 
                                            onClick={() => bumpOrder(order._id)} 
                                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-black text-xl tracking-wider transition-colors shadow-sm active:scale-95"
                                        >
                                            BUMP
                                        </button>
                                    ) : (
                                        <div className="text-center text-emerald-500 font-black py-4 text-lg tracking-widest bg-emerald-50 rounded-lg border border-emerald-100">
                                            READY
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
