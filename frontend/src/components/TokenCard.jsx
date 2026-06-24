export default function TokenCard({ number, status }) {
    const colorClass = status === 'Preparing' ? 'bg-amber-500' : 'bg-emerald-500';
    return (
        <div className={`${colorClass} text-white p-6 rounded-xl text-center text-3xl font-black shadow-md transform hover:scale-105 transition-transform duration-200`}>
            #{number}
        </div>
    );
}