import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Homepage } from './pages/public/Homepage';
import { Login } from './pages/public/Login';
import { Register } from './pages/public/Register';
import { Recovery } from './pages/public/Recovery';
import { ActivitiesList } from './pages/public/ActivitiesList';
import { ActivityDetail } from './pages/public/ActivityDetail';
import { Dashboard } from './pages/Dashboard';
import { MyEnrollments } from './pages/participant/MyEnrollments';
import { Certificates } from './pages/participant/Certificates';
import { AdminActivities } from './pages/admin/AdminActivities';
import { CreateActivity } from './pages/admin/CreateActivity';
import { UsersList } from './pages/admin/UsersList';
import { TournamentsList } from './pages/tournaments/TournamentsList';
import { MatchBracket } from './pages/tournaments/MatchBracket';
import { Reports } from './pages/admin/Reports';
import { LayoutAutenticado } from './components/layout/LayoutAutenticado';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isOrganizer, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isOrganizer) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const AdminOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const ParticipantRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isParticipant, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isParticipant) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/activities" element={<ActivitiesList />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LayoutAutenticado>
                  <Dashboard />
                </LayoutAutenticado>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-enrollments"
            element={
              <ParticipantRoute>
                <LayoutAutenticado>
                  <MyEnrollments />
                </LayoutAutenticado>
              </ParticipantRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ParticipantRoute>
                <LayoutAutenticado>
                  <Certificates />
                </LayoutAutenticado>
              </ParticipantRoute>
            }
          />

          <Route
            path="/admin/activities"
            element={
              <AdminRoute>
                <LayoutAutenticado>
                  <AdminActivities />
                </LayoutAutenticado>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/activities/new"
            element={
              <AdminRoute>
                <LayoutAutenticado>
                  <CreateActivity />
                </LayoutAutenticado>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/activities/edit/:id"
            element={
              <AdminRoute>
                <LayoutAutenticado>
                  <CreateActivity />
                </LayoutAutenticado>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminOnlyRoute>
                <LayoutAutenticado>
                  <UsersList />
                </LayoutAutenticado>
              </AdminOnlyRoute>
            }
          />
          <Route
            path="/admin/tournaments"
            element={
              <AdminRoute>
                <LayoutAutenticado>
                  <TournamentsList />
                </LayoutAutenticado>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/tournaments/:id/matches"
            element={
              <AdminRoute>
                <LayoutAutenticado>
                  <MatchBracket />
                </LayoutAutenticado>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminRoute>
                <LayoutAutenticado>
                  <Reports />
                </LayoutAutenticado>
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
  );
};
