import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './pages/auth/Login';
import { Dashboard } from './pages/Dashboard';
import { HireSmart } from './pages/HireSmart';
import { AutoMatch } from './pages/AutoMatch';
import { SalaryAnalysis } from './pages/SalaryAnalysis';
import { Analytics } from './pages/Analytics';
import { Messages } from './pages/Messages';
import { Settings } from './pages/Settings';
import { HelpInfo } from './pages/HelpInfo';
import './styles/globals.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<Login />} />
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/hiresmart"
      element={
        <ProtectedRoute>
          <HireSmart />
        </ProtectedRoute>
      }
    />
    <Route
      path="/automatch"
      element={
        <ProtectedRoute>
          <AutoMatch />
        </ProtectedRoute>
      }
    />
    <Route
      path="/salary-analysis"
      element={
        <ProtectedRoute>
          <SalaryAnalysis />
        </ProtectedRoute>
      }
    />
    <Route
      path="/analytics"
      element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/messages"
      element={
        <ProtectedRoute>
          <Messages />
        </ProtectedRoute>
      }
    />
    <Route
      path="/settings"
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/help"
      element={
        <ProtectedRoute>
          <HelpInfo />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
