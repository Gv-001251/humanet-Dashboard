import React, { useState } from 'react';
import { EmployeeSidebar } from '../../components/layout/EmployeeSidebar';
import { Header } from '../../components/layout/Header';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Award, 
  BookOpen, 
  TrendingUp, 
  Plus, 
  Check, 
  Target,
  Lightbulb,
  Star,
  Clock,
  ChevronRight
} from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  progress: number;
  category: string;
  dateAdded: string;
}

interface RecommendedSkill {
  id: string;
  name: string;
  category: string;
  reason: string;
  demand: 'High' | 'Medium' | 'Low';
  learningPath: string[];
}

interface PortalTask {
  id: string;
  title: string;
  level: string;
  skillsToLearn: string[];
  points: number;
  status: 'Locked' | 'Available' | 'In Progress' | 'Completed';
  progress: number;
}

const SkillEnhancer: React.FC = () => {
  const { darkMode } = useTheme();

  const [currentSkills, setCurrentSkills] = useState<Skill[]>([
    { id: 'S1', name: 'React', level: 'Advanced', progress: 85, category: 'Frontend', dateAdded: '2024-01-15' },
    { id: 'S2', name: 'TypeScript', level: 'Intermediate', progress: 65, category: 'Programming', dateAdded: '2024-02-20' },
    { id: 'S3', name: 'Tailwind CSS', level: 'Advanced', progress: 80, category: 'Frontend', dateAdded: '2024-03-10' },
    { id: 'S4', name: 'Node.js', level: 'Intermediate', progress: 60, category: 'Backend', dateAdded: '2024-04-05' },
    { id: 'S5', name: 'Git', level: 'Advanced', progress: 90, category: 'Tools', dateAdded: '2023-12-01' },
  ]);

  const [recommendedSkills] = useState<RecommendedSkill[]>([
    {
      id: 'RS1',
      name: 'Next.js',
      category: 'Frontend',
      reason: 'Based on your React expertise',
      demand: 'High',
      learningPath: ['SSR Basics', 'Routing', 'API Routes', 'Deployment'],
    },
    {
      id: 'RS2',
      name: 'GraphQL',
      category: 'Backend',
      reason: 'Complements your Node.js skills',
      demand: 'High',
      learningPath: ['Schema Design', 'Queries', 'Mutations', 'Apollo Client'],
    },
    {
      id: 'RS3',
      name: 'Docker',
      category: 'DevOps',
      reason: 'Essential for modern deployment',
      demand: 'High',
      learningPath: ['Containers', 'Images', 'Docker Compose', 'Kubernetes Basics'],
    },
    {
      id: 'RS4',
      name: 'MongoDB',
      category: 'Database',
      reason: 'Popular NoSQL database',
      demand: 'Medium',
      learningPath: ['CRUD Operations', 'Aggregation', 'Indexing', 'Mongoose'],
    },
  ]);

  const [portalTasks, setPortalTasks] = useState<PortalTask[]>([
    { id: 'PT1', title: 'Advanced React Patterns', level: 'L4', skillsToLearn: ['Custom Hooks', 'Context API', 'Performance Optimization'], points: 50, status: 'In Progress', progress: 60 },
    { id: 'PT2', title: 'TypeScript Deep Dive', level: 'L5', skillsToLearn: ['Generics', 'Advanced Types', 'Decorators'], points: 60, status: 'Available', progress: 0 },
    { id: 'PT3', title: 'Full-Stack Project', level: 'L5', skillsToLearn: ['REST API', 'Authentication', 'Database Design'], points: 80, status: 'Available', progress: 0 },
    { id: 'PT4', title: 'System Design Fundamentals', level: 'L6', skillsToLearn: ['Scalability', 'Load Balancing', 'Caching'], points: 100, status: 'Locked', progress: 0 },
  ]);

  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 'Beginner' as Skill['level'], category: '' });

  const handleAddSkill = () => {
    if (!newSkill.name.trim() || !newSkill.category.trim()) return;

    const skill: Skill = {
      id: `S${currentSkills.length + 1}`,
      name: newSkill.name,
      level: newSkill.level,
      progress: newSkill.level === 'Beginner' ? 25 : newSkill.level === 'Intermediate' ? 50 : newSkill.level === 'Advanced' ? 75 : 95,
      category: newSkill.category,
      dateAdded: new Date().toISOString().split('T')[0],
    };

    setCurrentSkills([...currentSkills, skill]);
    setNewSkill({ name: '', level: 'Beginner', category: '' });
    setShowAddSkillModal(false);

    // Simulate HR notification
    alert('✅ HR has been notified of your new skill addition!');
  };

  const handleUpdateProgress = (skillId: string, newProgress: number) => {
    setCurrentSkills(currentSkills.map(skill =>
      skill.id === skillId ? { ...skill, progress: newProgress } : skill
    ));
    // Notify HR
    alert('✅ Progress updated! HR has been notified.');
  };

  const levelColors = {
    Beginner: 'bg-green-100 text-green-700 border-green-200',
    Intermediate: 'bg-blue-100 text-blue-700 border-blue-200',
    Advanced: 'bg-purple-100 text-purple-700 border-purple-200',
    Expert: 'bg-red-100 text-red-700 border-red-200',
  };

  const demandColors = {
    High: 'text-red-600',
    Medium: 'text-orange-600',
    Low: 'text-green-600',
  };

  const statusColors = {
    Locked: 'bg-gray-100 text-gray-600',
    Available: 'bg-green-100 text-green-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Completed: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <EmployeeSidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Skill Enhancer
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Track your skills, discover new learning paths, and complete tasks to level up
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-3 mb-2">
                <Award className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentSkills.length}
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Current Skills</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className={`w-8 h-8 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {recommendedSkills.length}
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Recommended</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-3 mb-2">
                <Target className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {portalTasks.filter(t => t.status === 'Completed').length}/{portalTasks.length}
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks Completed</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className={`w-8 h-8 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {Math.round(currentSkills.reduce((sum, s) => sum + s.progress, 0) / currentSkills.length)}%
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Progress</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Current Skills */}
            <div className="lg:col-span-2">
              <div className={`rounded-xl shadow-sm p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    My Skills
                  </h2>
                  <button
                    onClick={() => setShowAddSkillModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Skill
                  </button>
                </div>

                <div className="space-y-4">
                  {currentSkills.map(skill => (
                    <div
                      key={skill.id}
                      className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {skill.name}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded border font-semibold ${levelColors[skill.level]}`}>
                            {skill.level}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-blue-600">{skill.progress}%</span>
                      </div>
                      <div className="mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${skill.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          {skill.category} • Added {skill.dateAdded}
                        </span>
                        <button
                          onClick={() => handleUpdateProgress(skill.id, Math.min(100, skill.progress + 10))}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Update Progress +10%
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portal Tasks */}
              <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Portal Learning Tasks
                </h2>
                <div className="space-y-4">
                  {portalTasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded">
                              {task.level}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-semibold ${statusColors[task.status]}`}>
                              {task.status}
                            </span>
                          </div>
                          <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {task.title}
                          </h3>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {task.skillsToLearn.map(skill => (
                              <span
                                key={skill}
                                className={`text-xs px-2 py-1 rounded ${
                                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-yellow-600 font-bold text-lg">{task.points}</div>
                          <div className="text-xs text-gray-500">points</div>
                        </div>
                      </div>
                      {task.status !== 'Locked' && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1 text-xs">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
                            <span className="font-semibold">{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {task.status === 'Available' && (
                        <button className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
                          Start Task
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Skills */}
            <div>
              <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Recommended to Learn
                </h2>
                <div className="space-y-4">
                  {recommendedSkills.map(skill => (
                    <div
                      key={skill.id}
                      className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {skill.name}
                        </h3>
                        <Star className={`w-5 h-5 ${demandColors[skill.demand]}`} />
                      </div>
                      <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {skill.reason}
                      </p>
                      <div className={`text-xs font-semibold mb-3 ${demandColors[skill.demand]}`}>
                        {skill.demand} Demand
                      </div>
                      <div className="mb-3">
                        <p className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                          Learning Path:
                        </p>
                        <div className="space-y-1">
                          {skill.learningPath.map((step, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                              <Check className="w-3 h-3 text-green-600" />
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-green-700 transition flex items-center justify-center gap-2">
                        Start Learning
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Add New Skill
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Skill Name
                </label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="e.g., Python, AWS, Docker"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Category
                </label>
                <input
                  type="text"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  placeholder="e.g., Frontend, Backend, DevOps"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Proficiency Level
                </label>
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddSkillModal(false)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium border ${
                    darkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSkill}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Add Skill
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillEnhancer;
