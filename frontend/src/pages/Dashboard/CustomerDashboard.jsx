import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Flame, Trophy, TrendingUp, Calendar, Zap, Award, Plus, Users, Utensils, MessageCircle, Phone, Mail, ChevronRight, History } from 'lucide-react';
import ActivityChart from '../../components/Charts/ActivityChart';
import PageTransition from '../../components/PageTransition';
import AuthContext from '../../context/AuthContext';
import api from '../../api/axios';
import ChatModal from '../../components/ChatModal';
import socket from '../../socket';
import DashboardPersonalization from './DashboardPersonalization';

const CustomerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [bmi, setBmi] = useState(user?.bmi || null);
    const [dashboardStats, setDashboardStats] = useState(user?.stats || {});
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [trainers, setTrainers] = useState([]);
    const [showTrainerModal, setShowTrainerModal] = useState(false);

    const [allChallenges, setAllChallenges] = useState([]);
    const [showChallengeBrowser, setShowChallengeBrowser] = useState(false);
    const [showNutritionModal, setShowNutritionModal] = useState(false);
    const [nutritionData, setNutritionData] = useState({ foodName: '', calories: '', mealType: 'breakfast' });
    const [dailyNutrition, setDailyNutrition] = useState({ totalCalories: 0, logs: [] });
    const [dailyBurned, setDailyBurned] = useState(0);

    // Diet State
    const [dietPlans, setDietPlans] = useState([]);
    const [selectedDiet, setSelectedDiet] = useState(null);

    // Peer Interaction State
    const [peers, setPeers] = useState([]);
    const [showPeersModal, setShowPeersModal] = useState(false);

    // Chart Data
    const [weeklyData, setWeeklyData] = useState([]);

    // Chat State
    const [selectedPeerForChat, setSelectedPeerForChat] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/users/profile');
                setDashboardStats(data.stats);
                setBmi(data.bmi);
                if (data.selectedTrainer) {
                    setSelectedTrainer(data.selectedTrainer);
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
            }
        };

        const fetchTrainers = async () => {
            try {
                const { data } = await api.get('/users/trainers');
                setTrainers(data);
            } catch (error) {
                console.error('Failed to fetch trainers', error);
            }
        };

        const fetchChallenges = async () => {
            try {
                const { data } = await api.get('/challenges');
                setAllChallenges(data);
            } catch (error) {
                console.error('Failed to fetch challenges', error);
            }
        };

        const fetchDiets = async () => {
            try {
                const { data } = await api.get('/diets');
                setDietPlans(data);
            } catch (error) {
                console.error('Failed to fetch diet plans', error);
            }
        };

        const fetchPeers = async () => {
            try {
                const { data } = await api.get('/users/peers');
                setPeers(data);
            } catch (error) {
                console.error('Failed to fetch peers', error);
            }
        };

        const fetchDailyCalorieStats = async () => {
            try {
                const { data: nutrition } = await api.get('/nutrition/daily-summary');
                setDailyNutrition(nutrition);

                // Fetch activities for today to calculate burned calories
                const { data: activities } = await api.get('/activities');
                const startOfDay = new Date();
                startOfDay.setHours(0, 0, 0, 0);
                const todayBurned = activities
                    .filter(a => new Date(a.createdAt) >= startOfDay)
                    .reduce((acc, curr) => acc + curr.value, 0);
                setDailyBurned(todayBurned);
            } catch (error) {
                console.error('Failed to fetch calorie stats', error);
            }
        };

        const fetchRecentActivities = async () => {
            try {
                const { data } = await api.get('/activities');
                setRecentActivities(data.slice(0, 3)); // Only show last 3
                setLoadingActivities(false);
            } catch (error) {
                console.error('Failed to fetch recent activities', error);
                setLoadingActivities(false);
            }
        };

        fetchProfile();
        fetchTrainers();
        fetchChallenges();
        fetchDiets();
        fetchPeers();
        fetchDailyCalorieStats();
        fetchWeeklyAnalytics();
        fetchRecentActivities();

        // Join my own room for socket messages
        if (user?._id) {
            socket.emit('join_room', user._id);
        }

        // Cleanup on unmount (optional, but good practice to leave logic if needed, usually socket stays connected)
        return () => {
            // socket.emit('leave_room', user._id); // If we implemented leave_room
        };
    }, [user]);

    // Derived state
    const myChallenges = allChallenges.filter(c => c.participants.some(p => p.user === user._id));
    const availableChallenges = allChallenges.filter(c => !c.participants.some(p => p.user === user._id));

    const handleJoinChallenge = async (challengeId) => {
        try {
            await api.put(`/challenges/${challengeId}/join`);
            // Refresh challenges list
            const { data } = await api.get('/challenges');
            setAllChallenges(data);
            alert('Joined Challenge Successfully!');
        } catch (error) {
            console.error('Failed to join challenge', error);
            alert('Failed to join challenge');
        }
    };

    const handleSelectTrainer = async (trainerId) => {
        try {
            await api.put('/users/select-trainer', { trainerId });
            setSelectedTrainer(trainerId);
            setShowTrainerModal(false);
            alert('Trainer Selected Successfully!');
        } catch (error) {
            console.error('Failed to select trainer', error);
            alert('Failed to select trainer');
        }
    };

    // Helper to get trainer name
    const getTrainerName = () => {
        if (!selectedTrainer) return null;
        const trainer = trainers.find(t => t._id === selectedTrainer);
        return trainer ? trainer.name : 'Unknown Trainer';
    };

    const handleLogNutrition = async (e) => {
        e.preventDefault();
        try {
            await api.post('/nutrition', nutritionData);
            setShowNutritionModal(false);
            setNutritionData({ foodName: '', calories: '', mealType: 'breakfast' });

            // Refresh nutrition summary
            const { data: nutrition } = await api.get('/nutrition/daily-summary');
            setDailyNutrition(nutrition);
            alert('Meal logged successfully!');
        } catch (error) {
            console.error('Failed to log nutrition', error);
        }
    };

    const handleOpenChat = (peer) => {
        setSelectedPeerForChat(peer);
    };

    const stats = [
        { title: 'BMI', value: bmi ? bmi.toString() : 'N/A', goal: '22', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10', glow: 'shadow-glow-blue' },
        { title: 'Total Steps', value: dashboardStats?.totalSteps?.toLocaleString() || '0', goal: '10,000', icon: Activity, color: 'text-violet-400', bg: 'bg-violet-400/10', glow: 'shadow-glow-purple' },
        { title: 'Challenges', value: dashboardStats?.challengesCompleted?.toString() || '0', goal: '5', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/10', glow: '' },
        { title: 'Streak', value: (dashboardStats?.currentStreak || 0) + ' Days', goal: null, icon: Flame, color: 'text-emerald-400', bg: 'bg-emerald-400/10', glow: 'shadow-glow-green' },
    ];

    const getMotivationBadge = (status) => {
        const styles = {
            'Consistent': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            'At Risk': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            'Dropping': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            'Inactive': 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        };
        return styles[status] || styles['Consistent'];
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-4xl font-extrabold tracking-tight">
                            <span className="text-white">Fit</span>
                            <span className="text-gradient">Pulse</span>
                        </h1>
                        {dashboardStats?.motivationStatus && (
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getMotivationBadge(dashboardStats.motivationStatus)}`}>
                                {dashboardStats.motivationStatus}
                            </span>
                        )}
                    </div>
                    <p className="text-dark-muted mt-1 text-lg">Welcome back, {user?.name}! Ready for your workout?</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowNutritionModal(true)}
                        className="btn-secondary flex items-center gap-2 text-sm py-2 px-4 shadow-lg border-primary/20"
                    >
                        <Utensils size={18} />
                        Log Meal
                    </button>
                    <button
                        onClick={() => setShowPeersModal(true)}
                        className="btn-secondary flex items-center gap-2 text-sm py-2 px-4 shadow-lg shadow-secondary/10"
                    >
                        <MessageCircle size={18} />
                        Connect with Peers
                    </button>
                    <button
                        onClick={() => setShowChallengeBrowser(true)}
                        className="btn-secondary flex items-center gap-2 text-sm py-2 px-4"
                    >
                        <Trophy size={18} />
                        Join Challenge
                    </button>
                    <Link
                        to="/history"
                        className="btn-secondary flex items-center gap-2 text-sm py-2 px-4 shadow-lg shadow-secondary/10"
                    >
                        <History size={18} />
                        History
                    </Link>
                    <Link
                        to="/activity"
                        className="btn-primary flex items-center gap-2 text-sm py-2 px-4 shadow-lg shadow-primary/20 hover:shadow-primary/40"
                    >
                        <Plus size={18} />
                        Log Activity
                    </Link>
                </div>
            </header>

            {/* BMI & Personalized Plans Section */}
            <DashboardPersonalization
                dailyBurned={dailyBurned}
                dailyIntake={dailyNutrition.totalCalories}
            />

            {/* My Trainer Section */}
            <div className="glass-card p-6 flex items-center justify-between border-primary/20 bg-primary/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold">
                        {selectedTrainer ? <Award size={24} /> : <Users size={24} />}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            {selectedTrainer ? `Your Trainer: ${getTrainerName()}` : 'No Trainer Selected'}
                        </h3>
                        <p className="text-sm text-dark-muted">
                            {selectedTrainer ? 'Keep up the good work!' : 'Find a trainer to guide your journey.'}
                        </p>
                    </div>
                </div>
                {!selectedTrainer ? (
                    <button
                        onClick={() => setShowTrainerModal(true)}
                        className="btn-secondary text-sm px-4 py-2"
                    >
                        Find Trainer
                    </button>
                ) : (
                    <button
                        onClick={() => setShowTrainerModal(true)}
                        className="text-xs font-bold text-primary-light hover:text-white transition-colors"
                    >
                        Change
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className={`glass-card p-6 flex flex-col justify-between group glass-card-hover ${stat.glow}`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                                <stat.icon size={26} />
                            </div>
                            <Zap size={16} className="text-white/10 group-hover:text-primary-light transition-colors" />
                        </div>
                        <div>
                            <p className="text-dark-muted text-sm font-semibold uppercase tracking-wider mb-1">{stat.title}</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                                {stat.goal && <span className="text-xs text-dark-muted font-medium">/ {stat.goal}</span>}
                            </div>
                            {stat.goal && (
                                <div className="w-full h-1.5 bg-white/5 rounded-full mt-3 overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000`}
                                        style={{ width: `${(parseInt(stat.value.replace(',', '')) / parseInt(stat.goal.replace(',', ''))) * 100}%` }}
                                    ></div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Active Challenges List (My Challenges) */}
            {myChallenges.length > 0 && (
                <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Trophy size={20} className="text-amber-400" />
                        Your Active Challenges
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {myChallenges.map(challenge => (
                            <div key={challenge._id} className="bg-white/5 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                            <Trophy size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{challenge.title}</h4>
                                            <p className="text-xs text-dark-muted">{challenge.durationDays} Days Goal</p>
                                        </div>
                                    </div>
                                    {/* Progress Badge */}
                                    {challenge.participants.find(p => p.user === user._id)?.status === 'completed' && (
                                        <span className="text-xs font-bold bg-green-500/20 text-green-400 px-2 py-1 rounded">Completed</span>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-dark-muted">
                                        <span>Progress</span>
                                        <span>
                                            {challenge.participants.find(p => p.user === user._id)?.progress || 0} /
                                            {challenge.isAdaptive ? (
                                                <span className="text-primary-light ml-1" title="Personalized Adaptive Goal">
                                                    {challenge.participants.find(p => p.user === user._id)?.personalizedGoal || challenge.goal}*
                                                </span>
                                            ) : challenge.goal}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                                            style={{
                                                width: `${Math.min(100, ((challenge.participants.find(p => p.user === user._id)?.progress || 0) / (challenge.isAdaptive ? (challenge.participants.find(p => p.user === user._id)?.personalizedGoal || challenge.goal) : challenge.goal)) * 100)}%`
                                            }}
                                        ></div>
                                    </div>
                                    {challenge.isAdaptive && (
                                        <p className="text-[10px] text-primary/60 italic">* Adaptive goal based on your level</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Challenge Browser Modal */}
            {showChallengeBrowser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="glass-card w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-dark-bg/50">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Explore Challenges</h2>
                                <p className="text-dark-muted text-sm">Join a challenge to push your limits!</p>
                            </div>
                            <button onClick={() => setShowChallengeBrowser(false)} className="text-dark-muted hover:text-white">Close</button>
                        </div>
                        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                            {availableChallenges.length === 0 ? (
                                <p className="col-span-full text-center text-dark-muted py-10">
                                    No new challenges available right now. Ask your trainer to create one!
                                </p>
                            ) : (
                                availableChallenges.map(challenge => (
                                    <div key={challenge._id} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-primary/30 transition-all flex flex-col">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl">
                                                <Trophy size={24} className="text-primary-light" />
                                            </div>
                                            <span className="flex flex-col items-end gap-1">
                                                <span className="text-xs font-bold text-dark-muted bg-white/5 px-2 py-1 rounded">
                                                    {challenge.type.toUpperCase()}
                                                </span>
                                                {challenge.isAdaptive && (
                                                    <span className="text-[10px] font-black text-primary-light bg-primary/10 px-2 py-0.5 rounded uppercase tracking-tighter">
                                                        Adaptive
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">{challenge.title}</h3>
                                        <p className="text-dark-muted text-sm mb-4">Created by {challenge.creator?.name || 'Trainer'}</p>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-black/20 p-3 rounded-lg text-center">
                                                <div className="text-lg font-bold text-white">{challenge.goal}</div>
                                                <div className="text-[10px] uppercase text-dark-muted font-bold">Target</div>
                                            </div>
                                            <div className="bg-black/20 p-3 rounded-lg text-center">
                                                <div className="text-lg font-bold text-white">{challenge.durationDays}</div>
                                                <div className="text-[10px] uppercase text-dark-muted font-bold">Days</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleJoinChallenge(challenge._id)}
                                            className="btn-primary w-full mt-auto"
                                        >
                                            Join Challenge
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Peers Modal */}
            {showPeersModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="glass-card w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-dark-bg/50">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Connect with Peers</h2>
                                <p className="text-dark-muted text-sm">Find gym buddies with similar experience!</p>
                            </div>
                            <button onClick={() => setShowPeersModal(false)} className="text-dark-muted hover:text-white">Close</button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4">
                            {peers.length === 0 ? (
                                <p className="text-center text-dark-muted py-10">No peers found with matching experience.</p>
                            ) : (
                                peers.map(peer => (
                                    <div key={peer._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-lg">
                                                {peer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg">{peer.name}</h4>
                                                <p className="text-xs text-dark-muted flex items-center gap-2">
                                                    <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{peer.experience || 0} Years Exp</span>
                                                    {peer.gender && <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{peer.gender}</span>}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenChat(peer)}
                                                className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all"
                                                title="Chat"
                                            >
                                                <MessageCircle size={18} />
                                            </button>
                                            {peer.phoneNumber && (
                                                <a
                                                    href={`tel:${peer.phoneNumber}`}
                                                    className="p-2.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all"
                                                    title="Call"
                                                >
                                                    <Phone size={18} />
                                                </a>
                                            )}
                                            <a
                                                href={`mailto:${peer.email}`}
                                                className="p-2.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                                                title="Email"
                                            >
                                                <Mail size={18} />
                                            </a>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Modal */}
            {selectedPeerForChat && (
                <ChatModal
                    peer={selectedPeerForChat}
                    onClose={() => setSelectedPeerForChat(null)}
                />
            )}

            {showTrainerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="glass-card w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-dark-bg/50">
                            <h2 className="text-2xl font-bold text-white">Select Your Trainer</h2>
                            <button onClick={() => setShowTrainerModal(false)} className="text-dark-muted hover:text-white">Close</button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4">
                            {trainers.length === 0 ? (
                                <p className="text-center text-dark-muted py-10">No trainers available yet.</p>
                            ) : (
                                trainers.map(trainer => (
                                    <div key={trainer._id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/30 hover:bg-white/10 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white">
                                                {trainer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white">{trainer.name}</h4>
                                                <p className="text-xs text-dark-muted">{trainer.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSelectTrainer(trainer._id)}
                                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${selectedTrainer === trainer._id
                                                ? 'bg-green-500 text-white cursor-default'
                                                : 'bg-primary text-white hover:bg-primary-light'}`}
                                            disabled={selectedTrainer === trainer._id}
                                        >
                                            {selectedTrainer === trainer._id ? 'Selected' : 'Select'}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showNutritionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="glass-card p-8 w-full max-w-sm m-4 relative animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-6">Log Nutrition</h3>
                        <form onSubmit={handleLogNutrition} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-dark-muted uppercase tracking-widest mb-2">Meal Type</label>
                                <select
                                    value={nutritionData.mealType}
                                    onChange={(e) => setNutritionData({ ...nutritionData, mealType: e.target.value })}
                                    className="input-field"
                                >
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="snack">Snack</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-dark-muted uppercase tracking-widest mb-2">Food Name</label>
                                <input
                                    type="text" value={nutritionData.foodName}
                                    onChange={(e) => setNutritionData({ ...nutritionData, foodName: e.target.value })}
                                    className="input-field" placeholder="e.g. Oats and Milk" required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-dark-muted uppercase tracking-widest mb-2">Calories (kcal)</label>
                                <input
                                    type="number" value={nutritionData.calories}
                                    onChange={(e) => setNutritionData({ ...nutritionData, calories: e.target.value })}
                                    className="input-field" placeholder="e.g. 450" required
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowNutritionModal(false)} className="text-xs font-bold text-dark-muted hover:text-white uppercase tracking-widest">Cancel</button>
                                <button type="submit" className="btn-primary py-3 px-8 text-xs">Save Entry</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Link to="/analytics" className="glass-card lg:col-span-2 overflow-hidden flex flex-col hover:border-primary/30 transition-all group">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                            <TrendingUp size={20} className="text-primary-light" />
                            Tactical Analytics
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dark-muted group-hover:text-primary-light transition-colors">
                            Full Intel <ChevronRight size={14} />
                        </div>
                    </div>
                    <div className="p-6 flex-grow min-h-[350px]">
                        <ActivityChart data={weeklyData} />
                    </div>
                </Link>

                <div className="glass-card flex flex-col border-white/5">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="text-xl font-bold flex items-center gap-2 text-white">
                            <History size={20} className="text-secondary-light" />
                            Recent Feed
                        </h3>
                        <Link to="/history" className="text-[10px] font-black uppercase tracking-widest text-dark-muted hover:text-white transition-colors">View All</Link>
                    </div>
                    <div className="p-6 space-y-4 flex-grow">
                        {loadingActivities ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />)}
                            </div>
                        ) : recentActivities.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
                                <Activity size={32} className="mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No Recent Bio-Data</p>
                            </div>
                        ) : (
                            recentActivities.map((act) => (
                                <div key={act._id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${act.type === 'steps' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-primary/10 text-primary-light'}`}>
                                            <Zap size={16} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white uppercase tracking-wider group-hover:text-primary-light transition-colors">
                                                {act.type === 'exercise' ? act.exerciseDetails?.name : act.type}
                                            </p>
                                            <p className="text-[8px] font-bold text-dark-muted uppercase tracking-widest">
                                                {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-white italic">
                                            {act.value}
                                            <span className="text-[8px] ml-1 opacity-60 not-italic">
                                                {act.type === 'steps' ? 'S' : act.type === 'exercise' ? 'M' : 'K'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 mt-auto bg-white/5 border-t border-white/5">
                        <div className="flex items-center justify-between mb-2 text-sm font-bold">
                            <span className="text-[10px] font-black uppercase tracking-[2px] text-white">XP Level 12</span>
                            <span className="text-[10px] font-black text-dark-muted uppercase">250 / 500</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-secondary w-1/2 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
