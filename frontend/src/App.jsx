import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Placeholder for Dashboard
// const Dashboard = () => <div className="text-white text-center mt-20">Dashboard Coming Soon</div>;
import Dashboard from './pages/Dashboard/Dashboard';
import ChallengeList from './pages/Challenges/ChallengeList';
import CreateChallenge from './pages/Challenges/CreateChallenge';
import Leaderboard from './pages/Leaderboard';
import Activity from './pages/Activity';
import Layout from './components/Layout';
import AdminChat from './pages/AdminChat';
import ExerciseLibrary from './pages/Exercises/ExerciseLibrary';
import ExerciseList from './pages/Exercises/ExerciseList';
import Analytics from './pages/Analytics';
import Gallery from './pages/Gallery';
import Achievements from './pages/Achievements';
import History from './pages/History';

import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/challenges" element={<ChallengeList />} />
              <Route path="/challenges/create" element={<CreateChallenge />} />
              <Route path="/activity" element={<Activity />} />
              <Route path="/exercises" element={<ExerciseLibrary />} />
              <Route path="/exercises/:bodyPart" element={<ExerciseList />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/history" element={<History />} />
              <Route path="/admin-chat" element={<AdminChat />} />
              <Route path="/profile" element={<div className="text-center p-10">Profile Coming Soon</div>} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
