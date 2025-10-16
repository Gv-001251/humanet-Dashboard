import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard,
  Target,
  BookOpen,
  TrendingUp,
  MessageSquare,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Award
} from 'lucide-react';

export const EmployeeSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode } = useTheme();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/employee/dashboard' },
    { icon: Target, label: 'My Tasks', path: '/employee/tasks' },
    { icon: BookOpen, label: 'Skill Enhancer', path: '/employee/portal' },
    { icon: Award, label: 'My Projects', path: '/employee/projects' },
    { icon: TrendingUp, label: 'Progress', path: '/employee/progress' },
    { icon: MessageSquare, label: 'Messages', path: '/employee/messages' },
    { icon: Bell, label: 'Notices', path: '/employee/notices' },
    { icon: Settings, label: 'Settings', path: '/employee/settings' },
  ];

  return (
    <div className={`w-64 h-screen fixed left-0 top-0 border-r flex flex-col justify-between ${
      darkMode 
        ? 'bg-gradient-to-b from-gray-800 to-gray-900 border-gray-700' 
        : 'bg-gradient-to-b from-blue-50 to-white border-gray-200'
    }`}>
      <div>
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Humanet</h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Employee Portal</p>
            </div>
          </div>
        </div>
        <nav className="px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : darkMode 
                      ? 'text-gray-300 hover:bg-gray-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 ${
          darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
        }`}>
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Help & Info</span>
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
            darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};
