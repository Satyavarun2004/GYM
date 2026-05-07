import { useState, useEffect } from 'react';
import { Users, Zap, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../socket';

const LivePeers = ({ currentUser }) => {
    const [peers, setPeers] = useState({});

    useEffect(() => {
        socket.on('peer_joined', ({ userId, exerciseName }) => {
            if (userId === currentUser?._id) return;
            setPeers(prev => ({
                ...prev,
                [userId]: { userId, exerciseName, sets: 0, reps: 0, lastSeen: Date.now() }
            }));
        });

        socket.on('peer_update', ({ userId, sets, reps, exerciseName }) => {
            if (userId === currentUser?._id) return;
            setPeers(prev => ({
                ...prev,
                [userId]: { ...prev[userId], sets, reps, exerciseName, lastSeen: Date.now() }
            }));
        });

        // Cleanup stale peers
        const interval = setInterval(() => {
            const now = Date.now();
            setPeers(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(id => {
                    if (now - updated[id].lastSeen > 60000) { // 1 min timeout
                        delete updated[id];
                    }
                });
                return updated;
            });
        }, 10000);

        return () => {
            socket.off('peer_joined');
            socket.off('peer_update');
            clearInterval(interval);
        };
    }, [currentUser]);

    const peerList = Object.values(peers);

    return (
        <div className="glass-card p-6 border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-4 mb-6">
                <Users className="text-primary-light" size={24} />
                <h4 className="font-bold uppercase tracking-widest text-sm text-white">Live Gym Floor</h4>
                <div className="ml-auto w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>

            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {peerList.length === 0 ? (
                    <p className="text-[10px] text-dark-muted font-bold uppercase tracking-widest text-center py-4">
                        The gym is quiet. Start a session to invite others.
                    </p>
                ) : (
                    <AnimatePresence>
                        {peerList.map((peer) => (
                            <motion.div
                                key={peer.userId}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary-light border border-primary/20">
                                    <User size={20} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-[10px] font-black text-white uppercase truncate">Citizen #{peer.userId.slice(-4)}</p>
                                    <p className="text-[8px] text-primary-light font-bold uppercase tracking-tighter truncate">
                                        Performing: {peer.exerciseName}
                                    </p>
                                    <div className="flex gap-3 mt-1">
                                        <span className="text-[8px] text-dark-muted font-bold uppercase">Sets: {peer.sets}</span>
                                        <span className="text-[8px] text-dark-muted font-bold uppercase">Reps: {peer.reps}</span>
                                    </div>
                                </div>
                                <Zap size={14} className="text-primary-light animate-pulse" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default LivePeers;
