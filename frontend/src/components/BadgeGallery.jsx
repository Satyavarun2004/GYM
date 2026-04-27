import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Dumbbell, Scan, Star, Lock } from 'lucide-react';

const iconMap = {
    Trophy: Trophy,
    Zap: Zap,
    Dumbbell: Dumbbell,
    Scan: Scan,
    Star: Star
};

const BadgeGallery = () => {
    const [allBadges, setAllBadges] = useState([]);
    const [myBadges, setMyBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allRes, myRes] = await Promise.all([
                    api.get('/badges'),
                    api.get('/badges/my')
                ]);
                setAllBadges(allRes.data);
                setMyBadges(myRes.data);
            } catch (error) {
                console.error('Failed to fetch badges:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="animate-pulse text-dark-muted font-black tracking-widest text-xs uppercase">Syncing Achievements...</div>;

    const isEarned = (badgeId) => myBadges.some(b => b.badge._id === badgeId);

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {allBadges.map((badge) => {
                const earned = isEarned(badge._id);
                const IconComponent = iconMap[badge.icon] || Star;

                return (
                    <motion.div
                        key={badge._id}
                        whileHover={earned ? { scale: 1.05 } : {}}
                        className={`relative group p-4 rounded-2xl border transition-all duration-500 flex flex-col items-center text-center ${earned
                            ? 'bg-gradient-to-br from-primary/20 to-secondary/10 border-white/10 shadow-glow-purple'
                            : 'bg-white/5 border-white/5 grayscale pointer-events-none'
                            }`}
                    >
                        {!earned && (
                            <div className="absolute top-2 right-2 text-dark-muted">
                                <Lock size={12} />
                            </div>
                        )}

                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${earned ? 'bg-primary/30 text-primary-light animate-float' : 'bg-white/5 text-dark-muted'
                            }`}>
                            <IconComponent size={24} />
                        </div>

                        <h5 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${earned ? 'text-white' : 'text-dark-muted'
                            }`}>
                            {badge.name}
                        </h5>

                        <p className="text-[8px] text-dark-muted font-bold uppercase tracking-tighter line-clamp-2">
                            {earned ? badge.description : `Req: ${badge.requirement}`}
                        </p>

                        {earned && (
                            <div className="mt-3 py-1 px-2 rounded-full bg-primary/20 border border-primary/30">
                                <span className="text-[8px] font-black text-primary-light text-white">+{badge.points} XP</span>
                            </div>
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default BadgeGallery;
