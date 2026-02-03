import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, Bell, ChevronUp, ChevronDown } from 'lucide-react';

const WorkoutTimer = () => {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(1);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [totalTime, setTotalTime] = useState(60);
    const timerRef = useRef(null);

    // Audio for timer feedback
    const playTickSound = () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
    };

    const playCompletionSound = () => {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        const playBuzz = (time) => {
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, time);
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            gainNode.gain.setValueAtTime(0, time);
            gainNode.gain.linearRampToValueAtTime(0.2, time + 0.1);
            gainNode.gain.linearRampToValueAtTime(0, time + 0.4);
            oscillator.start(time);
            oscillator.stop(time + 0.4);
        };

        // Triple buzz effect
        playBuzz(audioCtx.currentTime);
        playBuzz(audioCtx.currentTime + 0.5);
        playBuzz(audioCtx.currentTime + 1.0);
    };

    const toggleTimer = () => {
        if (!isActive) {
            const total = (minutes * 60) + seconds;
            if (total > 0) {
                if (timeLeft === 0 || timeLeft === totalTime) {
                    setTimeLeft(total);
                    setTotalTime(total);
                }
                setIsActive(true);
            }
        } else {
            setIsActive(false);
        }
    };

    const resetTimer = () => {
        setIsActive(false);
        const total = (minutes * 60) + seconds;
        setTimeLeft(total);
        setTotalTime(total);
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    const nextValue = prev - 1;
                    // Play ticks for last 3 seconds
                    if (nextValue <= 3 && nextValue > 0) {
                        playTickSound();
                    }
                    return nextValue;
                });
            }, 1000);
        } else if (timeLeft === 0) {
            if (isActive) {
                setIsActive(false);
                playCompletionSound();
            }
            clearInterval(timerRef.current);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = time % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
    const circumference = 2 * Math.PI * 45; // r=45
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="glass-card p-6 border-white/5 bg-dark-card/50 backdrop-blur-xl relative overflow-hidden group">
            {/* Background Light Effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="flex flex-col items-center">
                <div className="flex items-center gap-3 mb-6 w-full">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Timer size={18} />
                    </div>
                    <h4 className="font-bold uppercase tracking-[2px] text-xs text-white">Intensity Timer</h4>
                    <div className={`ml-auto w-2 h-2 rounded-full ${isActive ? 'bg-primary neon-pulse' : 'bg-white/10'}`} />
                </div>

                {/* Circular Progress */}
                <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background Path */}
                        <circle
                            cx="50%"
                            cy="50%"
                            r="45"
                            className="stroke-white/5 fill-none"
                            strokeWidth="6"
                        />
                        {/* Progress Path */}
                        <motion.circle
                            cx="50%"
                            cy="50%"
                            r="45"
                            className="stroke-primary fill-none"
                            strokeWidth="6"
                            strokeLinecap="round"
                            style={{
                                strokeDasharray: circumference,
                                strokeDashoffset: strokeDashoffset,
                                transition: 'stroke-dashoffset 1s linear'
                            }}
                        />
                    </svg>

                    <div className="absolute flex flex-col items-center">
                        <span className="text-4xl font-black text-white tracking-tighter tabular-nums">
                            {formatTime(timeLeft)}
                        </span>
                        <span className="text-[10px] font-black text-dark-muted uppercase tracking-widest mt-1">
                            Remains
                        </span>
                    </div>
                </div>

                {/* Controls */}
                {!isActive && timeLeft === totalTime ? (
                    <div className="flex gap-4 mb-4">
                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={() => setMinutes(m => Math.min(99, m + 1))}
                                className="p-1 hover:text-primary transition-colors"
                            >
                                <ChevronUp size={20} />
                            </button>
                            <div className="w-12 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-bold text-lg">
                                {minutes.toString().padStart(2, '0')}
                            </div>
                            <button
                                onClick={() => setMinutes(m => Math.max(0, m - 1))}
                                className="p-1 hover:text-primary transition-colors"
                            >
                                <ChevronDown size={20} />
                            </button>
                            <span className="text-[8px] font-bold text-dark-muted uppercase">Min</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-white/20 self-center mb-4 text-2xl font-black">:</div>
                        <div className="flex flex-col items-center gap-1">
                            <button
                                onClick={() => setSeconds(s => (s + 5) % 60)}
                                className="p-1 hover:text-primary transition-colors"
                            >
                                <ChevronUp size={20} />
                            </button>
                            <div className="w-12 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-bold text-lg">
                                {seconds.toString().padStart(2, '0')}
                            </div>
                            <button
                                onClick={() => setSeconds(s => (s - 5 + 60) % 60)}
                                className="p-1 hover:text-primary transition-colors"
                            >
                                <ChevronDown size={20} />
                            </button>
                            <span className="text-[8px] font-bold text-dark-muted uppercase">Sec</span>
                        </div>
                    </div>
                ) : (
                    <div className="h-24 flex items-center justify-center">
                        <div className="text-primary-light/50 text-[10px] font-black uppercase tracking-[3px] animate-pulse">
                            {isActive ? 'Tracking Set...' : 'Timer Paused'}
                        </div>
                    </div>
                )}

                <div className="flex gap-4 w-full">
                    <button
                        onClick={toggleTimer}
                        className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 ${isActive
                            ? 'bg-secondary/10 text-secondary-light border border-secondary/20 hover:bg-secondary/20'
                            : 'bg-primary/20 text-primary-light border border-primary/30 hover:bg-primary/30'
                            }`}
                    >
                        {isActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                        <span className="text-xs font-black uppercase tracking-wider">{isActive ? 'Pause' : 'Start'}</span>
                    </button>
                    <button
                        onClick={resetTimer}
                        className="p-4 bg-white/5 rounded-2xl text-dark-muted hover:text-white hover:bg-white/10 border border-white/5 transition-all"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WorkoutTimer;
