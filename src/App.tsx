import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Dashboard } from './pages/Dashboard';
import { HireSmart } from './pages/HireSmart';
import { HireSmartResumeScreener } from './pages/HireSmartResumeScreener';
import { AutoMatch } from './pages/AutoMatch';
import { TalentScout } from './pages/TalentScout';
import { SalaryAnalysis } from './pages/SalaryAnalysis';
import { Analytics } from './pages/Analytics';
import { Messages } from './pages/Messages';
import { Settings } from './pages/Settings';
import { HelpInfo } from './pages/HelpInfo';
import './styles/globals.css';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/hiresmart" element={<HireSmart />} />
    <Route path="/hiresmart-resume-screener" element={<HireSmartResumeScreener />} />
    <Route path="/automatch" element={<AutoMatch />} />
    <Route path="/talent-scout" element={<TalentScout />} />
    <Route path="/salary-analysis" element={<SalaryAnalysis />} />
    <Route path="/analytics" element={<Analytics />} />
    <Route path="/messages" element={<Messages />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/help" element={<HelpInfo />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
