import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, AlertCircle, CheckCircle2, Volume2, X, RefreshCw } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as poseDetection from '@tensorflow-models/pose-detection';

const calculateAngle = (A, B, C) => {
    if (!A || !B || !C) return 0;
    const radians = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
};

const VisionLens = ({ onDeactivate, onRepCount, isCompact = false }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const detectorRef = useRef(null);
    
    const [feedback, setFeedback] = useState('Initializing Neural Network...');
    const [isVulnerable, setIsVulnerable] = useState(false);
    const [repCount, setRepCount] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Ref to handle stale state in requestAnimationFrame
    const stateRef = useRef({ lastPos: 'up', repCount: 0, lastSpeakTime: 0, isMuted: false });
    
    useEffect(() => {
        stateRef.current.isMuted = isMuted;
    }, [isMuted]);

    const speak = (text) => {
        if (stateRef.current.isMuted || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const msg = new SpeechSynthesisUtterance(text);
        msg.rate = 1.1;
        msg.pitch = 0.9;
        window.speechSynthesis.speak(msg);
    };

    useEffect(() => {
        let animationFrame;
        let active = true;

        const startCamera = async () => {
            try {
                await tf.ready();
                const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
                detectorRef.current = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
                
                const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        if (active) {
                            setIsLoading(false);
                            setFeedback('Stand in view to begin analysis');
                            videoRef.current.play();
                            detectPose();
                        }
                    };
                }
            } catch (err) {
                console.error("Camera access denied or model load failed", err);
                setFeedback('Error: Camera access required');
            }
        };

        const detectPose = async () => {
            if (!active || !videoRef.current || !detectorRef.current || !canvasRef.current) return;
            if (videoRef.current.readyState < 2) {
                animationFrame = requestAnimationFrame(detectPose);
                return;
            }

            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Scale drawing to match CSS sizing
            const scaleX = canvas.clientWidth / video.videoWidth;
            const scaleY = canvas.clientHeight / video.videoHeight;
            
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            try {
                const poses = await detectorRef.current.estimatePoses(video);
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                if (poses.length > 0) {
                    const keypoints = poses[0].keypoints;

                    // Draw Skeleton
                    ctx.fillStyle = '#8B5CF6';
                    ctx.strokeStyle = '#8B5CF6';
                    ctx.lineWidth = 4;
                    ctx.lineCap = 'round';

                    const adjacentKeyPoints = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet);
                    adjacentKeyPoints.forEach(([i, j]) => {
                        const kp1 = keypoints[i];
                        const kp2 = keypoints[j];
                        if (kp1.score > 0.3 && kp2.score > 0.3) {
                            ctx.beginPath();
                            ctx.moveTo(kp1.x * scaleX, kp1.y * scaleY);
                            ctx.lineTo(kp2.x * scaleX, kp2.y * scaleY);
                            ctx.stroke();
                        }
                    });

                    // Draw Keypoints
                    keypoints.forEach(kp => {
                        if (kp.score > 0.3) {
                            ctx.beginPath();
                            ctx.arc(kp.x * scaleX, kp.y * scaleY, 5, 0, 2 * Math.PI);
                            ctx.fill();
                        }
                    });

                    // Squat Logic
                    const leftHip = keypoints.find(k => k.name === 'left_hip');
                    const leftKnee = keypoints.find(k => k.name === 'left_knee');
                    const leftAnkle = keypoints.find(k => k.name === 'left_ankle');

                    if (leftHip?.score > 0.3 && leftKnee?.score > 0.3 && leftAnkle?.score > 0.3) {
                        const angle = calculateAngle(leftHip, leftKnee, leftAnkle);
                        
                        const now = Date.now();
                        const { lastPos, repCount, lastSpeakTime } = stateRef.current;

                        if (angle < 90 && lastPos === 'up') {
                            setFeedback('Good depth! Push up!');
                            setIsVulnerable(false);
                            stateRef.current.lastPos = 'down';
                        } else if (angle > 160 && lastPos === 'down') {
                            const newCount = repCount + 1;
                            setRepCount(newCount);
                            if (onRepCount) onRepCount(newCount);
                            
                            setFeedback(`REP ${newCount}! Great extension.`);
                            setIsVulnerable(false);
                            speak(`Rep ${newCount}`);
                            
                            stateRef.current.lastPos = 'up';
                            stateRef.current.repCount = newCount;
                            stateRef.current.lastSpeakTime = now;
                        }
                        
                        // Form correction
                        if (angle > 100 && angle < 140 && lastPos === 'down') {
                            if (now - lastSpeakTime > 3000) {
                                setFeedback('Go lower, hit 90 degrees!');
                                setIsVulnerable(true);
                                speak('Go lower');
                                stateRef.current.lastSpeakTime = now;
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Error during pose detection", err);
            }

            animationFrame = requestAnimationFrame(detectPose);
        };

        startCamera();

        return () => {
            active = false;
            if (animationFrame) cancelAnimationFrame(animationFrame);
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, [onRepCount]);

    return (
        <div className={`relative bg-black rounded-3xl overflow-hidden border border-white/10 shadow-2xl ${isCompact ? 'h-72' : 'h-[550px]'}`}>
            <video
                ref={videoRef} playsInline muted
                className="absolute inset-0 w-full h-full object-cover opacity-60 transform -scale-x-100"
            />
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100"
            />

            {/* Overlay Header */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`}></div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white">
                            {isLoading ? 'Loading Model' : 'Neural Lens Active'}
                        </span>
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
                <AnimatePresence mode="wait">
                    <motion.div
                        key={feedback}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-2xl backdrop-blur-xl border-l-4 shadow-2xl ${
                            isVulnerable ? 'bg-red-500/20 border-red-500' : 'bg-primary/20 border-primary'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {isVulnerable ? <AlertCircle className="text-red-500" size={18} /> : 
                             isLoading ? <RefreshCw className="text-yellow-500 animate-spin" size={18} /> : 
                             <CheckCircle2 className="text-primary-light" size={18} />}
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">
                                    {isLoading ? 'System Status' : 'AI Suggestion'}
                                </p>
                                <p className="text-sm font-bold text-white italic">{feedback}</p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default VisionLens;
