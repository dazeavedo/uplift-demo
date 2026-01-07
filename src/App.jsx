import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Screens (will create these next)
import Login from './components/shared/Login';
import WorkerHome from './components/worker/WorkerHome';
import Schedule from './components/worker/Schedule';
import ShiftDetail from './components/worker/ShiftDetail';
import Grow from './components/worker/Grow';
import JobDetail from './components/worker/JobDetail';
import Applications from './components/worker/Applications';
import Profile from './components/worker/Profile';
import ManagerDashboard from './components/manager/ManagerDashboard';
import AISchedule from './components/manager/AISchedule';
import Team from './components/manager/Team';

// Protected Route wrapper
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
      <Route path="/worker" element={
        <ProtectedRoute requireWorker>
          <WorkerHome />
        </ProtectedRoute>
      } />
      <Route path="/worker/schedule" element={
        <ProtectedRoute requireWorker>
          <Schedule />
        </ProtectedRoute>
      } />
      <Route path="/worker/shift/:id" element={
        <ProtectedRoute requireWorker>
          <ShiftDetail />
        </ProtectedRoute>
      } />
      <Route path="/worker/grow" element={
        <ProtectedRoute requireWorker>
          <Grow />
        </ProtectedRoute>
      } />
      <Route path="/worker/job/:id" element={
        <ProtectedRoute requireWorker>
          <JobDetail />
        </ProtectedRoute>
      } />
      <Route path="/worker/applications" element={
        <ProtectedRoute requireWorker>
          <Applications />
        </ProtectedRoute>
      } />
      <Route path="/worker/profile" element={
        <ProtectedRoute requireWorker>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Manager Routes */}
      <Route path="/manager" element={
        <ProtectedRoute requireManager>
          <ManagerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/manager/schedule" element={
        <ProtectedRoute requireManager>
          <AISchedule />
        </ProtectedRoute>
      } />
      <Route path="/manager/team" element={
        <ProtectedRoute requireManager>
          <Team />
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={
        <Navigate to={isAuthenticated ? (isWorker ? '/worker' : '/manager') : '/login'} replace />
      } />
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
