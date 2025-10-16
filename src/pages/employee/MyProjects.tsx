import React, { useState } from 'react';
import { EmployeeSidebar } from '../../components/layout/EmployeeSidebar';
import { Header } from '../../components/layout/Header';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  TrendingUp,
  Upload,
  Download,
  Eye,
  MoreVertical
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Cancelled';
  progress: number;
  myRole: string;
  startDate: string;
  endDate: string;
  priority: 'High' | 'Medium' | 'Low';
  teamMembers: TeamMember[];
  milestones: Milestone[];
  tasks: ProjectTask[];
  files: ProjectFile[];
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  status: 'online' | 'offline';
}

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  progress: number;
}

interface ProjectTask {
  id: string;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  priority: 'High' | 'Medium' | 'Low';
}

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedDate: string;
}

const MyProjects: React.FC = () => {
  const { darkMode } = useTheme();

  const [projects] = useState<Project[]>([
    {
      id: 'PROJ01',
      name: 'E-Commerce Website Redesign',
      description: 'Complete redesign of client e-commerce platform with modern UI/UX and improved performance',
      status: 'Active',
      progress: 65,
      myRole: 'Lead Frontend Developer',
      startDate: '2025-08-01',
      endDate: '2025-11-30',
      priority: 'High',
      teamMembers: [
        { id: 'TM1', name: 'Bagus Fikri', role: 'Lead Developer', avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg', status: 'online' },
        { id: 'TM2', name: 'Ihdizein', role: 'UI Designer', avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg', status: 'online' },
        { id: 'TM3', name: 'Mufti Hidayat', role: 'Project Manager', avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg', status: 'offline' },
        { id: 'TM4', name: 'Fauzan', role: 'Backend Developer', avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'online' },
      ],
      milestones: [
        { id: 'M1', title: 'Design Phase Complete', dueDate: '2025-09-15', status: 'Completed', progress: 100 },
        { id: 'M2', title: 'Frontend Development', dueDate: '2025-10-20', status: 'In Progress', progress: 75 },
        { id: 'M3', title: 'Backend Integration', dueDate: '2025-11-10', status: 'In Progress', progress: 40 },
        { id: 'M4', title: 'Testing & Deployment', dueDate: '2025-11-30', status: 'Pending', progress: 0 },
      ],
      tasks: [
        { id: 'T1', title: 'Product Page Component', assignedTo: 'Me', dueDate: '2025-10-18', status: 'In Progress', priority: 'High' },
        { id: 'T2', title: 'Shopping Cart Feature', assignedTo: 'Me', dueDate: '2025-10-22', status: 'Pending', priority: 'High' },
        { id: 'T3', title: 'Payment Gateway UI', assignedTo: 'Fauzan', dueDate: '2025-10-25', status: 'Pending', priority: 'Medium' },
        { id: 'T4', title: 'User Dashboard', assignedTo: 'Me', dueDate: '2025-10-15', status: 'Completed', priority: 'Medium' },
      ],
      files: [
        { id: 'F1', name: 'Design_Mockups_v2.fig', type: 'Figma', size: '12.5 MB', uploadedBy: 'Ihdizein', uploadedDate: '2025-09-10' },
        { id: 'F2', name: 'Project_Requirements.pdf', type: 'PDF', size: '2.3 MB', uploadedBy: 'Mufti Hidayat', uploadedDate: '2025-08-05' },
        { id: 'F3', name: 'API_Documentation.md', type: 'Markdown', size: '125 KB', uploadedBy: 'Fauzan', uploadedDate: '2025-09-20' },
      ],
    },
    {
      id: 'PROJ02',
      name: 'Mobile App Development',
      description: 'iOS and Android app for food delivery service with real-time tracking',
      status: 'Active',
      progress: 40,
      myRole: 'Frontend Developer',
      startDate: '2025-09-01',
      endDate: '2025-12-15',
      priority: 'Medium',
      teamMembers: [
        { id: 'TM5', name: 'Sarah', role: 'Mobile Developer', avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg', status: 'online' },
        { id: 'TM6', name: 'John', role: 'Backend Developer', avatarUrl: 'https://randomuser.me/api/portraits/men/5.jpg', status: 'offline' },
      ],
      milestones: [
        { id: 'M5', title: 'Requirements Gathering', dueDate: '2025-09-15', status: 'Completed', progress: 100 },
        { id: 'M6', title: 'UI Development', dueDate: '2025-10-30', status: 'In Progress', progress: 50 },
        { id: 'M7', title: 'Backend API', dueDate: '2025-11-20', status: 'Pending', progress: 0 },
      ],
      tasks: [
        { id: 'T5', title: 'Login Screen', assignedTo: 'Me', dueDate: '2025-10-16', status: 'Completed', priority: 'High' },
        { id: 'T6', title: 'Restaurant Listing', assignedTo: 'Me', dueDate: '2025-10-20', status: 'In Progress', priority: 'High' },
      ],
      files: [
        { id: 'F4', name: 'App_Wireframes.sketch', type: 'Sketch', size: '8.7 MB', uploadedBy: 'Sarah', uploadedDate: '2025-09-12' },
      ],
    },
  ]);

  const [selectedProject, setSelectedProject] = useState<Project>(projects[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team' | 'files'>('overview');

  const statusColors = {
    Active: 'bg-green-100 text-green-700 border-green-200',
    Completed: 'bg-blue-100 text-blue-700 border-blue-200',
    'On Hold': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  const priorityColors = {
    High: 'text-red-600',
    Medium: 'text-orange-600',
    Low: 'text-green-600',
  };

  const taskStatusColors = {
    Completed: 'bg-green-100 text-green-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Pending: 'bg-gray-100 text-gray-700',
  };

  const milestoneStatusColors = {
    Completed: 'bg-green-500',
    'In Progress': 'bg-blue-500',
    Pending: 'bg-gray-300',
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <EmployeeSidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              My Projects
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              View and manage your assigned projects, tasks, and deliverables
            </p>
          </div>

          {/* Projects Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {projects.map(project => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`rounded-xl p-6 cursor-pointer transition border-2 ${
                  selectedProject.id === project.id
                    ? 'border-blue-500 shadow-lg'
                    : darkMode
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <Briefcase className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`text-xs px-2 py-1 rounded border font-semibold ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                </div>
                <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {project.name}
                </h3>
                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {project.myRole}
                </p>
                <div className="mb-2">
                  <div className="flex items-center justify-between mb-1 text-xs">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Progress</span>
                    <span className="font-bold text-blue-600">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Project View */}
          <div className={`rounded-xl shadow-sm p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {/* Project Header */}
            <div className="border-b pb-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedProject.name}
                  </h2>
                  <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {selectedProject.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      📅 {selectedProject.startDate} - {selectedProject.endDate}
                    </span>
                    <span className={priorityColors[selectedProject.priority]}>
                      • {selectedProject.priority} Priority
                    </span>
                  </div>
                </div>
                <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Overall Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Overall Progress
                  </span>
                  <span className="text-lg font-bold text-blue-600">{selectedProject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${selectedProject.progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b mb-6">
              {(['overview', 'tasks', 'team', 'files'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium capitalize transition ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : darkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Milestones */}
                <div>
                  <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Project Milestones
                  </h3>
                  <div className="space-y-4">
                    {selectedProject.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full ${milestoneStatusColors[milestone.status]}`} />
                          {index < selectedProject.milestones.length - 1 && (
                            <div className="w-0.5 flex-1 bg-gray-300 my-1" />
                          )}
                        </div>
                        <div className={`flex-1 pb-4 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{milestone.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded ${taskStatusColors[milestone.status]}`}>
                              {milestone.status}
                            </span>
                          </div>
                          <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Due: {milestone.dueDate}
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${milestoneStatusColors[milestone.status]}`}
                              style={{ width: `${milestone.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  My Tasks
                </h3>
                <div className="space-y-3">
                  {selectedProject.tasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {task.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded ${taskStatusColors[task.status]}`}>
                          {task.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Due: {task.dueDate}
                        </span>
                        <span className={priorityColors[task.priority]}>
                          • {task.priority} Priority
                        </span>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                          Assigned to: {task.assignedTo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div>
                <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Team Members ({selectedProject.teamMembers.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProject.teamMembers.map(member => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <div className="relative">
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                            darkMode ? 'border-gray-800' : 'border-white'
                          } ${member.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {member.name}
                        </h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {member.role}
                        </p>
                      </div>
                      <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                        <MessageSquare className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Project Files
                  </h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload File
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedProject.files.map(file => (
                    <div
                      key={file.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <div>
                          <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {file.name}
                          </h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {file.size} • Uploaded by {file.uploadedBy} on {file.uploadedDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProjects;
