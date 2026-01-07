import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/design-system.css';

// Shared
import Login from './components/shared/Login';

// Worker
import WorkerHome from './components/worker/WorkerHome';
import Schedule from './components/worker/Schedule';
import ShiftDetail from './components/worker/ShiftDetail';
import ShiftSwapRequest from './components/worker/ShiftSwapRequest';
import ShiftSwapSent from './components/worker/ShiftSwapSent';
import Grow from './components/worker/Grow';
import JobDetail from './components/worker/JobDetail';
import Applications from './components/worker/Applications';
import Profile from './components/worker/Profile';
import Tasks from './components/worker/Tasks';
import Notifications from './components/worker/Notifications';

// Manager
import ManagerDashboard from './components/manager/ManagerDashboard';
import AISchedule from './components/manager/AISchedule';
import Team from './components/manager/Team';

// Error Boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh',
          background: 'var(--bg-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            marginBottom: '24px'
          }}>
            ⚠️
          </div>
          
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '900', 
            color: 'var(--text-primary)', 
            marginBottom: '12px',
            letterSpacing: '-0.5px'
          }}>
            Something went wrong
          </h1>
          
          <p style={{ 
            fontSize: '16px', 
            color: 'var(--text-secondary)',
            marginBottom: '32px',
            maxWidth: '400px',
            lineHeight: '1.5'
          }}>
            We encountered an unexpected error. Please try reloading the page.
          </p>

          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '16px 32px',
              background: 'var(--momentum-bright)',
              color: '#FFF',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(255, 115, 45, 0.3)'
            }}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProtectedRoute = ({ children, requireWorker, requireManager }) => {
  const { isAuthenticated, isWorker, isManager } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireWorker && !isWorker) {
    return <Navigate to="/manager" replace />;
  }

  if (requireManager && !isManager) {
    return <Navigate to="/worker" replace />;
  }

  return children;
};

function AppRoutes() {
  const { isAuthenticated, isWorker, isManager } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated 
          ? <Navigate to={isWorker ? '/worker' : '/manager'} replace /> 
          : <Login />
      } />

      {/* Worker Routes */}
      <Route path="/worker" element={<ProtectedRoute requireWorker><WorkerHome /></ProtectedRoute>} />
      <Route path="/worker/schedule" element={<ProtectedRoute requireWorker><Schedule /></ProtectedRoute>} />
      <Route path="/worker/shift/:id" element={<ProtectedRoute requireWorker><ShiftDetail /></ProtectedRoute>} />
      <Route path="/worker/shift/:id/swap" element={<ProtectedRoute requireWorker><ShiftSwapRequest /></ProtectedRoute>} />
      <Route path="/worker/shift/:id/swap/sent" element={<ProtectedRoute requireWorker><ShiftSwapSent /></ProtectedRoute>} />
      <Route path="/worker/grow" element={<ProtectedRoute requireWorker><Grow /></ProtectedRoute>} />
      <Route path="/worker/job/:id" element={<ProtectedRoute requireWorker><JobDetail /></ProtectedRoute>} />
      <Route path="/worker/applications" element={<ProtectedRoute requireWorker><Applications /></ProtectedRoute>} />
      <Route path="/worker/profile" element={<ProtectedRoute requireWorker><Profile /></ProtectedRoute>} />
      <Route path="/worker/tasks" element={<ProtectedRoute requireWorker><Tasks /></ProtectedRoute>} />
      <Route path="/worker/notifications" element={<ProtectedRoute requireWorker><Notifications /></ProtectedRoute>} />

      {/* Manager Routes */}
      <Route path="/manager" element={<ProtectedRoute requireManager><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/manager/schedule" element={<ProtectedRoute requireManager><AISchedule /></ProtectedRoute>} />
      <Route path="/manager/team" element={<ProtectedRoute requireManager><Team /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to={isAuthenticated ? (isWorker ? '/worker' : '/manager') : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
