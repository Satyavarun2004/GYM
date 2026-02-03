import { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Zap } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden">
            {/* Background Animations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-40 right-40 w-96 h-96 bg-secondary-light/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-10 w-full max-w-md z-10 mx-4 border-white/10"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center shadow-glow-purple mx-auto mb-6">
                        <Zap className="text-white" size={32} fill="white" />
                    </div>
                    <h2 className="text-4xl font-extrabold tracking-tight mb-2">
                        <span className="text-white">Fit</span>
                        <span className="text-gradient">Pulse</span>
                    </h2>
                    <p className="text-dark-muted font-medium">Continue your elite fitness journey</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-2 ml-1">Email Address</label>
                        <input
                            type="email"
                            className="input-field"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary w-full flex items-center justify-center gap-3">
                        <LogIn size={20} />
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-dark-muted text-sm font-medium">
                    New to the elite?{' '}
                    <Link to="/register" className="text-primary-light hover:text-white transition-colors font-bold ml-1">
                        Join the pulse
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
