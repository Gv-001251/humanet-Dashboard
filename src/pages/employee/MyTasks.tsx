import React, { useState } from 'react';
import { EmployeeSidebar } from '../../components/layout/EmployeeSidebar';
import { Header } from '../../components/layout/Header';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Calendar,
  User,
  FileText,
  Plus,
  Filter,
  Search,
  Flag,
  Tag,
  Paperclip
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Completed' | 'Overdue';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedBy: string;
  assignedDate: Date;
  dueDate: Date;
  category: 'Development' | 'Design' | 'Testing' | 'Documentation' | 'Meeting' | 'Review';
  project?: string;
  points: number;
  attachments?: number;
  comments?: number;
}

const MyTasks: React.FC = () => {
  const { darkMode } = useTheme();

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'T001',
      title: 'Complete Product Page Component',
      description: 'Build responsive product page with image gallery, price display, and add to cart functionality using React and Tailwind CSS',
      status: 'In Progress',
      priority: 'High',
      assignedBy: 'Mufti Hidayat (Team Lead)',
      assignedDate: new Date(2025, 9, 10),
      dueDate: new Date(2025, 9, 18),
      category: 'Development',
      project: 'E-Commerce Website Redesign',
      points: 25,
      attachments: 2,
      comments: 3,
    },
    {
      id: 'T002',
      title: 'Shopping Cart Feature Implementation',
      description: 'Implement shopping cart with add/remove items, quantity update, and total calculation. Include local storage for persistence.',
      status: 'To Do',
      priority: 'High',
      assignedBy: 'Mufti Hidayat (Team Lead)',
      assignedDate: new Date(2025, 9, 12),
      dueDate: new Date(2025, 9, 22),
      category: 'Development',
      project: 'E-Commerce Website Redesign',
      points: 30,
      attachments: 1,
    },
    {
      id: 'T003',
      title: 'Code Review - Authentication Module',
      description: 'Review pull request for authentication module. Check for security best practices, code quality, and test coverage.',
      status: 'To Do',
      priority: 'Medium',
      assignedBy: 'HR Team',
      assignedDate: new Date(2025, 9, 14),
      dueDate: new Date(2025, 9, 16),
      category: 'Review',
      points: 15,
    },
    {
      id: 'T004',
      title: 'Unit Tests for User Dashboard',
      description: 'Write comprehensive unit tests for user dashboard components using Jest and React Testing Library',
      status: 'Completed',
      priority: 'Medium',
      assignedBy: 'Mufti Hidayat (Team Lead)',
      assignedDate: new Date(2025, 9, 8),
      dueDate: new Date(2025, 9, 15),
      category: 'Testing',
      project: 'E-Commerce Website Redesign',
      points: 20,
      comments: 5,
    },
    {
      id: 'T005',
      title: 'Sprint Planning Meeting Preparation',
      description: 'Review backlog items and prepare estimates for next sprint. Attend planning meeting on Oct 20th at 10 AM.',
      status: 'To Do',
      priority: 'Medium',
      assignedBy: 'Mufti Hidayat (Team Lead)',
      assignedDate: new Date(2025, 9, 13),
      dueDate: new Date(2025, 9, 20),
      category: 'Meeting',
      project: 'E-Commerce Website Redesign',
      points: 10,
    },
    {
      id: 'T006',
      title: 'API Documentation Update',
      description: 'Update API documentation for new endpoints. Include request/response examples and error codes.',
      status: 'Overdue',
      priority: 'Urgent',
      assignedBy: 'HR Team',
      assignedDate: new Date(2025, 9, 5),
      dueDate: new Date(2025, 9, 12),
      category: 'Documentation',
      points: 15,
    },
    {
      id: 'T007',
      title: 'Design Review with UI Team',
      description: 'Review new design mockups with Ihdizein and provide technical feasibility feedback',
      status: 'In Progress',
      priority: 'Low',
      assignedBy: 'Ihdizein (Designer)',
      assignedDate: new Date(2025, 9, 13),
      dueDate: new Date(2025, 9, 17),
      category: 'Review',
      project: 'E-Commerce Website Redesign',
      points: 10,
      attachments: 4,
    },
  ]);

  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const statusColors = {
    'To Do': 'bg-gray-100 text-gray-700 border-gray-300',
    'In Progress': 'bg-blue-100 text-blue-700 border-blue-300',
    'Completed': 'bg-green-100 text-green-700 border-green-300',
    'Overdue': 'bg-red-100 text-red-700 border-red-300',
  };

  const priorityColors = {
    Low: 'text-green-600',
    Medium: 'text-yellow-600',
    High: 'text-orange-600',
    Urgent: 'text-red-600',
  };

  const categoryColors = {
    Development: 'bg-purple-100 text-purple-700',
    Design: 'bg-pink-100 text-pink-700',
    Testing: 'bg-blue-100 text-blue-700',
    Documentation: 'bg-yellow-100 text-yellow-700',
    Meeting: 'bg-green-100 text-green-700',
    Review: 'bg-orange-100 text-orange-700',
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
    // Notify HR/Team Lead of status change
    alert(`✅ Task status updated! HR/Team Lead has been notified.`);
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === 'All' || task.status === filterStatus;
    const priorityMatch = filterPriority === 'All' || task.priority === filterPriority;
    const searchMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && priorityMatch && searchMatch;
  });

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'To Do').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    overdue: tasks.filter(t => t.status === 'Overdue').length,
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <EmployeeSidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              My Tasks
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Tasks assigned by HR and Team Leads
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-3 mb-2">
                <FileText className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {taskStats.total}
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Tasks</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-gray-500" />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {taskStats.todo}
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>To Do</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6 text-blue-600" />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {taskStats.inProgress}
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {taskStats.completed}
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</p>
            </div>

            <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {taskStats.overdue}
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overdue</p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className={`rounded-xl shadow-sm p-4 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative flex-1 min-w-[250px]">
                <Search className={`absolute left-3 top-3 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="All">All Status</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Overdue">Overdue</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="All">All Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.map(task => {
              const daysUntilDue = getDaysUntilDue(task.dueDate);
              return (
                <div
                  key={task.id}
                  className={`rounded-xl p-6 border transition cursor-pointer ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600' 
                      : 'bg-white border-gray-200 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded border font-semibold ${statusColors[task.status]}`}>
                          {task.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${categoryColors[task.category]}`}>
                          {task.category}
                        </span>
                      </div>
                      <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {task.description}
                      </p>
                      {task.project && (
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="w-4 h-4 text-blue-600" />
                          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {task.project}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Assigned by: {task.assignedBy}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            Due: {formatDate(task.dueDate)}
                          </span>
                          {daysUntilDue >= 0 ? (
                            <span className="text-xs text-green-600 font-semibold">
                              ({daysUntilDue} days left)
                            </span>
                          ) : (
                            <span className="text-xs text-red-600 font-semibold">
                              ({Math.abs(daysUntilDue)} days overdue)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Flag className={`w-4 h-4 ${priorityColors[task.priority]}`} />
                          <span className={priorityColors[task.priority]}>
                            {task.priority} Priority
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600 font-semibold">+{task.points} points</span>
                        </div>
                      </div>
                      {(task.attachments || task.comments) && (
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          {task.attachments && (
                            <div className="flex items-center gap-1">
                              <Paperclip className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {task.attachments} attachments
                              </span>
                            </div>
                          )}
                          {task.comments && (
                            <div className="flex items-center gap-1">
                              <FileText className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {task.comments} comments
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex gap-2 pt-4 border-t" style={{ borderColor: darkMode ? '#374151' : '#E5E7EB' }}>
                    {task.status === 'To Do' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, 'In Progress');
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                      >
                        Start Task
                      </button>
                    )}
                    {task.status === 'In Progress' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, 'Completed');
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                      >
                        Mark Complete
                      </button>
                    )}
                    {task.status === 'Completed' && (
                      <span className="text-sm text-green-600 font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Completed on {formatDate(task.dueDate)}
                      </span>
                    )}
                    {task.status === 'Overdue' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(task.id, 'In Progress');
                        }}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition"
                      >
                        Resume Task
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTasks.length === 0 && (
            <div className={`text-center py-12 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <FileText className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No tasks found</p>
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
