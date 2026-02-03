import { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import CustomerDashboard from './CustomerDashboard';
import TrainerDashboard from './TrainerDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    // ProtectedRoute handles the null user check, but if we reach here with null user for some reason:
    if (!user) {
        return <div className="text-white text-center mt-20">Loading Dashboard Data...</div>;
    }

    switch (user.role) {
        case 'trainer':
            return <TrainerDashboard />;
        case 'admin':
            return <AdminDashboard />;
        case 'customer':
        default:
            return <CustomerDashboard />;
    }
};

export default Dashboard;
