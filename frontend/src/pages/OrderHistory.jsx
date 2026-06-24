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
        return <div className="max-w-4xl mx-auto p-8 text-center text-slate-500 text-lg font-medium">Loading history...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-8">My Order History</h2>
            
            {orders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-700 mb-2">You haven't placed any orders yet.</h3>
                    <p className="text-slate-500">Go to the Menu to place your first order!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {orders.map(order => (
                        <div key={order._id} className={`bg-white rounded-xl shadow-md border-l-8 ${getBorderColor(order.status)} overflow-hidden`}>
                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-4 gap-2">
                                    <div>
                                        <span className="font-black text-xl text-slate-800">Order #{order.token_number}</span>
                                        <span className="text-slate-500 ml-0 sm:ml-4 text-sm block sm:inline">
                                            {new Date(order.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className={`font-black uppercase tracking-wide ${getTextColor(order.status)} bg-slate-50 px-4 py-1.5 rounded-full text-sm`}>
                                        {order.status}
                                    </div>
                                </div>
                                
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <div className="space-y-2 mb-6">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center text-slate-700 py-1">
                                                    <span className="font-bold w-8 text-slate-400 shrink-0">{item.quantity}x</span>
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded-md border border-slate-200 mr-3 shrink-0" />
                                                    ) : (
                                                        <div className="w-10 h-10 bg-slate-100 rounded-md border border-slate-200 mr-3 shrink-0 flex items-center justify-center">
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase">N/A</span>
                                                        </div>
                                                    )}
                                                    <span className="font-medium">{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="flex justify-between items-center border-t border-slate-100 pt-4 font-bold">
                                            <span className="text-slate-600">Total Paid <span className="text-sm font-normal bg-slate-100 px-2 py-0.5 rounded ml-2">{order.payment_method}</span></span>
                                            <span className="text-emerald-500 text-2xl">₹{order.total_price.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* QR Code Section */}
                                    {order.qr_code && order.status !== 'Completed' && (
                                        <div className="md:w-48 flex flex-col items-center justify-center bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Collection QR</p>
                                            <img src={`data:image/png;base64,${order.qr_code}`} alt="Collection QR Code" className="w-32 h-32 object-contain" />
                                            <p className="text-xs text-slate-400 mt-2 text-center">Show this at counter</p>
                                        </div>
                                    )}
                                    {order.qr_code && order.status === 'Completed' && (
                                        <div className="md:w-48 flex flex-col items-center justify-center bg-slate-50 p-4 rounded-xl border border-slate-200 shrink-0 opacity-50 grayscale">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">Collected</p>
                                            <img src={`data:image/png;base64,${order.qr_code}`} alt="Collected QR Code" className="w-32 h-32 object-contain" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
