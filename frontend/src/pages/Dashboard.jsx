import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import TokenCard from '../components/TokenCard';

export default function Dashboard() {
    const { liveTokens } = useContext(SocketContext);

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-amber-50/40 via-orange-50/40 to-red-50/40 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-orange-100 max-w-2xl mx-auto">
                    <span className="text-5xl block mb-2 animate-bounce">📺</span>
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">Live Canteen Order Board</h1>
                    <p className="text-slate-500 font-medium mt-1">Keep an eye on your token number for instant pickup!</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 bg-white/95 rounded-3xl shadow-xl p-6 border-t-8 border-amber-500 border border-orange-100">
                        <h2 className="text-2xl font-black text-amber-600 mb-6 flex items-center gap-2 border-b border-amber-100 pb-3">
                            <span className="text-3xl animate-pulse">🍳</span> Preparing in Kitchen
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {liveTokens.Preparing.map(t => <TokenCard key={t} number={t} status="Preparing" />)}
                            {liveTokens.Preparing.length === 0 && (
                                <div className="col-span-full py-10 text-center bg-amber-50/40 rounded-2xl border border-dashed border-amber-200">
                                    <span className="text-3xl block mb-1">🔥</span>
                                    <p className="text-slate-500 font-bold">Kitchen is clear right now.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 bg-white/95 rounded-3xl shadow-xl p-6 border-t-8 border-emerald-500 border border-orange-100">
                        <h2 className="text-2xl font-black text-emerald-600 mb-6 flex items-center gap-2 border-b border-emerald-100 pb-3">
                            <span className="text-3xl animate-bounce">🎉</span> Ready for Pickup
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {liveTokens.Ready.map(t => <TokenCard key={t} number={t} status="Ready" />)}
                            {liveTokens.Ready.length === 0 && (
                                <div className="col-span-full py-10 text-center bg-emerald-50/40 rounded-2xl border border-dashed border-emerald-200">
                                    <span className="text-3xl block mb-1">🔔</span>
                                    <p className="text-slate-500 font-bold">No completed orders waiting.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}