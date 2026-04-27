import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scan, User, Layers, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

// Derive body metrics from user profile data
const deriveBodyMetrics = (user) => {
    const weight = user.weight || 75;  // kg
    const height = user.height || 175; // cm
    const bmi = user.bmi || (weight / Math.pow(height / 100, 2));
    const gender = user.gender || 'Male';
    const fitnessLevel = user.stats?.fitnessLevel || 1;
    const age = user.age || 25;

    // Unique seed from user id for variation
    const idStr = (user._id || '000000000000').toString();
    const seed = parseInt(idStr.slice(-6), 16) % 100;
    const seedOffset = (seed - 50) / 50; // -1 to +1

    // Shoulder Width: based on height & gender (taller = broader shoulders)
    // Male avg: ~44-50cm, Female avg: ~38-44cm
    let shoulderBase = gender === 'Female' ? 40 : 46;
    shoulderBase += (height - 170) * 0.1;
    shoulderBase += seedOffset * 2;
    const shoulderWidth = Math.max(35, Math.min(58, shoulderBase)).toFixed(1);

    // Waist Line: based on weight, BMI, gender
    // Higher BMI = larger waist
    let waistBase = gender === 'Female' ? 70 : 78;
    waistBase += (bmi - 22) * 2;
    waistBase += seedOffset * 3;
    const waistLine = Math.max(58, Math.min(110, waistBase)).toFixed(1);

    // Body Fat: based on BMI, gender, fitnessLevel
    // Male baseline ~15%, Female baseline ~22%
    let bodyFatBase = gender === 'Female' ? 22 : 15;
    bodyFatBase += (bmi - 22) * 1.2;   // higher BMI = more fat
    bodyFatBase -= fitnessLevel * 1.5;   // fitter = less fat
    if (age > 40) bodyFatBase += 2;
    bodyFatBase += seedOffset * 2;
    const bodyFat = Math.max(5, Math.min(40, bodyFatBase)).toFixed(1);

    // Lean Mass: derived from body fat
    const leanMass = (100 - parseFloat(bodyFat)).toFixed(1);

    return { shoulderWidth, waistLine, bodyFat, leanMass };
};

const BodyScanner = () => {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        const loadMetrics = async () => {
            try {
                const { data } = await api.get('/users/profile');
                setMetrics(deriveBodyMetrics(data));
            } catch (err) {
                console.error('BodyScanner: failed to load profile', err);
                // Use placeholder values if not logged in
                setMetrics({ shoulderWidth: '--', waistLine: '--', bodyFat: '--', leanMass: '--' });
            }
        };
        loadMetrics();
    }, []);

    return (
        <div className="glass-card p-8 border-white/5 bg-black relative overflow-hidden h-[500px]">
            <div className="absolute inset-0 cyber-grid opacity-20" />
            <div className="scanline" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic leading-none">3D Biometric Scan</h3>
                        <span className="text-[10px] font-black text-primary-light uppercase tracking-widest mt-2 block">Structural Analysis v4.0</span>
                    </div>
                    <div className="p-3 bg-primary/20 rounded-2xl border border-primary/40 text-primary-light">
                        <Scan size={24} className="animate-pulse" />
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                    {/* Mock 3D Figure */}
                    <motion.div
                        animate={{ rotateY: 360 }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        className="relative w-48 h-80 perspective-1000"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Core Figure (Wireframe effect) */}
                        <div className="absolute inset-0 flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full border-2 border-primary-light/50 mb-2" />
                            <div className="w-32 h-40 border-2 border-primary-light/30 rounded-3xl relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary animate-ping rounded-full" />
                            </div>
                            <div className="flex gap-4 mt-2">
                                <div className="w-8 h-32 border-2 border-primary-light/20 rounded-full" />
                                <div className="w-8 h-32 border-2 border-primary-light/20 rounded-full" />
                            </div>
                        </div>

                        {/* Analysis Rings */}
                        {[1, 2, 3].map((ring) => (
                            <motion.div
                                key={ring}
                                animate={{ rotateX: 360, rotateZ: ring * 120 }}
                                transition={{ repeat: Infinity, duration: 10 / ring, ease: "linear" }}
                                className="absolute inset-0 border border-primary/10 rounded-full"
                                style={{ transformStyle: 'preserve-3d' }}
                            />
                        ))}
                    </motion.div>

                    {/* Floating Data Points */}
                    <div className="absolute left-0 top-1/4 space-y-4">
                        <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/5 border-l-primary border-l-4">
                            <span className="block text-[8px] font-black text-dark-muted uppercase">Shoulder Width</span>
                            <span className="text-xs font-black text-white">
                                {metrics ? `${metrics.shoulderWidth}cm` : '...'}
                            </span>
                        </div>
                        <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/5 border-l-secondary border-l-4">
                            <span className="block text-[8px] font-black text-dark-muted uppercase">Waist Line</span>
                            <span className="text-xs font-black text-white">
                                {metrics ? `${metrics.waistLine}cm` : '...'}
                            </span>
                        </div>
                    </div>

                    <div className="absolute right-0 bottom-1/4 space-y-4">
                        <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/5 border-r-emerald-500 border-r-4 text-right">
                            <span className="block text-[8px] font-black text-dark-muted uppercase">Lean Mass</span>
                            <span className="text-xs font-black text-emerald-400">
                                {metrics ? `${metrics.leanMass}%` : '...'}
                            </span>
                        </div>
                        <div className="bg-black/80 backdrop-blur-md p-3 rounded-xl border border-white/5 border-r-primary border-r-4 text-right">
                            <span className="block text-[8px] font-black text-dark-muted uppercase">Body Fat</span>
                            <span className="text-xs font-black text-primary-light">
                                {metrics ? `${metrics.bodyFat}%` : '...'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                        <Layers size={16} className="text-dark-muted mb-2" />
                        <span className="text-[8px] font-black text-dark-muted uppercase">Volume</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <User size={16} className="text-dark-muted mb-2" />
                        <span className="text-[8px] font-black text-dark-muted uppercase">Symmetry</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <ShieldCheck size={16} className="text-dark-muted mb-2" />
                        <span className="text-[8px] font-black text-dark-muted uppercase">Defense</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BodyScanner;
