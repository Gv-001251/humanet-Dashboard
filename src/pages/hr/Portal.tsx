import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { Trophy, CheckCircle, Clock, TrendingUp, Award, Target } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  level: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  points: number;
  timeLimit: string;
}

interface EmployeeProgress {
  id: string;
  name: string;
  avatarUrl: string;
  department: string;
  currentLevel: string;
  completedTasks: number;
  totalPoints: number;
  accuracy: number;
  lastActive: string;
  levelProgress: {
    L1: number;
    L2: number;
    L3: number;
    L4: number;
    L5: number;
    L6: number;
    L7: number;
    L8: number;
  };
}

const mockTasks: Task[] = [
  {
    id: 'T001',
    title: 'Basic React Components',
    description: 'Create functional components with props and state',
    level: 'L1',
    domain: 'Frontend Development',
    difficulty: 'Beginner',
    points: 10,
    timeLimit: '30 mins',
  },
  {
    id: 'T002',
    title: 'REST API Integration',
    description: 'Fetch data from API and display in UI',
    level: 'L2',
    domain: 'Frontend Development',
    difficulty: 'Beginner',
    points: 15,
    timeLimit: '45 mins',
  },
  {
    id: 'T003',
    title: 'State Management with Redux',
    description: 'Implement Redux for complex state handling',
    level: 'L3',
    domain: 'Frontend Development',
    difficulty: 'Intermediate',
    points: 25,
    timeLimit: '60 mins',
  },
  {
    id: 'T004',
    title: 'Authentication & Authorization',
    description: 'Implement JWT-based auth system',
    level: 'L4',
    domain: 'Backend Development',
    difficulty: 'Intermediate',
    points: 30,
    timeLimit: '90 mins',
  },
  {
    id: 'T005',
    title: 'Database Optimization',
    description: 'Optimize SQL queries and implement indexing',
    level: 'L5',
    domain: 'Backend Development',
    difficulty: 'Advanced',
    points: 40,
    timeLimit: '120 mins',
  },
  {
    id: 'T006',
    title: 'Microservices Architecture',
    description: 'Design and implement microservices',
    level: 'L6',
    domain: 'Software Architecture',
    difficulty: 'Advanced',
    points: 50,
    timeLimit: '180 mins',
  },
  {
    id: 'T007',
    title: 'Machine Learning Model',
    description: 'Build and train ML model for prediction',
    level: 'L7',
    domain: 'Artificial Intelligence',
    difficulty: 'Expert',
    points: 70,
    timeLimit: '240 mins',
  },
  {
    id: 'T008',
    title: 'System Design Challenge',
    description: 'Design scalable distributed system',
    level: 'L8',
    domain: 'System Design',
    difficulty: 'Expert',
    points: 100,
    timeLimit: '300 mins',
  },
];

const mockEmployeeProgress: EmployeeProgress[] = [
  {
    id: 'EMP01',
    name: 'Bagus Fikri',
    avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    department: 'Frontend Development',
    currentLevel: 'L4',
    completedTasks: 32,
    totalPoints: 485,
    accuracy: 87,
    lastActive: '2 hours ago',
    levelProgress: { L1: 100, L2: 100, L3: 100, L4: 60, L5: 0, L6: 0, L7: 0, L8: 0 },
  },
  {
    id: 'EMP02',
    name: 'Ihdizein',
    avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
    department: 'UI/UX Design',
    currentLevel: 'L3',
    completedTasks: 24,
    totalPoints: 320,
    accuracy: 92,
    lastActive: '1 day ago',
    levelProgress: { L1: 100, L2: 100, L3: 75, L4: 0, L5: 0, L6: 0, L7: 0, L8: 0 },
  },
  {
    id: 'EMP03',
    name: 'Mufti Hidayat',
    avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    department: 'Backend Development',
    currentLevel: 'L6',
    completedTasks: 58,
    totalPoints: 890,
    accuracy: 95,
    lastActive: '30 mins ago',
    levelProgress: { L1: 100, L2: 100, L3: 100, L4: 100, L5: 100, L6: 40, L7: 0, L8: 0 },
  },
  {
    id: 'EMP04',
    name: 'Fauzan Ardhiansyah',
    avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg',
    department: 'Frontend Development',
    currentLevel: 'L5',
    completedTasks: 45,
    totalPoints: 650,
    accuracy: 88,
    lastActive: '5 hours ago',
    levelProgress: { L1: 100, L2: 100, L3: 100, L4: 100, L5: 55, L6: 0, L7: 0, L8: 0 },
  },
];

const levels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];

const difficultyColors = {
  Beginner: 'bg-green-50 text-green-700',
  Intermediate: 'bg-blue-50 text-blue-700',
  Advanced: 'bg-orange-50 text-orange-700',
  Expert: 'bg-red-50 text-red-700',
};

const Portal: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('All Levels');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeProgress | null>(null);

  const filteredTasks = selectedLevel === 'All Levels' 
    ? mockTasks 
    : mockTasks.filter(task => task.level === selectedLevel);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Portal - SkillEnhancer & Task Assigner</h1>
            <p className="text-gray-600">
              Track employee skill progression through leveled tasks (L1-L8) and monitor performance analytics
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Employee Progress Tracking */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Employee Progress
                </h2>
                <div className="space-y-4">
                  {mockEmployeeProgress.map(employee => (
                    <div
                      key={employee.id}
                      onClick={() => setSelectedEmployee(employee)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                        selectedEmployee?.id === employee.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={employee.avatarUrl}
                          alt={employee.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-gray-900">{employee.name}</h3>
                          <p className="text-xs text-gray-600">{employee.department}</p>
                        </div>
                        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">
                          {employee.currentLevel}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-bold text-gray-900">{employee.completedTasks}</div>
                          <div className="text-gray-600">Tasks</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-bold text-gray-900">{employee.totalPoints}</div>
                          <div className="text-gray-600">Points</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="font-bold text-gray-900">{employee.accuracy}%</div>
                          <div className="text-gray-600">Accuracy</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Employee Detailed Progress */}
              {selectedEmployee && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    {selectedEmployee.name}'s Level Progress
                  </h3>
                  <div className="space-y-3">
                    {levels.map(level => (
                      <div key={level}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold text-gray-700">{level}</span>
                          <span className="text-xs font-bold text-gray-600">
                            {selectedEmployee.levelProgress[level as keyof typeof selectedEmployee.levelProgress]}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              selectedEmployee.levelProgress[level as keyof typeof selectedEmployee.levelProgress] === 100
                                ? 'bg-green-500'
                                : selectedEmployee.levelProgress[level as keyof typeof selectedEmployee.levelProgress] > 0
                                ? 'bg-blue-500'
                                : 'bg-gray-300'
                            }`}
                            style={{
                              width: `${selectedEmployee.levelProgress[level as keyof typeof selectedEmployee.levelProgress]}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Task Library */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    Task Library
                  </h2>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>All Levels</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  {filteredTasks.map(task => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">
                              {task.level}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${difficultyColors[task.difficulty]}`}>
                              {task.difficulty}
                            </span>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {task.domain}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-gray-900 mb-1">{task.title}</h3>
                          <p className="text-sm text-gray-600">{task.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{task.timeLimit}</span>
                          </div>
                          <div className="flex items-center gap-1 text-yellow-600">
                            <Trophy className="w-4 h-4" />
                            <span className="font-semibold">{task.points} pts</span>
                          </div>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">
                          Assign Task
                        </button>
                      </div>
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

export default Portal;
