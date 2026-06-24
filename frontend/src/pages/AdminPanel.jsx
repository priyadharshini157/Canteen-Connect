import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { uploadImageToCloudinary } from '../utils/uploadImage';
import Scanner from '../components/Scanner';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminPanel() {
    const [orderId, setOrderId] = useState('');
    const [status, setStatus] = useState('Ready');
    const [analytics, setAnalytics] = useState({ 
        total_orders: 0, 
        total_revenue: 0, 
        revenue_by_date: [], 
        top_products: [], 
        category_sales: [] 
    });
    const [menuItems, setMenuItems] = useState([]);
    
    // New menu item form state
    const [newItemName, setNewItemName] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemCategory, setNewItemCategory] = useState('Lunch');
    const [newItemImageFile, setNewItemImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const fetchData = async () => {
        try {
            const [analyticsRes, menuRes] = await Promise.all([
                api.get('/orders/analytics'),
                api.get('/menu')
            ]);
            setAnalytics(analyticsRes.data);
            setMenuItems(menuRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateOrderStatus = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/orders/${orderId}/status?new_status=${status}`);
            alert('Status updated globally!');
            setOrderId('');
        } catch (error) {
            alert('Failed to update order status. Check Order ID.');
        }
    };

    const handleAddMenuItem = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        let imageUrl = null;
        
        if (newItemImageFile) {
            imageUrl = await uploadImageToCloudinary(newItemImageFile);
            if (!imageUrl) {
                setIsUploading(false);
                return; // Upload failed
            }
        }

        try {
            await api.post('/menu', {
                name: newItemName,
                price: parseFloat(newItemPrice),
                category: newItemCategory,
                image_url: imageUrl
            });
            alert('Menu item added!');
            setNewItemName('');
            setNewItemPrice('');
            setNewItemImageFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            fetchData();
        } catch (error) {
            alert('Failed to add menu item.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteMenuItem = async (itemName) => {
        if (!window.confirm(`Are you sure you want to delete ${itemName}?`)) return;
        try {
            await api.delete(`/menu/${itemName}`);
            alert('Menu item deleted!');
            fetchData();
        } catch (error) {
            alert('Failed to delete menu item.');
        }
    };

    const handleClearAllMenuItems = async () => {
        if (!window.confirm("WARNING: Are you sure you want to delete ALL menu items? This cannot be undone!")) return;
        try {
            await api.delete('/menu/clear_all');
            alert('All menu items cleared!');
            fetchData();
        } catch (error) {
            alert('Failed to clear menu items.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-3xl font-black text-slate-800 mb-8">Admin Dashboard</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-600 rounded-2xl p-6 shadow-lg text-white flex flex-col justify-center items-center transform hover:scale-105 transition-transform">
                    <h3 className="text-blue-100 font-bold text-lg uppercase tracking-wider mb-2">Total Orders</h3>
                    <p className="text-5xl font-black">{analytics.total_orders}</p>
                </div>
                <div className="bg-emerald-500 rounded-2xl p-6 shadow-lg text-white flex flex-col justify-center items-center transform hover:scale-105 transition-transform">
                    <h3 className="text-emerald-100 font-bold text-lg uppercase tracking-wider mb-2">Total Revenue</h3>
                    <p className="text-5xl font-black">₹{(analytics.total_revenue || 0).toFixed(2)}</p>
                </div>
            </div>

            {/* Analytics Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Revenue Line Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 h-96">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Revenue (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <LineChart data={analytics.revenue_by_date}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="date" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                            <YAxis tick={{fill: '#64748b'}} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                            <Tooltip 
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                formatter={(value) => [`₹${value.toFixed(2)}`, 'Revenue']}
                            />
                            <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', strokeWidth: 2}} activeDot={{r: 6}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Products Bar Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 h-96">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Top 5 Products</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={analytics.top_products} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" tick={{fill: '#64748b'}} axisLine={false} tickLine={false} />
                            <YAxis type="category" dataKey="name" tick={{fill: '#334155', fontWeight: 600}} axisLine={false} tickLine={false} width={100} />
                            <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                                {analytics.top_products?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Sales Pie Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 h-96 lg:col-span-2">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Sales by Category</h3>
                    <ResponsiveContainer width="100%" height="80%">
                        <PieChart>
                            <Pie
                                data={analytics.category_sales}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {analytics.category_sales?.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Update Order Status</h3>
                    <form onSubmit={handleUpdateOrderStatus} className="flex flex-col gap-4">
                        <input 
                            type="text" 
                            placeholder="MongoDB Order ID" 
                            value={orderId} 
                            onChange={e => setOrderId(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select 
                            value={status} 
                            onChange={e => setStatus(e.target.value)} 
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="Preparing">Preparing</option>
                            <option value="Ready">Ready</option>
                            <option value="Completed">Completed</option>
                        </select>
                        <button type="submit" className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-md mt-2">
                            Broadcast Status Update
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-3">Add Menu Item</h3>
                    <form onSubmit={handleAddMenuItem} className="flex flex-col gap-4">
                        <input 
                            type="text" 
                            placeholder="Item Name" 
                            value={newItemName} 
                            onChange={e => setNewItemName(e.target.value)} 
                            required 
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input 
                            type="number" 
                            placeholder="Price" 
                            value={newItemPrice} 
                            onChange={e => setNewItemPrice(e.target.value)} 
                            required 
                            step="0.01" 
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select 
                            value={newItemCategory} 
                            onChange={e => setNewItemCategory(e.target.value)} 
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Drinks">Drinks</option>
                        </select>
                        <input 
                            type="file" 
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={e => setNewItemImageFile(e.target.files[0])} 
                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <button type="submit" disabled={isUploading} className={`w-full py-3 text-white font-bold rounded-xl transition-colors shadow-md mt-2 ${isUploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {isUploading ? 'Uploading & Adding...' : 'Add Item'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                        <h3 className="text-xl font-bold text-slate-800">Manage Menu Items</h3>
                        <button 
                            onClick={handleClearAllMenuItems} 
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-sm"
                        >
                            Clear All Products
                        </button>
                    </div>
                    <ul className="flex flex-col gap-3">
                        {menuItems.map(item => (
                            <li key={item.name} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 transition-colors">
                                <span className="font-bold text-slate-700">{item.name} <span className="text-emerald-500 ml-2">₹{item.price.toFixed(2)}</span></span>
                                <button 
                                    onClick={() => handleDeleteMenuItem(item.name)} 
                                    className="px-4 py-2 bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white font-bold rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                        {menuItems.length === 0 && <p className="text-slate-500 text-center py-4">No menu items found.</p>}
                    </ul>
                </div>

                {/* Scanner Component */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 h-fit">
                    <Scanner />
                </div>
            </div>
        </div>
    );
}