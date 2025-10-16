import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { 
  Briefcase, 
  Users, 
  Target, 
  TrendingUp, 
  Filter, 
  Plus, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  AlertTriangle,
  Search
} from 'lucide-react';
import { JobPostingService, JobPosting, CandidateMatch } from '../../services/api/jobPostingService';
import { ResumeService, Candidate } from '../../services/api/resumeService';

export default function AutoMatch() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [candidateMatches, setCandidateMatches] = useState<CandidateMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Create job form state
  const [createJobForm, setCreateJobForm] = useState({
    title: '',
    department: '',
    description: '',
    required_skills: [] as string[],
    experience_required: 2,
    budget_min: 500000,
    budget_max: 1000000,
    location: 'Remote',
    employment_type: 'Full-time',
    status: 'active'
  });

  const availableSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Git',
    'TypeScript', 'Vue.js', 'Angular', 'Express.js', 'Docker', 'Kubernetes', 'Redis',
    'PostgreSQL', 'MySQL', 'GraphQL', 'REST API', 'Microservices', 'CI/CD', 'HTML/CSS',
    'C++', 'C#', '.NET', 'PHP', 'Laravel', 'Django', 'Flask', 'Spring Boot', 'Ruby',
    'Go', 'Rust', 'Swift', 'Kotlin', 'Android', 'iOS', 'React Native', 'Flutter',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
    'Tableau', 'Power BI', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator'
  ];

  const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales', 'HR', 'Finance'];

  useEffect(() => {
    loadJobPostings();
  }, []);

  const loadJobPostings = async () => {
    try {
      setLoading(true);
      const jobs = await JobPostingService.getAllJobPostings();
      setJobPostings(jobs);
      
      // Auto-select first job if available
      if (jobs.length > 0) {
        setSelectedJob(jobs[0]._id);
        loadCandidateMatches(jobs[0]._id);
      }
    } catch (error) {
      console.error('Error loading job postings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidateMatches = async (jobId: string) => {
    try {
      setLoadingMatches(true);
      const matches = await JobPostingService.getJobMatches(jobId);
      setCandidateMatches(matches);
    } catch (error) {
      console.error('Error loading candidate matches:', error);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleJobSelect = (jobId: string) => {
    setSelectedJob(jobId);
    loadCandidateMatches(jobId);
  };

  const handleCreateJob = async () => {
    try {
      const newJob = await JobPostingService.createJobPosting(createJobForm);
      setJobPostings(prev => [newJob, ...prev]);
      setShowCreateJobModal(false);
      setCreateJobForm({
        title: '',
        department: '',
        description: '',
        required_skills: [],
        experience_required: 2,
        budget_min: 500000,
        budget_max: 1000000,
        location: 'Remote',
        employment_type: 'Full-time',
        status: 'active'
      });
    } catch (error) {
      console.error('Error creating job posting:', error);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setCreateJobForm(prev => ({
      ...prev,
      required_skills: prev.required_skills.includes(skill)
        ? prev.required_skills.filter(s => s !== skill)
        : [...prev.required_skills, skill]
    }));
  };

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const selectedJobData = jobPostings.find(job => job._id === selectedJob);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AutoMatch</h1>
            <p className="text-gray-600">
              AI-powered candidate-job matching system for intelligent hiring decisions
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <Briefcase className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{jobPostings.length}</p>
                  <p className="text-sm text-gray-600">Active Jobs</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{candidateMatches.length}</p>
                  <p className="text-sm text-gray-600">Total Matches</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {candidateMatches.filter(m => m.match_score >= 80).length}
                  </p>
                  <p className="text-sm text-gray-600">High Matches</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {candidateMatches.length > 0 
                      ? Math.round(candidateMatches.reduce((acc, m) => acc + m.match_score, 0) / candidateMatches.length)
                      : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Avg Match Score</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Postings */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Job Postings</h2>
                  <button
                    onClick={() => setShowCreateJobModal(true)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Create Job
                  </button>
                </div>

                {/* Filters */}
                <div className="space-y-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                {/* Job List */}
                <div className="space-y-3">
                  {filteredJobs.map(job => (
                    <div
                      key={job._id}
                      onClick={() => handleJobSelect(job._id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedJob === job._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{job.title}</h3>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {job.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{job.department}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {JobPostingService.formatCurrency(job.budget_min)} - {JobPostingService.formatCurrency(job.budget_max)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Candidate Matches */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Candidate Matches {selectedJobData && `for ${selectedJobData.title}`}
                  </h2>
                  {candidateMatches.length > 0 && (
                    <span className="text-sm text-gray-600">
                      {candidateMatches.length} matches found
                    </span>
                  )}
                </div>

                {loadingMatches ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : candidateMatches.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500">No candidates match this job</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Try adjusting job requirements or upload more candidate resumes
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {candidateMatches.map((candidate, index) => (
                      <div key={candidate._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                              <p className="text-sm text-gray-600">{candidate.email}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {JobPostingService.getExperienceLevel(candidate.experience_years)}
                                </span>
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {candidate.experience_years} years exp
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              JobPostingService.getMatchScoreColor(candidate.match_score)
                            }`}>
                              <Star className="w-4 h-4 mr-1" />
                              {candidate.match_score}% Match
                            </div>
                          </div>
                        </div>

                        {/* Match Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Skills Match</h4>
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.slice(0, 5).map(skill => (
                                <span key={skill} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                              {candidate.skills.length > 5 && (
                                <span className="text-xs text-gray-500">+{candidate.skills.length - 5} more</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">CTC Fit</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                Expected: {JobPostingService.formatCurrency(candidate.expected_ctc)}
                              </span>
                              {selectedJobData && (
                                <span className={`text-xs px-2 py-1 rounded ${
                                  JobPostingService.getCTCFitColor(
                                    JobPostingService.calculateCTCFit(
                                      candidate.expected_ctc,
                                      selectedJobData.budget_min,
                                      selectedJobData.budget_max
                                    )
                                  )
                                }`}>
                                  {JobPostingService.calculateCTCFit(
                                    candidate.expected_ctc,
                                    selectedJobData.budget_min,
                                    selectedJobData.budget_max
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Match Reasons */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Why this candidate fits:</h4>
                          <div className="space-y-1">
                            {candidate.match_reasons.slice(0, 3).map((reason, idx) => (
                              <div key={idx} className="flex items-center text-sm text-gray-600">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                {reason}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Shortlist
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              View Resume
                            </button>
                          </div>
                          <div className="text-sm text-gray-500">
                            Rank #{index + 1}
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
      </div>

      {/* Create Job Modal */}
      {showCreateJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Create New Job Posting</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      value={createJobForm.title}
                      onChange={(e) => setCreateJobForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <select
                      value={createJobForm.department}
                      onChange={(e) => setCreateJobForm(prev => ({ ...prev, department: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                  <textarea
                    value={createJobForm.description}
                    onChange={(e) => setCreateJobForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe the role and responsibilities..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                  <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {availableSkills.map(skill => (
                      <label key={skill} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={createJobForm.required_skills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="mr-2"
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience Required</label>
                    <input
                      type="number"
                      value={createJobForm.experience_required}
                      onChange={(e) => setCreateJobForm(prev => ({ ...prev, experience_required: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Budget (₹)</label>
                    <input
                      type="number"
                      value={createJobForm.budget_min}
                      onChange={(e) => setCreateJobForm(prev => ({ ...prev, budget_min: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Budget (₹)</label>
                    <input
                      type="number"
                      value={createJobForm.budget_max}
                      onChange={(e) => setCreateJobForm(prev => ({ ...prev, budget_max: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={createJobForm.location}
                      onChange={(e) => setCreateJobForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                    <select
                      value={createJobForm.employment_type}
                      onChange={(e) => setCreateJobForm(prev => ({ ...prev, employment_type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateJobModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateJob}
                  disabled={!createJobForm.title || !createJobForm.department || createJobForm.required_skills.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Create Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}