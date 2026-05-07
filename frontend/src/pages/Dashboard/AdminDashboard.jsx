import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Activity, Settings, Shield, AlertCircle, Trash2, LogOut, Award, BarChart3, CheckCircle2, XCircle, Clock } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [performances, setPerformances] = useState({ members: [], trainers: [] });
    const [activeMainTab, setActiveMainTab] = useState('management'); // management, performances, approvals
    const [performanceTab, setPerformanceTab] = useState('members'); // members, trainers
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [usersRes, perfRes, pendingRes] = await Promise.all([
                api.get('/users'),
                api.get('/users/admin/performances'),
                api.get('/users/pending')
            ]);
            setUsers(usersRes.data);
            setPerformances(perfRes.data);
            setPendingUsers(pendingRes.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching admin data', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
                setPendingUsers(pendingUsers.filter(user => user._id !== id));
            } catch (error) {
                alert('Failed to delete user');
            }
        }
    };

    const handleApproveUser = async (id) => {
        try {
            await api.put(`/users/${id}/approve`);
            // Refresh data
            fetchData();
            alert('User approved successfully');
        } catch (error) {
            alert('Failed to approve user');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
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
                        <p className="text-dark-muted mt-1 text-lg">System Overview & Gatekeeper Terminal</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-red-500/10 px-4 py-2 rounded-2xl border border-red-500/20">
                            <Shield size={20} className="text-red-400" />
                            <span className="text-sm font-medium text-red-200">
                                Administrator
                            </span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10 transition-all"
                            title="Sign Out"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Main Tabs */}
                <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5 overflow-x-auto max-w-full">
                    <button
                        onClick={() => setActiveMainTab('management')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeMainTab === 'management' ? 'bg-primary text-white shadow-glow-purple' : 'text-dark-muted hover:text-white'}`}
                    >
                        <Settings size={18} />
                        User Management
                    </button>
                    <button
                        onClick={() => setActiveMainTab('performances')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeMainTab === 'performances' ? 'bg-primary text-white shadow-glow-purple' : 'text-dark-muted hover:text-white'}`}
                    >
                        <BarChart3 size={18} />
                        System Performances
                    </button>
                    <button
                        onClick={() => setActiveMainTab('approvals')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 relative whitespace-nowrap ${activeMainTab === 'approvals' ? 'bg-primary text-white shadow-glow-purple' : 'text-dark-muted hover:text-white'}`}
                    >
                        <Clock size={18} />
                        Pending Approvals
                        {pendingUsers.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-dark-bg animate-pulse">
                                {pendingUsers.length}
                            </span>
                        )}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {activeMainTab === 'management' && (
                        <motion.div
                            key="management"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="glass-card p-6 flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-blue-400/10 text-blue-400">
                                        <Users size={28} />
                                    </div>
                                    <div>
                                        <p className="text-dark-muted text-sm font-bold uppercase tracking-wider">Total Users</p>
                                        <h3 className="text-3xl font-bold text-white">{users.length}</h3>
                                    </div>
                                </div>
                                <div className="glass-card p-6 flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-green-400/10 text-green-400">
                                        <Activity size={28} />
                                    </div>
                                    <div>
                                        <p className="text-dark-muted text-sm font-bold uppercase tracking-wider">Active Today</p>
                                        <h3 className="text-3xl font-bold text-white">{Math.floor(users.length * 0.8)}</h3>
                                    </div>
                                </div>
                                <div className="glass-card p-6 flex items-center gap-4">
                                    <div className="p-4 rounded-2xl bg-primary/10 text-primary-light">
                                        <Award size={28} />
                                    </div>
                                    <div>
                                        <p className="text-dark-muted text-sm font-bold uppercase tracking-wider">Approved Members</p>
                                        <h3 className="text-3xl font-bold text-white">{users.filter(u => u.isApproved).length}</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card p-8 border-white/5 relative overflow-hidden">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Users size={20} className="text-primary-light" />
                                        User Registry
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-dark-muted text-xs uppercase tracking-wider border-b border-white/5">
                                                <th className="pb-3 px-4">Identifier</th>
                                                <th className="pb-3 px-4">Contact</th>
                                                <th className="pb-3 px-4">Status</th>
                                                <th className="pb-3 px-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {users.map(user => (
                                                <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <p className="font-medium text-white">{user.name}</p>
                                                        <p className="text-[10px] text-dark-muted">ID: {user._id.substring(0, 8)}...</p>
                                                    </td>
                                                    <td className="py-4 px-4 text-dark-muted text-sm">{user.email}</td>
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded-md ${user.role === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                                user.role === 'trainer' ? 'bg-primary/10 text-primary-light border border-primary/20' :
                                                                    'bg-white/5 text-dark-muted border border-white/10'
                                                                }`}>
                                                                {user.role}
                                                            </span>
                                                            {!user.isApproved && (
                                                                <span className="text-[8px] font-black uppercase bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-md animate-pulse">
                                                                    Pending
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button 
                                                                onClick={() => navigate(`/admin/user-performance/${user._id}`)}
                                                                className="p-2 text-primary-light hover:bg-primary/10 rounded-lg transition-all"
                                                                title="View Performance"
                                                            >
                                                                <BarChart3 size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteUser(user._id)}
                                                                className="p-2 text-dark-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                                title="Revoke Access"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeMainTab === 'performances' && (
                        <motion.div
                            key="performances"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Sub Tabs */}
                            <div className="flex gap-8 border-b border-white/5 mb-6">
                                <button
                                    onClick={() => setPerformanceTab('members')}
                                    className={`pb-4 text-sm font-bold transition-all relative ${performanceTab === 'members' ? 'text-primary-light' : 'text-dark-muted hover:text-white'}`}
                                >
                                    Member Performances
                                    {performanceTab === 'members' && <motion.div layoutId="perfTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-glow-purple" />}
                                </button>
                                <button
                                    onClick={() => setPerformanceTab('trainers')}
                                    className={`pb-4 text-sm font-bold transition-all relative ${performanceTab === 'trainers' ? 'text-primary-light' : 'text-dark-muted hover:text-white'}`}
                                >
                                    Trainer Assignment Analytics
                                    {performanceTab === 'trainers' && <motion.div layoutId="perfTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-primary shadow-glow-purple" />}
                                </button>
                            </div>

                            <div className="glass-card p-8 border-white/5">
                                {performanceTab === 'members' ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-dark-muted text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                                                    <th className="pb-3 px-4">Member</th>
                                                    <th className="pb-3 px-4">BMI</th>
                                                    <th className="pb-3 px-4">Total Steps</th>
                                                    <th className="pb-3 px-4">Challenges</th>
                                                    <th className="pb-3 px-4">Streak</th>
                                                    <th className="pb-3 px-4 text-right">Performance</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {performances.members.map(member => (
                                                    <tr key={member._id} className="group hover:bg-white/5 transition-colors">
                                                        <td className="py-4 px-4 text-sm font-bold text-white">{member.name}</td>
                                                        <td className="py-4 px-4 text-sm text-dark-muted">{member.bmi || 'N/A'}</td>
                                                        <td className="py-4 px-4 text-sm text-primary-light font-bold">{member.stats?.totalSteps?.toLocaleString() || 0}</td>
                                                        <td className="py-4 px-4 text-sm text-white">{member.stats?.challengesCompleted || 0}</td>
                                                        <td className="py-4 px-4 text-sm text-orange-400 font-bold">{member.stats?.currentStreak || 0} 🔥</td>
                                                        <td className="py-4 px-4 text-right">
                                                            <button 
                                                                onClick={() => navigate(`/admin/user-performance/${member._id}`)}
                                                                className="px-3 py-1.5 bg-primary/10 text-primary-light hover:bg-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                                            >
                                                                View Dashboard
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-dark-muted text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                                                    <th className="pb-3 px-4">Trainer Name</th>
                                                    <th className="pb-3 px-4">Experience</th>
                                                    <th className="pb-3 px-4 text-right">Assigned Members</th>
                                                    <th className="pb-3 px-4 text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {performances.trainers.map(trainer => (
                                                    <tr key={trainer._id} className="group hover:bg-white/5 transition-colors">
                                                        <td className="py-4 px-4">
                                                            <p className="font-bold text-white text-sm flex items-center gap-2">
                                                                <Award size={16} className="text-primary-light" />
                                                                {trainer.name}
                                                            </p>
                                                        </td>
                                                        <td className="py-4 px-4 text-sm text-white">{trainer.experience || 0} Years</td>
                                                        <td className="py-4 px-4 text-right">
                                                            <span className="text-lg font-black text-primary-light bg-primary/10 px-3 py-1 rounded-xl border border-primary/20">
                                                                {trainer.memberCount}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <button 
                                                                onClick={() => navigate(`/admin/user-performance/${trainer._id}`)}
                                                                className="px-3 py-1.5 bg-primary/10 text-primary-light hover:bg-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                                                            >
                                                                View Stats
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeMainTab === 'approvals' && (
                        <motion.div
                            key="approvals"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="glass-card p-8 border-white/5">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Clock size={20} className="text-orange-400" />
                                        Pending Gatekeeper Requests
                                    </h3>
                                    <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-black text-dark-muted uppercase tracking-widest border border-white/5">
                                        {pendingUsers.length} Users Waiting
                                    </span>
                                </div>

                                {pendingUsers.length === 0 ? (
                                    <div className="text-center py-20">
                                        <CheckCircle2 size={48} className="mx-auto mb-4 text-green-500 opacity-20" />
                                        <p className="text-dark-muted font-bold uppercase tracking-widest text-sm">All users have been processed</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="text-dark-muted text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                                                    <th className="pb-3 px-4">Applicant</th>
                                                    <th className="pb-3 px-4">Role</th>
                                                    <th className="pb-3 px-4">Applied At</th>
                                                    <th className="pb-3 px-4 text-right">Decision</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {pendingUsers.map(user => (
                                                    <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                                                        <td className="py-4 px-4">
                                                            <p className="font-bold text-white text-sm">{user.name}</p>
                                                            <p className="text-xs text-dark-muted">{user.email}</p>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className="text-[10px] font-black uppercase bg-white/5 text-dark-muted border border-white/10 px-2 py-1 rounded-md">
                                                                {user.role}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-sm text-dark-muted">
                                                            {new Date(user.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="py-4 px-4 text-right">
                                                            <div className="flex justify-end gap-3">
                                                                <button
                                                                    onClick={() => handleApproveUser(user._id)}
                                                                    className="p-2 text-green-400 hover:bg-green-400/10 rounded-xl transition-all"
                                                                    title="Grant Access"
                                                                >
                                                                    <CheckCircle2 size={24} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteUser(user._id)}
                                                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                                                                    title="Deny Access"
                                                                >
                                                                    <XCircle size={24} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PageTransition>
    );
};

export default AdminDashboard;
