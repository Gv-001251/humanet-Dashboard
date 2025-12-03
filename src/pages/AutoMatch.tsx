import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { 
  PlusCircle, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  Star,
  Clock,
  Target,
  Briefcase,
  Code,
  Smartphone,
  BarChart3,
  Megaphone,
  Zap,
  AlertCircle,
  FileText,
  Award
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  experience: string;
  teamSize: number;
  timeline: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  status: 'draft' | 'matching' | 'matched' | 'assigned';
  assignedEmployees: EmployeeMatch[];
  suggestedEmployees: EmployeeMatch[];
  selectedEmployeeIds: string[];
  recommendedTeamSize: number;
}

interface EmployeeMatch {
  id: string;
  name: string;
  role: string;
  skills: string[];
  matchScore: number;
  availability: 'Available' | 'Partially Available' | 'Engaged';
  experience: string;
  matchReasons: MatchReason[];
  recentProjects: string[];
  certifications: string[];
}

interface MatchReason {
  icon: string;
  label: string;
  detail: string;
  score: number;
}

interface ProjectTemplate {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  category: string;
  requiredSkills: string[];
  experience: string;
  teamSize: number;
  timeline: string;
  priority: 'high' | 'medium' | 'low';
}

const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'web-app',
    icon: <Code className="w-5 h-5" />,
    title: 'Web Application',
    description: 'Build a modern web application with React, TypeScript, and backend APIs',
    category: 'Web Development',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'REST APIs'],
    experience: '3-5 years',
    teamSize: 4,
    timeline: '12 weeks',
    priority: 'high'
  },
  {
    id: 'mobile-app',
    icon: <Smartphone className="w-5 h-5" />,
    title: 'Mobile App',
    description: 'Develop a cross-platform mobile application for iOS and Android',
    category: 'Mobile Development',
    requiredSkills: ['React Native', 'Mobile UI/UX', 'REST APIs', 'Firebase'],
    experience: '3-5 years',
    teamSize: 3,
    timeline: '10 weeks',
    priority: 'medium'
  },
  {
    id: 'data-analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Data Analytics',
    description: 'Build analytics dashboards and data pipelines for business intelligence',
    category: 'Data Science',
    requiredSkills: ['Python', 'SQL', 'Data Visualization', 'ETL'],
    experience: '2-4 years',
    teamSize: 3,
    timeline: '8 weeks',
    priority: 'medium'
  },
  {
    id: 'marketing-campaign',
    icon: <Megaphone className="w-5 h-5" />,
    title: 'Marketing Campaign',
    description: 'Launch a comprehensive digital marketing campaign with tracking',
    category: 'Marketing',
    requiredSkills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
    experience: '2-4 years',
    teamSize: 2,
    timeline: '6 weeks',
    priority: 'low'
  }
];

const ALL_EMPLOYEES: EmployeeMatch[] = [
  {
    id: 'emp-1',
    name: 'Anjali Sharma',
    role: 'Senior Frontend Engineer',
    skills: ['React', 'TypeScript', 'GraphQL', 'UI/UX', 'Node.js'],
    matchScore: 95,
    availability: 'Available',
    experience: '5 years',
    matchReasons: [
      { icon: '🎯', label: 'Perfect skill match', detail: '5/5 required skills', score: 100 },
      { icon: '⭐', label: 'Experience level', detail: '5 years matches requirement', score: 95 },
      { icon: '✅', label: 'Availability', detail: 'Immediately available', score: 100 },
      { icon: '🏆', label: 'Past performance', detail: '3 successful similar projects', score: 90 }
    ],
    recentProjects: ['E-commerce Platform', 'SaaS Dashboard', 'Mobile Banking App'],
    certifications: ['AWS Certified Developer', 'React Advanced']
  },
  {
    id: 'emp-2',
    name: 'Rahul Verma',
    role: 'Full Stack Developer',
    skills: ['Node.js', 'React', 'MongoDB', 'AWS', 'TypeScript'],
    matchScore: 92,
    availability: 'Available',
    experience: '4 years',
    matchReasons: [
      { icon: '🎯', label: 'Strong skill overlap', detail: '4/5 required skills', score: 90 },
      { icon: '⭐', label: 'Experience level', detail: '4 years, close to requirement', score: 85 },
      { icon: '✅', label: 'Availability', detail: 'Immediately available', score: 100 },
      { icon: '🔧', label: 'Technical versatility', detail: 'Full-stack expertise', score: 95 }
    ],
    recentProjects: ['Payment Gateway', 'Inventory System', 'API Platform'],
    certifications: ['MongoDB Certified', 'AWS Solutions Architect']
  },
  {
    id: 'emp-3',
    name: 'Priya Singh',
    role: 'Backend Engineer',
    skills: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'Microservices'],
    matchScore: 88,
    availability: 'Partially Available',
    experience: '4 years',
    matchReasons: [
      { icon: '🎯', label: 'Core skills match', detail: '3/5 required skills', score: 80 },
      { icon: '⭐', label: 'Experience level', detail: '4 years backend expertise', score: 85 },
      { icon: '⚠️', label: 'Availability', detail: 'Available in 2 weeks', score: 70 },
      { icon: '🏆', label: 'Architecture skills', detail: 'Microservices expert', score: 95 }
    ],
    recentProjects: ['Microservices Migration', 'API Gateway', 'DevOps Pipeline'],
    certifications: ['Docker Certified', 'Kubernetes Administrator']
  },
  {
    id: 'emp-4',
    name: 'Vikram Patel',
    role: 'UI/UX Developer',
    skills: ['React', 'Figma', 'CSS', 'JavaScript', 'Design Systems'],
    matchScore: 85,
    availability: 'Available',
    experience: '3 years',
    matchReasons: [
      { icon: '🎯', label: 'Frontend expertise', detail: 'Strong React & design skills', score: 85 },
      { icon: '⭐', label: 'Experience level', detail: '3 years, meets minimum', score: 80 },
      { icon: '✅', label: 'Availability', detail: 'Immediately available', score: 100 },
      { icon: '🎨', label: 'Design focus', detail: 'Strong UI/UX background', score: 90 }
    ],
    recentProjects: ['Design System', 'Marketing Website', 'Admin Dashboard'],
    certifications: ['Google UX Design', 'React Professional']
  },
  {
    id: 'emp-5',
    name: 'Meera Patel',
    role: 'DevOps Engineer',
    skills: ['AWS', 'Kubernetes', 'CI/CD', 'Terraform', 'Docker'],
    matchScore: 83,
    availability: 'Available',
    experience: '5 years',
    matchReasons: [
      { icon: '🎯', label: 'Cloud expertise', detail: 'Deep AWS & Kubernetes experience', score: 85 },
      { icon: '⚙️', label: 'Delivery speed', detail: 'CI/CD specialist boosts velocity', score: 80 },
      { icon: '⭐', label: 'Experience level', detail: '5 years in enterprise DevOps', score: 88 },
      { icon: '✅', label: 'Availability', detail: 'Ready to onboard immediately', score: 100 }
    ],
    recentProjects: ['CI/CD Modernization', 'Container Platform Rollout', 'Observability Upgrade'],
    certifications: ['CKA', 'Terraform Associate']
  },
  {
    id: 'emp-6',
    name: 'Kavya Krishnan',
    role: 'Mobile Developer',
    skills: ['React Native', 'TypeScript', 'Swift', 'Kotlin', 'UI/UX'],
    matchScore: 81,
    availability: 'Available',
    experience: '4 years',
    matchReasons: [
      { icon: '📱', label: 'Mobile-first expertise', detail: 'Native iOS and Android delivery', score: 88 },
      { icon: '🎯', label: 'Skill overlap', detail: 'Strong React Native & TypeScript', score: 84 },
      { icon: '🧩', label: 'Cross-platform', detail: 'Bridges design & engineering', score: 80 },
      { icon: '✅', label: 'Availability', detail: 'Immediate availability', score: 100 }
    ],
    recentProjects: ['Fintech Super App', 'Fitness Companion', 'Retail Loyalty Platform'],
    certifications: ['React Native Advanced', 'Swift Professional']
  },
  {
    id: 'emp-7',
    name: 'Rohan Agarwal',
    role: 'Site Reliability Engineer',
    skills: ['Monitoring', 'Incident Management', 'Automation', 'Node.js', 'Python'],
    matchScore: 79,
    availability: 'Available',
    experience: '5 years',
    matchReasons: [
      { icon: '🛡️', label: 'Reliability focus', detail: 'Incident response specialist', score: 82 },
      { icon: '⚙️', label: 'Automation depth', detail: 'Builds resilient pipelines', score: 80 },
      { icon: '📊', label: 'Observability', detail: 'Designs proactive monitoring', score: 76 },
      { icon: '✅', label: 'Availability', detail: 'Can start this sprint', score: 100 }
    ],
    recentProjects: ['Uptime Automation', 'Incident Command Program', 'Service Reliability Toolkit'],
    certifications: ['Google SRE', 'Prometheus Professional']
  },
  {
    id: 'emp-8',
    name: 'Divya Menon',
    role: 'Product Manager',
    skills: ['Product Strategy', 'Agile Delivery', 'Analytics', 'Stakeholder Management'],
    matchScore: 77,
    availability: 'Partially Available',
    experience: '6 years',
    matchReasons: [
      { icon: '🧭', label: 'Strategic alignment', detail: 'Connects delivery to outcomes', score: 78 },
      { icon: '🤝', label: 'Stakeholder partner', detail: 'Strong collaboration record', score: 80 },
      { icon: '📈', label: 'Data-led decisions', detail: 'Analytics driven prioritization', score: 75 },
      { icon: '⚠️', label: 'Availability', detail: 'Rolling off current project in 1 week', score: 68 }
    ],
    recentProjects: ['AI Analytics Suite', 'Customer Portal Revamp', 'Subscription Growth Program'],
    certifications: ['CSPO', 'Pragmatic Institute PMC']
  }
];

export const AutoMatch: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentStep, setCurrentStep] = useState<'templates' | 'custom'>('templates');
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [customProject, setCustomProject] = useState({
    title: '',
    description: '',
    requiredSkills: '',
    teamSize: 3,
    timeline: '8 weeks',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const handleSelectTemplate = (template: ProjectTemplate) => {
    const project: Project = {
      id: `proj-${Date.now()}`,
      title: template.title,
      description: template.description,
      requiredSkills: template.requiredSkills,
      experience: template.experience,
      teamSize: template.teamSize,
      timeline: template.timeline,
      priority: template.priority,
      category: template.category,
      status: 'matching',
      assignedEmployees: [],
      suggestedEmployees: [],
      selectedEmployeeIds: [],
      recommendedTeamSize: template.teamSize
    };

    setTimeout(() => {
      const sortedEmployees = [...ALL_EMPLOYEES].sort((a, b) => b.matchScore - a.matchScore);
      const suggestedCount = Math.min(template.teamSize + 4, ALL_EMPLOYEES.length);
      const suggestedEmployees = sortedEmployees.slice(0, suggestedCount);
      const initialSelectedIds = suggestedEmployees.slice(0, template.teamSize).map(e => e.id);

      const completedProject = {
        ...project,
        status: 'matched' as const,
        suggestedEmployees,
        selectedEmployeeIds: initialSelectedIds
      };

      setProjects(prev => prev.map(p => p.id === project.id ? completedProject : p));
    }, 1500);

    setProjects(prev => [project, ...prev]);
    setShowQuickCreate(false);
  };

  const handleCustomCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const project: Project = {
      id: `proj-${Date.now()}`,
      title: customProject.title,
      description: customProject.description,
      requiredSkills: customProject.requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      experience: '3-5 years',
      teamSize: customProject.teamSize,
      timeline: customProject.timeline,
      priority: customProject.priority,
      category: 'Custom',
      status: 'matching',
      assignedEmployees: [],
      suggestedEmployees: [],
      selectedEmployeeIds: [],
      recommendedTeamSize: customProject.teamSize
    };

    setTimeout(() => {
      const sortedEmployees = [...ALL_EMPLOYEES].sort((a, b) => b.matchScore - a.matchScore);
      const suggestedCount = Math.min(customProject.teamSize + 4, ALL_EMPLOYEES.length);
      const suggestedEmployees = sortedEmployees.slice(0, suggestedCount);
      const initialSelectedIds = suggestedEmployees.slice(0, customProject.teamSize).map(e => e.id);

      const completedProject = {
        ...project,
        status: 'matched' as const,
        suggestedEmployees,
        selectedEmployeeIds: initialSelectedIds
      };

      setProjects(prev => prev.map(p => p.id === project.id ? completedProject : p));
    }, 1500);

    setProjects(prev => [project, ...prev]);
    setShowQuickCreate(false);
    setCustomProject({ title: '', description: '', requiredSkills: '', teamSize: 3, timeline: '8 weeks', priority: 'medium' });
  };

  const toggleEmployeeSelection = (projectId: string, employeeId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const isSelected = p.selectedEmployeeIds.includes(employeeId);
      return {
        ...p,
        selectedEmployeeIds: isSelected
          ? p.selectedEmployeeIds.filter(id => id !== employeeId)
          : [...p.selectedEmployeeIds, employeeId]
      };
    }));
  };

  const handleAssignTeam = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    if (project.selectedEmployeeIds.length === 0) {
      alert('Please select at least one team member before assigning.');
      return;
    }

    const assignedEmployees = project.suggestedEmployees.filter(e =>
      project.selectedEmployeeIds.includes(e.id)
    );

    setProjects(prev => prev.map(p => 
      p.id === projectId 
        ? { ...p, status: 'assigned' as const, assignedEmployees } 
        : p
    ));
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability === 'Available') return 'text-green-700 bg-green-100';
    if (availability === 'Partially Available') return 'text-amber-700 bg-amber-100';
    return 'text-red-700 bg-red-100';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'text-red-700 bg-red-100';
    if (priority === 'medium') return 'text-amber-700 bg-amber-100';
    return 'text-blue-700 bg-blue-100';
  };

  return (
    <Layout>
      <div className="p-6 bg-neutral-background min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-text">AutoMatch</h1>
                <p className="text-neutral-subtler text-sm">AI-powered team matching in 3 clicks</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowQuickCreate(!showQuickCreate)}
              variant="primary"
              className="flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              New Project
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl border border-neutral-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-muted font-medium uppercase">Total Projects</p>
                  <p className="text-2xl font-bold text-neutral-text mt-1">{projects.length}</p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-muted font-medium uppercase">Teams Matched</p>
                  <p className="text-2xl font-bold text-neutral-text mt-1">
                    {projects.filter(p => p.status === 'matched' || p.status === 'assigned').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-muted font-medium uppercase">Avg Match Score</p>
                  <p className="text-2xl font-bold text-neutral-text mt-1">
                    {projects.length > 0 
                      ? Math.round(projects.reduce((sum, p) => 
                          sum + (p.assignedEmployees[0]?.matchScore || 0), 0) / projects.length)
                      : 0}%
                  </p>
                </div>
                <Star className="w-8 h-8 text-amber-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-muted font-medium uppercase">Active Now</p>
                  <p className="text-2xl font-bold text-neutral-text mt-1">
                    {projects.filter(p => p.status === 'assigned').length}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-purple-500 opacity-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Create Modal */}
        {showQuickCreate && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-neutral-border p-6 z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-neutral-text">Create New Project</h2>
                    <p className="text-sm text-neutral-subtler mt-1">
                      Choose a template for instant matching or create a custom project
                    </p>
                  </div>
                  <button
                    onClick={() => setShowQuickCreate(false)}
                    className="text-neutral-muted hover:text-neutral-text transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentStep('templates')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentStep === 'templates'
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'bg-neutral-background text-neutral-muted hover:text-neutral-text'
                    }`}
                  >
                    1. Choose Template
                  </button>
                  <ArrowRight className="w-4 h-4 text-neutral-border" />
                  <button
                    onClick={() => setCurrentStep('custom')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentStep === 'custom'
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'bg-neutral-background text-neutral-muted hover:text-neutral-text'
                    }`}
                  >
                    2. Or Custom Create
                  </button>
                </div>
              </div>

              <div className="p-6">
                {currentStep === 'templates' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-brand-primary" />
                      <h3 className="text-lg font-semibold text-neutral-text">Quick Start Templates</h3>
                    </div>
                    <p className="text-sm text-neutral-subtler mb-6">
                      Select a pre-configured template and get matched with the perfect team in seconds
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {PROJECT_TEMPLATES.map(template => (
                        <div
                          key={template.id}
                          className="group border-2 border-neutral-border hover:border-brand-primary rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg bg-white"
                          onClick={() => handleSelectTemplate(template)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg group-hover:from-blue-100 group-hover:to-purple-100 transition-colors">
                              {template.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-neutral-text">{template.title}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(template.priority)}`}>
                                  {template.priority}
                                </span>
                              </div>
                              <p className="text-sm text-neutral-subtler mb-3">{template.description}</p>
                              
                              <div className="space-y-2 text-xs text-neutral-muted">
                                <div className="flex items-center gap-2">
                                  <Users className="w-3.5 h-3.5" />
                                  <span>{template.teamSize} members</span>
                                  <span className="mx-1">•</span>
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{template.timeline}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                  {template.requiredSkills.slice(0, 3).map((skill, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded">
                                      {skill}
                                    </span>
                                  ))}
                                  {template.requiredSkills.length > 3 && (
                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                                      +{template.requiredSkills.length - 3}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="mt-4 pt-3 border-t border-neutral-border">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-neutral-muted">Click to auto-match team</span>
                                  <ArrowRight className="w-4 h-4 text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {currentStep === 'custom' && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-brand-primary" />
                      <h3 className="text-lg font-semibold text-neutral-text">Custom Project</h3>
                    </div>
                    <p className="text-sm text-neutral-subtler mb-6">
                      Fill in the essential details and let our AI find the best team for your unique requirements
                    </p>

                    <form onSubmit={handleCustomCreate} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-neutral-text mb-2">
                          Project Title *
                        </label>
                        <input
                          required
                          value={customProject.title}
                          onChange={e => setCustomProject(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                          placeholder="e.g., Customer Portal Redesign"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-text mb-2">
                          Brief Description *
                        </label>
                        <textarea
                          required
                          value={customProject.description}
                          onChange={e => setCustomProject(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                          rows={3}
                          placeholder="What is the project about and what are the main goals?"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-text mb-2">
                            Team Size *
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            required
                            value={customProject.teamSize}
                            onChange={e => setCustomProject(prev => ({ ...prev, teamSize: Number(e.target.value) }))}
                            className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-text mb-2">
                            Timeline *
                          </label>
                          <input
                            required
                            value={customProject.timeline}
                            onChange={e => setCustomProject(prev => ({ ...prev, timeline: e.target.value }))}
                            className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                            placeholder="e.g., 8 weeks"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-text mb-2">
                            Priority *
                          </label>
                          <select
                            required
                            value={customProject.priority}
                            onChange={e => setCustomProject(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                            className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-neutral-text mb-2">
                          Required Skills *
                        </label>
                        <input
                          required
                          value={customProject.requiredSkills}
                          onChange={e => setCustomProject(prev => ({ ...prev, requiredSkills: e.target.value }))}
                          className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
                          placeholder="React, TypeScript, Node.js (comma-separated)"
                        />
                        <p className="text-xs text-neutral-muted mt-1.5">
                          Enter key skills separated by commas. AI will match employees with these skills.
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-neutral-border">
                        <Button type="submit" variant="primary" className="flex-1">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Find Perfect Team
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setShowQuickCreate(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Projects List */}
        <div className="space-y-6">
          {projects.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-subtle p-12 text-center border border-neutral-border">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-10 h-10 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-text mb-3">Ready to build your dream team?</h3>
                <p className="text-neutral-subtler mb-6 leading-relaxed">
                  Create a new project and let our AI match you with the perfect team members based on skills, experience, and availability.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => { setShowQuickCreate(true); setCurrentStep('templates'); }}
                    variant="primary"
                    className="flex items-center justify-center gap-2"
                  >
                    <Target className="w-4 h-4" />
                    Use Template
                  </Button>
                  <Button 
                    onClick={() => { setShowQuickCreate(true); setCurrentStep('custom'); }}
                    variant="outline"
                    className="flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Custom Project
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            projects.map(project => {
              const selectedEmployees = project.suggestedEmployees.filter(employee =>
                project.selectedEmployeeIds.includes(employee.id)
              );
              const selectedCount = selectedEmployees.length;
              const showOverSelection = selectedCount > project.recommendedTeamSize;

              return (
              <div key={project.id} className="bg-white rounded-2xl shadow-subtle border border-neutral-border overflow-hidden">
                {/* Project Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-neutral-border">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-neutral-text">{project.title}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getPriorityColor(project.priority)}`}>
                          {project.priority} priority
                        </span>
                        {project.status === 'assigned' && (
                          <span className="text-xs px-3 py-1 rounded-full font-semibold text-green-700 bg-green-100 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Assigned
                          </span>
                        )}
                      </div>
                      <p className="text-neutral-subtler mb-4">{project.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2 text-neutral-muted">
                          <Users className="w-4 h-4" />
                          <span className="font-medium">{project.teamSize} members</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-muted">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{project.timeline}</span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-muted">
                          <Briefcase className="w-4 h-4" />
                          <span className="font-medium">{project.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-medium text-neutral-muted uppercase mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {project.requiredSkills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-white text-brand-primary rounded-lg text-sm font-medium border border-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Matching Status */}
                {project.status === 'matching' && (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-4 bg-blue-50 rounded-xl">
                      <div className="animate-spin">
                        <Sparkles className="w-6 h-6 text-brand-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-neutral-text">AI is analyzing your requirements...</p>
                        <p className="text-sm text-neutral-subtler">Finding the perfect team match</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Matched Team */}
                {(project.status === 'matched' || project.status === 'assigned') && project.suggestedEmployees.length > 0 && (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-neutral-text">Perfect Team Found!</h4>
                          <p className="text-sm text-neutral-subtler">
                            {project.selectedEmployeeIds.length} selected / {project.recommendedTeamSize} recommended · {project.suggestedEmployees.length} suggestions available
                          </p>
                        </div>
                      </div>
                      
                      {project.status === 'matched' && (
                        <Button 
                          onClick={() => handleAssignTeam(project.id)}
                          variant="primary"
                          className="flex items-center gap-2"
                          disabled={selectedCount === 0}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Assign Team ({selectedCount})
                        </Button>
                      )}
                    </div>

                    {showOverSelection && (
                      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        You have selected {selectedCount} members, which is more than the recommended team size of {project.recommendedTeamSize}. That's okay—just ensure everyone has a clear role before assigning.
                      </div>
                    )}

                    <div className="space-y-4">
                      {project.suggestedEmployees.map((employee, index) => {
                        const isSelected = project.selectedEmployeeIds.includes(employee.id);
                        const isRecommended = index < project.recommendedTeamSize;
                        return (
                        <div key={employee.id} className={`border-2 rounded-xl p-5 transition-all bg-white ${
                          isSelected ? 'border-brand-primary shadow-subtle ring-1 ring-brand-primary/20' : 'border-neutral-border hover:border-brand-primary/60'
                        }`}>
                          {/* Employee Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {employee.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h5 className="text-lg font-bold text-neutral-text">{employee.name}</h5>
                                  {index === 0 && (
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-semibold inline-flex items-center gap-1">
                                      <Award className="w-3 h-3" />
                                      Top Match
                                    </span>
                                  )}
                                  {isRecommended && (
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded">
                                      Recommended
                                    </span>
                                  )}
                                  {!isRecommended && (
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded">
                                      Additional
                                    </span>
                                  )}
                                  {project.status === 'assigned' && isSelected && (
                                    <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded">
                                      Assigned
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-neutral-subtler">{employee.role}</p>
                                <p className="text-xs text-neutral-muted mt-1">{employee.experience} of experience</p>
                              </div>
                            </div>

                            {/* Match Score & Selection Button */}
                            <div className="flex flex-col items-end gap-2">
                              <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 ${getMatchScoreColor(employee.matchScore)}`}>
                                <span className="text-2xl font-bold">{employee.matchScore}</span>
                                <span className="text-xs font-medium">Match</span>
                              </div>
                              {project.status === 'matched' && (
                                <button
                                  onClick={() => toggleEmployeeSelection(project.id, employee.id)}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                                    isSelected
                                      ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                                      : 'bg-white text-neutral-text border-neutral-border hover:border-brand-primary hover:text-brand-primary'
                                  }`}
                                >
                                  {isSelected ? (
                                    <><CheckCircle2 className="w-3.5 h-3.5" /> Selected</>
                                  ) : (
                                    <><PlusCircle className="w-3.5 h-3.5" /> Add</>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Why This Match? */}
                          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2 mb-3">
                              <Info className="w-4 h-4 text-blue-600" />
                              <p className="text-sm font-semibold text-blue-900">Why this is a great match:</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {employee.matchReasons.map((reason, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="text-base">{reason.icon}</span>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-neutral-text">{reason.label}</p>
                                    <p className="text-xs text-neutral-muted">{reason.detail}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Skills & Details */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-xs font-semibold text-neutral-muted uppercase mb-2">Skills</p>
                              <div className="flex flex-wrap gap-1.5">
                                {employee.skills.map((skill, idx) => (
                                  <span 
                                    key={idx} 
                                    className={`px-2 py-1 text-xs rounded ${
                                      project.requiredSkills.includes(skill)
                                        ? 'bg-green-100 text-green-700 font-semibold'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {skill}
                                    {project.requiredSkills.includes(skill) && ' ✓'}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-neutral-muted uppercase mb-2">Availability</p>
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${getAvailabilityColor(employee.availability)}`}>
                                <div className={`w-2 h-2 rounded-full ${
                                  employee.availability === 'Available' ? 'bg-green-500' :
                                  employee.availability === 'Partially Available' ? 'bg-amber-500' :
                                  'bg-red-500'
                                }`} />
                                {employee.availability}
                              </span>
                            </div>

                            <div>
                              <p className="text-xs font-semibold text-neutral-muted uppercase mb-2">Certifications</p>
                              <div className="space-y-1">
                                {employee.certifications.map((cert, idx) => (
                                  <p key={idx} className="text-xs text-neutral-text flex items-center gap-1">
                                    <Award className="w-3 h-3 text-amber-500" />
                                    {cert}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Recent Projects */}
                          <div>
                            <p className="text-xs font-semibold text-neutral-muted uppercase mb-2">Recent Projects</p>
                            <div className="flex flex-wrap gap-2">
                              {employee.recentProjects.map((proj, idx) => (
                                <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs">
                                  {proj}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    </div>

                    {project.status === 'assigned' && (
                      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-semibold text-green-900">Team Successfully Assigned!</p>
                            <p className="text-sm text-green-700">
                              {project.assignedEmployees.length} team members have been notified and the project is ready to begin.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <AlertCircle className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-text mb-2">How AutoMatch Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-subtler">
                <div>
                  <p className="font-medium text-neutral-text mb-1">1️⃣ Choose or Create</p>
                  <p>Select a template or describe your project requirements</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-text mb-1">2️⃣ AI Analyzes</p>
                  <p>Our AI matches skills, experience, and availability instantly</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-text mb-1">3️⃣ Assign & Start</p>
                  <p>Review the perfect team and assign with one click</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
