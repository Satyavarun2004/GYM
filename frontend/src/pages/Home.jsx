import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Activity, Zap, Shield, Trophy,
    ChevronDown, BarChart3, Target, ZapIcon, X, Play,
    CheckCircle2, Info
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CursorAura = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const springX = useSpring(mousePos.x - 150, { stiffness: 50, damping: 20 });
    const springY = useSpring(mousePos.y - 150, { stiffness: 50, damping: 20 });

    return (
        <motion.div
            style={{ x: springX, y: springY }}
            className="fixed pointer-events-none z-[1] w-[300px] h-[300px] rounded-full bg-primary/20 aura-glow"
        />
    );
};

const PulseCard = ({ feature, index, onClick }) => {
    const cardRef = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        setRotateX((y - centerY) / 8);
        setRotateY((centerX - x) / 8);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: 1000,
                rotateX: useSpring(rotateX),
                rotateY: useSpring(rotateY)
            }}
            className="glass-card p-10 group hover:bg-white/[0.08] transition-all duration-700 h-full flex flex-col justify-between cursor-pointer border-white/5"
            onClick={() => onClick(feature)}
        >
            <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center mb-8 border border-${feature.color}-500/20 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                    <feature.icon size={32} className={`text-${feature.color}-400`} />
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase italic tracking-tighter">{feature.title}</h3>
                <p className="text-dark-muted leading-relaxed font-bold text-xs uppercase tracking-widest">
                    {feature.desc}
                </p>
            </div>
            <div className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 group-hover:opacity-100 transition-opacity">
                <Info size={14} className={`text-${feature.color}-400`} /> View Bio-Logic Analysis
            </div>
        </motion.div>
    );
};

const Home = () => {
    const [publicStats, setPublicStats] = useState({ users: '12k', calories: '8.4M', sessions: '24.8k' });
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [showDemo, setShowDemo] = useState(false);
    const [demoStep, setDemoStep] = useState(0);

    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 1000], [0, 400]);
    const textY = useTransform(scrollY, [0, 500], [0, -100]);
    const opacityHero = useTransform(scrollY, [0, 400], [1, 0]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/activities/public-stats`);
                setPublicStats(data);
            } catch (error) {
                console.error('Error fetching public stats:', error);
            }
        };
        fetchStats();
    }, []);

    useEffect(() => {
        let interval;
        if (showDemo) {
            interval = setInterval(() => {
                setDemoStep(prev => (prev + 1) % 8);
            }, 4000);
        }
        return () => clearInterval(interval);
    }, [showDemo]);

    const demoSteps = [
        {
            title: "Vision AI 2.0",
            subtitle: "Autonomous Form Correction",
            desc: "Real-time skeletal tracking and voice coaching to ensure 100% rep accuracy.",
            image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
            stats: [["Precision", "99.8%"], ["Neural Lag", "12ms"]]
        },
        {
            title: "AI Meal Scanner",
            subtitle: "Visual Nutrition Intel",
            desc: "Instant caloric and macro-nutrient breakdown using high-fidelity computer vision.",
            image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070&auto=format&fit=crop",
            stats: [["Object ID", "Detected"], ["Confidence", "96%"]]
        },
        {
            title: "Voice Coaching",
            subtitle: "Neural Motivation Stream",
            desc: "AI-driven audio cues and real-time form adjustments based on your performance delta.",
            image: "https://images.unsplash.com/photo-1543975177-800494543b8a?q=80&w=2072&auto=format&fit=crop",
            stats: [["Latency", "8ms"], ["Sync Level", "Elite"]]
        },
        {
            title: "Biometric Sync",
            subtitle: "Total Physiological Clarity",
            desc: "Synchronize heart rate and sleep quality to calculate your daily Recovery Score.",
            image: "https://images.unsplash.com/photo-1557333610-90ee4a951ecf?q=80&w=2070&auto=format&fit=crop",
            stats: [["HR Monitor", "Active"], ["HRV Delta", "+15%"]]
        },
        {
            title: "Cyber Badges",
            subtitle: "Relational Reward Logic",
            desc: "Earn high-value XP and digital ornaments by hitting protocol-specific milestones.",
            image: "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?q=80&w=2070&auto=format&fit=crop",
            stats: [["XP Gain", "Boosted"], ["Rank", "Node-Elite"]]
        },
        {
            title: "Neural Analytics",
            subtitle: "Predictive PR Modeling",
            desc: "Advanced linear regression models forecast your next personal record with precision.",
            image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop",
            stats: [["PR Forecast", "145kg"], ["Confidence", "94%"]]
        },
        {
            title: "3D Evolution",
            subtitle: "Physical Mesh Analysis",
            desc: "High-density 3D scanning to visualize muscle hypertrophy and fat-loss deltas.",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
            stats: [["Mesh Density", "High"], ["Scan Complete", "100%"]]
        },
        {
            title: "Global Social Floor",
            subtitle: "Live Sync Training",
            desc: "Train with peers globally in real-time with synchronized set and rep logging.",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
            stats: [["Active Peers", "842"], ["Global Sync", "Stable"]]
        }
    ];

    const features = [
        {
            id: 'analytics',
            icon: BarChart3,
            title: 'Neural Analytics',
            desc: 'Real-time biometric telemetry and athletic forecasting.',
            longDesc: 'Our proprietary PulseEngine transitions your raw workout data into actionable insights. It uses Fourier Transform logic to analyze rep rhythm and tempo, ensuring your "time under tension" is perfectly optimized for muscle hypertrophy.',
            color: 'blue'
        },
        {
            id: 'targeting',
            icon: Target,
            title: 'Precision Lock',
            desc: 'Linear regression milestones for continuous adaptation.',
            longDesc: 'Never hit a plateau again. Our targeting system uses linear regression to predict your next peak, setting micro-goals that are calibrated to be 5% more challenging than your previous best—the "sweet spot" for continuous neural adaptation.',
            color: 'purple'
        },
        {
            id: 'pro',
            icon: Shield,
            title: 'Pro-Protocol',
            desc: 'Elite guidance tools used by professional athletes.',
            longDesc: 'Access the same algorithms used by professional sports leagues. From HRV (Heart Rate Variability) monitoring to predictive fatigue analysis, we provide the tools needed to prevent overtraining while maximizing athletic volume.',
            color: 'pink'
        }
    ];

    return (
        <div className="min-h-screen bg-dark-bg text-white selection:bg-primary/30 overflow-x-hidden">
            <CursorAura />

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
                                <p className="text-sm text-dark-text leading-relaxed mb-8 uppercase font-bold tracking-widest opacity-80">
                                    {selectedFeature.longDesc}
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {['Neural Sync', 'Bio-Intelligence', 'Cyber-Integrity'].map(tag => (
                                        <span key={tag} className="px-4 py-2 rounded-lg bg-white/5 border border-white/5 text-[8px] font-black uppercase tracking-[3px] text-dark-muted flex items-center gap-2">
                                            <CheckCircle2 size={12} className={`text-${selectedFeature.color}-400`} /> {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal for Demo (Cinematic HUD Overhaul) */}
            <AnimatePresence>
                {showDemo && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDemo(false)}
                            className="absolute inset-0 bg-black/95"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="relative w-full h-full max-w-[95vw] max-h-[90vh] rounded-[4rem] overflow-hidden border border-white/10 bg-dark-bg shadow-2xl overflow-y-auto lg:overflow-hidden"
                        >
                            <button
                                onClick={() => setShowDemo(false)}
                                className="absolute top-10 right-10 z-[250] p-5 rounded-full bg-black/50 hover:bg-white/10 transition-colors backdrop-blur-xl border border-white/10"
                            >
                                <X size={28} />
                            </button>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={demoStep}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 1 }}
                                    className="absolute inset-0"
                                >
                                    {/* Full-Bleed Background Image with HUD Filter */}
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={demoSteps[demoStep].image}
                                            className="w-full h-full object-cover grayscale brightness-[0.3] scale-110"
                                            alt="Pro Feature"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-dark-bg/20" />
                                        <div className="absolute inset-0 hud-grid opacity-30" />
                                    </div>

                                    {/* Floating HUD Scanning Lines */}
                                    <div className="absolute inset-x-0 h-1/2 top-1/4 z-10 pointer-events-none overflow-hidden">
                                        <div className="w-full h-full animate-hud-scan bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
                                    </div>

                                    {/* HUD Content Layout */}
                                    <div className="relative z-20 h-full p-12 lg:p-24 flex flex-col justify-between">
                                        {/* Top HUD Node */}
                                        <div className="flex justify-between items-start">
                                            <motion.div
                                                initial={{ x: -30, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                className="hud-widget max-w-md bg-black/60"
                                            >
                                                <div className="flex items-center gap-4 mb-4">
                                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/40">
                                                        <Activity size={24} className="text-primary-light" />
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-primary-light uppercase tracking-[4px]">Neural Link Established</div>
                                                        <div className="text-xs font-bold text-white/40 uppercase">Architecture Node: 0x{demoStep}F42</div>
                                                    </div>
                                                </div>
                                                <h2 className="text-6xl font-black uppercase italic italic tracking-tighter mb-4">{demoSteps[demoStep].title}</h2>
                                                <p className="text-sm font-black text-dark-muted uppercase tracking-[3px] leading-relaxed">
                                                    {demoSteps[demoStep].desc}
                                                </p>
                                            </motion.div>

                                            <div className="hidden lg:flex flex-col gap-6 items-end">
                                                <div className="hud-widget bg-black/60 !py-4">
                                                    <div className="text-[8px] font-black text-primary-light uppercase tracking-[4px] mb-1">Stream Status</div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="hud-pulse">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                        </div>
                                                        <span className="text-xs font-black uppercase tracking-[2px]">High-Fidelity Feed</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom HUD Metrics Section */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                            {demoSteps[demoStep].stats.map((s, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ y: 30, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.2 + idx * 0.1 }}
                                                    className="hud-widget bg-black/60 group hover:border-primary/40 transition-all border-l-4 border-l-primary"
                                                >
                                                    <div className="text-[8px] font-black text-dark-muted uppercase tracking-[4px] mb-3">{s[0]}</div>
                                                    <div className="text-4xl font-black italic font-mono text-white group-hover:text-primary-light transition-colors">{s[1]}</div>
                                                </motion.div>
                                            ))}

                                            {/* Step Counter Widget */}
                                            <div className="hud-widget bg-primary/5 border-primary/20 flex flex-col justify-center items-center text-center">
                                                <div className="text-[8px] font-black text-primary-light uppercase tracking-[4px] mb-4">Sequence Progress</div>
                                                <div className="flex gap-2">
                                                    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => (
                                                        <div
                                                            key={i}
                                                            className={`h-2 rounded-full transition-all duration-700 ${i === demoStep ? 'w-10 bg-primary shadow-[0_0_10px_rgba(124,58,237,0.8)]' : 'w-2 bg-white/10'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* HUD Side Borders Overlay */}
                            <div className="absolute inset-y-0 left-0 w-24 border-r border-white/5 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
                            <div className="absolute inset-y-0 right-0 w-24 border-l border-white/5 bg-gradient-to-l from-black/40 to-transparent pointer-events-none" />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Parallax Background */}
                <motion.div style={{ y: bgY }} className="absolute inset-0 z-0 h-[120%]">
                    <img
                        src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
                        alt="Gym Background"
                        className="w-full h-full object-cover opacity-30 grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/0 via-dark-bg/60 to-dark-bg" />
                    <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-transparent to-transparent opacity-90" />
                </motion.div>

                {/* Neural Floor */}
                <div className="absolute inset-0 z-1 pointer-events-none overflow-hidden">
                    <div className="neural-floor absolute inset-x-0 bottom-0 h-full w-full" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div style={{ y: textY, opacity: opacityHero }}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-3 py-2 px-5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-8 group cursor-default"
                        >
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-light">Proprietary Training Intelligence</span>
                        </motion.div>

                        <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black leading-[0.8] tracking-tighter mb-8 italic uppercase">
                            Pro <br />
                            <span className="text-gradient">Evolution</span>
                        </h1>

                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-dark-muted max-w-md mb-12 leading-relaxed opacity-80 decoration-primary decoration-2 underline-offset-4 underline">
                            Gain total biometric control. Our platform transforms raw potential into elite performance metrics.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <Link to="/register" className="btn-primary group !px-12 !py-5 shadow-glow-purple">
                                <span className="flex items-center gap-4 text-xs font-black uppercase tracking-[4px]">
                                    Initialize Protocol <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <button
                                onClick={() => setShowDemo(true)}
                                className="px-10 py-5 rounded-3xl font-black text-xs uppercase tracking-[4px] border border-white/10 hover:bg-white/5 transition-all flex items-center gap-4 group backdrop-blur-xl"
                            >
                                <Play size={20} className="group-hover:text-primary transition-colors" /> Observe Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* Kinetic Showcase Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                        className="hidden lg:block relative perspective-1000"
                    >
                        <div className="glass-card p-4 border-white/15 relative overflow-hidden group shadow-glow-purple">
                            <img
                                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop"
                                alt="Training"
                                className="rounded-[2.5rem] shadow-2xl grayscale brightness-50 group-hover:brightness-110 group-hover:grayscale-0 transition-all duration-1000"
                            />

                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-8 -left-8 glass-card p-8 border-primary/20 shadow-glow-purple bg-primary/10"
                            >
                                <Trophy className="text-primary-light mb-4" size={32} />
                                <div className="text-[10px] font-black uppercase tracking-[3px]">Elite Rank #001</div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-10 -right-8 glass-card p-8 border-secondary/20 shadow-glow-pink bg-secondary/10"
                            >
                                <Zap className="text-secondary-light mb-4" size={32} />
                                <div className="text-[10px] font-black uppercase tracking-[3px]">Neuromuscular Peak</div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-20 hover:opacity-100 transition-opacity">
                    <ChevronDown size={40} className="text-primary-light" />
                </div>
            </header>

            {/* Neural Experience Section */}
            <section className="py-40 px-6 max-w-7xl mx-auto relative">
                <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-8 relative z-10">
                    <div className="max-w-2xl">
                        <div className="text-xs font-black uppercase tracking-[5px] text-primary-light mb-4">The Architecture</div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic">
                            Neural <br />
                            <span className="text-primary">Ecosystem</span>
                        </h2>
                        <p className="text-sm font-bold tracking-[0.2em] text-dark-muted italic max-w-md">
                            Engineered for citizens who demand absolute physiological precision through high-fidelity data streams.
                        </p>
                    </div>
                    <Link to="/register" className="text-[10px] font-black uppercase tracking-[4px] border-b-2 border-primary pb-3 flex items-center gap-3 hover:gap-6 transition-all text-white">
                        Access Neural Grid <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-10">
                    {features.map((item, i) => (
                        <PulseCard key={item.id} feature={item} index={i} onClick={setSelectedFeature} />
                    ))}
                </div>

                {/* Decorative Background for Features */}
                <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
            </section>

            {/* Performance Node Showcase */}
            <section className="py-24 relative px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto bg-black border border-white/10 rounded-[4rem] overflow-hidden relative shadow-glow-purple">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1548690312-e3b507d17a47?q=80&w=1974&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-50"
                        alt=""
                    />

                    <div className="relative z-20 p-12 md:p-24 grid lg:grid-cols-2 items-center gap-24">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-10 italic leading-[0.85]">
                                Atmospheric <br />
                                <span className="text-gradient">Performance</span>
                            </h2>
                            <p className="text-sm font-black uppercase tracking-[3px] text-primary-light mb-12 opacity-80">
                                Joining the grid gain an unfair advantage through real-time physiological synchronization.
                            </p>
                            <Link to="/register" className="btn-primary inline-flex !px-12 !py-5 shadow-glow-purple">
                                <span className="text-xs font-black uppercase tracking-[4px]">Request Invite</span>
                            </Link>
                        </motion.div>

                        <div className="space-y-12">
                            {[
                                { label: 'Active Sessions Registry', val: publicStats.sessions },
                                { label: 'Molecular Burn Delta', val: publicStats.calories },
                                { label: 'Verified Athlete Nodes', val: publicStats.users }
                            ].map((s, idx) => (
                                <motion.div
                                    key={s.label}
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="flex items-center justify-between border-b border-white/5 pb-8"
                                >
                                    <div className="text-[10px] font-black uppercase tracking-[4px] text-dark-muted">{s.label}</div>
                                    <div className="text-5xl font-black italic text-white font-mono tracking-tighter shadow-glow-purple bg-white/5 px-4 py-2 rounded-xl">{s.val}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Pro Footer */}
            <footer className="py-24 px-6 border-t border-white/5 relative z-10 bg-dark-bg/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex items-center gap-6 group cursor-pointer">
                        <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/40 group-hover:scale-110 transition-transform">
                            <ZapIcon size={32} fill="currentColor" className="text-primary-light" />
                        </div>
                        <span className="text-4xl font-black tracking-tighter uppercase italic text-white">FitPulse Pro</span>
                    </div>

                    <div className="flex gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-dark-muted">
                        <a href="#" className="hover:text-primary-light transition-colors">Privacy.exe</a>
                        <a href="#" className="hover:text-primary-light transition-colors">Logic.md</a>
                        <a href="#" className="hover:text-primary-light transition-colors">Support.io</a>
                    </div>

                    <div className="text-[10px] text-dark-muted font-black opacity-30 uppercase tracking-[4px]">
                        Architect: FitPulse Engine v4.0.5 // © 2026
                    </div>
                </div>
            </footer>

            {/* Living Overlays */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[9999] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay animate-pulse-opacity" />
            <div className="fixed inset-0 pointer-events-none z-[9999] scanline" />
        </div>
    );
};

export default Home;


