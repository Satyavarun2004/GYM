import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Medal, Trophy } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const { data } = await api.get('/users/leaderboard');
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch leaderboard', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    if (loading) return <div className="text-center p-10">Loading Leaderboard...</div>;

    const getRankStyle = (index) => {
        switch (index) {
            case 0: return 'text-yellow-400';
            case 1: return 'text-gray-400';
            case 2: return 'text-orange-400';
            default: return 'text-white';
        }
    };

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto relative overflow-hidden cyber-grid rounded-3xl p-8">
                <div className="scanline"></div>
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">
                        Tactical Rankings
                    </h1>
                    <p className="text-dark-muted font-bold tracking-widest text-[10px] uppercase mt-2">Global Performance Intelligence // Phase 2</p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white/5 text-left">
                                    <th className="p-4 text-dark-muted font-medium w-20 text-center">Rank</th>
                                    <th className="p-4 text-dark-muted font-medium">User</th>
                                    <th className="p-4 text-dark-muted font-medium text-right">Total Steps</th>
                                    <th className="p-4 text-dark-muted font-medium text-right">Badges</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr key={user._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-center">
                                            {index < 3 ? (
                                                <Medal className={`mx-auto ${getRankStyle(index)}`} size={24} />
                                            ) : (
                                                <span className="font-bold text-dark-muted">#{index + 1}</span>
                                            )}
                                        </td>
                                        <td className="p-4 font-medium flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-light to-secondary-light flex items-center justify-center text-xs font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            {user.name}
                                        </td>
                                        <td className="p-4 text-right font-bold text-primary-light">
                                            {user.stats.totalSteps.toLocaleString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Trophy size={16} className="text-yellow-500" />
                                                <span>{user.badges.length}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default Leaderboard;
