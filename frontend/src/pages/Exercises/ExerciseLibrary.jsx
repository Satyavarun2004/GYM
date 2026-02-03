
import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, ArrowRight, Activity, Zap, Wind, Waves } from 'lucide-react';
import { exercises } from '../../data/exerciseData';
import { useNavigate } from 'react-router-dom';

const ImageWithFallback = ({ src, alt, id }) => {
    const [error, setError] = React.useState(false);

    const getFallbackIcon = () => {
        switch (id) {
            case 'cardio': return <Activity size={48} className="text-primary-light/80" />;
            case 'yoga': return <Wind size={48} className="text-primary-light/80" />;
            case 'hiit': return <Zap size={48} className="text-primary-light/80" />;
            case 'swimming': return <Waves size={48} className="text-primary-light/80" />;
            default: return <Dumbbell size={48} className="text-primary-light/80" />;
        }
    };

    if (error || !src) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                {getFallbackIcon()}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain p-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
            onError={() => setError(true)}
        />
    );
};

const ExerciseLibrary = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 space-y-8 h-full overflow-y-auto relative cyber-grid">
            <div className="scanline"></div>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">Tactical Intel</h1>
                    <p className="text-dark-muted font-bold tracking-widest text-[10px] uppercase mt-2">Classified Exercise Database // Phase 2</p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-glow-purple">
                    <Dumbbell className="text-primary-light" size={24} />
                </div>
            </div>

            {/* Body Part Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exercises.map((part, index) => (
                    <motion.div
                        key={part.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative overflow-hidden rounded-3xl bg-dark-card border border-white/5 cursor-pointer hover:border-primary/30 hover:shadow-[0_0_30px_-5px_rgba(124,58,237,0.3)] transition-all duration-500"
                        onClick={() => navigate(`/exercises/${part.id}`)}
                    >
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="p-6 relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                                    {/* Placeholder icon if image fails */}
                                    <Dumbbell className="text-white group-hover:text-primary-light transition-colors" size={20} />
                                </div>
                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                    <ArrowRight size={14} className="text-white" />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-light transition-colors">{part.name}</h3>
                            <p className="text-sm text-dark-muted group-hover:text-gray-300 transition-colors">{part.description}</p>

                            <div className="mt-5 h-40 w-full bg-dark-bg/50 rounded-2xl overflow-hidden relative border border-white/5 group-hover:border-primary/20 transition-all">
                                <ImageWithFallback
                                    src={part.image}
                                    alt={part.name}
                                    id={part.id}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent opacity-60" />
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-dark-muted">
                                <span className="bg-white/5 px-2 py-1 rounded-lg border border-white/5">{part.exercises.length} Exercises</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ExerciseLibrary;
