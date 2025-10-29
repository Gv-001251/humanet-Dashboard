import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Star,
  Award,
  Send,
  ExternalLink,
  Building2,
  Linkedin,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { talentScoutService } from '../services/talentScoutService';
import { ExternalCandidate, SearchFilters } from '../types/talentScout.types';

export const TalentScout: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    platform: 'both',
    keywords: '',
    location: '',
    experience: { min: 0, max: 15 },
    skills: []
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [candidates, setCandidates] = useState<ExternalCandidate[]>([]);
  const [savedCandidates, setSavedCandidates] = useState<ExternalCandidate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<ExternalCandidate | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'saved'>('search');

  useEffect(() => {
    loadSavedCandidates();
  }, []);

  const loadSavedCandidates = async () => {
    try {
      const response = await talentScoutService.getSavedCandidates();
      if (response.success) {
        setSavedCandidates(response.data);
      }
    } catch (error) {
      console.error('Error loading saved candidates:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchFilters.keywords.trim()) {
      alert('Please enter search keywords');
      return;
    }

    setIsSearching(true);
    try {
      const response = await talentScoutService.search(searchFilters);
      if (response.success) {
        setCandidates(response.data);
      }
    } catch (error) {
      console.error('Error searching candidates:', error);
      alert('Failed to search candidates. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !searchFilters.skills.includes(skillInput.trim())) {
      setSearchFilters(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSearchFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleInviteCandidate = (candidate: ExternalCandidate) => {
    setSelectedCandidate(candidate);
    setInviteMessage(
      `Hi ${candidate.name},\n\nWe came across your profile and are impressed with your experience in ${candidate.skills.slice(0, 3).join(', ')}. We have an exciting opportunity that matches your expertise.\n\nWould you be interested in exploring this further?\n\nBest regards,\nHumaNet HR Team`
    );
    setShowInviteModal(true);
  };

  const handleSendInvite = async () => {
    if (!selectedCandidate) return;

    setIsInviting(true);
    try {
      const response = await talentScoutService.inviteCandidate({
        candidateId: selectedCandidate.id,
        message: inviteMessage
      });

      if (response.success) {
        alert(`Invitation sent successfully to ${selectedCandidate.name}!`);
        setShowInviteModal(false);
        setSelectedCandidate(null);
        setInviteMessage('');
        
        // Update local state
        setCandidates(prev =>
          prev.map(c =>
            c.id === selectedCandidate.id
              ? { ...c, status: 'invited' as const, invitedAt: new Date().toISOString() }
              : c
          )
        );
        
        loadSavedCandidates();
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-blue-600 bg-blue-100';
    if (score >= 65) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getPlatformIcon = (source: 'linkedin' | 'naukri') => {
    if (source === 'linkedin') {
      return <Linkedin className="w-4 h-4 text-blue-600" />;
    }
    return <Globe className="w-4 h-4 text-orange-600" />;
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      discovered: { text: 'New', className: 'bg-gray-100 text-gray-700' },
      invited: { text: 'Invited', className: 'bg-blue-100 text-blue-700' },
      applied: { text: 'Applied', className: 'bg-green-100 text-green-700' },
      rejected: { text: 'Declined', className: 'bg-red-100 text-red-700' }
    };
    const badge = badges[status as keyof typeof badges] || badges.discovered;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const renderCandidateCard = (candidate: ExternalCandidate) => (
    <div key={candidate.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
            {candidate.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {candidate.currentRole && (
                <span className="flex items-center">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {candidate.currentRole}
                </span>
              )}
              {candidate.currentCompany && (
                <span className="flex items-center">
                  <Building2 className="w-3 h-3 mr-1" />
                  {candidate.currentCompany}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {getPlatformIcon(candidate.source)}
          {getStatusBadge(candidate.status)}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span>{candidate.location}</span>
        </div>
        <div className="flex items-center">
          <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
          <span>{candidate.experience} years experience</span>
        </div>
        <div className="flex items-center">
          <Award className="w-4 h-4 mr-2 text-gray-400" />
          <span>{candidate.education}</span>
        </div>
      </div>

      {candidate.bio && (
        <p className="text-sm text-gray-600 mb-4 overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {candidate.bio}
        </p>
      )}

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
        <div className="flex flex-wrap gap-2">
          {candidate.skills.slice(0, 6).map((skill, idx) => (
            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              {skill}
            </span>
          ))}
          {candidate.skills.length > 6 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              +{candidate.skills.length - 6} more
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className={`text-lg font-bold ${getScoreColor(candidate.atsScore)}`}>
              {candidate.atsScore}%
            </div>
            <div className="text-xs text-gray-500">ATS Score</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${getScoreColor(candidate.matchScore)}`}>
              {candidate.matchScore}%
            </div>
            <div className="text-xs text-gray-500">Match</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={candidate.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View</span>
          </a>
          {candidate.status === 'discovered' && (
            <Button
              variant="primary"
              onClick={() => handleInviteCandidate(candidate)}
              className="flex items-center space-x-1 px-3 py-2 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>Invite</span>
            </Button>
          )}
          {candidate.status === 'invited' && (
            <div className="flex items-center space-x-1 text-blue-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Invited</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Talent Scout</h1>
          <p className="text-gray-600 mt-1">
            Search and invite external candidates from LinkedIn & Naukri
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'search'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Search Candidates
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'saved'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Saved Candidates ({savedCandidates.length})
          </button>
        </div>

        {activeTab === 'search' && (
          <>
            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <select
                    value={searchFilters.platform}
                    onChange={e =>
                      setSearchFilters(prev => ({
                        ...prev,
                        platform: e.target.value as 'both' | 'linkedin' | 'naukri'
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="both">Both LinkedIn & Naukri</option>
                    <option value="linkedin">LinkedIn Only</option>
                    <option value="naukri">Naukri Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={searchFilters.keywords}
                    onChange={e =>
                      setSearchFilters(prev => ({ ...prev, keywords: e.target.value }))
                    }
                    placeholder="e.g., Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={searchFilters.location}
                    onChange={e =>
                      setSearchFilters(prev => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="e.g., Bangalore"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (years)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={searchFilters.experience.min}
                      onChange={e =>
                        setSearchFilters(prev => ({
                          ...prev,
                          experience: { ...prev.experience, min: Number(e.target.value) }
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={searchFilters.experience.max}
                      onChange={e =>
                        setSearchFilters(prev => ({
                          ...prev,
                          experience: { ...prev.experience, max: Number(e.target.value) }
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Add skill and press Enter"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Button type="button" onClick={handleAddSkill} variant="outline">
                    Add
                  </Button>
                </div>
                {searchFilters.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {searchFilters.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="flex items-center space-x-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-indigo-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isSearching}
                className="w-full md:w-auto"
              >
                <Search className="w-5 h-5 mr-2" />
                {isSearching ? 'Searching...' : 'Search Candidates'}
              </Button>
            </form>

            {/* Search Results */}
            {isSearching && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Searching candidates...
                </h3>
                <p className="text-gray-600">
                  Scanning LinkedIn and Naukri for matching profiles
                </p>
              </div>
            )}

            {!isSearching && candidates.length === 0 && searchFilters.keywords && (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No candidates found</h3>
                <p className="text-gray-600">
                  Try adjusting your search filters or keywords
                </p>
              </div>
            )}

            {!isSearching && candidates.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Search Results ({candidates.length} candidates)
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Filter className="w-4 h-4" />
                    <span>Sorted by match score</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {candidates.map(candidate => renderCandidateCard(candidate))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'saved' && (
          <div>
            {savedCandidates.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No saved candidates yet
                </h3>
                <p className="text-gray-600">
                  Candidates you invite will appear here
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {savedCandidates.map(candidate => renderCandidateCard(candidate))}
              </div>
            )}
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && selectedCandidate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Invite Candidate</h2>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedCandidate.name}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedCandidate.currentRole}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Invitation Message
                  </label>
                  <textarea
                    value={inviteMessage}
                    onChange={e => setInviteMessage(e.target.value)}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowInviteModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSendInvite}
                    isLoading={isInviting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isInviting ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
