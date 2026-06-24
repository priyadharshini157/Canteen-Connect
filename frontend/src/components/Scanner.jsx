import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../services/api';

export default function Scanner() {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const isScanningRef = useRef(false);

    useEffect(() => {
        let html5QrCode;

        if (!scanResult && !error) {
            html5QrCode = new Html5Qrcode("reader");
            isScanningRef.current = false;

            html5QrCode.start(
                { facingMode: "environment" }, // Force rear camera on mobile
                { fps: 10, qrbox: { width: 250, height: 250 } },
                async (decodedText) => {
                    // Success callback
                    if (isScanningRef.current) return; // Prevent double-scans
                    isScanningRef.current = true;
                    
                    // Stop camera immediately upon successful read
                    try {
                        await html5QrCode.stop();
                    } catch(e) { console.error(e); }

                    try {
                        const res = await api.post('/orders/verify_qr', { qr_token: decodedText });
                        setScanResult(res.data);
                        setError(null);
                    } catch (err) {
                        setError(err.response?.data?.detail || "Failed to verify QR code.");
                        setScanResult(null);
                    }
                },
                (errorMessage) => {
                    // Ignore ongoing background scan errors
                }
            ).catch(err => {
                console.error("Camera start error:", err);
                setError("Camera access denied or unavailable. Please check your browser permissions to allow camera access.");
            });
        }

        return () => {
            if (html5QrCode && html5QrCode.isScanning) {
                html5QrCode.stop().catch(console.error);
            }
        };
    }, [scanResult, error]);

    const resetScanner = () => {
        setScanResult(null);
        setError(null);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3 text-center">Collection Scanner</h3>
            
            {!scanResult && !error && (
                <div>
                    <p className="text-center text-sm text-slate-500 mb-4 animate-pulse">Requesting camera access...</p>
                    <div id="reader" className="w-full overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50 min-h-[250px]"></div>
                </div>
            )}

            {scanResult && (
                <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="text-emerald-500 mb-4 text-5xl">✅</div>
                    <h4 className="text-xl font-bold text-emerald-600 mb-2">{scanResult.message}</h4>
                    <p className="text-slate-700 font-bold text-lg mb-4">Token #{scanResult.token_number}</p>
                    <div className="text-left bg-white p-4 rounded-lg border border-emerald-100 mb-6">
                        <p className="text-slate-500 font-bold mb-2 uppercase text-xs tracking-wider">Items to hand over:</p>
                        <ul className="space-y-1">
                            {scanResult.items.map((item, idx) => (
                                <li key={idx} className="flex items-center text-slate-800 font-medium py-1.5 border-b border-emerald-50 last:border-0">
                                    <span className="font-bold text-slate-400 w-8 shrink-0">{item.quantity}x</span>
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-10 h-10 object-cover rounded shadow-sm mr-3 shrink-0" />
                                    ) : (
                                        <div className="w-10 h-10 bg-slate-100 rounded border border-slate-200 mr-3 shrink-0 flex items-center justify-center">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">N/A</span>
                                        </div>
                                    )}
                                    <span>{item.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button 
                        onClick={resetScanner}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-md"
                    >
                        Scan Next Order
                    </button>
                </div>
            )}

            {error && (
                <div className="text-center p-6 bg-rose-50 rounded-xl border border-rose-100">
                    <div className="text-rose-500 mb-4 text-5xl">❌</div>
                    <h4 className="text-xl font-bold text-rose-600 mb-4">{error}</h4>
                    <button 
                        onClick={resetScanner}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-colors shadow-md"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
}
