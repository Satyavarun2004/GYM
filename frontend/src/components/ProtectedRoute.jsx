import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);

    console.log('ProtectedRoute: Checking auth...', { user, loading });

    if (loading) {
        console.log('ProtectedRoute: Showing loading spinner');
        return (
            <div className="min-h-screen flex items-center justify-center bg-dark-bg">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        console.log('ProtectedRoute: No user, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    console.log('ProtectedRoute: User authorized, rendering Outlet');
    return <Outlet />;
};

export default ProtectedRoute;
