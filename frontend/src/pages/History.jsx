import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Calendar, Trash2, Dumbbell, Zap, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const History = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchActivities = async () => {
        try {
            const { data } = await api.get('/activities');
            setActivities(data);
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this log?')) {
            try {
                await api.delete(`/activities/${id}`);
                fetchActivities();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    // Group activities by date
    const groupedActivities = activities
        .filter(act => {
            const searchStr = (act.exerciseDetails?.name || act.type).toLowerCase();
            return searchStr.includes(searchTerm.toLowerCase());
        })
        .reduce((groups, activity) => {
            const date = new Date(activity.createdAt).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(activity);
            return groups;
        }, {});

    return (
        <PageTransition>
            <div className="min-h-screen pb-20 px-4 md:px-8 relative overflow-hidden cyber-grid">
                <div className="scanline"></div>
                {/* Header Section */}
                <div className="max-w-6xl mx-auto pt-8 mb-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic flex items-center gap-4">
                                <span className="bg-primary/20 p-3 rounded-2xl border border-primary/20">
                                    <HistoryIcon className="text-primary-light" size={40} />
                                </span>
                                Tactical History
                            </h1>
                            <p className="text-dark-muted font-black uppercase tracking-[0.2em] text-xs mt-3 flex items-center gap-2">
                                <Zap size={14} className="text-secondary" fill="currentColor" />
                                Comprehensive Performance Records
                            </p>
                        </div>

                        {/* Search & Filter Bar */}
                        <div className="relative group min-w-[300px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted group-focus-within:text-primary-light transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="SEARCH PERFORMANCE LOGS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-dark-muted/50"
                            />
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto mt-12">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-dark-muted font-black uppercase tracking-widest text-xs animate-pulse">Scanning Bio-Data Database...</p>
                        </div>
                    ) : Object.keys(groupedActivities).length === 0 ? (
                        <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl py-20 text-center">
                            <HistoryIcon size={60} className="mx-auto text-dark-muted mb-6 opacity-20" />
                            <h3 className="text-xl font-bold text-white uppercase tracking-widest">No Tactical Logs Found</h3>
                            <p className="text-dark-muted text-sm mt-2 uppercase font-black tracking-widest">Your performance history is blank. Start crushing it!</p>
                        </div>
                    ) : (
                        <div className="space-y-16">
                            {Object.entries(groupedActivities).map(([date, items]) => {
                                // Calculate daily totals
                                const dailyTotals = items.reduce((acc, act) => {
                                    if (act.type === 'steps') acc.steps += act.value;
                                    acc.calories += act.value;
                                    if (act.exerciseDetails) {
                                        acc.volume += (act.exerciseDetails.reps || 0) * (act.exerciseDetails.sets || 0) * (act.exerciseDetails.weight || 0);
                                    }
                                    return acc;
                                }, { steps: 0, calories: 0, volume: 0 });

                                return (
                                    <div key={date} className="relative">
                                        {/* Date Header */}
                                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 md:mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                                                <h2 className="text-lg font-black text-white uppercase tracking-[3px] italic">{date}</h2>
                                            </div>

                                            {/* Daily Totals Bar */}
                                            <div className="flex items-center gap-4 md:gap-6 bg-white/5 px-4 md:px-6 py-2 rounded-2xl border border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-dark-muted font-black uppercase tracking-widest">VOL:</span>
                                                    <span className="text-sm font-black text-primary-light italic">{dailyTotals.volume.toLocaleString()}KG</span>
                                                </div>
                                                <div className="w-px h-4 bg-white/10"></div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-dark-muted font-black uppercase tracking-widest">BURN:</span>
                                                    <span className="text-sm font-black text-secondary italic">{dailyTotals.calories.toLocaleString()}KCAL</span>
                                                </div>
                                                {dailyTotals.steps > 0 && (
                                                    <>
                                                        <div className="w-px h-4 bg-white/10"></div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-dark-muted font-black uppercase tracking-widest">STEPS:</span>
                                                            <span className="text-sm font-black text-cyan-400 italic">{dailyTotals.steps.toLocaleString()}</span>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Activity Cards Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                            <AnimatePresence>
                                                {items.map((act) => (
                                                    <motion.div
                                                        layout
                                                        key={act._id}
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        className="bg-dark-card/50 border border-white/5 rounded-3xl p-6 group hover:border-primary/30 transition-all hover:bg-white/5 relative overflow-hidden"
                                                    >
                                                        {/* Glow Peak */}
                                                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-primary/10 blur-3xl rounded-full group-hover:bg-primary/20 transition-all"></div>

                                                        <div className="flex justify-between items-start mb-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`p-3 rounded-xl ${act.type === 'steps' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-primary/10 text-primary-light'}`}>
                                                                    <Dumbbell size={20} />
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-black text-white uppercase tracking-wider group-hover:text-primary-light transition-colors">
                                                                        {act.type === 'exercise' ? act.exerciseDetails?.name : act.type}
                                                                    </h3>
                                                                    <span className="text-[10px] text-dark-muted font-black uppercase tracking-widest">
                                                                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => handleDelete(act._id)}
                                                                className="p-2 text-dark-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                                                                <p className="text-[8px] text-dark-muted font-black uppercase mb-1 tracking-widest">OUTPUT</p>
                                                                <p className="text-xl font-black text-white italic">
                                                                    {act.value}
                                                                    <span className="text-[10px] ml-1 text-primary-light not-italic">
                                                                        {act.type === 'steps' ? 'STEPS' : act.type === 'exercise' ? 'MINS' : 'KCAL'}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            {act.exerciseDetails && (
                                                                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-all">
                                                                    <p className="text-[8px] text-dark-muted font-black uppercase mb-1 tracking-widest">VOLUME</p>
                                                                    <p className="text-xl font-black text-white italic">
                                                                        {act.exerciseDetails.sets}x{act.exerciseDetails.reps}
                                                                        <span className="text-[10px] ml-1 text-primary-light not-italic">
                                                                            @{act.exerciseDetails.weight}KG
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {act.exerciseDetails?.notes && (
                                                            <div className="mt-4 p-3 bg-white/5 rounded-xl border-l-2 border-primary/40">
                                                                <p className="text-[10px] text-dark-muted font-bold italic leading-relaxed">
                                                                    "{act.exerciseDetails.notes}"
                                                                </p>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default History;
