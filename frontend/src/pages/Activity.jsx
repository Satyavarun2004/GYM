import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity as ActivityIcon, Save, Dumbbell, History, Zap, Timer as TimerIcon, ChevronRight, Trash2, Camera } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import WorkoutTimer from '../components/WorkoutTimer';
import VisionLens from '../components/VisionLens';
import LivePeers from '../components/LivePeers';
import AuthContext from '../context/AuthContext';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const Activity = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [type, setType] = useState('steps');
    const [value, setValue] = useState('');
    const [name, setName] = useState('');
    const [reps, setReps] = useState('');
    const [sets, setSets] = useState('');
    const [weight, setWeight] = useState('');
    const [restTime, setRestTime] = useState('');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');
    const [showTimer, setShowTimer] = useState(false);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [showVision, setShowVision] = useState(false);

    useEffect(() => {
        if (type === 'exercise' && name) {
            socket.emit('workout_start', { userId: user?._id || 'guest', exerciseName: name });
        }
    }, [type, name, user]);

    useEffect(() => {
        if (type === 'exercise' && (reps || sets)) {
            socket.emit('workout_update', {
                userId: user?._id || 'guest',
                exerciseName: name,
                reps: parseInt(reps) || 0,
                sets: parseInt(sets) || 0
            });
        }
    }, [reps, sets, type, name, user]);

    const fetchRecentActivities = async () => {
        try {
            const { data } = await api.get('/activities');
            setRecentActivities(data.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleRepCount = (count) => {
        if (type === 'exercise') {
            setReps(count.toString());
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this activity?')) {
            try {
                await api.delete(`/activities/${id}`);
                fetchRecentActivities();
            } catch (error) {
                console.error('Failed to delete activity:', error);
            }
        }
    };

    useEffect(() => {
        fetchRecentActivities();
        if (location.state) {
            if (location.state.type) setType(location.state.type);
            if (location.state.name) setName(location.state.name);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                type,
                value: type === 'exercise' ? Number(duration || 0) : Number(value || 0),
                exerciseDetails: type === 'exercise' ? {
                    name,
                    reps: Number(reps),
                    sets: Number(sets),
                    weight: Number(weight),
                    restTime: Number(restTime),
                    notes
                } : undefined
            };

            await api.post('/activities', payload);
            setMessage('Performance data logged successfully!');
            setValue('');
            setName('');
            setReps('');
            setSets('');
            setWeight('');
            setRestTime('');
            setDuration('');
            setNotes('');
            fetchRecentActivities();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Critical: Failed to sync activity';
            setMessage(errorMsg);
        }
    };

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto px-6">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tight text-white italic">Log Performance</h1>
                        <p className="text-dark-muted font-bold tracking-widest text-xs uppercase mt-2">Every rep counts toward greatness</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-glow-purple">
                        <Zap size={24} fill="currentColor" />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-3 glass-card p-8 border-white/5 shadow-2xl relative overflow-hidden cyber-grid"
                    >
                        <div className="scanline"></div>
                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                className={`p - 4 rounded - xl mb - 8 text - xs font - black uppercase tracking - widest text - center ${message.includes('success') ? 'bg-primary/10 text-primary-light border border-primary/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'} `}
                            >
                                {message}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-[10px] font-black text-dark-muted uppercase tracking-[3px] mb-3 ml-1">Modal Type</label>
                                    <select
                                        className="input-field py-4 font-bold"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <option value="steps">Steps Progress</option>
                                        <option value="exercise">Strength Training</option>
                                        <option value="duration">Cardio Duration</option>
                                        <option value="calories">Manual Calorie Burn</option>
                                    </select>
                                </div>

                                <div className="col-span-2 md:col-span-1">
                                    <label className="block text-[10px] font-black text-dark-muted uppercase tracking-[3px] mb-3 ml-1">
                                        {type === 'steps' ? 'Step Count' : type === 'exercise' ? 'Exercise Name' : 'Value'}
                                    </label>
                                    {type === 'exercise' ? (
                                        <input
                                            type="text" className="input-field py-4" placeholder="e.g. Bench Press"
                                            value={name} onChange={(e) => setName(e.target.value)} required
                                        />
                                    ) : (
                                        <div className="relative">
                                            <input
                                                type="number" className="input-field py-4 pl-12"
                                                value={value} onChange={(e) => setValue(e.target.value)}
                                                required placeholder="e.g. 5000"
                                            />
                                            <ActivityIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <AnimatePresence>
                                {type === 'exercise' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-6 overflow-hidden"
                                    >
                                        <div className="grid grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-black text-dark-muted uppercase tracking-[2px] mb-3 ml-1">Sets</label>
                                                <input
                                                    type="number" className="input-field text-center py-4" placeholder="0"
                                                    value={sets} onChange={(e) => setSets(e.target.value)} required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-dark-muted uppercase tracking-[2px] mb-3 ml-1">Reps</label>
                                                <input
                                                    type="number" className="input-field text-center py-4" placeholder="0"
                                                    value={reps} onChange={(e) => setReps(e.target.value)} required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-dark-muted uppercase tracking-[2px] mb-3 ml-1">Weight (kg)</label>
                                                <input
                                                    type="number" className="input-field text-center py-4" placeholder="0"
                                                    value={weight} onChange={(e) => setWeight(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="col-span-1">
                                                <label className="block text-[10px] font-black text-dark-muted uppercase tracking-[2px] mb-3 ml-1">Rest (sec)</label>
                                                <input
                                                    type="number" className="input-field text-center py-4" placeholder="60"
                                                    value={restTime} onChange={(e) => setRestTime(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-[10px] font-black text-dark-muted uppercase tracking-[2px] mb-3 ml-1">Duration (min)</label>
                                                <input
                                                    type="number" className="input-field text-center py-4" placeholder="0"
                                                    value={duration} onChange={(e) => setDuration(e.target.value)} required
                                                />
                                            </div>
                                            <div className="col-span-1">
                                                <label className="block text-[10px] font-black text-dark-muted uppercase tracking-[2px] mb-3 ml-1">Personal Notes</label>
                                                <input
                                                    type="text" className="input-field py-4" placeholder="e.g. Felt strong"
                                                    value={notes} onChange={(e) => setNotes(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-3 py-5 uppercase tracking-[5px] font-black text-sm shadow-glow-purple group">
                                <Save size={20} className="group-hover:scale-125 transition-transform" />
                                Store Analytics
                            </button>
                        </form>
                    </motion.div>

                    <div className="lg:col-span-2 space-y-6">
                        {/* Timer Toggle Card */}
                        <div className="glass-card p-6 border-white/5 bg-gradient-to-br from-secondary/10 to-transparent">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <TimerIcon className="text-secondary-light" size={24} />
                                    <h4 className="font-bold uppercase tracking-widest text-sm text-white">Focus Timer</h4>
                                </div>
                                <button
                                    onClick={() => setShowTimer(!showTimer)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showTimer ? 'bg-secondary text-white' : 'bg-white/5 text-dark-muted hover:bg-white/10'
                                        }`}
                                >
                                    {showTimer ? 'Hide' : 'Open'}
                                </button>
                            </div>
                            <p className="text-[10px] text-dark-muted font-bold uppercase tracking-wider leading-relaxed">
                                {showTimer ? 'Maximize your gains by tracking rest intervals and set durations.' : 'Need to track rest? Open the tactical timer below.'}
                            </p>
                        </div>

                        <AnimatePresence>
                            {showTimer && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: 20, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <WorkoutTimer />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="glass-card p-6 border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <Camera className="text-primary-light" size={24} />
                                    <h4 className="font-bold uppercase tracking-widest text-sm text-white">Vision AI Assist</h4>
                                </div>
                                <button
                                    onClick={() => setShowVision(!showVision)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showVision ? 'bg-primary text-white' : 'bg-white/5 text-dark-muted hover:bg-white/10'
                                        }`}
                                >
                                    {showVision ? 'Deactivate' : 'Enable'}
                                </button>
                            </div>
                            <p className="text-[10px] text-dark-muted font-bold uppercase tracking-wider leading-relaxed">
                                {showVision ? 'AI Lens is active. Calibrating skeletal tracking...' : 'Get real-time posture feedback while you train.'}
                            </p>
                        </div>

                        <AnimatePresence>
                            {showVision && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: 20, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <VisionLens
                                        isCompact={true}
                                        onDeactivate={() => setShowVision(false)}
                                        onRepCount={handleRepCount}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="glass-card p-6 border-white/5 bg-gradient-to-br from-primary/10 to-transparent">
                            <div className="flex items-center gap-4 mb-4">
                                <Dumbbell className="text-primary-light" size={24} />
                                <h4 className="font-bold uppercase tracking-widest text-sm">Professional Entry</h4>
                            </div>
                            <p className="text-xs text-dark-muted leading-relaxed font-medium">
                                Tracking every rep allows us to calculate your metabolic intensity with 98% accuracy. Don't skip the data entry.
                            </p>
                        </div>

                        <div className="glass-card p-6 border-white/5">
                            <div className="flex items-center gap-4 mb-4">
                                <History className="text-secondary-light" size={24} />
                                <h4 className="font-bold uppercase tracking-widest text-sm">Recent Activity</h4>
                            </div>
                            <div className="space-y-4">
                                {loadingHistory ? (
                                    <div className="text-center py-6 text-[10px] text-dark-muted font-black uppercase tracking-[2px] animate-pulse">Syncing tactical logs...</div>
                                ) : recentActivities.length === 0 ? (
                                    <div className="text-center py-6 text-[10px] text-dark-muted font-black uppercase tracking-[2px]">No data streams found</div>
                                ) : (
                                    recentActivities.map((act) => (
                                        <div key={act._id} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-xl group/item">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-white uppercase tracking-wider group-hover/item:text-primary-light transition-colors">
                                                    {act.type === 'exercise' ? act.exerciseDetails?.name : act.type}
                                                </span>
                                                <span className="text-[8px] text-dark-muted font-black uppercase tracking-tighter mt-0.5">
                                                    {new Date(act.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <span className="text-[10px] font-black text-primary-light uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-lg">
                                                    {act.value} {act.type === 'steps' ? 'Steps' : 'kcal'}
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(act._id)}
                                                    className="p-1.5 text-dark-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover/item:opacity-100 ml-2"
                                                    title="Delete Log"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <LivePeers currentUser={user} />
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Activity;

