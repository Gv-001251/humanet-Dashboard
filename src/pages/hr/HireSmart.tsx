import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { ResumeUpload } from '../../components/ResumeUpload';
import { ResumeViewer } from '../../components/ResumeViewer';
import { 
  Search, Filter, Download, Eye, CheckCircle, XCircle, Upload, User, Mail, Phone, 
  Briefcase, Calendar, AlertTriangle, Star, MapPin, Award, GraduationCap,
  Users, TrendingUp, Target, FileText, Plus, Settings
} from 'lucide-react';
import { ResumeService, Candidate, CandidateFilters } from '../../services/api/resumeService';

const HireSmart: React.FC = () => {
  console.log('HireSmart component is rendering');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [showResumeViewer, setShowResumeViewer] = useState(false);

  // Filters
  const [filters, setFilters] = useState<CandidateFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experienceRange, setExperienceRange] = useState<{ min: number; max: number }>({ min: 0, max: 20 });
  const [ctcRange, setCtcRange] = useState<{ min: number; max: number }>({ min: 0, max: 5000000 });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [atsScoreRange, setAtsScoreRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });

  // Available skills for filtering
  const availableSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Git',
    'TypeScript', 'Vue.js', 'Angular', 'Express.js', 'Docker', 'Kubernetes', 'Redis',
    'PostgreSQL', 'MySQL', 'GraphQL', 'REST API', 'Microservices', 'CI/CD', 'HTML/CSS',
    'C++', 'C#', '.NET', 'PHP', 'Laravel', 'Django', 'Flask', 'Spring Boot', 'Ruby',
    'Go', 'Rust', 'Swift', 'Kotlin', 'Android', 'iOS', 'React Native', 'Flutter',
    'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy',
    'Tableau', 'Power BI', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator'
  ];

  // ATS Score calculation based on resume quality
  const calculateATSScore = (candidate: Candidate): number => {
    let score = 0;
    
    // Skills match (30 points)
    const requiredSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL'];
    const matchedSkills = candidate.skills.filter(skill => 
      requiredSkills.some(reqSkill => skill.toLowerCase().includes(reqSkill.toLowerCase()))
    );
    score += (matchedSkills.length / requiredSkills.length) * 30;
    
    // Experience level (25 points)
    if (candidate.experience_years >= 5) score += 25;
    else if (candidate.experience_years >= 3) score += 20;
    else if (candidate.experience_years >= 2) score += 15;
    else if (candidate.experience_years >= 1) score += 10;
    
    // Education (15 points)
    if (candidate.education.toLowerCase().includes('master')) score += 15;
    else if (candidate.education.toLowerCase().includes('bachelor') || candidate.education.toLowerCase().includes('btech')) score += 12;
    else if (candidate.education.toLowerCase().includes('diploma')) score += 8;
    
    // Certifications (10 points)
    score += Math.min(candidate.certifications.length * 3, 10);
    
    // Resume completeness (10 points)
    if (candidate.name && candidate.email && candidate.phone && candidate.resume_text) score += 10;
    else if (candidate.name && candidate.email) score += 7;
    else if (candidate.name) score += 4;
    
    // Fraud check (10 points)
    if (candidate.fraud_check.is_verified && candidate.fraud_check.risk_score < 30) score += 10;
    else if (candidate.fraud_check.risk_score < 50) score += 7;
    else if (candidate.fraud_check.risk_score < 70) score += 4;
    
    return Math.min(Math.round(score), 100);
  };

  // Load candidates from MongoDB
  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      console.log('Loading candidates...');
      const candidatesData = await ResumeService.getAllCandidates();
      console.log('Candidates loaded:', candidatesData);
      setCandidates(candidatesData);
      setError(null);
    } catch (err) {
      console.error('Error loading candidates:', err);
      setError(`Failed to load candidates: ${err}`);
      // Set some dummy data for testing
      setCandidates([
        {
          _id: 'test1',
          name: 'Test Candidate',
          email: 'test@example.com',
          phone: '+91 9876543210',
          resume_url: '/test.pdf',
          resume_text: 'Test resume text',
          skills: ['React', 'JavaScript'],
          experience_years: 3,
          current_ctc: 500000,
          expected_ctc: 800000,
          notice_period: 30,
          education: 'B.Tech Computer Science',
          certifications: ['AWS'],
          fraud_check: {
            is_verified: true,
            risk_score: 20,
            flags: []
          },
          application_status: 'new',
          applied_date: new Date(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newCandidate: Candidate) => {
    setCandidates(prev => [newCandidate, ...prev]);
    setShowResumeUpload(false);
  };

  const handleUploadError = (error: string) => {
    setError(error);
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowResumeViewer(true);
  };

  const handleUpdateCandidateStatus = async (candidateId: string, status: string) => {
    try {
      await ResumeService.updateCandidate(candidateId, { application_status: status });
      setCandidates(prev => 
        prev.map(candidate => 
          candidate._id === candidateId 
            ? { ...candidate, application_status: status }
            : candidate
        )
      );
    } catch (err) {
      setError('Failed to update candidate status');
      console.error('Error updating candidate:', err);
    }
  };

  // Filter candidates based on current filters
  const filteredCandidates = candidates.filter(candidate => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!candidate.name.toLowerCase().includes(searchLower) &&
          !candidate.email.toLowerCase().includes(searchLower) &&
          !candidate.skills.some(skill => skill.toLowerCase().includes(searchLower))) {
        return false;
      }
    }

    // Skills filter
    if (selectedSkills.length > 0) {
      if (!selectedSkills.some(skill => candidate.skills.includes(skill))) {
        return false;
      }
    }

    // Experience filter
    if (candidate.experience_years < experienceRange.min || candidate.experience_years > experienceRange.max) {
      return false;
    }

    // CTC filter
    if (candidate.expected_ctc < ctcRange.min || candidate.expected_ctc > ctcRange.max) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && candidate.application_status !== statusFilter) {
      return false;
    }

    // ATS Score filter
    const atsScore = calculateATSScore(candidate);
    if (atsScore < atsScoreRange.min || atsScore > atsScoreRange.max) {
      return false;
    }

    return true;
  });

  // Sort candidates by ATS score (highest first)
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    const scoreA = calculateATSScore(a);
    const scoreB = calculateATSScore(b);
    return scoreB - scoreA;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'interviewed':
        return 'bg-blue-100 text-blue-800';
      case 'offered':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFraudRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-100';
    if (score < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateMatchScore = (candidate: Candidate) => {
    // Simple match score calculation based on skills and experience
    let score = 0;
    const commonSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java'];
    const skillMatches = candidate.skills.filter(skill => commonSkills.includes(skill)).length;
    score += (skillMatches / commonSkills.length) * 60;
    
    if (candidate.experience_years >= 2 && candidate.experience_years <= 8) {
      score += 30;
    }
    
    if (candidate.fraud_check.is_verified) {
      score += 10;
    }
    
    return Math.min(Math.max(score, 0), 100);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="pt-20 px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">HireSmart</h1>
            <p className="text-gray-600">
              AI-powered ATS filtering and intelligent resume screening for better hiring decisions
            </p>
          </div>
              <button
                onClick={() => setShowResumeUpload(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Upload Resume
              </button>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
                  <p className="text-sm text-gray-600">Total Candidates</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {candidates.filter(c => c.application_status === 'new').length}
                  </p>
                  <p className="text-sm text-gray-600">New Applications</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {candidates.filter(c => c.application_status === 'shortlisted').length}
                  </p>
                  <p className="text-sm text-gray-600">Shortlisted</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {candidates.filter(c => calculateATSScore(c) >= 70).length}
                  </p>
                  <p className="text-sm text-gray-600">High ATS Score</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Skills Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Skills
                </label>
                <select
                  multiple
                  value={selectedSkills}
                  onChange={(e) => setSelectedSkills(Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  size={3}
                >
                  {availableSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              {/* Experience Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Experience: {experienceRange.min}-{experienceRange.max} years
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={experienceRange.min}
                    onChange={(e) => setExperienceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={experienceRange.max}
                    onChange={(e) => setExperienceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* CTC Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expected CTC: {formatCurrency(ctcRange.min)} - {formatCurrency(ctcRange.max)}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="100000"
                    value={ctcRange.min}
                    onChange={(e) => setCtcRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="100000"
                    value={ctcRange.max}
                    onChange={(e) => setCtcRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Status Filter and ATS Score */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ATS Score: {atsScoreRange.min}-{atsScoreRange.max}%
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={atsScoreRange.min}
                    onChange={(e) => setAtsScoreRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                <input
                  type="range"
                  min="0"
                  max="100"
                    value={atsScoreRange.max}
                    onChange={(e) => setAtsScoreRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor (0-30)</span>
                  <span>Good (31-70)</span>
                  <span>Excellent (71-100)</span>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex justify-between items-center">
              <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-semibold">
                {sortedCandidates.length} Candidates Found (Sorted by ATS Score)
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSkills([]);
                  setExperienceRange({ min: 0, max: 20 });
                  setCtcRange({ min: 0, max: 5000000 });
                  setStatusFilter('all');
                  setAtsScoreRange({ min: 0, max: 100 });
                }}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Candidates Grid */}
          {sortedCandidates.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 text-lg">No candidates match your current filters</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria or upload new resumes</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedCandidates.map(candidate => {
                const atsScore = calculateATSScore(candidate);
                const getATSScoreColor = (score: number) => {
                  if (score >= 70) return 'text-green-600 bg-green-50';
                  if (score >= 40) return 'text-yellow-600 bg-yellow-50';
                  return 'text-red-600 bg-red-50';
                };
                
                return (
                  <div key={candidate._id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow p-6 border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-blue-600" />
                      </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-lg text-gray-900">{candidate.name}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(candidate.application_status)}`}>
                            {candidate.application_status.charAt(0).toUpperCase() + candidate.application_status.slice(1)}
                      </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {candidate.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {candidate.phone}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">Match Score</span>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                          calculateMatchScore(candidate) >= 80 ? 'text-green-600 bg-green-50' :
                          calculateMatchScore(candidate) >= 60 ? 'text-blue-600 bg-blue-50' :
                          calculateMatchScore(candidate) >= 40 ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50'
                        }`}>
                          <Star className="w-4 h-4 inline mr-1" />
                          {calculateMatchScore(candidate).toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            calculateMatchScore(candidate) >= 80 ? 'bg-green-500' :
                            calculateMatchScore(candidate) >= 60 ? 'bg-blue-500' :
                            calculateMatchScore(candidate) >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${calculateMatchScore(candidate)}%` }}
                        />
                  </div>
                </div>

                {/* ATS Score */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">ATS Score</span>
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${getATSScoreColor(atsScore)}`}>
                          {atsScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                            atsScore >= 70 ? 'bg-green-500' :
                            atsScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                          style={{ width: `${atsScore}%` }}
                    />
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                        {candidate.skills.slice(0, 5).map(skill => (
                      <span key={skill} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded font-medium">
                        {skill}
                      </span>
                    ))}
                        {candidate.skills.length > 5 && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-medium">
                            +{candidate.skills.length - 5} more
                          </span>
                        )}
                  </div>
                </div>

                    {/* Experience & CTC */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm space-y-1">
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        <strong>Experience:</strong> {candidate.experience_years} years
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <strong>Applied:</strong> {formatDate(candidate.applied_date)}
                      </div>
                      <div><strong>Expected CTC:</strong> {formatCurrency(candidate.expected_ctc)}</div>
                      <div><strong>Notice Period:</strong> {candidate.notice_period} days</div>
                    </div>

                    {/* Fraud Risk */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">Document Risk:</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getFraudRiskColor(candidate.fraud_check.risk_score)}`}>
                          {candidate.fraud_check.risk_score}/100
                        </span>
                      </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                      <button
                        onClick={() => handleViewCandidate(candidate)}
                        className="flex-1 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition flex items-center justify-center gap-2"
                      >
                    <Eye className="w-4 h-4" />
                        View Details
                  </button>
                      {candidate.application_status === 'new' && (
                        <>
                  <button
                            onClick={() => handleUpdateCandidateStatus(candidate._id!, 'shortlisted')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                            title="Shortlist"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                            onClick={() => handleUpdateCandidateStatus(candidate._id!, 'rejected')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                            title="Reject"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                        </>
                      )}
                </div>
              </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Resume Upload Modal */}
      {showResumeUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ResumeUpload
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
            <div className="p-4 border-t">
              <button
                onClick={() => setShowResumeUpload(false)}
                className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Viewer Modal */}
      {showResumeViewer && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <ResumeViewer
              candidate={selectedCandidate}
              onClose={() => {
                setShowResumeViewer(false);
                setSelectedCandidate(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HireSmart;