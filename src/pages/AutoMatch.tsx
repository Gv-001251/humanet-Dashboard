import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { PlusCircle, Users, Calendar, Loader2 } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  experience: string;
  teamSize: number;
  timeline: string;
  progress: number;
  assignedEmployees: EmployeeMatch[];
}

interface EmployeeMatch {
  id: string;
  name: string;
  role: string;
  skills: string[];
  matchScore: number;
  skillOverlap: number;
  experienceFit: string;
  availability: 'Available' | 'Partially Available' | 'Engaged';
}

const ALL_EMPLOYEES: EmployeeMatch[] = [
  {
    id: 'emp-1',
    name: 'Anjali Sharma',
    role: 'Senior Frontend Engineer',
    skills: ['React', 'TypeScript', 'GraphQL', 'UI/UX'],
    matchScore: 92,
    skillOverlap: 90,
    experienceFit: 'Excellent',
    availability: 'Available'
  },
  {
    id: 'emp-2',
    name: 'Rahul Verma',
    role: 'Full Stack Developer',
    skills: ['Node.js', 'React', 'MongoDB', 'AWS'],
    matchScore: 88,
    skillOverlap: 85,
    experienceFit: 'Good',
    availability: 'Partially Available'
  },
  {
    id: 'emp-3',
    name: 'Priya Singh',
    role: 'Data Scientist',
    skills: ['Python', 'TensorFlow', 'Data Analysis', 'ML'],
    matchScore: 80,
    skillOverlap: 78,
    experienceFit: 'Solid',
    availability: 'Available'
  }
];

export const AutoMatch: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    experience: '',
    teamSize: 3,
    timeline: ''
  });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isMatching, setIsMatching] = useState(false);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();

    const project: Project = {
      id: `proj-${Date.now()}`,
      title: newProject.title,
      description: newProject.description,
      requiredSkills: newProject.requiredSkills.split(',').map(skill => skill.trim()).filter(Boolean),
      experience: newProject.experience,
      teamSize: newProject.teamSize,
      timeline: newProject.timeline,
      progress: 0,
      assignedEmployees: []
    };

    setProjects(prev => [project, ...prev]);
    setNewProject({ title: '', description: '', requiredSkills: '', experience: '', teamSize: 3, timeline: '' });
  };

  const handleMatchTeam = (projectId: string) => {
    setIsMatching(true);
    setSelectedProject(projectId);

    setTimeout(() => {
      const updatedProjects = projects.map(project => {
        if (project.id !== projectId) return project;

        const matchedEmployees = ALL_EMPLOYEES.slice(0, project.teamSize).map(emp => ({
          ...emp,
          matchScore: emp.matchScore - Math.floor(Math.random() * 10),
          skillOverlap: emp.skillOverlap - Math.floor(Math.random() * 8)
        }));

        return {
          ...project,
          assignedEmployees: matchedEmployees,
          progress: Math.min(100, project.progress + 25)
        };
      });

      setProjects(updatedProjects);
      setIsMatching(false);
    }, 1200);
  };

  const handleUpdateProgress = (projectId: string, delta: number) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, progress: Math.max(0, Math.min(100, project.progress + delta)) }
          : project
      )
    );
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">AutoMatch</h1>
            <p className="text-gray-600">AI-powered project staffing and team recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Project */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <PlusCircle className="w-5 h-5 mr-2 text-blue-600" />
                Create Project
              </h2>
              <form className="space-y-4" onSubmit={handleCreateProject}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                  <input
                    required
                    value={newProject.title}
                    onChange={e => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., AI Resume Parser"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={newProject.description}
                    onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Project objectives and requirements"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                  <input
                    required
                    value={newProject.requiredSkills}
                    onChange={e => setNewProject(prev => ({ ...prev, requiredSkills: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Comma-separated list"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    required
                    value={newProject.experience}
                    onChange={e => setNewProject(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3-5 years"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                    <input
                      type="number"
                      min={1}
                      value={newProject.teamSize}
                      onChange={e => setNewProject(prev => ({ ...prev, teamSize: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                    <input
                      required
                      value={newProject.timeline}
                      onChange={e => setNewProject(prev => ({ ...prev, timeline: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 8 weeks"
                    />
                  </div>
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Create Project
                </Button>
              </form>
            </div>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-2 space-y-6">
            {projects.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects yet</h3>
                <p className="text-gray-600">Create a project to see AI-powered employee recommendations.</p>
              </div>
            ) : (
              projects.map(project => (
                <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-500">{project.description}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{project.timeline}</span>
                      </div>
                      <div className="text-blue-600 font-medium">Progress: {project.progress}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Required Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {project.requiredSkills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Experience</p>
                      <p className="text-gray-800">{project.experience}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Team Size</p>
                      <p className="text-gray-800">{project.teamSize} members</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <Button
                      onClick={() => handleMatchTeam(project.id)}
                      variant="primary"
                      className="flex items-center"
                    >
                      {isMatching && selectedProject === project.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Users className="w-4 h-4 mr-2" />
                      )}
                      Find Team
                    </Button>
                    <Button
                      onClick={() => handleUpdateProgress(project.id, 10)}
                      variant="outline"
                    >
                      Update Progress +10%
                    </Button>
                  </div>

                  {project.assignedEmployees.length > 0 && (
                    <div className="mt-6 border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-semibold mb-4">Recommended Team</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {project.assignedEmployees.map(emp => (
                          <div key={emp.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="text-md font-semibold text-gray-900">{emp.name}</h5>
                                <p className="text-sm text-gray-500">{emp.role}</p>
                              </div>
                              <span className="text-blue-600 font-semibold">{emp.matchScore}% match</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mt-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">Skill Overlap</p>
                                <p className="font-medium">{emp.skillOverlap}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Experience Fit</p>
                                <p className="font-medium">{emp.experienceFit}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Availability</p>
                                <p className="font-medium">{emp.availability}</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-4 text-xs">
                              {emp.skills.map((skill, idx) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
