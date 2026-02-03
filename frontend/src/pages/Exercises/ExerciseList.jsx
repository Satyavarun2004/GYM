
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Clock, Flame, Info } from 'lucide-react';
import { exercises } from '../../data/exerciseData';

const ExerciseList = () => {
    const { bodyPart } = useParams();
    const navigate = useNavigate();

    const selectedPart = exercises.find(p => p.id === bodyPart);

    if (!selectedPart) {
        return (
            <div className="p-10 text-center text-white">
                <h2 className="text-2xl font-bold">Category Not Found</h2>
                <button onClick={() => navigate('/exercises')} className="mt-4 text-primary hover:underline">Back to Library</button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 h-full overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/exercises')}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{selectedPart.name} Exercises</h1>
                        <p className="text-dark-muted">Master your {selectedPart.name.toLowerCase()} with these moves.</p>
                    </div>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 p-2 shrink-0 overflow-hidden">
                    <img src={selectedPart.image} alt={selectedPart.name} className="w-full h-full object-contain opacity-80" />
                </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-6">
                {selectedPart.exercises.map((ex, index) => (
                    <motion.div
                        key={ex.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5"
                    >
                        <div className="p-5 rounded-2xl bg-dark-card/90 backdrop-blur-xl group">
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Visual Placeholder */}
                                <div className="w-full md:w-56 h-36 bg-dark-bg/50 rounded-xl flex flex-col items-center justify-center shrink-0 border border-white/5 relative overflow-hidden group-hover:border-primary/30 transition-all">
                                    {ex.image ? (
                                        <img
                                            src={ex.image}
                                            alt={ex.name}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = selectedPart.image;
                                            }}
                                        />
                                    ) : (
                                        <Play className="text-white/20 group-hover:text-primary transition-colors z-10" size={32} />
                                    )}
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-white group-hover:text-primary-light transition-colors">{ex.name}</h3>
                                            <div className="flex gap-2 mt-1">
                                                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary-light border border-primary/20 flex items-center gap-1 uppercase tracking-wider">
                                                    <Clock size={10} /> {ex.duration}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary-light border border-secondary/20 flex items-center gap-1 uppercase tracking-wider">
                                                    <Flame size={10} /> {ex.calories}
                                                </span>
                                                {ex.difficulty && (
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 uppercase tracking-wider ${ex.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                        ex.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                        }`}>
                                                        {ex.difficulty}
                                                    </span>
                                                )}
                                                {ex.equipment && (
                                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 uppercase tracking-wider">
                                                        {ex.equipment}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-dark-muted text-sm leading-relaxed">{ex.description}</p>

                                    {/* Diet Plan Section */}
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-2">
                                        <div className="flex items-center gap-2 text-primary-light font-bold text-xs uppercase tracking-widest">
                                            <Info size={14} />
                                            <span>Dietary Strategy</span>
                                        </div>
                                        <p className="text-xs text-gray-300 italic leading-relaxed">
                                            {ex.dietPlan}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4 pt-2">
                                        <button
                                            onClick={() => navigate('/activity', { state: { type: 'exercise', name: ex.name } })}
                                            className="ml-auto text-sm font-bold text-white bg-gradient-to-r from-primary to-secondary px-6 py-2.5 rounded-xl hover:shadow-glow transition-all active:scale-95"
                                        >
                                            Start Training
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ExerciseList;
