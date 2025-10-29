import React, { useState, useRef, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Upload, FileText, CheckCircle, XCircle, Eye, Filter, Trash2, Search, X } from 'lucide-react';
import { Button } from '../components/common/Button';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: number;
  ctc: number;
  location: string;
  domain: string;
  atsScore: number;
  status: 'pending' | 'shortlisted' | 'rejected';
  education: string;
}

const MIN_ATS_THRESHOLD = 60;
const MAX_ATS_THRESHOLD = 90;
const DEFAULT_ATS_THRESHOLD = 70;

export const HireSmart: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [atsThreshold, setAtsThreshold] = useState(DEFAULT_ATS_THRESHOLD);
  const [skillFilters, setSkillFilters] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [deletingCandidateId, setDeletingCandidateId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/candidates`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('humanet_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch candidates');

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const parsedCandidates: Candidate[] = data.data.map((candidate: any): Candidate => ({
          id: String(candidate.id ?? candidate._id ?? `cand-${Date.now()}`),
          name: candidate.name ?? 'Unknown Candidate',
          email: candidate.email ?? 'unknown@example.com',
          phone: candidate.phone ?? '+91 9876543210',
          skills: Array.isArray(candidate.skills) ? candidate.skills : [],
          experience: Number(candidate.experience ?? candidate.experience_years ?? 0),
          ctc: Number(candidate.ctc ?? candidate.expected_ctc ?? 0),
          location: candidate.location ?? 'Bangalore',
          domain: candidate.domain ?? 'General',
          atsScore: Number(candidate.atsScore ?? candidate.ats_score ?? 60),
          status: (candidate.status === 'shortlisted' || candidate.status === 'rejected') ? candidate.status : 'pending',
          education: candidate.education ?? 'Not specified'
        }));
        setCandidates(parsedCandidates);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('resumes', file);
    });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/candidates/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('humanet_token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to upload resumes');

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const parsedCandidates: Candidate[] = data.data.map((candidate: any): Candidate => ({
          id: String(candidate.id ?? candidate._id ?? `cand-${Date.now()}`),
          name: candidate.name ?? 'Unknown Candidate',
          email: candidate.email ?? 'unknown@example.com',
          phone: candidate.phone ?? '+91 9876543210',
          skills: Array.isArray(candidate.skills) ? candidate.skills : [],
          experience: Number(candidate.experience ?? candidate.experience_years ?? 0),
          ctc: Number(candidate.ctc ?? candidate.expected_ctc ?? 0),
          location: candidate.location ?? 'Bangalore',
          domain: candidate.domain ?? 'General',
          atsScore: Number(candidate.atsScore ?? candidate.ats_score ?? 60),
          status: (candidate.status === 'shortlisted' || candidate.status === 'rejected') ? candidate.status : 'pending',
          education: candidate.education ?? 'Not specified'
        }));
        setCandidates(prev => [...prev, ...parsedCandidates]);
      }
    } catch (error) {
      console.error('Error uploading resumes:', error);
      alert('Failed to upload resumes. Using mock data for demo.');
      
      // Mock data for demo
      const mockCandidates: Candidate[] = Array.from({ length: files.length }, (_, i) => ({
        id: `cand-${Date.now()}-${i}`,
        name: `Candidate ${i + 1}`,
        email: `candidate${i + 1}@example.com`,
        phone: `+91 98765${String(43210 + i).padStart(5, '0')}`,
        skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'].slice(0, Math.floor(Math.random() * 4) + 1),
        experience: Math.floor(Math.random() * 10) + 1,
        ctc: Math.floor(Math.random() * 1000000) + 500000,
        location: ['Bangalore', 'Chennai', 'Hyderabad', 'Mumbai'][Math.floor(Math.random() * 4)],
        domain: ['Frontend', 'Backend', 'Full Stack', 'Data Science'][Math.floor(Math.random() * 4)],
        atsScore: Math.floor(Math.random() * 40) + 60,
        status: 'pending',
        education: 'B.Tech Computer Science'
      }));
      setCandidates(prev => [...prev, ...mockCandidates]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleStatusUpdate = async (candidateId: string, newStatus: 'shortlisted' | 'rejected') => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/candidates/${candidateId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('humanet_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setCandidates(prev =>
        prev.map(c => (c.id === candidateId ? { ...c, status: newStatus } : c))
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update candidate status');
    }
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    if (!confirm('Are you sure you want to delete this candidate? This will also remove their resume file.')) {
      return;
    }

    setDeletingCandidateId(candidateId);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/candidates/${candidateId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('humanet_token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete candidate');

      setCandidates(prev => prev.filter(c => c.id !== candidateId));
      if (selectedCandidate?.id === candidateId) {
        setSelectedCandidate(null);
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('Failed to delete candidate');
    } finally {
      setDeletingCandidateId(null);
    }
  };

  const handleDeleteAllCandidates = async () => {
    if (!confirm(`Are you sure you want to delete all ${candidates.length} candidates? This will also remove all their resume files. This action cannot be undone.`)) {
      return;
    }

    const candidateIds = [...candidates.map(c => c.id)];
    let successCount = 0;
    let failCount = 0;

    for (const candidateId of candidateIds) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/candidates/${candidateId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('humanet_token')}`
          }
        });

        if (response.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error('Error deleting candidate:', error);
        failCount++;
      }
    }

    setCandidates([]);
    setSelectedCandidate(null);
    
    if (failCount > 0) {
      alert(`Deleted ${successCount} candidates. Failed to delete ${failCount} candidates.`);
    } else {
      alert(`Successfully deleted all ${successCount} candidates.`);
    }
  };

  const handleResetFilters = () => {
    setFilterStatus('all');
    setAtsThreshold(DEFAULT_ATS_THRESHOLD);
    setSkillFilters([]);
    setSkillInput('');
  };

  const handleAddSkillFilter = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    const exists = skillFilters.some(existing => existing.toLowerCase() === skill.toLowerCase());
    if (!exists) {
      setSkillFilters([...skillFilters, skill]);
    }
    setSkillInput('');
  };

  const handleRemoveSkillFilter = (skill: string) => {
    setSkillFilters(skillFilters.filter(s => s !== skill));
  };

  const filteredCandidates = candidates
    .filter(c => {
      if (filterStatus !== 'all' && c.status !== filterStatus) return false;
      if (c.atsScore < atsThreshold) return false;
      if (skillFilters.length > 0) {
        const hasAllSkills = skillFilters.every(filterSkill =>
          c.skills.some(candidateSkill =>
            candidateSkill.toLowerCase().includes(filterSkill.toLowerCase())
          )
        );
        if (!hasAllSkills) return false;
      }
      return true;
    })
    .sort((a, b) => b.atsScore - a.atsScore);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">HireSmart</h1>
            <p className="text-gray-600 mt-1">Resume parsing & ATS scoring</p>
          </div>
          <div className="flex items-center space-x-3">
            {candidates.length > 0 && (
              <Button
                onClick={handleDeleteAllCandidates}
                variant="outline"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Delete All ({candidates.length})
              </Button>
            )}
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="primary"
              isLoading={isUploading}
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Resumes
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap items-center gap-4 lg:gap-6">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="font-medium text-gray-700">Filters:</span>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700">ATS Threshold:</label>
                <input
                  type="range"
                  min={MIN_ATS_THRESHOLD}
                  max={MAX_ATS_THRESHOLD}
                  value={atsThreshold}
                  onChange={e => setAtsThreshold(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm font-semibold text-blue-600">{atsThreshold}%</span>
              </div>

              <div className="ml-auto text-sm text-gray-600 text-right flex items-center gap-3">
                <div>
                  <p>
                    Showing <span className="font-semibold">{filteredCandidates.length}</span> of <span className="font-semibold">{candidates.length}</span> candidates
                  </p>
                  {skillFilters.length > 0 && (
                    <p className="text-xs text-indigo-600 font-medium mt-1">
                      Filtering by {skillFilters.length} skill{skillFilters.length > 1 ? 's' : ''} · Sorted by ATS score
                    </p>
                  )}
                </div>
                {(filterStatus !== 'all' || atsThreshold !== DEFAULT_ATS_THRESHOLD || skillFilters.length > 0) && (
                  <button
                    onClick={handleResetFilters}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-between">
              <div className="flex-1 min-w-[220px] max-w-md">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Add skill to filter (e.g., React, Python)..."
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkillFilter();
                        }
                      }}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleAddSkillFilter}
                    variant="primary"
                    className="px-4"
                  >
                    Add
                  </Button>
                </div>
                {skillFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skillFilters.map((skill, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-200"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkillFilter(skill)}
                          className="hover:text-indigo-900 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Candidates must have ALL selected skills.
              </p>
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        {filteredCandidates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Candidates Found</h3>
            <p className="text-gray-600 mb-6">
              {candidates.length === 0
                ? 'Upload resumes to get started with AI-powered candidate screening.'
                : 'No candidates match the current filters. Try adjusting the status, ATS threshold, or skill search to see more results.'}
            </p>
            {candidates.length === 0 ? (
              <Button onClick={() => fileInputRef.current?.click()} variant="primary">
                <Upload className="w-5 h-5 mr-2" />
                Upload Resumes
              </Button>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  Clear Filters
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="primary">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload More Resumes
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCandidates.map(candidate => {
              const isDeletingCandidate = deletingCandidateId === candidate.id;
              return (
                <div key={candidate.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                      <p className="text-sm text-gray-600">{candidate.domain}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(candidate.atsScore)}`}>
                      {candidate.atsScore}%
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>Experience:</strong> {candidate.experience} years</p>
                    <p><strong>CTC:</strong> ₹{(candidate.ctc / 100000).toFixed(1)}L</p>
                    <p><strong>Location:</strong> {candidate.location}</p>
                    <p><strong>Email:</strong> {candidate.email}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, idx) => {
                        const isMatch = skillFilters.length > 0 && skillFilters.some(filter => 
                          skill.toLowerCase().includes(filter.toLowerCase())
                        );
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded text-xs ${
                              isMatch
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    {candidate.status === 'pending' ? (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(candidate.id, 'shortlisted')}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Shortlist</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(candidate.id, 'rejected')}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <div
                        className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold ${
                          candidate.status === 'shortlisted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {candidate.status === 'shortlisted' ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Shortlisted
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejected
                          </>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => handleDeleteCandidate(candidate.id)}
                      disabled={isDeletingCandidate}
                      className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                        isDeletingCandidate
                          ? 'bg-red-100 text-red-500 border-red-200 cursor-not-allowed'
                          : 'bg-white text-red-600 border-red-200 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{isDeletingCandidate ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Resume Viewer Modal */}
        {selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Resume Details</h2>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedCandidate.name}</h3>
                    <p className="text-lg text-gray-600">{selectedCandidate.domain}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{selectedCandidate.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-gray-900">{selectedCandidate.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Experience</p>
                      <p className="text-gray-900">{selectedCandidate.experience} years</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">CTC</p>
                      <p className="text-gray-900">₹{(selectedCandidate.ctc / 100000).toFixed(1)}L</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-gray-900">{selectedCandidate.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">ATS Score</p>
                      <p className={`text-lg font-semibold ${getScoreColor(selectedCandidate.atsScore)}`}>
                        {selectedCandidate.atsScore}%
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Education</p>
                    <p className="text-gray-900">{selectedCandidate.education}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill, idx) => {
                        const isMatch = skillFilters.length > 0 && skillFilters.some(filter =>
                          skill.toLowerCase().includes(filter.toLowerCase())
                        );
                        return (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-sm ${
                              isMatch
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-sm'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
