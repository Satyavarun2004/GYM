import { useState, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AuthContext from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Zap, ArrowRight, Clock, CheckCircle2, Shield } from 'lucide-react';
import PaymentStep from './PaymentStep';

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
    const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Pending

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
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!passwordRegex.test(password)) {
            setError('Password must be 8+ chars, with upper, lower, number & symbol');
            return false;
        }
        return true;
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setError('');
        if (validateForm()) {
            setStep(2);
        }
    };

    const handleRegister = async (selectedPlan) => {
        setError('');
        try {
            const data = await register({ 
                name, email, password, role, age: Number(age), experience: Number(experience), 
                gender, height: Number(height), weight: Number(weight), phoneNumber, 
                plan: selectedPlan 
            });

            if (data.isApproved || data.role === 'admin') {
                navigate('/dashboard');
            } else {
                setStep(3); // Go to pending screen
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
            setStep(1); 
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
                {step !== 3 && (
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-tr from-primary to-secondary rounded-2xl flex items-center justify-center shadow-glow-purple mx-auto mb-6">
                            <Zap className="text-white" size={32} fill="white" />
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight mb-2">
                            <span className="text-white">Fit</span>
                            <span className="text-gradient">Pulse</span>
                        </h2>
                        <p className="text-dark-muted font-medium">
                            {step === 1 ? 'Join the elite fitness community' : 'Finalize your membership'}
                        </p>
                    </div>
                )}

                {error && step !== 3 && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-medium"
                    >
                        {error}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleNextStep} 
                            className="space-y-4"
                        >
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div>
                                    <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Full Name</label>
                                    <input type="text" className="input-field" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Email Address</label>
                                    <input type="email" className="input-field" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Password</label>
                                    <input type="password" className="input-field" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Age</label>
                                        <input type="number" className="input-field" placeholder="25" value={age} onChange={(e) => setAge(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Gender</label>
                                        <select className="input-field appearance-none" value={gender} onChange={(e) => setGender(e.target.value)}>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Height (cm)</label>
                                        <input type="number" className="input-field" placeholder="175" value={height} onChange={(e) => setHeight(e.target.value)} required />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Weight (kg)</label>
                                        <input type="number" className="input-field" placeholder="70" value={weight} onChange={(e) => setWeight(e.target.value)} required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Phone Number</label>
                                    <input type="tel" className="input-field" placeholder="+1234567890" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-dark-muted uppercase tracking-widest mb-1 ml-1">Role</label>
                                    <select className="input-field appearance-none" value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value="customer">Member</option>
                                        <option value="trainer">Trainer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-3">
                                    Next Step
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.form>
                    ) : step === 2 ? (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <PaymentStep 
                                onComplete={handleRegister} 
                                onBack={() => setStep(1)} 
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6 space-y-6"
                        >
                            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto border border-orange-500/30 shadow-glow-orange">
                                <Clock size={40} className="text-orange-400 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tight">Pending Approval</h3>
                                <p className="text-dark-muted mt-4 font-medium leading-relaxed">
                                    Your application and payment have been received. An administrator will review your request shortly.
                                </p>
                            </div>
                            <div className="glass-card p-6 border-white/5 bg-white/5 space-y-4">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-widest">Payment Verified</p>
                                        <p className="text-[10px] text-dark-muted font-bold uppercase tracking-widest">Transaction Secure</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-left">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-white uppercase tracking-widest">Profile Queued</p>
                                        <p className="text-[10px] text-dark-muted font-bold uppercase tracking-widest">Waiting for Gatekeeper</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-primary w-full py-4 font-black uppercase tracking-widest text-sm"
                            >
                                Back to Login
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {step !== 3 && (
                    <p className="mt-8 text-center text-dark-muted text-sm font-medium">
                        Already a member?{' '}
                        <Link to="/login" className="text-primary-light hover:text-white transition-colors font-bold ml-1">
                            Sign in
                        </Link>
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default Register;
