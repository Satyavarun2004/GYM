import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion } from 'framer-motion';
import { Trophy, Users, Clock, ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageTransition from '../../components/PageTransition';

const ChallengeList = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const { data } = await api.get('/challenges');
                setChallenges(data);
            } catch (error) {
                console.error('Failed to fetch challenges', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChallenges();
    }, []);

    const handleJoin = async (id) => {
        try {
            await api.put(`/challenges/${id}/join`);
            // Refresh list or show success toast
            alert('Joined successfully!');
            // Optimistically update UI or refetch
            const { data } = await api.get('/challenges');
            setChallenges(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to join');
        }
    };

    if (loading) return <div className="text-center p-10">Loading Challenges...</div>;

    return (
        <PageTransition>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Challenges</h1>
                        <p className="text-dark-muted">Push yourself and compete with others.</p>
                    </div>
                    <Link to="/challenges/create" className="btn-primary flex items-center gap-2">
                        <Plus size={20} />
                        Create Challenge
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.map((challenge, index) => (
                        <motion.div
                            key={challenge._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card p-6 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-primary/20 text-primary-light rounded-xl">
                                        <Trophy size={24} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10`}>
                                        {challenge.type}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                                <p className="text-dark-muted text-sm mb-4 line-clamp-2">{challenge.description}</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-dark-muted">
                                        <Users size={16} />
                                        <span>{challenge.participants.length} Participants</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-dark-muted">
                                        <Clock size={16} />
                                        <span>{challenge.durationDays} Days</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => handleJoin(challenge._id)}
                                className="w-full py-2 rounded-lg border border-primary-light text-primary-light hover:bg-primary-light hover:text-white transition-all duration-300 font-medium"
                            >
                                Join Challenge
                            </button>
                        </motion.div>
                    ))}

                    {challenges.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white/5 rounded-xl border border-dashed border-white/10">
                            <Trophy size={48} className="mx-auto text-dark-muted mb-4 opacity-50" />
                            <h3 className="text-xl font-bold text-dark-muted">No Active Challenges</h3>
                            <p className="text-dark-muted mt-2">Be the first to create one!</p>
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default ChallengeList;
