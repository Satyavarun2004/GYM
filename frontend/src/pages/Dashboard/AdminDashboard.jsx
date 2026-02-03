import { motion } from 'framer-motion';
import { Users, Activity, Settings, Shield, AlertCircle, Trash2 } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useEffect, useState } from 'react';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/users');
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users', error);
            }
        };
        fetchUsers();
    }, []);

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (error) {
                alert('Failed to delete user');
            }
        }
    };

    return (
        <PageTransition>
            <div className="space-y-10 pb-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            <span className="text-white">Admin</span>
                            <span className="text-gradient">Panel</span>
                        </h1>
                        <p className="text-dark-muted mt-1 text-lg">System Overview & User Management</p>
                    </div>
                    <div className="flex items-center gap-3 bg-red-500/10 px-4 py-2 rounded-2xl border border-red-500/20">
                        <Shield size={20} className="text-red-400" />
                        <span className="text-sm font-medium text-red-200">
                            Administrator Access
                        </span>
                    </div>
                </header>

                {/* Admin Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-blue-400/10 text-blue-400">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-dark-muted text-sm font-bold uppercase">Total Users</p>
                            <h3 className="text-3xl font-bold text-white">{users.length}</h3>
                        </div>
                    </div>
                    {/* Placeholder Stats */}
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-green-400/10 text-green-400">
                            <Activity size={28} />
                        </div>
                        <div>
                            <p className="text-dark-muted text-sm font-bold uppercase">System Health</p>
                            <h3 className="text-3xl font-bold text-white">98%</h3>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-yellow-400/10 text-yellow-400">
                            <AlertCircle size={28} />
                        </div>
                        <div>
                            <p className="text-dark-muted text-sm font-bold uppercase">Pending Reports</p>
                            <h3 className="text-3xl font-bold text-white">0</h3>
                        </div>
                    </div>
                </div>

                {/* User Management Section */}
                <div className="glass-card p-8">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Settings size={20} className="text-primary-light" />
                        User Management
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-dark-muted text-xs uppercase tracking-wider border-b border-white/5">
                                    <th className="pb-3 px-4">Name</th>
                                    <th className="pb-3 px-4">Email</th>
                                    <th className="pb-3 px-4">Role</th>
                                    <th className="pb-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map(user => (
                                    <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-4 px-4 font-medium text-white">{user.name}</td>
                                        <td className="py-4 px-4 text-dark-muted">{user.email}</td>
                                        <td className="py-4 px-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${user.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                                                    user.role === 'trainer' ? 'bg-primary/10 text-primary-light' :
                                                        'bg-white/5 text-dark-muted'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                className="p-2 text-dark-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default AdminDashboard;
