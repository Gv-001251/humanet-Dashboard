import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Login } from './pages/auth/Login';
import { HRDashboard } from './pages/hr/HRDashboard';
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import EmployeeList from './components/dashboard/EmployeeList';
import AutoMatch from './pages/hr/AutoMatch';
import HireSmart from './pages/hr/HireSmart';
import Portal from './pages/hr/Portal';
import SalaryPrediction from './pages/hr/SalaryPrediction';
import HRAssistance from './pages/hr/HRAssistance';
import Messages from './pages/hr/Messages';
import NoticeBoard from './pages/hr/NoticeBoard';
import Settings from './pages/hr/Settings';
import HelpInfo from './pages/hr/HelpInfo';
import SkillEnhancer from './pages/employee/SkillEnhancer';
import MyProjects from './pages/employee/MyProjects';
import Progress from './pages/employee/Progress';
import EmployeeMessages from './pages/employee/EmployeeMessages';
import EmployeeNotices from './pages/employee/EmployeeNotices';
import EmployeeSettings from './pages/employee/EmployeeSettings';
import EmployeeHelpInfo from './pages/employee/EmployeeHelpInfo';
import MyTasks from './pages/employee/MyTasks';
import DocumentFraudDetection from './pages/hr/DocumentFraudDetection';
import ProctoredInterview from './pages/hr/ProctoredInterview';
import HikeExpectationAnalyzer from './pages/hr/HikeExpectationAnalyzer'; 
import OfferManagement from './pages/hr/OfferManagement';
import './styles/globals.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hr/dashboard" element={<HRDashboard />} />
          <Route path="/hr/employee" element={<EmployeeList />} />
          <Route path="/hr/automatch" element={<AutoMatch />} />
          <Route path="/hr/hiresmart" element={<HireSmart />} />
          <Route path="/hr/hire" element={<HireSmart />} />
          <Route path="/hr/portal" element={<Portal />} />
          <Route path="/hr/salary-prediction" element={<SalaryPrediction />} />
          <Route path="/hr/hr-assistance" element={<HRAssistance />} />
          <Route path="/hr/messages" element={<Messages />} />
          <Route path="/hr/notice-board" element={<NoticeBoard />} />
          <Route path="/hr/settings" element={<Settings />} />
          <Route path="/hr/help-info" element={<HelpInfo />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/portal" element={<SkillEnhancer />} />
          <Route path="/employee/projects" element={<MyProjects />} />
          <Route path="/employee/progress" element={<Progress />} />
          <Route path="/employee/messages" element={<EmployeeMessages />} />
          <Route path="/employee/notices" element={<EmployeeNotices />} />
          <Route path='/employee/settings' element={<EmployeeSettings />} />
          <Route path='/employee/help-info' element={<EmployeeHelpInfo />} />
          <Route path="/employee/tasks" element={<MyTasks />} />
          <Route path="/hr/document-fraud-detection" element={<DocumentFraudDetection />} />
          <Route path="/hr/proctored-interview" element={<ProctoredInterview />} />
          <Route path="/hr/hike-expectation-analyzer" element={<HikeExpectationAnalyzer />} />
          <Route path="/hr/offer-management" element={<OfferManagement />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
