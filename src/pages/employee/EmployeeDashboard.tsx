import React from 'react';
import { EmployeeSidebar } from '../../components/layout/EmployeeSidebar';
import { Header } from '../../components/layout/Header';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Trophy,
  Zap
} from 'lucide-react';

// Mock employee data - in real app, this comes from backend based on logged-in user
const employeeData = {
  id: 'EMP01',
  name: 'Bagus Fikri',
  email: 'bagus.fikri@humanet.com',
  role: 'Frontend Developer',
  department: 'Engineering',
  currentLevel: 'L4',
  joinedDate: '2020-10-29',
  stats: {
    tasksCompleted: 32,
    tasksInProgress: 5,
    tasksPending: 3,
    totalPoints: 485,
    accuracy: 87,
    currentStreak: 12,
  },
  recentTasks: [
    { id: 'T001', title: 'Complete React Dashboard', status: 'In Progress', dueDate: '2025-10-20', priority: 'High' },
    { id: 'T002', title: 'Code Review - API Integration', status: 'Pending', dueDate: '2025-10-18', priority: 'Medium' },
    { id: 'T003', title: 'Unit Tests for Auth Module', status: 'Completed', dueDate: '2025-10-15', priority: 'High' },
  ],
  projects: [
    { id: 'PROJ01', name: 'E-Commerce Website Redesign', progress: 65, role: 'Lead Developer' },
    { id: 'PROJ02', name: 'Mobile App Development', progress: 40, role: 'Frontend Developer' },
  ],
  levelProgress: {
    L1: 100, L2: 100, L3: 100, L4: 60, L5: 0, L6: 0, L7: 0, L8: 0
  },
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Git'],
  upcomingMeetings: [
    { title: 'Sprint Planning', time: '10:00 AM', date: 'Oct 15' },
    { title: '1-on-1 with Manager', time: '3:00 PM', date: 'Oct 16' },
  ],
};

export const EmployeeDashboard: React.FC = () => {
  const { darkMode } = useTheme();

  const statusColors = {
    'Completed': 'bg-green-100 text-green-700 border-green-200',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
    'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  };

  const priorityColors = {
    'High': 'text-red-600',
    'Medium': 'text-orange-600',
    'Low': 'text-green-600',
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <EmployeeSidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back, {employeeData.name}! 👋
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {employeeData.role} • {employeeData.department} • Level {employeeData.currentLevel}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-blue-900' : 'bg-blue-50'
                }`}>
                  <CheckCircle className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
                <span className="text-green-600 text-sm font-semibold">+12%</span>
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {employeeData.stats.tasksCompleted}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks Completed</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-orange-900' : 'bg-orange-50'
                }`}>
                  <Clock className={`w-6 h-6 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                </div>
                <span className="text-orange-600 text-sm font-semibold">{employeeData.stats.tasksInProgress}</span>
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {employeeData.stats.tasksInProgress}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-purple-900' : 'bg-purple-50'
                }`}>
                  <Trophy className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <span className="text-purple-600 text-sm font-semibold">{employeeData.stats.accuracy}%</span>
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {employeeData.stats.totalPoints}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Points</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-green-900' : 'bg-green-50'
                }`}>
                  <Zap className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                </div>
                <span className="text-green-600 text-sm font-semibold">🔥</span>
              </div>
              <h3 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {employeeData.stats.currentStreak}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Tasks */}
            <div className="lg:col-span-2">
              <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Recent Tasks
                  </h2>
                  <button className="text-blue-600 hover:underline text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-4">
                  {employeeData.recentTasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded border ${statusColors[task.status as keyof typeof statusColors]}`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Due: {task.dueDate}
                        </span>
                        <span className={priorityColors[task.priority as keyof typeof priorityColors]}>
                          • {task.priority} Priority
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className={`rounded-xl shadow-sm p-6 mt-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Active Projects
                </h2>
                <div className="space-y-4">
                  {employeeData.projects.map(project => (
                    <div key={project.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {project.name}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {project.role}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-blue-600">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Portal Progress */}
              <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Portal Progress
                </h2>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-blue-600 mb-1">{employeeData.currentLevel}</div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Level</p>
                </div>
                <div className="space-y-2">
                  {Object.entries(employeeData.levelProgress).map(([level, progress]) => (
                    <div key={level} className="flex items-center gap-2">
                      <span className={`text-xs font-semibold w-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {level}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {progress}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  My Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {employeeData.skills.map(skill => (
                    <span
                      key={skill}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Upcoming Meetings */}
              <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Upcoming Meetings
                </h2>
                <div className="space-y-3">
                  {employeeData.upcomingMeetings.map((meeting, index) => (
                    <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {meeting.title}
                      </h3>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {meeting.date} at {meeting.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
