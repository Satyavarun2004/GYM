import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Activity, Zap, Shield, Trophy,
    ChevronDown, BarChart3, Target, ZapIcon, X, Play,
    CheckCircle2, Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
    const [publicStats, setPublicStats] = useState({
        users: '12k',
        calories: '8.4M',
        sessions: '24.8k'
    });
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [showDemo, setShowDemo] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/activities/public-stats');
                setPublicStats(data);
            } catch (error) {
                console.error('Error fetching public stats:', error);
            }
        };
        fetchStats();
    }, []);

    const features = [
        {
            id: 'analytics',
            icon: BarChart3,
            title: 'Advanced Analytics',
            desc: 'Deep integration with your biometric data to provide the most accurate fitness forecasting available.',
            longDesc: 'Our proprietary PulseEngine transitions your raw workout data into actionable insights. It uses Fourier Transform logic to analyze rep rhythm and tempo, ensuring your "time under tension" is perfectly optimized for muscle hypertrophy.',
            color: 'blue'
        },
        {
            id: 'targeting',
            icon: Target,
            title: 'Precision Targeting',
            desc: 'Customized milestones designed to keep you motivated and consistently hitting personal records.',
            longDesc: 'Never hit a plateau again. Our targeting system uses linear regression to predict your next peak, setting micro-goals that are calibrated to be 5% more challenging than your previous best—the "sweet spot" for continuous neural adaptation.',
            color: 'purple'
        },
        {
            id: 'pro',
            icon: Shield,
            title: 'Professional Track',
            desc: 'Elite guidance and tracking tools used by athletes to maintain peak physiological condition.',
            longDesc: 'Access the same algorithms used by professional sports leagues. From HRV (Heart Rate Variability) monitoring to predictive fatigue analysis, we provide the tools needed to prevent overtraining while maximizing athletic volume.',
            color: 'pink'
        }
    ];

    return (
        <div className="min-h-screen bg-dark-bg text-white selection:bg-primary/30 overflow-x-hidden">
            {/* Modal for Features */}
            <AnimatePresence>
                {selectedFeature && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedFeature(null)}
                            className="absolute inset-0 bg-dark-bg/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl glass-card p-10 border-white/20 shadow-glow-purple overflow-hidden"
                        >
                            <div className={`absolute top-0 right-0 w-64 h-64 bg-${selectedFeature.color}-500/10 rounded-full -mr-32 -mt-32 blur-[80px]`} />

                            <button
                                onClick={() => setSelectedFeature(null)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="relative z-10">
                                <div className={`w-20 h-20 rounded-3xl bg-${selectedFeature.color}-500/20 flex items-center justify-center mb-8 border border-${selectedFeature.color}-500/30`}>
                                    <selectedFeature.icon size={40} className={`text-${selectedFeature.color}-400`} />
                                </div>
                                <h3 className="text-4xl font-black mb-6 uppercase italic tracking-tighter">{selectedFeature.title}</h3>
                                <p className="text-xl text-dark-text leading-relaxed mb-8">
                                    {selectedFeature.longDesc}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {['Real-time Sync', 'Biometric Logic', 'Pro-Grade API'].map(tag => (
                                        <span key={tag} className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-xs font-bold uppercase tracking-widest text-dark-muted flex items-center gap-2">
                                            <CheckCircle2 size={12} className={`text-${selectedFeature.color}-400`} /> {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal for Demo */}
            <AnimatePresence>
                {showDemo && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDemo(false)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-5xl aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-dark-bg shadow-2xl"
                        >
                            <button
                                onClick={() => setShowDemo(false)}
                                className="absolute top-8 right-8 z-50 p-3 rounded-full bg-black/50 hover:bg-white/10 transition-colors backdrop-blur-md"
                            >
                                <X size={24} />
                            </button>

                            {/* Mock Demo UI */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8"
                                >
                                    <Play fill="currentColor" size={40} />
                                </motion.div>
                                <h2 className="text-3xl font-black uppercase italic mb-4">Pulse Engine Demo</h2>
                                <p className="text-dark-muted max-w-md mb-8">Streaming high-fidelity telemetry from verified athlete node #x842...</p>

                                <div className="grid grid-cols-3 gap-8 w-full max-w-2xl">
                                    {[
                                        { l: 'Load', v: '85%' },
                                        { l: 'Tempo', v: '3s/Rep' },
                                        { l: 'Volume', v: '2,400kg' }
                                    ].map(m => (
                                        <div key={m.l} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="text-xs font-bold text-primary uppercase mb-2 tracking-widest">{m.l}</div>
                                            <div className="text-4xl font-black italic font-mono">{m.v}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <img
                                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
                                className="w-full h-full object-cover opacity-20"
                                alt="Demo Background"
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Immersive Hero Section */}
            <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Dynamic Background */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
                        alt="Gym Background"
                        className="w-full h-full object-cover opacity-40 scale-105 animate-float"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/40 via-dark-bg/60 to-dark-bg" />
                    <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-transparent to-transparent opacity-80" />
                </div>

                {/* Decorative Blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] animate-pulse delay-1000" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 py-2 px-5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8 group cursor-default"
                        >
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-light">The New Standard of Training</span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter mb-8 italic uppercase">
                            Evolution <br />
                            <span className="text-gradient">Starts Now</span>
                        </h1>

                        <p className="text-xl text-dark-muted max-w-lg mb-12 font-medium leading-relaxed">
                            Stop guessing. Gain total control. Our high-precision platform transforms your athletic potential into elite performance results.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link to="/register" className="btn-primary group">
                                <span className="flex items-center gap-3">
                                    Get Started Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <button
                                onClick={() => setShowDemo(true)}
                                className="px-8 py-4 rounded-2xl font-bold border border-white/10 hover:bg-white/5 transition-all flex items-center gap-3 group"
                            >
                                <Play size={20} className="group-hover:text-primary transition-colors" /> View Experience
                            </button>
                        </div>

                        {/* Social Proof */}
                        <div className="mt-16 flex items-center gap-6">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-12 h-12 rounded-full border-4 border-dark-bg" alt="" />
                                ))}
                            </div>
                            <div>
                                <div className="text-lg font-bold">12k+ Athletes</div>
                                <div className="text-sm text-dark-muted font-medium">Achieving goals daily</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Static Premium Showcase */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className="hidden lg:block relative perspective-1000"
                    >
                        <div className="glass-card p-4 border-white/15 relative overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop"
                                alt="Training"
                                className="rounded-2xl shadow-2xl brightness-75 group-hover:brightness-100 transition-all duration-700"
                            />

                            {/* Floating decorative elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-6 -left-6 glass-card p-6 border-white/10 shadow-glow-purple"
                            >
                                <Trophy className="text-primary mb-2" size={32} />
                                <div className="text-sm font-bold">Elite Certified</div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-6 -right-6 glass-card p-6 border-white/10 shadow-glow-pink"
                            >
                                <Zap className="text-secondary mb-2" size={32} />
                                <div className="text-sm font-bold">Peak Performance</div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-30 hover:opacity-100 transition-opacity">
                    <ChevronDown size={40} />
                </div>
            </header>

            {/* Core Experience Section */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6 italic">
                            The Fitness <br />
                            <span className="text-primary">Ecosystem</span>
                        </h2>
                        <p className="text-xl text-dark-muted font-medium italic underline decoration-primary/30 decoration-4 underline-offset-8">
                            Engineered for athletes who demand precision.
                        </p>
                    </div>
                    <Link to="/features" className="text-sm font-bold uppercase tracking-widest border-b-2 border-primary pb-2 flex items-center gap-2 hover:gap-4 transition-all">
                        Explore Full Architecture <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-10 group hover:bg-white/[0.08] transition-all duration-700 h-full flex flex-col justify-between cursor-pointer"
                            onClick={() => setSelectedFeature(item)}
                        >
                            <div>
                                <div className={`w-16 h-16 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center mb-8 border border-${item.color}-500/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                                    <item.icon size={32} className={`text-${item.color}-400`} />
                                </div>
                                <h3 className="text-2xl font-black mb-4 uppercase italic">{item.title}</h3>
                                <p className="text-dark-muted leading-relaxed font-medium">
                                    {item.desc}
                                </p>
                            </div>
                            <div className="mt-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-30 group-hover:opacity-100 transition-opacity">
                                <Info size={14} className={`text-${item.color}-400`} /> View Logic Analysis
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Performance Showcase */}
            <section className="py-20 relative px-6">
                <div className="max-w-7xl mx-auto bg-dark-card rounded-[4rem] overflow-hidden border border-white/5 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/90 to-transparent z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=1974&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                        alt=""
                    />

                    <div className="relative z-20 p-12 md:p-24 grid lg:grid-cols-2 items-center gap-20">
                        <div>
                            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic">
                                Break the <br />
                                <span className="text-gradient">Atmosphere</span>
                            </h2>
                            <p className="text-xl text-dark-muted mb-12 font-medium">
                                Joining FitPulse isn't just about gym access—it's about gaining an unfair advantage through real-time physiological insights.
                            </p>
                            <Link to="/register" className="btn-primary inline-block">
                                Claim User Invite
                            </Link>
                        </div>

                        <div className="space-y-8">
                            {[
                                { label: 'Active Sessions', val: publicStats.sessions },
                                { label: 'Cals Burned Registry', val: publicStats.calories },
                                { label: 'Verified Athlete Node', val: publicStats.users }
                            ].map((s) => (
                                <motion.div
                                    key={s.label}
                                    whileInView={{ x: [20, 0], opacity: [0, 1] }}
                                    className="flex items-center justify-between border-b border-white/5 pb-6"
                                >
                                    <div className="text-sm font-bold uppercase tracking-widest text-dark-muted">{s.label}</div>
                                    <div className="text-4xl font-black italic text-white font-mono">{s.val}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-3">
                        <ZapIcon size={32} fill="currentColor" className="text-primary" />
                        <span className="text-3xl font-black tracking-tighter uppercase italic">FitPulse Pro</span>
                    </div>

                    <div className="flex gap-12 text-sm font-bold uppercase tracking-[.2em] text-dark-muted">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Logic</a>
                        <a href="#" className="hover:text-white transition-colors">Support</a>
                    </div>

                    <div className="text-xs text-dark-muted font-bold opacity-30 uppercase tracking-widest">
                        © 2026 FitPulse Engine v4.0.2
                    </div>
                </div>
            </footer>

            {/* Global Animated Noise Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
        </div>
    );
};

export default Home;


