import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import TrainerDashboard from './TrainerDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const auth = useContext(AuthContext);
    const user = auth?.user;

    console.log('DashboardRouter: Entry', { hasUser: !!user, role: user?.role });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-bold uppercase tracking-widest opacity-50 text-gradient">Initializing Dashboard...</p>
                </div>
            </div>
        );
    }

    try {
        switch (user.role) {
            case 'trainer':
                return <TrainerDashboard />;
            case 'admin':
                return <AdminDashboard />;
            case 'customer':
            default:
                return <CustomerDashboard />;
        }
    } catch (error) {
        console.error('DashboardRouter: Sub-dashboard Render Failed', error);
        throw error;
    }
};

export default Dashboard;
