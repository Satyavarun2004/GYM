import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import CustomerDashboard from './CustomerDashboard';
import TrainerDashboard from './TrainerDashboard';
import PageTransition from '../../components/PageTransition';
import { Shield, ChevronLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminUserPerformance = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [targetUser, setTargetUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTargetUser = async () => {
            try {
                // Fetch the profile of the user we want to view
                const { data } = await api.get(`/users/profile?userId=${id}`);
                setTargetUser(data);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch target user', err);
                setError('User not found or access denied');
                setLoading(false);
            }
        };

        if (id) {
            fetchTargetUser();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-bold uppercase tracking-widest opacity-50 text-gradient">Securing Data Stream...</p>
                </div>
            </div>
        );
    }

    if (error || !targetUser) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-dark-bg p-6 text-center">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
                    <AlertCircle size={40} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                <p className="text-dark-muted mb-8 max-w-sm">{error || 'The requested performance profile is currently unavailable.'}</p>
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2"
                >
                    <ChevronLeft size={20} />
                    Back to Terminal
                </button>
            </div>
        );
    }

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary/10 p-6 rounded-[2rem] border border-primary/20 shadow-glow-purple/20">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tight">Performance Intelligence</h2>
                            <p className="text-primary-light text-xs font-bold uppercase tracking-widest">
                                Viewing {targetUser.name}'s Dashboard
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black uppercase text-dark-muted tracking-[0.2em] bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                            Read-Only Protocol
                        </span>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                        >
                            <ChevronLeft size={16} />
                            Exit View
                        </button>
                    </div>
                </div>

                {targetUser.role === 'trainer' ? (
                    <TrainerDashboard targetUserId={id} />
                ) : (
                    <CustomerDashboard targetUserId={id} />
                )}
            </div>
        </PageTransition>
    );
};

export default AdminUserPerformance;
