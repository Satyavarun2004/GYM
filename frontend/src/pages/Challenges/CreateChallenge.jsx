import { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import PageTransition from '../../components/PageTransition';

const CreateChallenge = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'steps',
        goal: '',
        durationDays: 7
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/challenges', formData);
            navigate('/challenges');
        } catch (error) {
            console.error(error);
            alert('Failed to create challenge');
        }
    };

    return (
        <PageTransition>
            <div className="max-w-2xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold">Create Challenge</h1>
                    <p className="text-dark-muted">Set a goal and invite others to join.</p>
                </header>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-8"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">Challenge Title</label>
                            <input
                                type="text"
                                className="input-field"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">Description</label>
                            <textarea
                                className="input-field min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-dark-muted mb-2">Type</label>
                                <select
                                    className="input-field"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="steps">Steps</option>
                                    <option value="calories">Calories</option>
                                    <option value="duration">Duration (mins)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-dark-muted mb-2">Goal Target</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={formData.goal}
                                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                                    required
                                    placeholder={formData.type === 'steps' ? 'e.g. 10000' : 'e.g. 500'}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-muted mb-2">Duration (Days)</label>
                            <input
                                type="number"
                                className="input-field"
                                value={formData.durationDays}
                                onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                                required
                            />
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                                <Plus size={20} />
                                Create Challenge
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </PageTransition>
    );
};

export default CreateChallenge;
