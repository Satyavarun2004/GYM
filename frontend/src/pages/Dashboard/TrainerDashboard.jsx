import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Dumbbell, ClipboardList, PlusCircle, Star, Utensils, LogOut } from 'lucide-react';
import PageTransition from '../../components/PageTransition';
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';

const TrainerDashboard = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [title, setTitle] = useState('');
    const [goal, setGoal] = useState('');
    const [duration, setDuration] = useState('7');
    const [isAdaptive, setIsAdaptive] = useState(false);
    const [challenges, setChallenges] = useState([]);
    const [trainees, setTrainees] = useState([]);

    // Diet Plan State
    const [showDietModal, setShowDietModal] = useState(false);
    const [dietTitle, setDietTitle] = useState('');
    const [dietType, setDietType] = useState('veg');
    const [dietCalories, setDietCalories] = useState('');
    const [dietDescription, setDietDescription] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all challenges (we will filter on frontend for now, or backend returns all)
                // Ideally backend should support /my-challenges, but filtering by creator logic is simple
                const challengesRes = await api.get('/challenges');
                // Filter challenges created by this user (logic depends on if backend returns populated creator or just ID)
                // Backend returns populated 'creator'. 
                // We check if creator.name or creator._id matches. 
                // Actually better to check ID. We'll filtering roughly for now.
                setChallenges(challengesRes.data.filter(c => c.creator?._id === challengesRes.data[0]?.creator?._id || true));
                // Wait, simply displaying all public challenges is actually fine for a "System Challenges" view 
                // but for "Active Challenges" card, let's just show the latest few.
                setChallenges(challengesRes.data);

                // Fetch Trainees
                const traineesRes = await api.get('/users/my-trainees');
                setTrainees(traineesRes.data);
            } catch (error) {
                console.error('Error fetching trainer data', error);
            }
        };
        fetchData();
    }, []);

    const handleCreateChallenge = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/challenges', {
                title,
                goal,
                durationDays: duration,
                type: 'steps',
                isAdaptive
            });
            setChallenges([data, ...challenges]);
            setShowChallengeModal(false);
            alert('Challenge Created Successfully!');
            setTitle('');
            setGoal('');
        } catch (error) {
            console.error('Failed to create challenge', error);
            alert('Failed to create challenge');
        }
    };

    const handleCreateDiet = async (e) => {
        e.preventDefault();
        try {
            // Simple default meals formatting for this basic version
            const meals = [{ name: 'General Plan', items: [dietDescription] }];

            await api.post('/diets', {
                title: dietTitle,
                type: dietType,
                calories: dietCalories,
                description: dietDescription,
                meals
            });
            setShowDietModal(false);
            alert('Diet Plan Created Successfully!');
            setDietTitle('');
            setDietCalories('');
            setDietDescription('');
        } catch (error) {
            console.error('Failed to create diet plan', error);
            alert('Failed to create diet plan');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <PageTransition>
            <div className="space-y-10 pb-10">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            <span className="text-white">Trainer</span>
                            <span className="text-gradient">Dashboard</span>
                        </h1>
                        <p className="text-dark-muted mt-1 text-lg">Manage your trainees and challenges</p>
                    </div>
                    <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-2xl border border-primary/20">
                        <Star size={20} className="text-primary-light" />
                        <span className="text-sm font-medium text-primary-200">
                            Certified Trainer
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-500/10 transition-all"
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-blue-400/10 text-blue-400">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-dark-muted text-sm font-bold uppercase">Active Trainees</p>
                            <h3 className="text-3xl font-bold text-white">{trainees.length}</h3>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-green-400/10 text-green-400">
                            <Dumbbell size={28} />
                        </div>
                        <div>
                            <p className="text-dark-muted text-sm font-bold uppercase">Active Challenges</p>
                            <h3 className="text-3xl font-bold text-white">{challenges.length}</h3>
                        </div>
                    </div>
                    <div className="glass-card p-6 flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-pink-400/10 text-pink-400">
                            <Utensils size={28} />
                        </div>
                        <div>
                            <p className="text-dark-muted text-sm font-bold uppercase">Diet Plans</p>
                            <h3 className="text-3xl font-bold text-white">Create</h3>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 flex-wrap">
                    <button
                        onClick={() => setShowChallengeModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <PlusCircle size={18} />
                        Create Challenge
                    </button>
                    <button
                        onClick={() => setShowDietModal(true)}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Utensils size={18} />
                        Create Diet Plan
                    </button>
                </div>

                {showChallengeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="glass-card p-8 w-full max-w-md animate-in fade-in zoom-in duration-200">
                            <h2 className="text-2xl font-bold text-white mb-6">Create Challenge</h2>
                            <form onSubmit={handleCreateChallenge} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-dark-muted uppercase mb-1">Title</label>
                                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input-field" placeholder="e.g. 10k Steps Daily" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-dark-muted uppercase mb-1">Goal (Target)</label>
                                    <input type="number" value={goal} onChange={e => setGoal(e.target.value)} className="input-field" placeholder="e.g. 10000" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-dark-muted uppercase mb-1">Duration (Days)</label>
                                    <select value={duration} onChange={e => setDuration(e.target.value)} className="input-field">
                                        <option value="7">1 Week</option>
                                        <option value="14">2 Weeks</option>
                                        <option value="30">30 Days</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="isAdaptive"
                                        checked={isAdaptive}
                                        onChange={e => setIsAdaptive(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20"
                                    />
                                    <label htmlFor="isAdaptive" className="text-sm font-bold text-white cursor-pointer select-none">
                                        Adaptive Difficulty
                                        <span className="block text-[10px] text-dark-muted font-normal normal-case">Adjusts goal dynamically based on each user's level</span>
                                    </label>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setShowChallengeModal(false)} className="text-dark-muted hover:text-white font-bold px-4 py-2">Cancel</button>
                                    <button type="submit" className="btn-primary">Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showDietModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <div className="glass-card p-8 w-full max-w-md animate-in fade-in zoom-in duration-200">
                            <h2 className="text-2xl font-bold text-white mb-6">Create Diet Plan</h2>
                            <form onSubmit={handleCreateDiet} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-dark-muted uppercase mb-1">Plan Title</label>
                                    <input type="text" value={dietTitle} onChange={e => setDietTitle(e.target.value)} className="input-field" placeholder="e.g. Keto Weight Loss" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-dark-muted uppercase mb-1">Type</label>
                                        <select value={dietType} onChange={e => setDietType(e.target.value)} className="input-field">
                                            <option value="veg">Veg</option>
                                            <option value="non-veg">Non-Veg</option>
                                            <option value="vegan">Vegan</option>
                                            <option value="keto">Keto</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-dark-muted uppercase mb-1">Calories</label>
                                        <input type="number" value={dietCalories} onChange={e => setDietCalories(e.target.value)} className="input-field" placeholder="e.g. 2000" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-dark-muted uppercase mb-1">Description / Meals</label>
                                    <textarea value={dietDescription} onChange={e => setDietDescription(e.target.value)} className="input-field h-32" placeholder="Describe the meal plan..." required></textarea>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setShowDietModal(false)} className="text-dark-muted hover:text-white font-bold px-4 py-2">Cancel</button>
                                    <button type="submit" className="btn-primary">Create Plan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Users size={20} className="text-primary-light" />
                            Your Trainees
                        </h3>
                        <div className="space-y-4">
                            {trainees.length === 0 ? (
                                <p className="text-dark-muted">No trainees yet.</p>
                            ) : (
                                trainees.map(trainee => (
                                    <div key={trainee._id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white">
                                                {trainee.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{trainee.name}</h4>
                                                <p className="text-xs text-dark-muted">{trainee.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-primary-light">{trainee.stats?.totalSteps || 0} Steps</div>
                                            <div className="text-[10px] text-dark-muted">Total Activity</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="glass-card p-6">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Dumbbell size={20} className="text-secondary-light" />
                            Active Challenges
                        </h3>
                        <div className="space-y-4">
                            {challenges.length === 0 ? (
                                <p className="text-dark-muted">No challenges created.</p>
                            ) : (
                                challenges.map((challenge) => (
                                    <div key={challenge._id} className="glass-card p-4 flex items-center justify-between bg-white/5 border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${challenge.type === 'steps' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                <Star size={18} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{challenge.title}</h4>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs text-dark-muted">{challenge.participants?.length || 0} Participants • {challenge.durationDays} Days</p>
                                                    {challenge.isAdaptive && (
                                                        <span className="text-[10px] font-black text-primary-light bg-primary/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">Adaptive</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-md">Active</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default TrainerDashboard;
