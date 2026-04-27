import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crosshair, Shield, Zap, Loader } from 'lucide-react';
import api from '../api/axios';

// Colour used when no clans exist yet (fallback)
const FALLBACK = [
    { id: 1, name: 'No Clans Yet', totalXP: 0, memberCount: 0, rank: 'Bronze', status: 'Neutral', color: '#64748b', x: 50, y: 50 }
];

const ZoneMap = () => {
    const [nodes, setNodes] = useState([]);
    const [totalClans, setTotal] = useState(0);
    const [volatility, setVol] = useState('Low');
    const [neutralPct, setNeutral] = useState(0);
    const [loading, setLoading] = useState(true);
    const [tooltip, setTooltip] = useState(null); // hovered node id

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await api.get('/clans/territory/map');
                setNodes(data.nodes?.length ? data.nodes : FALLBACK);
                setTotal(data.totalClans ?? 0);
                setVol(data.volatility ?? 'Low');
                setNeutral(data.neutralPct ?? 0);
            } catch (err) {
                console.error('ZoneMap: failed to load territory data', err);
                setNodes(FALLBACK);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="glass-card p-6 border-white/5 bg-black/40 relative overflow-hidden h-full min-h-[300px]">
            <div className="absolute inset-0 cyber-grid opacity-10" />
            <div className="relative z-10 h-full flex flex-col">

                {/* Header */}
                <header className="flex items-center justify-between mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[4px] text-primary-light flex items-center gap-2">
                        <Crosshair size={14} />
                        Territory Control
                    </h3>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-primary/40 rounded-full" />)}
                    </div>
                </header>

                {/* Map */}
                <div className="flex-1 relative">
                    {/* SVG Grid + Axes */}
                    <svg viewBox="0 0 400 300" className="w-full h-full opacity-30 absolute inset-0">
                        {/* Boundary */}
                        <path d="M50,30 L350,30 L350,270 L50,270 Z" stroke="white" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
                        {/* Quadrant dividers */}
                        <line x1="200" y1="30" x2="200" y2="270" stroke="white" strokeWidth="0.3" />
                        <line x1="50" y1="150" x2="350" y2="150" stroke="white" strokeWidth="0.3" />
                        {/* Centre contested ring */}
                        <circle cx="200" cy="150" r="70" stroke="#8B5CF6" strokeWidth="0.5" fill="none" strokeDasharray="2 4" />
                        {/* Axis labels */}
                        <text x="55" y="165" fill="#8B5CF6" fontSize="7" opacity="0.6">CHALLENGER</text>
                        <text x="260" y="40" fill="#10B981" fontSize="7" opacity="0.6">ELITE</text>
                    </svg>

                    {loading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader size={20} className="animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            {/* Clan nodes */}
                            {nodes.map((node, idx) => (
                                <motion.div
                                    key={node.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: idx * 0.15, type: 'spring', stiffness: 200 }}
                                    className="absolute group cursor-pointer"
                                    style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                                    onMouseEnter={() => setTooltip(node.id)}
                                    onMouseLeave={() => setTooltip(null)}
                                >
                                    {/* Dot */}
                                    <div
                                        className="w-4 h-4 rounded-full border-2 border-white/30 shadow-lg"
                                        style={{ backgroundColor: node.color, boxShadow: `0 0 8px ${node.color}66` }}
                                    />

                                    {/* Tooltip on hover */}
                                    {tooltip === node.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="absolute top-6 left-1/2 -translate-x-1/2 w-36 bg-dark-card/95 border border-white/10 p-2 rounded-lg z-20 pointer-events-none backdrop-blur-md"
                                        >
                                            <p className="text-[8px] font-black text-white uppercase truncate">{node.name}</p>
                                            <div className="mt-1 space-y-0.5">
                                                <div className="flex justify-between">
                                                    <span className="text-[6px] text-dark-muted font-bold uppercase">Rank</span>
                                                    <span className="text-[6px] font-black" style={{ color: node.color }}>{node.rank}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[6px] text-dark-muted font-bold uppercase">XP</span>
                                                    <span className="text-[6px] text-white font-black">{node.totalXP.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[6px] text-dark-muted font-bold uppercase">Members</span>
                                                    <span className="text-[6px] text-white font-black">{node.memberCount}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[6px] text-dark-muted font-bold uppercase">Status</span>
                                                    <span className="text-[6px] text-primary-light font-black uppercase">{node.status}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            ))}
                        </>
                    )}

                    {/* Scanning Beam */}
                    <motion.div
                        animate={{ y: [0, 240, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-40 z-10"
                    />
                </div>

                {/* Stats footer */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Shield size={12} className="text-secondary" />
                        <span className="text-[8px] font-black text-dark-muted uppercase">
                            Clans: {totalClans} Active
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap size={12} className="text-primary-light" fill="currentColor" />
                        <span className="text-[8px] font-black text-dark-muted uppercase">
                            Volatility: {volatility}
                        </span>
                    </div>
                </div>
            </div>

            {/* Tactical summary below the card (rendered by parent, but we expose as data-attribute) */}
            <div
                className="hidden"
                data-summary={`Neutral forces holding ${neutralPct}% of outer zones. ${totalClans} clans in active competition.`}
            />
        </div>
    );
};

export default ZoneMap;
