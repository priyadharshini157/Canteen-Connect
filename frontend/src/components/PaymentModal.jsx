import { useState } from 'react';

export default function PaymentModal({ isOpen, onClose, onConfirm, totalAmount }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [method, setMethod] = useState('GPay');

    if (!isOpen) return null;

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            onConfirm(method);
        }, 1500);
    };

    // Generic UPI String (works for all UPI apps, but we style the UI differently)
    const upiString = `upi://pay?pa=priyadharshini.s3011@okicici&pn=Priyadharshini%20S&am=${totalAmount.toFixed(2)}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;

    const isUpi = method === 'GPay' || method === 'PhonePe';

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 text-white w-full max-w-md border border-slate-700 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-2xl font-bold text-center mb-6 pb-4 border-b border-slate-700">Complete Payment</h3>
                
                <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl mb-6 border border-slate-700">
                    <p className="text-slate-400 font-medium">Total Amount:</p>
                    <p className="text-3xl font-black text-emerald-400">₹{totalAmount.toFixed(2)}</p>
                </div>
                
                <div className="mb-6">
                    <label className="block text-slate-300 font-bold mb-2">Select Payment Method:</label>
                    <select 
                        value={method} 
                        onChange={e => setMethod(e.target.value)} 
                        className="w-full p-3 rounded-xl bg-slate-900 text-white border border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    >
                        <option value="GPay">Google Pay (UPI)</option>
                        <option value="PhonePe">PhonePe (UPI)</option>
                        <option value="Card">Credit/Debit Card</option>
                        <option value="Cash">Pay at Counter</option>
                    </select>
                </div>

                {isUpi && (
                    <div className={`text-center p-6 rounded-xl mb-6 border-2 transition-colors ${method === 'PhonePe' ? 'bg-[#5f259f] border-[#5f259f]' : 'bg-white border-slate-200'}`}>
                        <p className={`font-bold mb-4 text-xl ${method === 'PhonePe' ? 'text-white' : 'text-slate-800'}`}>
                            {method === 'PhonePe' ? 'Pay with PhonePe' : 'Pay with GPay'}
                        </p>
                        <div className="bg-white p-3 rounded-xl inline-block shadow-sm">
                            <img src={qrCodeUrl} alt="UPI QR Code" className="w-40 h-40 object-contain" />
                        </div>
                        <p className={`text-sm mt-4 font-medium ${method === 'PhonePe' ? 'text-purple-200' : 'text-slate-500'}`}>
                            Scan this exact QR code using your {method} app.
                        </p>
                    </div>
                )}

                {isProcessing ? (
                    <div className="text-center p-4 bg-blue-600 rounded-xl animate-pulse">
                        <p className="text-white font-bold text-lg">Verifying Payment via Bank...</p>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <button onClick={onClose} className="flex-1 py-3 px-4 rounded-xl border-2 border-rose-500 text-rose-500 font-bold hover:bg-rose-500 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button onClick={handlePayment} className="flex-[2] py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg transition-colors shadow-lg hover:shadow-emerald-500/30">
                            {isUpi ? 'I have Paid' : 'Pay Now'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
