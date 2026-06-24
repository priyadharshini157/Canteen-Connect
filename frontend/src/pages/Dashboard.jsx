import { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import TokenCard from '../components/TokenCard';

export default function Dashboard() {
    const { liveTokens } = useContext(SocketContext);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-4xl font-black text-slate-800 text-center mb-10 tracking-tight">Live Order Board</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border-t-8 border-amber-500">
                    <h2 className="text-2xl font-bold text-amber-500 mb-6 flex items-center gap-2">
                        <span className="animate-pulse">🍳</span> Preparing
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {liveTokens.Preparing.map(t => <TokenCard key={t} number={t} status="Preparing" />)}
                        {liveTokens.Preparing.length === 0 && <p className="text-slate-400 col-span-full">No orders preparing.</p>}
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border-t-8 border-emerald-500">
                    <h2 className="text-2xl font-bold text-emerald-500 mb-6 flex items-center gap-2">
                        <span>✅</span> Ready for Pickup
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {liveTokens.Ready.map(t => <TokenCard key={t} number={t} status="Ready" />)}
                        {liveTokens.Ready.length === 0 && <p className="text-slate-400 col-span-full">No orders ready.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}