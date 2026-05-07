import { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AuthContext from '../context/AuthContext';
import socket from '../socket';

const Layout = () => {
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user?._id) {
            socket.emit('join_room', user._id);
        }
    }, [user]);

    return (
        <div className="flex min-h-screen bg-dark-bg text-dark-text relative overflow-hidden font-sans">
            {/* Ambient Background Blur & Cyber Elements */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 cyber-grid opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-secondary/20 rounded-full blur-[120px] opacity-20 animate-pulse transition-all duration-[5000ms]"></div>
                <div className="scanline"></div>
            </div>

            <Sidebar />
            <main className="flex-1 lg:ml-72 min-h-screen relative z-10">
                <div className="p-6 md:p-10 pt-24 lg:pt-10 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
