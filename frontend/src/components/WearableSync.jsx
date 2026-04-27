import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Watch, Activity, Moon, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

const WearableSync = () => {
    const [biometrics, setBiometrics] = useState({
        heartRate: 70,
        sleepQuality: 85,
        recoveryScore: 90
    });
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
    const [isDerived, setIsDerived] = useState(false);

    const fetchBiometrics = async () => {
        try {
            const { data } = await api.get('/ai/biometrics');
            setBiometrics({
                heartRate: data.heartRate,
                sleepQuality: data.sleepQuality,
                recoveryScore: data.recoveryScore
            });
            setIsDerived(data.derived || false);
        } catch (error) {
            console.error('Failed to fetch biometrics:', error);
        }
    };

    useEffect(() => {
        fetchBiometrics();
    }, []);

    const handleSync = async () => {
        setIsSyncing(true);
        setSyncStatus('syncing');

        // Simulated sync delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const { data } = await api.put('/ai/wearable-sync', {
                heartRate: biometrics.heartRate,
                sleepQuality: biometrics.sleepQuality
            });
            setBiometrics(data);
            setSyncStatus('success');
            setTimeout(() => setSyncStatus('idle'), 3000);
        } catch (error) {
            console.error('Sync failed:', error);
            setSyncStatus('error');
        } finally {
            setIsSyncing(false);
        }
    };

    return (
        <div className="glass-card p-8 border-white/5 bg-black relative overflow-hidden">
            <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

            <header className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/20 rounded-2xl border border-primary/30 text-primary-light">
                        <Watch size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic">Wearable Link</h3>
                        <span className="text-[10px] font-black text-dark-muted uppercase tracking-widest mt-1 block">
                            {isDerived ? '🧬 AI-Derived Profile Baseline' : 'Virtual Biometric Bridge v1.2'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleSync}
                    disabled={isSyncing}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${syncStatus === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        syncStatus === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                            'bg-primary text-white hover:bg-primary-light'
                        }`}
                >
                    {isSyncing ? <RefreshCw size={14} className="animate-spin" /> : syncStatus === 'success' ? <CheckCircle2 size={14} /> : <RefreshCw size={14} />}
                    {isSyncing ? 'Syncing...' : syncStatus === 'success' ? 'Linked' : 'Sync Device'}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {/* Heart Rate */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <Activity className="text-red-500" size={20} />
                        <span className="text-[8px] font-black text-dark-muted uppercase">Resting HR</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <input
                            type="range" min="40" max="120"
                            value={biometrics.heartRate}
                            onChange={(e) => setBiometrics({ ...biometrics, heartRate: parseInt(e.target.value) })}
                            className="w-full accent-red-500"
                        />
                        <span className="text-2xl font-black text-white font-mono">{biometrics.heartRate}</span>
                        <span className="text-[10px] font-black text-dark-muted">BPM</span>
                    </div>
                </div>

                {/* Sleep Quality */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-4">
                        <Moon className="text-indigo-400" size={20} />
                        <span className="text-[8px] font-black text-dark-muted uppercase">Sleep Score</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <input
                            type="range" min="0" max="100"
                            value={biometrics.sleepQuality}
                            onChange={(e) => setBiometrics({ ...biometrics, sleepQuality: parseInt(e.target.value) })}
                            className="w-full accent-indigo-400"
                        />
                        <span className="text-2xl font-black text-white font-mono">{biometrics.sleepQuality}</span>
                        <span className="text-[10px] font-black text-dark-muted">%</span>
                    </div>
                </div>

                {/* Recovery Score */}
                <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="scanline opacity-20" />
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <RefreshCw size={16} className="text-primary-light" />
                        </div>
                        <span className="text-[8px] font-black text-primary-light uppercase">Readiness</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-4xl font-black text-white group-hover:scale-110 transition-transform font-mono">{biometrics.recoveryScore}</span>
                        <span className="text-[10px] font-black text-dark-muted uppercase tracking-[3px]">Total Recovery</span>
                    </div>
                </div>
            </div>

            <footer className="mt-8 pt-8 border-t border-white/5 flex items-center gap-4 relative z-10">
                <AlertCircle className="text-dark-muted" size={16} />
                <p className="text-[10px] font-bold text-dark-muted uppercase leading-relaxed max-w-lg">
                    Biometric data is simulated for tactical readiness assessment. Actual wearable integration requires FITPULSE-BRIDGE protocol setup.
                </p>
            </footer>
        </div>
    );
};

export default WearableSync;
