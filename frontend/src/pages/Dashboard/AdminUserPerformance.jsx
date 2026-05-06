import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../api/axios';
import CustomerDashboard from './CustomerDashboard';
import TrainerDashboard from './TrainerDashboard';
import PageTransition from '../../components/PageTransition';
import { ChevronLeft, Loader2 } from 'lucide-react';

const AdminUserPerformance = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [targetUser, setTargetUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTargetUser = async () => {
            try {
                // Fetch the profile of the target user to know their role
                const { data } = await api.get(`/users/profile?userId=${id}`);
                setTargetUser(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching target user performance', err);
                setError('Failed to load user data');
                setLoading(false);
            }
        };

        fetchTargetUser();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="text-primary animate-spin" />
                    <p className="text-dark-muted animate-pulse">Loading Performance Data...</p>
                </div>
            </div>
        );
    }

    if (error || !targetUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
                <div className="text-center space-y-4">
                    <p className="text-red-400 font-bold">{error || 'User not found'}</p>
                    <button onClick={() => navigate('/dashboard')} className="btn-secondary">Back to Admin Panel</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-bg">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <button 
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-dark-muted hover:text-white transition-colors mb-6 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Admin Dashboard
                </button>

                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-white">
                        Viewing Performance: <span className="text-gradient">{targetUser.name}</span>
                    </h2>
                    <p className="text-dark-muted text-sm uppercase tracking-widest font-bold">Role: {targetUser.role}</p>
                </div>

                {targetUser.role === 'trainer' ? (
                    <TrainerDashboard targetUserId={id} />
                ) : (
                    <CustomerDashboard targetUserId={id} />
                )}
            </div>
        </div>
    );
};

export default AdminUserPerformance;
