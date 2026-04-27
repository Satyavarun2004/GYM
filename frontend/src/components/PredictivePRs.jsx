import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Calendar, Zap, Award } from 'lucide-react';

const PredictivePRs = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                const res = await api.get('/ai/predict-pr');
                setPredictions(res.data);
            } catch (error) {
                console.error('Failed to fetch predictions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPredictions();
    }, []);

    if (loading) return <div className="p-10 text-center animate-pulse text-[10px] font-black uppercase tracking-widest text-dark-muted">Projecting Strength Trajectory...</div>;

    if (predictions.length === 0) return (
        <div className="glass-card p-8 border-white/5 bg-black/40 flex flex-col items-center justify-center text-center">
            <Zap size={32} className="text-dark-muted opacity-20 mb-4" />
            <p className="text-[10px] font-black text-dark-muted uppercase tracking-[3px]">Insufficient data for PR projection</p>
        </div>
    );

    return (
        <div className="space-y-4">
            {predictions.map((pr, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass-card p-6 border-white/5 bg-gradient-to-r from-primary/10 to-transparent flex items-center gap-6 relative group overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Award size={64} className="text-white" />
                    </div>

                    <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary-light border border-primary/30">
                        <TrendingUp size={24} />
                    </div>

                    <div className="flex-1">
                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{pr.exercise}</h4>
                        <div className="flex gap-4 items-center">
                            <div>
                                <span className="block text-[8px] font-black text-dark-muted uppercase mb-1">Current PR</span>
                                <span className="text-lg font-black text-white">{pr.currentPR}kg</span>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <div>
                                <span className="block text-[8px] font-black text-primary-light uppercase mb-1">Target PR</span>
                                <span className="text-lg font-black text-primary-light">{pr.predictedPR}kg</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-1">
                            <Calendar size={12} className="text-dark-muted" />
                            <span className="text-[8px] font-black text-white uppercase tracking-tighter">Est. {new Date(pr.estimatedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                            <span className="text-[10px] font-black text-emerald-400 font-mono">{pr.confidence}%</span>
                            <span className="text-[8px] font-black text-dark-muted uppercase tracking-tighter">Confidence</span>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default PredictivePRs;
