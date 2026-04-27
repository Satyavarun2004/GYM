import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Trophy, Activity, Award, LogOut, Menu, X, Zap, MessageCircle, Dumbbell, TrendingUp, Star, History } from 'lucide-react';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { name: 'Dashboard', icon: Home, path: '/dashboard' },
        { name: 'Analytics', icon: TrendingUp, path: '/analytics' },
        { name: 'Workout History', icon: History, path: '/history' },
        { name: 'Achievements', icon: Star, path: '/achievements' },
        { name: 'Challenges', icon: Trophy, path: '/challenges' },
        { name: 'Log Activity', icon: Activity, path: '/activity' },
        { name: 'Exercises', icon: Dumbbell, path: '/exercises' },
        { name: 'Leaderboard', icon: Award, path: '/leaderboard' },
        ...(user?.role === 'admin' ? [{ name: 'Admin Chat', icon: MessageCircle, path: '/admin-chat' }] : []),
    ];

    const NavContent = () => (
        <div className="flex flex-col h-full py-8">
            <div className="px-6 mb-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-glow-purple">
                        <Zap className="text-white" size={24} fill="white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold tracking-tight text-white leading-none">FitPulse</h2>
                        <span className="text-[10px] uppercase tracking-[3px] font-bold text-primary-light">Pro</span>
                    </div>
                </div>
            </div>

            <nav className="flex-grow space-y-2 px-3 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-300 group
                                ${isActive
                                    ? 'bg-gradient-to-r from-primary/20 to-secondary/10 text-white border border-white/10 shadow-glow-purple'
                                    : 'text-dark-muted hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon size={22} className={`${isActive ? 'text-primary-light' : 'group-hover:text-primary-light transition-colors'}`} />
                            <span className="tracking-wide text-sm">{item.name}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-light neon-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="px-3 mt-auto space-y-4">
                <div className="mx-3 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light font-bold text-lg border border-primary/20">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-[10px] text-dark-muted font-bold truncate uppercase tracking-wider">Silver Member</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full px-4 py-4 rounded-2xl font-semibold text-red-400 hover:bg-red-500/10 transition-all duration-300 group"
                >
                    <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm">Sign Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72 h-screen fixed left-0 top-0 bg-dark-bg/80 backdrop-blur-2xl border-r border-white/5 z-40">
                <NavContent />
            </div>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-dark-bg/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-2">
                    <Zap className="text-primary-light" size={20} fill="currentColor" />
                    <span className="font-extrabold text-white tracking-tight text-sm">FitPulse Pro</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 bg-white/5 rounded-xl border border-white/10"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 w-72 h-full bg-dark-bg z-50 lg:hidden shadow-2xl border-r border-white/10"
                        >
                            <NavContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
