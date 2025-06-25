import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AdminDashboard from './pages/AdminDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import JobDetailsPage from './pages/JobDetailsPage';
import InterviewPage from './pages/InterviewPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './components/Navbar';

function RoleRoute({ role, children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/" />;
  return children;
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#f6f7fc', paddingTop: 64 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route 
            path="/admin" 
            element={
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route 
            path="/recruiter" 
            element={
              <RoleRoute role="recruiter">
                <RecruiterDashboard />
              </RoleRoute>
            }
          />
          <Route 
            path="/candidate" 
            element={
              <RoleRoute role="candidate">
                <CandidateDashboard />
              </RoleRoute>
            }
          />
          <Route 
            path="/job/:jobId" 
            element={<JobDetailsPage />}
          />
          <Route 
            path="/interview/:interviewId" 
            element={<InterviewPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
