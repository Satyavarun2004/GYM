import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, AlertCircle, CheckCircle2, Volume2, X } from 'lucide-react';

const VisionLens = ({ onDeactivate, onRepCount, isCompact = false }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [feedback, setFeedback] = useState('Stand in view to begin analysis');
    const [isVulnerable, setIsVulnerable] = useState(false);
    const [repCount, setRepCount] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [lastPos, setLastPos] = useState('up'); // track up/down for rep counting

    const speak = (text) => {
        if (isMuted || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new Uint8Array(20); // Dummy for type check, actual code below
        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = 1.1;
        msg.pitch = 0.9;
        window.speechSynthesis.speak(msg);
    };

    useEffect(() => {
        let animationFrame;
        let lastSpeakTime = 0;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                const drawDummySkelton = () => {
                    if (!canvasRef.current) return;
                    const ctx = canvasRef.current.getContext('2d');
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

                    // Simulated Skeletal Lines
                    ctx.strokeStyle = '#8B5CF6';
                    ctx.lineWidth = 4;
                    ctx.lineCap = 'round';

                    // Draw a flickering "neural" skeleton
                    const time = Date.now() / 500;
                    const offset = Math.sin(time) * 20;

                    ctx.beginPath();
                    ctx.moveTo(300, 100 + offset); // Shoulder left
                    ctx.lineTo(500, 100 + offset); // Shoulder right
                    ctx.lineTo(500, 300 + offset / 2); // Hip right
                    ctx.lineTo(300, 300 + offset / 2); // Hip left
                    ctx.closePath();
                    ctx.stroke();

                    // Simulated Feedback & Rep Counting
                    const now = Date.now();
                    if (now - lastSpeakTime > 3000) { // Limit speech frequency
                        if (offset < -15 && lastPos === 'up') {
                            setFeedback('Descending... Keep back straight');
                            setLastPos('down');
                        } else if (offset > 15 && lastPos === 'down') {
                            const newCount = repCount + 1;
                            setRepCount(newCount);
                            if (onRepCount) onRepCount(newCount);
                            setFeedback(`REP ${newCount}! Great extension.`);
                            speak(`Rep ${newCount}`);
                            setLastPos('up');
                            lastSpeakTime = now;
                        } else if (Math.random() < 0.01) {
                            setFeedback('Correcting posture...');
                            speak('Keep your core engaged');
                            lastSpeakTime = now;
                        }
                    }

                    animationFrame = requestAnimationFrame(drawDummySkelton);
                };
                drawDummySkelton();
            } catch (err) {
                console.error("Camera access denied", err);
                setFeedback('Camera access required');
            }
        };

        startCamera();

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [repCount, lastPos, isMuted]);

    return (
        <div className={`relative bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl ${isCompact ? 'h-72' : 'h-[550px]'}`}>
            <video
                ref={videoRef} autoPlay playsInline muted
                className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
                width={1280} height={720}
            />

            {/* Overlay Header */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white">Neural Lens Active</span>
                    </div>
                    <div className="bg-primary/20 backdrop-blur-md px-3 py-2 rounded-xl border border-primary/30">
                        <span className="text-[10px] font-black text-white mr-2">REPS:</span>
                        <span className="text-xl font-black text-primary-light font-mono">{repCount}</span>
                    </div>
                </div>

                <div className="flex gap-2 pointer-events-auto">
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        className={`p-2 backdrop-blur-md rounded-lg border border-white/10 text-white transition-colors ${isMuted ? 'bg-red-500/20' : 'bg-black/60'}`}
                    >
                        <Volume2 size={16} className={isMuted ? 'opacity-50' : 'opacity-100'} />
                    </button>
                    {onDeactivate && (
                        <button
                            onClick={onDeactivate}
                            className="p-2 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 text-white hover:bg-red-500/20 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Feedback Bar */}
            <div className="absolute bottom-4 left-4 right-4">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`p-4 rounded-2xl backdrop-blur-xl border-l-4 shadow-2xl ${isVulnerable ? 'bg-red-500/20 border-red-500' : 'bg-primary/20 border-primary'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        {isVulnerable ? <AlertCircle className="text-red-500" size={18} /> : <CheckCircle2 className="text-primary-light" size={18} />}
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">AI Suggestion</p>
                            <p className="text-sm font-bold text-white italic">{feedback}</p>
                        </div>
                        {isVulnerable && !isCompact && (
                            <button className="ml-auto p-2 bg-white/5 rounded-lg text-red-400">
                                <Volume2 size={16} />
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Scanline Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                <div className="w-full h-2 bg-primary/20 animate-scanline"></div>
            </div>
        </div>
    );
};

export default VisionLens;
