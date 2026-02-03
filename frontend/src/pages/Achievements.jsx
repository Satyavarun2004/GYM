import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Footprints, Dumbbell, Award, Lock, Zap, Star } from 'lucide-react';
import api from '../api/axios';
import PageTransition from '../components/PageTransition';

const BadgeIcon = ({ name, size = 24 }) => {
    switch (name) {
        case '10k Club': return <Footprints size={size} />;
        case 'Challenge Conqueror': return <Trophy size={size} />;
        case 'Lifting Legend': return <Dumbbell size={size} />;
        default: return <Award size={size} />;
    }
};

const Achievements = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    const allPossibleBadges = [
        { name: '10k Club', description: 'Walk total of 10,000 steps', icon: 'Footprints', hint: 'Keep walking!' },
        { name: 'Challenge Conqueror', description: 'Complete 5 fitness challenges', icon: 'Trophy', hint: 'Join more challenges' },
        { name: 'Lifting Legend', description: 'Lift 1,000kg total volume', icon: 'Dumbbell', hint: 'Hit the weights' }
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/api/users/profile');
            setUser(res.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const syncAchievements = async () => {
        setSyncing(true);
        try {
            const res = await api.put('/api/users/profile/achievements');
            if (res.data.badges && res.data.badges.length > 0) {
                // Celebration effect could be added here
                fetchProfile();
            }
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            setSyncing(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-white font-bold animate-pulse uppercase tracking-widest text-xs">Retaining glory...</div>;

    const ownedBadges = user?.badges || [];

    return (
        <PageTransition>
            <div className="p-6 space-y-10 max-w-5xl mx-auto h-full overflow-y-auto pb-20 relative overflow-hidden cyber-grid">
                <div className="scanline"></div>
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="text-secondary" size={20} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-secondary">Hall of Fame</span>
                        </div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter text-white italic leading-none">Achievements</h1>
                        <p className="text-dark-muted font-bold tracking-widest text-xs uppercase mt-3">Level: {user?.experience || 0} Professional</p>
                    </div>
                    <button
                        onClick={syncAchievements}
                        disabled={syncing}
                        className="btn-primary px-8 py-4 text-[10px] font-black uppercase tracking-[3px] shadow-glow-purple flex items-center gap-3 active:scale-95 transition-all"
                    >
                        <Star size={16} className={syncing ? 'animate-spin' : ''} />
                        {syncing ? 'Analyzing...' : 'Scan For New Medals'}
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="md:col-span-1 glass-card p-8 border-white/5 bg-gradient-to-b from-primary/10 to-transparent flex flex-col items-center justify-center text-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-dark-bg/50 border-4 border-primary/20 flex items-center justify-center mb-6 relative">
                            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-20" />
                            <Trophy size={48} className="text-primary-light" />
                        </div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tight mb-2">Elite Status</h3>
                        <p className="text-dark-muted text-[10px] font-medium uppercase tracking-[3px] mb-8">Current Standing</p>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="block text-[8px] font-black text-dark-muted uppercase mb-1">Earned</span>
                                <span className="text-xl font-black text-white">{ownedBadges.length}</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                <span className="block text-[8px] font-black text-dark-muted uppercase mb-1">Locked</span>
                                <span className="text-xl font-black text-white">{allPossibleBadges.length - ownedBadges.length}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Badge Grid */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {allPossibleBadges.map((badge, index) => {
                            const isOwned = ownedBadges.some(b => b.name === badge.name);
                            return (
                                <motion.div
                                    key={badge.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative glass-card p-6 border-white/5 group transition-all duration-500 ${isOwned ? 'hover:border-primary/40 bg-primary/5' : 'grayscale opacity-40'}`}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className={`p-4 rounded-2xl ${isOwned ? 'bg-primary/20 text-primary-light' : 'bg-white/5 text-dark-muted'} group-hover:scale-110 transition-transform`}>
                                            {isOwned ? <BadgeIcon name={badge.name} size={32} /> : <Lock size={32} />}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">{badge.name}</h4>
                                            <p className="text-[10px] text-dark-muted font-medium mb-4 leading-relaxed">{isOwned ? badge.description : `Locked: ${badge.hint}`}</p>

                                            {isOwned ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Achieved</span>
                                                </div>
                                            ) : (
                                                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                                    <div className="bg-white/10 h-full w-[20%]" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {isOwned && (
                                            <motion.div
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
                                            />
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}

                        {/* Secret Achievement Placeholder */}
                        <div className="glass-card p-6 border-white/5 opacity-20 border-dashed flex flex-col items-center justify-center text-center">
                            <Award size={24} className="text-dark-muted mb-2" />
                            <span className="text-[8px] font-black text-dark-muted uppercase tracking-widest">Discover Secret Achievements To Unlock More Slots</span>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Achievements;
