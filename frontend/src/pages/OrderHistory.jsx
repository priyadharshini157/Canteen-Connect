import { useState, useEffect } from 'react';
import api from '../services/api';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders/history')
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch history:", err);
                setLoading(false);
            });
    }, []);

    const getBorderColor = (status) => {
        switch(status) {
            case 'Preparing': return 'border-blue-500';
            case 'Ready': return 'border-emerald-500';
            case 'Completed': return 'border-slate-400';
            default: return 'border-amber-500'; // Pending/Paid
        }
    };

    const getTextColor = (status) => {
        switch(status) {
            case 'Preparing': return 'text-blue-500';
            case 'Ready': return 'text-emerald-500';
            case 'Completed': return 'text-slate-500';
            default: return 'text-amber-500';
        }
    };

    if (loading) {
        return <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-amber-50/40 via-orange-50/40 to-red-50/40 flex items-center justify-center p-8 text-slate-500 text-xl font-bold">🍳 Loading your delicious order history...</div>;
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-amber-50/40 via-orange-50/40 to-red-50/40 py-8">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-orange-100 mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <span className="text-4xl">📜</span> My Canteen Orders
                        </h2>
                        <p className="text-slate-500 text-sm font-medium mt-1">Track your tokens and view past receipts easily</p>
                    </div>
                </div>
                
                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-lg p-14 text-center border border-orange-100 max-w-xl mx-auto">
                        <span className="text-6xl block mb-4 animate-bounce">🥪</span>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">No orders placed yet!</h3>
                        <p className="text-slate-500 font-medium mb-6">Your stomach is waiting. Head over to our canteen menu and pick your favorite snack!</p>
                        <a href="/menu" className="inline-block px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5 transition-all">Browse Menu 🍕</a>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map(order => (
                            <div key={order._id} className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-l-8 ${getBorderColor(order.status)} border border-orange-100/60 overflow-hidden`}>
                                <div className="p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-4 gap-2">
                                        <div>
                                            <span className="font-black text-2xl text-slate-800 flex items-center gap-2">
                                                <span>🎫 Token</span>
                                                <span className="bg-amber-100 text-amber-900 px-3 py-0.5 rounded-lg border border-amber-300 font-extrabold">#{order.token_number}</span>
                                            </span>
                                            <span className="text-slate-400 text-xs font-semibold mt-1 block">
                                                🕒 Ordered on {new Date(order.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className={`font-black uppercase tracking-wider ${getTextColor(order.status)} bg-slate-50 border border-slate-200/80 px-4 py-1.5 rounded-full text-xs shadow-sm flex items-center gap-1.5`}>
                                            <span>{order.status === 'Ready' ? '🎉' : order.status === 'Preparing' ? '🍳' : '📌'}</span>
                                            <span>{order.status}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <div className="space-y-3 mb-6 bg-amber-50/30 p-4 rounded-xl border border-amber-100/50">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center text-slate-800 py-1">
                                                        <span className="font-black bg-orange-500 text-white px-2 py-0.5 rounded text-xs mr-3 shrink-0 shadow-sm">{item.quantity}x</span>
                                                        {item.image_url ? (
                                                            <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-orange-200 mr-3 shrink-0 shadow-sm" />
                                                        ) : (
                                                            <div className="w-12 h-12 bg-amber-100 rounded-lg border border-amber-200 mr-3 shrink-0 flex items-center justify-center">
                                                                <span className="text-base">🍔</span>
                                                            </div>
                                                        )}
                                                        <span className="font-extrabold text-base text-slate-800">{item.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div className="flex justify-between items-center border-t border-slate-100 pt-4 font-bold">
                                                <span className="text-slate-600 flex items-center gap-2">
                                                    <span>Total Paid</span>
                                                    <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md uppercase tracking-wider">{order.payment_method}</span>
                                                </span>
                                                <span className="text-emerald-600 font-black text-3xl">₹{order.total_price.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        {/* QR Code Section */}
                                        {order.qr_code && order.status !== 'Completed' && (
                                            <div className="md:w-48 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50 p-4 rounded-2xl border-2 border-orange-200 shrink-0 shadow-inner">
                                                <p className="text-xs font-black text-orange-600 uppercase tracking-wider mb-2 text-center">📱 Collection QR</p>
                                                <div className="bg-white p-2 rounded-xl shadow-md border border-orange-100">
                                                    <img src={`data:image/png;base64,${order.qr_code}`} alt="Collection QR Code" className="w-32 h-32 object-contain" />
                                                </div>
                                                <p className="text-[11px] font-bold text-slate-500 mt-2 text-center">Show at canteen counter</p>
                                            </div>
                                        )}
                                        {order.qr_code && order.status === 'Completed' && (
                                            <div className="md:w-48 flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0 opacity-60 grayscale">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">✅ Collected</p>
                                                <img src={`data:image/png;base64,${order.qr_code}`} alt="Collected QR Code" className="w-28 h-28 object-contain" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
