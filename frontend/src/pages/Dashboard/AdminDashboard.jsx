import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Activity, Settings, Shield, AlertCircle, Trash2, LogOut, BarChart2, Award } from 'lucide-react';
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
    const [performanceTab, setPerformanceTab] = useState('members');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get('/users');
                setUsers(data);
                const pendingData = await api.get('/users/pending');
                setPendingUsers(pendingData.data);
                
                const perfData = await api.get('/users/admin/performances');
                setPerformances(perfData.data);
            } catch (error) {
                console.error('Error fetching admin data', error);
            }
        };
        fetchData();
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

    const handleApproveUser = async (id) => {
        try {
            await api.put(`/users/approve/${id}`);
            const approvedUser = pendingUsers.find(u => u._id === id);
            setPendingUsers(pendingUsers.filter(user => user._id !== id));
            if (approvedUser) {
                approvedUser.status = 'active';
                setUsers([...users, approvedUser]);
            }
            alert('User approved and email sent successfully!');
        } catch (error) {
            console.error(error);
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
                        <p className="text-dark-muted mt-1 text-lg">System Overview & User Management</p>
                    </div>
                    <div className="flex items-center gap-3 bg-red-500/10 px-4 py-2 rounded-2xl border border-red-500/20">
                        <Shield size={20} className="text-red-400" />
                        <span className="text-sm font-medium text-red-200">
                            Administrator Access
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10 transition-all"
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
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
                            <p className="text-dark-muted text-sm font-bold uppercase">Pending Approvals</p>
                            <h3 className="text-3xl font-bold text-white">{pendingUsers.length}</h3>
                        </div>
                    </div>
                </div>

                {/* Pending Users Section */}
                {pendingUsers.length > 0 && (
                    <div className="glass-card p-8">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <AlertCircle size={20} className="text-yellow-400" />
                            Pending Approvals
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-dark-muted text-xs uppercase tracking-wider border-b border-white/5">
                                        <th className="pb-3 px-4">Name</th>
                                        <th className="pb-3 px-4">Email</th>
                                        <th className="pb-3 px-4">Duration</th>
                                        <th className="pb-3 px-4">Fee Paid</th>
                                        <th className="pb-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {pendingUsers.map(user => (
                                        <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4 font-medium text-white">{user.name}</td>
                                            <td className="py-4 px-4 text-dark-muted">{user.email}</td>
                                            <td className="py-4 px-4 text-white">{user.membershipDuration} Month(s)</td>
                                            <td className="py-4 px-4 text-green-400 font-bold">₹{user.feePaid}</td>
                                            <td className="py-4 px-4 text-right">
                                                <button
                                                    onClick={() => handleApproveUser(user._id)}
                                                    className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-sm font-bold transition-all"
                                                >
                                                    Approve
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

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

                {/* System Performances Section */}
                <div className="glass-card p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <BarChart2 size={20} className="text-primary-light" />
                            System Performances
                        </h3>
                        
                        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                            <button
                                onClick={() => setPerformanceTab('members')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                    performanceTab === 'members'
                                        ? 'bg-primary/20 text-white border border-primary/20 shadow-glow-purple'
                                        : 'text-dark-muted hover:text-white'
                                }`}
                            >
                                Members
                            </button>
                            <button
                                onClick={() => setPerformanceTab('trainers')}
                                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                    performanceTab === 'trainers'
                                        ? 'bg-primary/20 text-white border border-primary/20 shadow-glow-purple'
                                        : 'text-dark-muted hover:text-white'
                                }`}
                            >
                                Trainers
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {performanceTab === 'members' ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-dark-muted text-xs uppercase tracking-wider border-b border-white/5">
                                        <th className="pb-3 px-4">Member</th>
                                        <th className="pb-3 px-4">BMI</th>
                                        <th className="pb-3 px-4">Total Steps</th>
                                        <th className="pb-3 px-4">Challenges</th>
                                        <th className="pb-3 px-4">Streak</th>
                                        <th className="pb-3 px-4">Motivation</th>
                                        <th className="pb-3 px-4 text-right">Performance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {performances.members.map(member => (
                                        <tr key={member._id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4">
                                                <p className="font-medium text-white">{member.name}</p>
                                                <p className="text-xs text-dark-muted">{member.email}</p>
                                            </td>
                                            <td className="py-4 px-4 text-dark-muted">{member.bmi || 'N/A'}</td>
                                            <td className="py-4 px-4 text-primary-light font-bold">{member.stats?.totalSteps?.toLocaleString() || 0}</td>
                                            <td className="py-4 px-4 text-white">{member.stats?.challengesCompleted || 0}</td>
                                            <td className="py-4 px-4 text-orange-400 font-bold">{member.stats?.currentStreak || 0} 🔥</td>
                                            <td className="py-4 px-4">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                                                    member.stats?.motivationStatus === 'Consistent' ? 'bg-green-500/10 text-green-400' :
                                                    member.stats?.motivationStatus === 'At Risk' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    member.stats?.motivationStatus === 'Inactive' ? 'bg-red-500/10 text-red-400' :
                                                    'bg-white/5 text-dark-muted'
                                                }`}>
                                                    {member.stats?.motivationStatus || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button 
                                                    onClick={() => navigate(`/admin/user-performance/${member._id}`)}
                                                    className="px-3 py-1.5 bg-primary/10 text-primary-light hover:bg-primary/20 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {performances.members.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="py-8 text-center text-dark-muted">No active members found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-dark-muted text-xs uppercase tracking-wider border-b border-white/5">
                                        <th className="pb-3 px-4">Trainer</th>
                                        <th className="pb-3 px-4">Experience</th>
                                        <th className="pb-3 px-4 text-right">Assigned Members</th>
                                        <th className="pb-3 px-4 text-right">Performance</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {performances.trainers.map(trainer => (
                                        <tr key={trainer._id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-4">
                                                <p className="font-medium text-white flex items-center gap-2">
                                                    <Award size={16} className="text-primary-light" />
                                                    {trainer.name}
                                                </p>
                                                <p className="text-xs text-dark-muted">{trainer.email}</p>
                                            </td>
                                            <td className="py-4 px-4 text-white">{trainer.experience || 0} Years</td>
                                            <td className="py-4 px-4 text-right">
                                                <span className="text-lg font-bold text-primary-light bg-primary/10 px-3 py-1 rounded-xl">
                                                    {trainer.memberCount}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <button 
                                                    onClick={() => navigate(`/admin/user-performance/${trainer._id}`)}
                                                    className="px-3 py-1.5 bg-primary/10 text-primary-light hover:bg-primary/20 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {performances.trainers.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="py-8 text-center text-dark-muted">No active trainers found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

            </div>
        </PageTransition>
    );
};

export default AdminDashboard;
