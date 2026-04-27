import PageTransition from '../components/PageTransition';
import BadgeGallery from '../components/BadgeGallery';
import { Trophy, Award, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Achievements = () => {
    return (
        <PageTransition>
            <div className="p-6 space-y-10 max-w-5xl mx-auto h-full overflow-y-auto pb-20 relative overflow-hidden cyber-grid">
                <div className="scanline" />
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Zap className="text-secondary" size={20} fill="currentColor" />
                            <span className="text-[10px] font-black uppercase tracking-[4px] text-secondary">Hall of Fame</span>
                        </div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter text-white italic leading-none">Achievements</h1>
                        <p className="text-dark-muted font-bold tracking-widest text-xs uppercase mt-3">Cybernetic Achievements & Milestones</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <BadgeGallery />
                    </div>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-6 border-white/5 bg-gradient-to-br from-secondary/10 to-transparent"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <Award className="text-secondary-light" size={24} />
                                <h4 className="font-bold uppercase tracking-widest text-sm text-white">Pro Stats</h4>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-dark-muted">Rank</span>
                                    <span className="text-white">Elite Novice</span>
                                </div>
                                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-secondary h-full w-[45%]" />
                                </div>
                            </div>
                        </motion.div>

                        <div className="glass-card p-6 border-white/5">
                            <h4 className="font-bold uppercase tracking-widest text-[10px] text-dark-muted mb-4 uppercase">Coming Soon</h4>
                            <p className="text-[9px] text-dark-muted font-bold leading-relaxed uppercase">
                                Global Leaderboards & Clan Warfare modules initialize in v2.0
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Achievements;
