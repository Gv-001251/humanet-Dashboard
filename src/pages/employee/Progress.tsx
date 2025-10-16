import React, { useState } from 'react';
import { EmployeeSidebar } from '../../components/layout/EmployeeSidebar';
import { Header } from '../../components/layout/Header';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  TrendingUp, 
  Award, 
  Target,
  Calendar,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Trophy,
  BarChart3,
  Activity
} from 'lucide-react';

interface PerformanceMetric {
  month: string;
  tasksCompleted: number;
  pointsEarned: number;
  accuracy: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string;
  category: 'Skills' | 'Projects' | 'Tasks' | 'Collaboration';
}

interface SkillGrowth {
  skill: string;
  startLevel: number;
  currentLevel: number;
  growth: number;
}

const Progress: React.FC = () => {
  const { darkMode } = useTheme();

  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const performanceData: PerformanceMetric[] = [
    { month: 'May', tasksCompleted: 12, pointsEarned: 180, accuracy: 85 },
    { month: 'Jun', tasksCompleted: 15, pointsEarned: 225, accuracy: 88 },
    { month: 'Jul', tasksCompleted: 18, pointsEarned: 270, accuracy: 90 },
    { month: 'Aug', tasksCompleted: 20, pointsEarned: 300, accuracy: 87 },
    { month: 'Sep', tasksCompleted: 22, pointsEarned: 330, accuracy: 92 },
    { month: 'Oct', tasksCompleted: 25, pointsEarned: 375, accuracy: 89 },
  ];

  const achievements: Achievement[] = [
    { id: 'A1', title: 'Fast Learner', description: 'Completed 5 courses in one month', icon: '🚀', earnedDate: '2025-09-15', category: 'Skills' },
    { id: 'A2', title: 'Team Player', description: 'Collaborated on 3 major projects', icon: '🤝', earnedDate: '2025-09-01', category: 'Collaboration' },
    { id: 'A3', title: 'Perfect Score', description: '100% accuracy for 2 weeks straight', icon: '🎯', earnedDate: '2025-08-20', category: 'Tasks' },
    { id: 'A4', title: 'Level Master', description: 'Reached Level 4 in Portal', icon: '⭐', earnedDate: '2025-08-10', category: 'Skills' },
    { id: 'A5', title: 'Code Warrior', description: 'Completed 50 coding tasks', icon: '💻', earnedDate: '2025-07-25', category: 'Tasks' },
    { id: 'A6', title: 'Project Hero', description: 'Led successful project delivery', icon: '🏆', earnedDate: '2025-07-01', category: 'Projects' },
  ];

  const skillGrowth: SkillGrowth[] = [
    { skill: 'React', startLevel: 60, currentLevel: 85, growth: 25 },
    { skill: 'TypeScript', startLevel: 40, currentLevel: 65, growth: 25 },
    { skill: 'Node.js', startLevel: 45, currentLevel: 60, growth: 15 },
    { skill: 'Tailwind CSS', startLevel: 50, currentLevel: 80, growth: 30 },
    { skill: 'Git', startLevel: 70, currentLevel: 90, growth: 20 },
  ];

  const currentStats = {
    totalPoints: 1680,
    tasksCompleted: 112,
    currentLevel: 'L4',
    averageAccuracy: 88,
    currentStreak: 12,
    rank: 5,
    totalEmployees: 32,
  };

  const recentActivity = [
    { date: '2025-10-14', action: 'Completed task: Product Page Component', points: 15 },
    { date: '2025-10-13', action: 'Earned achievement: Fast Learner', points: 50 },
    { date: '2025-10-12', action: 'Updated skill: React to 85%', points: 10 },
    { date: '2025-10-11', action: 'Completed project milestone', points: 30 },
    { date: '2025-10-10', action: 'Completed 3 tasks in one day', points: 25 },
  ];

  const categoryColors = {
    Skills: 'bg-blue-100 text-blue-700',
    Projects: 'bg-purple-100 text-purple-700',
    Tasks: 'bg-green-100 text-green-700',
    Collaboration: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <EmployeeSidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              My Progress
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Track your performance, skill growth, and achievements over time
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2 mb-8">
            {(['week', 'month', 'quarter', 'year'] as const).map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <Trophy className={`w-10 h-10 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <span className="text-green-600 text-sm font-semibold">+15%</span>
              </div>
              <h3 className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentStats.totalPoints}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Points</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className={`w-10 h-10 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <span className="text-green-600 text-sm font-semibold">+22%</span>
              </div>
              <h3 className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentStats.tasksCompleted}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks Completed</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <Target className={`w-10 h-10 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className="text-blue-600 text-sm font-semibold">{currentStats.averageAccuracy}%</span>
              </div>
              <h3 className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentStats.currentLevel}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Level</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <Zap className={`w-10 h-10 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <span className="text-purple-600 text-sm font-semibold">🔥</span>
              </div>
              <h3 className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {currentStats.currentStreak}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Day Streak</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Performance Chart */}
            <div className="lg:col-span-2 space-y-8">
              <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Performance Trends
                </h2>
                
                {/* Tasks Completed Chart */}
                <div className="mb-8">
                  <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tasks Completed (Last 6 Months)
                  </h3>
                  <div className="flex items-end gap-4 h-48">
                    {performanceData.map((data, index) => {
                      const maxTasks = Math.max(...performanceData.map(d => d.tasksCompleted));
                      const height = (data.tasksCompleted / maxTasks) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex flex-col justify-end h-full">
                            <div
                              className="bg-blue-600 rounded-t-lg relative group cursor-pointer hover:bg-blue-700 transition"
                              style={{ height: `${height}%` }}
                            >
                              <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition ${
                                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                              } px-2 py-1 rounded text-xs whitespace-nowrap`}>
                                {data.tasksCompleted} tasks
                              </div>
                            </div>
                          </div>
                          <span className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {data.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Points Earned Chart */}
                <div>
                  <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Points Earned (Last 6 Months)
                  </h3>
                  <div className="flex items-end gap-4 h-48">
                    {performanceData.map((data, index) => {
                      const maxPoints = Math.max(...performanceData.map(d => d.pointsEarned));
                      const height = (data.pointsEarned / maxPoints) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div className="w-full flex flex-col justify-end h-full">
                            <div
                              className="bg-green-600 rounded-t-lg relative group cursor-pointer hover:bg-green-700 transition"
                              style={{ height: `${height}%` }}
                            >
                              <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition ${
                                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-900 text-white'
                              } px-2 py-1 rounded text-xs whitespace-nowrap`}>
                                {data.pointsEarned} pts
                              </div>
                            </div>
                          </div>
                          <span className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {data.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Skill Growth */}
              <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Skill Growth
                </h2>
                <div className="space-y-4">
                  {skillGrowth.map(skill => (
                    <div key={skill.skill}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {skill.skill}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {skill.startLevel}% → {skill.currentLevel}%
                          </span>
                          <span className="text-sm font-bold text-green-600">+{skill.growth}%</span>
                        </div>
                      </div>
                      <div className="relative w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gray-400 h-3 rounded-full absolute"
                          style={{ width: `${skill.startLevel}%` }}
                        />
                        <div
                          className="bg-blue-600 h-3 rounded-full absolute transition-all"
                          style={{ width: `${skill.currentLevel}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Leaderboard Position */}
              <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Leaderboard Rank
                </h2>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-blue-600 mb-2">#{currentStats.rank}</div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Out of {currentStats.totalEmployees} employees
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} text-center`}>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                    🎯 You're in the top 16%!
                  </p>
                </div>
              </div>

              {/* Recent Achievements */}
              <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Achievements
                </h2>
                <div className="space-y-3">
                  {achievements.slice(0, 4).map(achievement => (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {achievement.title}
                          </h3>
                          <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {achievement.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${categoryColors[achievement.category]}`}>
                              {achievement.category}
                            </span>
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              {achievement.earnedDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-blue-600 hover:underline text-sm font-medium">
                  View All Achievements
                </button>
              </div>

              {/* Recent Activity */}
              <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className={`pb-3 border-b last:border-b-0 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="flex items-start justify-between mb-1">
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          {activity.action}
                        </p>
                        <span className="text-xs font-bold text-green-600">+{activity.points}</span>
                      </div>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {activity.date}
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

export default Progress;
