import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Plus, Trash2, Calendar, Weight, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import PageTransition from '../components/PageTransition';

const Gallery = () => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [newPhoto, setNewPhoto] = useState({ image: null, weight: '', note: '' });
    const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchPhotos();
    }, []);

    const fetchPhotos = async () => {
        try {
            const res = await api.get('/api/photos');
            setPhotos(res.data);
        } catch (error) {
            console.error('Error fetching photos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!newPhoto.image) return alert('Please select an image');

        setIsUploading(true);
        const formData = new FormData();
        formData.append('image', newPhoto.image);
        formData.append('weight', newPhoto.weight);
        formData.append('note', newPhoto.note);

        try {
            await api.post('/api/photos', formData);
            setNewPhoto({ image: null, weight: '', note: '' });
            fetchPhotos();
        } catch (error) {
            console.error('Upload failed:', error);
            alert(error.response?.data?.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/photos/${id}`);
            setPhotos(photos.filter(p => p._id !== id));
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    return (
        <PageTransition>
            <div className="p-6 space-y-8 max-w-6xl mx-auto h-full overflow-y-auto">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter text-white italic">Transformation Hub</h1>
                        <p className="text-dark-muted font-bold tracking-widest text-[10px] uppercase mt-2">Visual Progress History</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass-card p-6 border-white/5 bg-gradient-to-br from-primary/10 to-transparent"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                    <Plus size={18} />
                                </div>
                                <h2 className="text-xs font-black uppercase tracking-widest text-white">Log Visual Entry</h2>
                            </div>

                            <form onSubmit={handleUpload} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-dark-muted uppercase tracking-widest mb-2 ml-1">Select Photo</label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="photo-upload"
                                            onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.files[0] })}
                                        />
                                        <label
                                            htmlFor="photo-upload"
                                            className="input-field py-3 pl-10 text-xs flex items-center cursor-pointer hover:border-primary/50 transition-colors"
                                        >
                                            {newPhoto.image ? newPhoto.image.name : 'Choose image...'}
                                        </label>
                                        <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={14} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-dark-muted uppercase tracking-widest mb-2 ml-1">Current Weight</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                className="input-field py-3 pl-10 text-xs"
                                                placeholder="kg"
                                                value={newPhoto.weight}
                                                onChange={(e) => setNewPhoto({ ...newPhoto, weight: e.target.value })}
                                                required
                                            />
                                            <Weight className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={14} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-dark-muted uppercase tracking-widest mb-2 ml-1">Notes</label>
                                        <input
                                            type="text"
                                            className="input-field py-3 text-xs"
                                            placeholder="Notes..."
                                            value={newPhoto.note}
                                            onChange={(e) => setNewPhoto({ ...newPhoto, note: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="btn-primary w-full py-3 text-[10px] font-black uppercase tracking-[3px] shadow-glow-purple disabled:opacity-50"
                                >
                                    {isUploading ? 'Registering...' : 'Add To Timeline'}
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    {/* Photo Feed */}
                    <div className="lg:col-span-2">
                        {loading ? (
                            <div className="text-center py-20 text-dark-muted font-bold tracking-widest uppercase text-xs">Developing film...</div>
                        ) : photos.length === 0 ? (
                            <div className="glass-card p-12 text-center border-dashed border-white/10">
                                <Camera className="mx-auto text-dark-muted mb-4" size={40} />
                                <p className="text-dark-muted font-bold uppercase tracking-widest text-xs">No transformation photos yet</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnimatePresence mode="popLayout">
                                    {photos.map((photo, index) => (
                                        <motion.div
                                            key={photo._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative glass-card p-4 border-white/5 hover:border-primary/30 transition-all"
                                        >
                                            <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative">
                                                <img
                                                    src={`${BACKEND_URL}${photo.imageUrl}`}
                                                    alt="Progress"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <button
                                                    onClick={() => handleDelete(photo._id)}
                                                    className="absolute top-2 right-2 p-2 bg-red-500/20 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 backdrop-blur-md hover:bg-red-500 transition-all"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                                    <div className="flex items-center justify-between text-white font-black text-xs">
                                                        <span>{photo.weight} kg</span>
                                                        <span className="opacity-60 text-[10px]">{new Date(photo.date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {photo.note && <p className="text-[10px] text-dark-muted font-medium italic border-l-2 border-primary/30 pl-3 py-1">{photo.note}</p>}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Gallery;
