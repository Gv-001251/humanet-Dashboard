import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { 
  Users, 
  Sparkles, 
  Target,
  Award,
  Briefcase,
  CheckCircle
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

interface Employee {
  id: string;
  name: string;
  role: string;
  resumeSummary: string;
  skills: string[];
}

interface MatchedEmployee extends Employee {
  matchScore: number;
  matchReason: string;
  matchedSkills: string[];
}

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const AutoMatch: React.FC = () => {
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [matchedEmployees, setMatchedEmployees] = useState<MatchedEmployee[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('status', 'active');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const formattedEmployees = data.map(emp => ({
            id: emp.id || emp.employee_id,
            name: emp.name || 'Unknown Employee',
            role: emp.role || emp.position || 'Unknown Role',
            resumeSummary: emp.resume_summary || emp.bio || 'No summary available',
            skills: emp.skills ? (Array.isArray(emp.skills) ? emp.skills : [emp.skills]) : []
          }));
          setEmployees(formattedEmployees);
        } else {
          // Fallback to hardcoded data if no employees in database
          setEmployees([
            {
              id: 'emp-1',
              name: 'Anjali Sharma',
              role: 'Senior Frontend Engineer',
              resumeSummary: 'Experienced frontend developer with 5+ years building scalable React applications, implementing design systems, and leading UI/UX initiatives. Strong track record of delivering high-quality web applications.',
              skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux', 'GraphQL', 'UI/UX Design', 'Responsive Design', 'Performance Optimization']
            },
            {
              id: 'emp-2',
              name: 'Rahul Verma',
              role: 'Full Stack Developer',
              resumeSummary: 'Full-stack engineer with expertise in Node.js, Express, and MongoDB. Built multiple REST APIs and microservices. Strong problem-solving skills and experience with cloud deployment on AWS.',
              skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'AWS', 'Docker', 'JavaScript', 'React', 'PostgreSQL', 'Microservices']
            },
            {
              id: 'emp-3',
              name: 'Priya Singh',
              role: 'Backend Engineer',
              resumeSummary: 'Backend specialist focused on building robust server-side applications with Python and Node.js. Experience with database optimization, API design, and system architecture for high-traffic applications.',
              skills: ['Python', 'Django', 'Node.js', 'PostgreSQL', 'Redis', 'API Design', 'System Architecture', 'Database Optimization', 'Docker', 'Kubernetes']
            },
            {
              id: 'emp-4',
              name: 'Vikram Patel',
              role: 'UI/UX Designer & Developer',
              resumeSummary: 'Creative designer-developer hybrid specializing in user interface design and frontend implementation. Expert in Figma, design systems, and crafting delightful user experiences with modern web technologies.',
              skills: ['Figma', 'UI/UX Design', 'React', 'CSS', 'HTML', 'Design Systems', 'Prototyping', 'User Research', 'Accessibility', 'Animation']
            },
            {
              id: 'emp-5',
              name: 'Meera Kapoor',
              role: 'DevOps Engineer',
              resumeSummary: 'DevOps engineer with strong background in CI/CD pipelines, cloud infrastructure, and automation. Experienced in managing Kubernetes clusters, implementing monitoring solutions, and optimizing deployment workflows.',
              skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Jenkins', 'Terraform', 'Monitoring', 'Linux', 'Bash Scripting', 'Infrastructure as Code']
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setError('Failed to fetch employees. Using fallback data.');
        setEmployees([
          {
            id: 'emp-1',
            name: 'Anjali Sharma',
            role: 'Senior Frontend Engineer',
            resumeSummary: 'Experienced frontend developer with 5+ years building scalable React applications, implementing design systems, and leading UI/UX initiatives. Strong track record of delivering high-quality web applications.',
            skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Redux', 'GraphQL', 'UI/UX Design', 'Responsive Design', 'Performance Optimization']
          },
          {
            id: 'emp-2',
            name: 'Rahul Verma',
            role: 'Full Stack Developer',
            resumeSummary: 'Full-stack engineer with expertise in Node.js, Express, and MongoDB. Built multiple REST APIs and microservices. Strong problem-solving skills and experience with cloud deployment on AWS.',
            skills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'AWS', 'Docker', 'JavaScript', 'React', 'PostgreSQL', 'Microservices']
          },
          {
            id: 'emp-3',
            name: 'Priya Singh',
            role: 'Backend Engineer',
            resumeSummary: 'Backend specialist focused on building robust server-side applications with Python and Node.js. Experience with database optimization, API design, and system architecture for high-traffic applications.',
            skills: ['Python', 'Django', 'Node.js', 'PostgreSQL', 'Redis', 'API Design', 'System Architecture', 'Database Optimization', 'Docker', 'Kubernetes']
          },
          {
            id: 'emp-4',
            name: 'Vikram Patel',
            role: 'UI/UX Designer & Developer',
            resumeSummary: 'Creative designer-developer hybrid specializing in user interface design and frontend implementation. Expert in Figma, design systems, and crafting delightful user experiences with modern web technologies.',
            skills: ['Figma', 'UI/UX Design', 'React', 'CSS', 'HTML', 'Design Systems', 'Prototyping', 'User Research', 'Accessibility', 'Animation']
          },
          {
            id: 'emp-5',
            name: 'Meera Kapoor',
            role: 'DevOps Engineer',
            resumeSummary: 'DevOps engineer with strong background in CI/CD pipelines, cloud infrastructure, and automation. Experienced in managing Kubernetes clusters, implementing monitoring solutions, and optimizing deployment workflows.',
            skills: ['Kubernetes', 'Docker', 'AWS', 'CI/CD', 'Jenkins', 'Terraform', 'Monitoring', 'Linux', 'Bash Scripting', 'Infrastructure as Code']
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const calculateMatchScore = (employee: Employee, projectSkills: string[], projectDesc: string): MatchedEmployee => {
    const skillsArray = projectSkills.map(s => s.toLowerCase().trim());
    const descWords = projectDesc.toLowerCase().split(/\s+/);
    
    const matchedSkills = employee.skills.filter(skill => 
      skillsArray.some(reqSkill => 
        skill.toLowerCase().includes(reqSkill) || reqSkill.includes(skill.toLowerCase())
      )
    );
    
    const resumeMatches = skillsArray.filter(reqSkill =>
      employee.resumeSummary.toLowerCase().includes(reqSkill) ||
      employee.role.toLowerCase().includes(reqSkill)
    );
    
    const contextMatches = descWords.filter(word =>
      word.length > 3 && employee.resumeSummary.toLowerCase().includes(word)
    ).length;
    
    const skillMatchScore = matchedSkills.length > 0 ? (matchedSkills.length / skillsArray.length) * 60 : 0;
    const resumeMatchScore = resumeMatches.length > 0 ? (resumeMatches.length / skillsArray.length) * 30 : 0;
    const contextScore = Math.min(contextMatches * 2, 10);
    
    const totalScore = Math.min(Math.round(skillMatchScore + resumeMatchScore + contextScore), 100);
    
    let matchReason = '';
    if (matchedSkills.length > 0) {
      matchReason = `Matches ${matchedSkills.length}/${skillsArray.length} required skills`;
    } else if (resumeMatches.length > 0) {
      matchReason = `Experience aligns with ${resumeMatches.length} project requirements`;
    } else {
      matchReason = 'Background has relevant experience for this project';
    }
    
    return {
      ...employee,
      matchScore: totalScore,
      matchReason,
      matchedSkills
    };
  };

  const handleFindMatches = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectTitle.trim() || !projectDescription.trim() || !requiredSkills.trim()) {
      alert('Please fill in all fields before finding matches');
      return;
    }
    
    const skillsArray = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    
    const matches = employees
      .map(employee => calculateMatchScore(employee, skillsArray, projectDescription))
      .filter(match => match.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
    
    setMatchedEmployees(matches);
    setHasSearched(true);
  };

  const handleReset = () => {
    setProjectTitle('');
    setProjectDescription('');
    setRequiredSkills('');
    setMatchedEmployees([]);
    setHasSearched(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 40) return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-gray-500';
  };

  return (
    <Layout>
      <div className="p-6 bg-neutral-background min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-text">AutoMatch - Internal Mobility</h1>
              <p className="text-neutral-subtler text-sm">Match existing employees to new projects based on skills and experience</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl border border-neutral-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-muted font-medium uppercase">Available Employees</p>
                  <p className="text-2xl font-bold text-neutral-text mt-1">{employees.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-muted font-medium uppercase">Total Matches</p>
                  <p className="text-2xl font-bold text-neutral-text mt-1">{hasSearched ? matchedEmployees.length : 0}</p>
                </div>
                <Target className="w-8 h-8 text-blue-500 opacity-20" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-neutral-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-muted font-medium uppercase">Best Match Score</p>
                  <p className="text-2xl font-bold text-neutral-text mt-1">
                    {hasSearched && matchedEmployees.length > 0 ? `${matchedEmployees[0].matchScore}%` : '-'}
                  </p>
                </div>
                <Award className="w-8 h-8 text-green-500 opacity-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content: Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Input Form */}
          <div className="bg-white rounded-xl border border-neutral-border shadow-sm">
            <div className="border-b border-neutral-border p-6">
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-neutral-text">Project Details</h2>
              </div>
              <p className="text-sm text-neutral-subtler mt-1">
                Enter your project information to find the best internal matches
              </p>
            </div>
            
            <form onSubmit={handleFindMatches} className="p-6 space-y-6">
              {/* Project Title */}
              <div>
                <label htmlFor="projectTitle" className="block text-sm font-semibold text-neutral-text mb-2">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="projectTitle"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g., E-commerce Platform Redesign"
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Project Description */}
              <div>
                <label htmlFor="projectDescription" className="block text-sm font-semibold text-neutral-text mb-2">
                  Project Description / Requirements <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe the project requirements, goals, and technical challenges..."
                  rows={6}
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                />
                <p className="text-xs text-neutral-muted mt-1">
                  Be specific about the technical requirements and project scope
                </p>
              </div>

              {/* Required Skills */}
              <div>
                <label htmlFor="requiredSkills" className="block text-sm font-semibold text-neutral-text mb-2">
                  Required Skills <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="requiredSkills"
                  value={requiredSkills}
                  onChange={(e) => setRequiredSkills(e.target.value)}
                  placeholder="React, TypeScript, Node.js, REST APIs"
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <p className="text-xs text-neutral-muted mt-1">
                  Separate skills with commas
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit"
                  variant="primary" 
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Target className="w-4 h-4" />
                  Find Matches
                </Button>
                <Button 
                  type="button"
                  variant="secondary" 
                  onClick={handleReset}
                  className="px-6"
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Matched Employees */}
          <div className="bg-white rounded-xl border border-neutral-border shadow-sm">
            <div className="border-b border-neutral-border p-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-bold text-neutral-text">Matched Employees</h2>
              </div>
              <p className="text-sm text-neutral-subtler mt-1">
                {hasSearched 
                  ? `Found ${matchedEmployees.length} ${matchedEmployees.length === 1 ? 'match' : 'matches'}`
                  : 'Results will appear here after searching'}
              </p>
            </div>
            
            <div className="p-6">
              {!hasSearched ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-neutral-background rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-neutral-muted" />
                  </div>
                  <p className="text-neutral-subtler text-sm">
                    Enter project details and click "Find Matches" to see results
                  </p>
                </div>
              ) : matchedEmployees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-amber-500" />
                  </div>
                  <p className="text-neutral-text font-semibold mb-2">No matches found</p>
                  <p className="text-neutral-subtler text-sm max-w-xs">
                    Try adjusting your requirements or required skills to find suitable candidates
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {matchedEmployees.map((employee) => (
                    <div 
                      key={employee.id} 
                      className={`border-2 rounded-xl p-5 transition-all hover:shadow-md ${getScoreColor(employee.matchScore)}`}
                    >
                      {/* Employee Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-neutral-text mb-1">{employee.name}</h3>
                          <p className="text-sm text-neutral-subtler font-medium">{employee.role}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg font-bold text-white shadow-sm ${getScoreBadgeColor(employee.matchScore)}`}>
                          {employee.matchScore}%
                        </div>
                      </div>

                      {/* Match Reason */}
                      <div className="bg-white/60 rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-neutral-muted uppercase mb-1">Why This Match?</p>
                            <p className="text-sm text-neutral-text font-medium">{employee.matchReason}</p>
                          </div>
                        </div>
                      </div>

                      {/* Matched Skills */}
                      {employee.matchedSkills.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-semibold text-neutral-muted uppercase mb-2">Matched Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {employee.matchedSkills.map((skill, index) => (
                              <span 
                                key={index}
                                className="px-3 py-1 bg-white rounded-full text-xs font-medium text-neutral-text border border-neutral-border"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Resume Summary */}
                      <div>
                        <p className="text-xs font-semibold text-neutral-muted uppercase mb-2">Background</p>
                        <p className="text-sm text-neutral-text leading-relaxed">{employee.resumeSummary}</p>
                      </div>

                      {/* All Skills */}
                      <div className="mt-3">
                        <p className="text-xs font-semibold text-neutral-muted uppercase mb-2">All Skills</p>
                        <div className="flex flex-wrap gap-1.5">
                          {employee.skills.map((skill, index) => (
                            <span 
                              key={index}
                              className="px-2 py-0.5 bg-neutral-background rounded text-xs text-neutral-subtler"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};