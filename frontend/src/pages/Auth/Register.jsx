import { useState, useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Zap } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [age, setAge] = useState('');
    const [experience, setExperience] = useState('');
    const [gender, setGender] = useState('Male');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const validateForm = () => {
        if (name.length < 2) {
            setError('Name must be at least 2 characters');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email format');
            return false;
        }

        // Password validation: 8+ chars, 1 upper, 1 lower, 1 number, 1 special char
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            return false;
        }

        if (age < 13 || age > 120) {
            setError('Age must be between 13 and 120');
            return false;
        }

        if (height < 50 || height > 300) {
            setError('Height must be between 50 and 300 cm');
            return false;
        }

        if (weight < 30 || weight > 500) {
            setError('Weight must be between 30 and 500 kg');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        try {
            await register({ name, email, password, role, age, experience, gender, height, weight, phoneNumber });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-40 right-40 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-light/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
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
                    <p className="text-dark-muted font-medium">Join the elite fitness community</p>
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Email Address</label>
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
                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Age</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="25"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Gender</label>
                            <select
                                className="input-field appearance-none"
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Height (cm)</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="175"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Weight (kg)</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="70"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Experience (Years)</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="0"
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Phone Number</label>
                            <input
                                type="tel"
                                className="input-field"
                                placeholder="+1234567890"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Role</label>
                        <select
                            className="input-field appearance-none"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="customer">Member</option>
                            <option value="trainer">Trainer</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-3">
                            <UserPlus size={20} />
                            Start Journey
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-dark-muted text-sm font-medium">
                    Already a member?{' '}
                    <Link to="/login" className="text-primary-light hover:text-white transition-colors font-bold ml-1">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
