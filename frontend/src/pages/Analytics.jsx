import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { TrendingUp, Activity, Flame, Dumbbell, Timer } from 'lucide-react';
import api from '../api/axios';
import PageTransition from '../components/PageTransition';

const Analytics = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await api.get('/activities/analytics');
                setData(res.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-dark-card/95 border border-white/10 p-4 rounded-2xl backdrop-blur-xl shadow-2xl">
                    <p className="text-[10px] font-black text-dark-muted uppercase tracking-widest mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 py-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-xs font-bold text-white uppercase">{entry.name}:</span>
                            <span className="text-xs font-black text-primary-light">{entry.value.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (loading) return <div className="p-10 text-center text-white font-bold animate-pulse">Analyzing metabolic output...</div>;

    return (
        <PageTransition>
            <div className="p-6 space-y-8 max-w-6xl mx-auto h-full overflow-y-auto relative cyber-grid">
                <div className="scanline"></div>
                <header className="flex items-baseline justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">Biometric Performance</h1>
                        <p className="text-dark-muted font-bold tracking-widest text-[10px] uppercase mt-2">7-Day Aggregated Intelligence</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Volume Trend */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-6 border-white/5 bg-gradient-to-br from-primary/5 to-transparent relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                <TrendingUp size={18} />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-white">Lifting Volume (kg)</h2>
                        </div>

                        <div className="h-64 w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="rgba(255,255,255,0.2)"
                                        fontSize={9}
                                        tickFormatter={(str) => str.split('-')[2]}
                                    />
                                    <YAxis hide />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="volume"
                                        stroke="#7C3AED"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorVolume)"
                                        name="Volume"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Calorie Output */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 border-white/5 bg-gradient-to-br from-secondary/5 to-transparent relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="p-2 bg-secondary/20 rounded-lg text-secondary">
                                <Flame size={18} />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-white">Metabolic Burn (kcal)</h2>
                        </div>

                        <div className="h-64 w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="rgba(255,255,255,0.2)"
                                        fontSize={9}
                                        tickFormatter={(str) => str.split('-')[1] + '/' + str.split('-')[2]}
                                    />
                                    <YAxis hide />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="calories" name="Burned" radius={[4, 4, 0, 0]}>
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#EC4899' : '#EC489940'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Workout Intensity (mins) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6 border-white/5 bg-gradient-to-br from-emerald-500/5 to-transparent relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                <Timer size={18} />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-white">Intensity (min)</h2>
                        </div>

                        <div className="h-64 w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="rgba(255,255,255,0.2)"
                                        fontSize={9}
                                        tickFormatter={(str) => str.split('-')[2]}
                                    />
                                    <YAxis hide />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="duration"
                                        stroke="#10B981"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorDuration)"
                                        name="Minutes"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Step Trends */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 border-white/5 bg-gradient-to-br from-blue-500/5 to-transparent relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3 mb-8 relative z-10">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                <Activity size={18} />
                            </div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-white">Movement (steps)</h2>
                        </div>

                        <div className="h-64 w-full relative z-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data}>
                                    <defs>
                                        <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="rgba(255,255,255,0.2)"
                                        fontSize={9}
                                        tickFormatter={(str) => str.split('-')[2]}
                                    />
                                    <YAxis hide />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="stepAfter"
                                        dataKey="steps"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSteps)"
                                        name="Steps"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Analytics;
