import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit, Dumbbell, Calendar, Target, Activity } from 'lucide-react';
import axiosInstance from '../api/axios';
import AuthContext from '../context/AuthContext';

const AIWorkoutGenerator = () => {
    const { user } = useContext(AuthContext);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pastPlans, setPastPlans] = useState([]);
    const [currentPlan, setCurrentPlan] = useState(null);
    const [formData, setFormData] = useState({
        goal: 'Muscle Hypertrophy',
        fitnessLevel: user?.fitnessLevel || 'Intermediate',
        daysPerWeek: 4,
        age: user?.age || 25,
        weight: user?.weight || 75
    });

    useEffect(() => {
        fetchPastPlans();
    }, []);

    const fetchPastPlans = async () => {
        try {
            const res = await axiosInstance.get('/workout-plans');
            setPastPlans(res.data);
            if (res.data.length > 0) {
                setCurrentPlan(res.data[0]);
            }
        } catch (error) {
            console.error('Failed to fetch past plans:', error);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setIsGenerating(true);
        try {
            const res = await axiosInstance.post('/workout-plans/generate', formData);
            setCurrentPlan(res.data);
            fetchPastPlans(); // Refresh the list
        } catch (error) {
            console.error('Failed to generate plan:', error);
            alert(error.response?.data?.message || 'Failed to generate plan.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center justify-center md:justify-start gap-4">
                    <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-2xl shadow-glow-purple">
                        <BrainCircuit size={32} className="text-white" />
                    </div>
                    AI Workout Architect
                </h1>
                <p className="text-dark-muted mt-3 text-lg">Harness the power of AI to build your perfect weekly routine.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Generation Form */}
                <div className="lg:col-span-1">
                    <div className="bg-dark-card border border-white/5 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Target size={20} className="text-primary-light" />
                            Plan Parameters
                        </h2>

                        <form onSubmit={handleGenerate} className="space-y-5 relative z-10">
                            <div>
                                <label className="block text-sm font-bold text-dark-muted mb-2 uppercase tracking-wider">Primary Goal</label>
                                <select 
                                    value={formData.goal} 
                                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                                    className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-light transition-colors"
                                >
                                    <option value="Muscle Hypertrophy">Muscle Hypertrophy (Size)</option>
                                    <option value="Strength Training">Strength Training</option>
                                    <option value="Fat Loss">Fat Loss & Toning</option>
                                    <option value="Endurance">Endurance</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-dark-muted mb-2 uppercase tracking-wider">Fitness Level</label>
                                <select 
                                    value={formData.fitnessLevel} 
                                    onChange={(e) => setFormData({...formData, fitnessLevel: e.target.value})}
                                    className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-light transition-colors"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-dark-muted mb-2 uppercase tracking-wider">Days/Week</label>
                                    <input 
                                        type="number" min="2" max="6"
                                        value={formData.daysPerWeek} 
                                        onChange={(e) => setFormData({...formData, daysPerWeek: e.target.value})}
                                        className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-light transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-dark-muted mb-2 uppercase tracking-wider">Weight (kg)</label>
                                    <input 
                                        type="number"
                                        value={formData.weight} 
                                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                                        className="w-full bg-dark-bg border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-light transition-colors"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isGenerating}
                                className="w-full mt-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <Sparkles className="animate-spin" size={20} />
                                        Synthesizing Plan...
                                    </>
                                ) : (
                                    <>
                                        <BrainCircuit size={20} />
                                        Generate Plan
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {pastPlans.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-sm font-bold text-dark-muted mb-4 uppercase tracking-wider px-2">History</h3>
                            <div className="space-y-3">
                                {pastPlans.map(plan => (
                                    <button 
                                        key={plan._id}
                                        onClick={() => setCurrentPlan(plan)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all ${currentPlan?._id === plan._id ? 'bg-primary/20 border-primary shadow-glow-purple' : 'bg-dark-card border-white/5 hover:border-white/20'}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-white text-sm">{plan.goal}</span>
                                            <span className="text-xs text-dark-muted">{new Date(plan.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-xs font-semibold text-primary-light">
                                            {plan.daysPerWeek} Days • {plan.fitnessLevel}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Plan Display */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[500px] flex flex-col items-center justify-center bg-dark-card border border-white/5 rounded-3xl p-10"
                            >
                                <div className="w-24 h-24 mb-8 relative">
                                    <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
                                    <div className="absolute inset-2 border-r-4 border-secondary rounded-full animate-spin-reverse"></div>
                                    <BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-light animate-pulse" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Analyzing Profile...</h3>
                                <p className="text-dark-muted text-center max-w-sm">
                                    Our AI is optimizing your volume, selecting exercises, and structuring your weekly progression.
                                </p>
                            </motion.div>
                        ) : currentPlan ? (
                            <motion.div 
                                key="result"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-dark-card border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
                            >
                                <div className="p-8 border-b border-white/5 bg-gradient-to-r from-primary/10 to-transparent">
                                    <h2 className="text-2xl font-extrabold text-white mb-3">Your Personalized Plan</h2>
                                    <p className="text-dark-muted leading-relaxed">
                                        {currentPlan.planData?.summary || "Here is your structured workout routine based on your goals."}
                                    </p>
                                </div>

                                <div className="p-8 space-y-8">
                                    {currentPlan.planData?.days?.map((day, idx) => (
                                        <div key={idx} className="relative">
                                            {/* Day Header */}
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
                                                    <span className="text-[10px] font-black text-dark-muted uppercase">Day</span>
                                                    <span className="text-lg font-black text-primary-light">{day.day}</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-white">{day.focus || 'Rest Day'}</h3>
                                                    <p className="text-sm font-semibold text-dark-muted">
                                                        {day.exercises?.length || 0} exercises
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Exercises Grid */}
                                            {day.exercises && day.exercises.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-white/5">
                                                    {day.exercises.map((ex, i) => (
                                                        <div key={i} className="bg-dark-bg p-4 rounded-xl border border-white/5 hover:border-primary/30 transition-colors group">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h4 className="font-bold text-white group-hover:text-primary-light transition-colors">{ex.name}</h4>
                                                                <Dumbbell size={16} className="text-dark-muted" />
                                                            </div>
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <span className="bg-primary/20 text-primary-light px-2 py-1 rounded text-xs font-bold">
                                                                    {ex.sets} SETS
                                                                </span>
                                                                <span className="bg-secondary/20 text-secondary-light px-2 py-1 rounded text-xs font-bold">
                                                                    {ex.reps} REPS
                                                                </span>
                                                            </div>
                                                            {ex.notes && (
                                                                <p className="text-xs text-dark-muted font-medium italic">
                                                                    💡 {ex.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="pl-4 border-l-2 border-white/5 py-4">
                                                    <div className="bg-white/5 px-4 py-3 rounded-xl inline-flex items-center gap-2 text-dark-muted text-sm font-bold">
                                                        <Calendar size={16} /> Active Recovery / Rest
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-dark-card border border-white/5 border-dashed rounded-3xl p-10 opacity-50">
                                <Activity size={48} className="text-dark-muted mb-4" />
                                <h3 className="text-xl font-bold text-white">No Plan Generated</h3>
                                <p className="text-sm text-dark-muted mt-2">Adjust your parameters and click generate.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AIWorkoutGenerator;
