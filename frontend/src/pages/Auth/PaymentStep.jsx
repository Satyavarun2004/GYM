import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ShieldCheck, Zap, Star, CheckCircle2, QrCode, Smartphone, ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';

const PaymentStep = ({ onComplete, onBack }) => {
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [paymentMethod, setPaymentMethod] = useState('card'); // card, upi
    const [isProcessing, setIsProcessing] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    const plans = [
        {
            id: 'basic',
            name: 'Basic Elite',
            price: '29',
            features: ['Full Gym Access', 'Community Chat', 'Activity Tracking'],
            icon: Zap,
            color: 'from-blue-500 to-indigo-600'
        },
        {
            id: 'pro',
            name: 'Pro Visionary',
            price: '59',
            features: ['AI Personal Trainer', 'Custom Diet Plans', 'Advanced Analytics', 'Priority Support'],
            icon: Star,
            color: 'from-primary to-secondary',
            popular: true
        }
    ];

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsPaid(true);
            // Auto-complete after a brief success message
            setTimeout(() => {
                onComplete(selectedPlan);
            }, 1500);
        }, 2500);
    };

    return (
        <div className="space-y-8">
            <AnimatePresence mode="wait">
                {!isPaid ? (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-8"
                    >
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">Select Your Journey</h3>
                            <p className="text-dark-muted text-sm uppercase tracking-widest font-black">Choose a tier to unlock elite features</p>
                        </div>

                        {/* Plan Selection */}
                        <div className="grid grid-cols-1 gap-4">
                            {plans.map((plan) => (
                                <motion.div
                                    key={plan.id}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={`relative p-5 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 overflow-hidden
                                        ${selectedPlan === plan.id 
                                            ? 'border-primary bg-primary/5 shadow-glow-purple' 
                                            : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute top-0 right-0 bg-primary text-white text-[8px] font-black uppercase px-3 py-1 rounded-bl-2xl tracking-[2px]">
                                            Most Popular
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl bg-gradient-to-tr ${plan.color} text-white shadow-lg`}>
                                            <plan.icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-black text-white uppercase tracking-tight">{plan.name}</h4>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-white">${plan.price}</span>
                                                <span className="text-dark-muted text-[10px] font-bold uppercase">/ month</span>
                                            </div>
                                        </div>
                                        {selectedPlan === plan.id && (
                                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                                                <Check size={14} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Payment Method Tabs */}
                        <div className="flex gap-4 p-1 bg-white/5 rounded-2xl border border-white/5">
                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${paymentMethod === 'card' ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-dark-muted hover:text-white'}`}
                            >
                                <CreditCard size={16} />
                                Credit Card
                            </button>
                            <button
                                onClick={() => setPaymentMethod('upi')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${paymentMethod === 'upi' ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-dark-muted hover:text-white'}`}
                            >
                                <Smartphone size={16} />
                                UPI / Scan
                            </button>
                        </div>

                        {/* Payment Details Area */}
                        <div className="glass-card p-6 border-white/5 bg-black/20 overflow-hidden relative">
                            {paymentMethod === 'card' ? (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="space-y-4"
                                >
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Card Number"
                                            className="input-field pl-12"
                                            defaultValue="4242 4242 4242 4242"
                                            readOnly
                                        />
                                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            className="input-field text-center"
                                            defaultValue="12/26"
                                            readOnly
                                        />
                                        <input
                                            type="text"
                                            placeholder="CVC"
                                            className="input-field text-center"
                                            defaultValue="***"
                                            readOnly
                                        />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex flex-col items-center gap-4 py-2"
                                >
                                    <div className="w-32 h-32 bg-white p-2 rounded-2xl shadow-glow-purple">
                                        <QrCode size="100%" className="text-black" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-white text-sm font-bold">Scan with any UPI App</p>
                                        <p className="text-dark-muted text-[10px] font-medium uppercase tracking-widest mt-1">Transaction ID: FP_{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="space-y-4 pt-4">
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className="btn-primary w-full py-4 flex items-center justify-center gap-3 relative overflow-hidden"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span className="font-bold uppercase tracking-widest text-xs">Processing...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-black uppercase tracking-[0.2em] text-sm">Start Your Journey</span>
                                        <Zap size={20} fill="currentColor" />
                                    </>
                                )}
                            </button>
                            <button
                                onClick={onBack}
                                className="w-full flex items-center justify-center gap-2 text-dark-muted hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest"
                            >
                                <ArrowLeft size={14} />
                                Back to Details
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-12 space-y-6 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30 shadow-glow-green">
                            <CheckCircle2 size={40} className="text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Access Granted!</h3>
                            <p className="text-dark-muted mt-2 font-medium">Your subscription is active. Welcome to the elite.</p>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-primary shadow-glow-purple"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <p className="text-[10px] text-dark-muted text-center uppercase tracking-widest font-black opacity-50">
                🔒 Protected by End-to-End Encryption
            </p>
        </div>
    );
};

export default PaymentStep;
