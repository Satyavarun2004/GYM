
import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Scale, Move, CheckCircle, Info, ChevronRight, TrendingDown, Target, TrendingUp } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';
import { bmiPlans } from '../../data/bmiPlans';

const DashboardPersonalization = ({ dailyBurned = 0, dailyIntake = 0 }) => {
    const { user, setUser } = useContext(AuthContext);
    const [weight, setWeight] = useState(user?.weight || '');
    const [height, setHeight] = useState(user?.height || '');
    const [weightHistory, setWeightHistory] = useState([]);
    const [showUpdate, setShowUpdate] = useState(!user?.bmi);

    const calculateBMI = (w, h) => {
        if (!w || !h) return 0;
        const heightInMeters = h / 100;
        return (w / (heightInMeters * heightInMeters)).toFixed(1);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const bmi = calculateBMI(weight, height);
        try {
            // Updated user profile
            const { data } = await api.put('/users/profile', {
                weight,
                height,
                bmi,
                gender: user?.gender || 'Male'
            });

            // Log weight history
            await api.post('/weight', { weight });

            // Preserve the token from the current user object
            const updatedUser = { ...data, token: user.token };

            // Update both Context and LocalStorage
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setShowUpdate(false);
            fetchWeightHistory();
        } catch (error) {
            console.error('Update failed', error);
        }
    };

    const fetchWeightHistory = async () => {
        try {
            const { data } = await api.get('/weight');
            setWeightHistory(data.map(log => ({
                date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                weight: log.weight
            })));
        } catch (error) {
            console.error('Failed to fetch weight history', error);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchWeightHistory();
        }
    }, [user?._id]);

    const getPlan = () => {
        if (!user?.bmi) return null;
        const gender = user.gender?.toLowerCase() || 'male';
        const safeGender = bmiPlans[gender] ? gender : 'male';
        let category = 'normal';
        if (user.bmi < 18.5) category = 'underweight';
        else if (user.bmi >= 25) category = 'obese';

        return bmiPlans[safeGender][category];
    };

    const plan = getPlan();

    return (
        <div className="space-y-8 pb-10">
            {/* BMI Status Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-2 glass-card p-8 border-white/10 relative overflow-hidden cyber-grid"
                >
                    <div className="scanline"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                                <circle
                                    cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent"
                                    className="text-primary-light" strokeDasharray={364}
                                    strokeDashoffset={364 - (Math.min(user?.bmi || 0, 40) / 40) * 364}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-black text-white">{user?.bmi || '--'}</span>
                                <span className="text-[8px] uppercase font-bold text-dark-muted tracking-[2px]">Your BMI</span>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
                                {plan?.status || 'Set Your Profile'}
                            </h2>
                            <p className="text-dark-muted font-medium mb-6">
                                {plan?.message || 'Update your weight and height to generate your personalized fitness roadmap.'}
                            </p>
                            <button
                                onClick={() => setShowUpdate(true)}
                                className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-bold transition-all uppercase tracking-widest"
                            >
                                Update Stats
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Calorie Deficit Widget */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-8 border-white/10 bg-gradient-to-br from-dark-card to-primary/10 relative overflow-hidden cyber-grid-small"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-black uppercase tracking-widest text-xs text-primary-light">Daily Balance</h3>
                        <TrendingDown className="text-secondary-light" size={20} />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-dark-muted">
                                <span>Intake</span>
                                <span className="text-white">{dailyIntake.toLocaleString()} cal</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-secondary transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (dailyIntake / 2500) * 100)}%` }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2 text-dark-muted">
                                <span>Burned</span>
                                <span className="text-white">{dailyBurned.toLocaleString()} cal</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (dailyBurned / 1000) * 100)}%` }}
                                />
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/5">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-dark-muted">
                                        {dailyIntake > dailyBurned ? 'Current Surplus' : 'Current Deficit'}
                                    </div>
                                    <div className="text-2xl font-black text-white">
                                        {Math.abs(dailyIntake - dailyBurned).toLocaleString()} <span className="text-sm font-medium opacity-50">kcal</span>
                                    </div>
                                </div>
                                <Target className="text-primary-light opacity-50" size={32} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Weight Intelligence Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card p-8 border-white/10 bg-gradient-to-br from-dark-card to-primary/5 relative overflow-hidden cyber-grid"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg text-primary">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-white">Biometric Intelligence</h3>
                            <p className="text-[10px] text-dark-muted font-bold uppercase tracking-widest">Historical Weight Trend (KG)</p>
                        </div>
                    </div>
                    {weightHistory.length > 0 && (
                        <div className="text-right">
                            <span className="block text-[8px] font-black text-dark-muted uppercase tracking-widest">Last Variance</span>
                            <span className={`text-sm font-black italic ${weightHistory.length > 1 && weightHistory[weightHistory.length - 1].weight < weightHistory[weightHistory.length - 2].weight ? 'text-emerald-400' : 'text-primary-light'}`}>
                                {weightHistory.length > 1 ? (weightHistory[weightHistory.length - 1].weight - weightHistory[weightHistory.length - 2].weight).toFixed(1) : '0.0'} KG
                            </span>
                        </div>
                    )}
                </div>

                <div className="h-64 w-full">
                    {weightHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={weightHistory}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={9} tickLine={false} axisLine={false} dy={10} />
                                <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="weight"
                                    stroke="#7C3AED"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorWeight)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-center opacity-30">
                            <Scale size={40} className="mb-4" />
                            <p className="text-xs font-black uppercase tracking-widest">Weight Data Required</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest">Update your stats to begin biometric tracking</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Plans Section */}
            <AnimatePresence>
                {plan && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 xl:grid-cols-2 gap-8"
                    >
                        {/* Weekly Workout Plan */}
                        <div className="glass-card border-white/10 overflow-hidden">
                            <div className="p-6 bg-white/5 border-b border-white/5 flex items-center gap-3">
                                <Move className="text-primary-light" size={20} />
                                <h3 className="font-black uppercase tracking-[2px] text-sm">Targeted Training Plan</h3>
                            </div>
                            <div className="p-0">
                                {plan.workoutPlan.map((day, i) => (
                                    <div key={day.day} className={`p-5 flex items-center justify-between group hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 text-[10px] font-black uppercase text-dark-muted">{day.day.substring(0, 3)}</div>
                                            <div>
                                                <div className="text-sm font-bold text-white group-hover:text-primary-light transition-colors">{day.focus}</div>
                                                <div className="text-[10px] text-dark-muted font-medium uppercase tracking-wider">{day.exercises.join(', ')}</div>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-white bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                                            {day.reps}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nutrition & Strategy */}
                        <div className="space-y-8">
                            <div className="glass-card border-white/10">
                                <div className="p-6 bg-white/5 border-b border-white/5 flex items-center gap-3">
                                    <Activity className="text-secondary-light" size={20} />
                                    <h3 className="font-black uppercase tracking-[2px] text-sm">Strategic Nutrition</h3>
                                </div>
                                <div className="p-6 space-y-6">
                                    {plan.dietPlan.map((meal) => (
                                        <div key={meal.meal} className="flex gap-4">
                                            <div className="w-20 shrink-0 text-[10px] font-black uppercase text-primary-light pt-1">{meal.meal}</div>
                                            <div className="text-sm text-gray-300 font-medium leading-relaxed">{meal.items}</div>
                                        </div>
                                    ))}
                                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-dark-muted">Calorie Goal</div>
                                        <div className="px-4 py-1.5 rounded-full bg-secondary text-white text-[10px] font-bold uppercase tracking-widest shadow-glow-pink">
                                            {plan.targetCalories}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Daily Tip */}
                            <div className="p-6 rounded-3xl bg-gradient-to-r from-primary to-secondary relative overflow-hidden group">
                                <div className="relative z-10 flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                                        <Info className="text-white" size={32} />
                                    </div>
                                    <div>
                                        <h4 className="font-black uppercase tracking-widest text-sm text-white mb-1">Expert Note</h4>
                                        <p className="text-white/80 text-xs font-medium leading-relaxed">
                                            Consistency beats intensity every time. Follow this {plan.status.toLowerCase()} protocol for 30 days to see measurable metabolic shifts.
                                        </p>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-[2s]" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Update Modal */}
            <AnimatePresence>
                {showUpdate && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => !user?.bmi && setShowUpdate(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-md glass-card p-10 border-white/10 shadow-glow-purple"
                        >
                            <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-8">Personal Stats</h3>
                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-muted ml-2">Weight (kg)</label>
                                    <input
                                        type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
                                        className="input-field" placeholder="e.g. 75" required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-dark-muted ml-2">Height (cm)</label>
                                    <input
                                        type="number" value={height} onChange={(e) => setHeight(e.target.value)}
                                        className="input-field" placeholder="e.g. 180" required
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full py-4 text-sm uppercase tracking-[4px] font-black mt-4">
                                    Calculate Analytics
                                </button>
                                {user?.bmi && (
                                    <button
                                        type="button" onClick={() => setShowUpdate(false)}
                                        className="w-full text-[10px] font-black uppercase tracking-widest text-dark-muted hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardPersonalization;
