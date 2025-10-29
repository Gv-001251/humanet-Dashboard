import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import {
  Search,
  Filter,
  MapPin,
  Clock,
  Briefcase,
  Send,
  ExternalLink,
  Building2,
  Linkedin,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  X,
  Mail,
  Phone,
  TrendingUp,
  Info
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
  const [showDetailModal, setShowDetailModal] = useState(false);
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

  const handleViewCandidate = (candidate: ExternalCandidate) => {
    if (!candidate.externalViewAvailable || candidate.source === 'naukri' || !candidate.profileUrl) {
      setSelectedCandidate(candidate);
      setShowDetailModal(true);
      return;
    }

    window.open(candidate.profileUrl, '_blank', 'noopener,noreferrer');
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
    if (score >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 75) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 65) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getPlatformIcon = (source: 'linkedin' | 'naukri') => {
    if (source === 'linkedin') {
      return (
        <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">
          <Linkedin className="w-3.5 h-3.5" />
          <span>LinkedIn</span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1 px-2 py-1 bg-orange-50 text-orange-600 rounded-md text-xs font-medium">
        <Globe className="w-3.5 h-3.5" />
        <span>Naukri</span>
      </div>
    );
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      discovered: { text: 'New', className: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300' },
      invited: { text: 'Invited', className: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border border-blue-300' },
      applied: { text: 'Applied', className: 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border border-green-300' },
      rejected: { text: 'Declined', className: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border border-red-300' }
    };
    const badge = badges[status as keyof typeof badges] || badges.discovered;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const getAvailabilityBadge = (availability: ExternalCandidate['availability']) => {
    const badges = {
      'Immediate': { className: 'bg-green-50 text-green-700 border-green-200', icon: '🚀' },
      '15 Days': { className: 'bg-blue-50 text-blue-700 border-blue-200', icon: '📅' },
      '1 Month': { className: 'bg-amber-50 text-amber-700 border-amber-200', icon: '⏳' },
      'Not Specified': { className: 'bg-gray-50 text-gray-700 border-gray-200', icon: '❓' }
    };
    const badge = badges[availability] || badges['Not Specified'];
    return (
      <span className={`inline-flex items-center space-x-1 px-2 py-1 border rounded-md text-xs font-medium ${badge.className}`}>
        <span>{badge.icon}</span>
        <span>{availability}</span>
      </span>
    );
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not Specified';
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  const renderCandidateCard = (candidate: ExternalCandidate) => {
    const canOpenExternal = Boolean(candidate.profileUrl) && candidate.externalViewAvailable !== false;
    const ViewIcon = canOpenExternal ? ExternalLink : Eye;
    const viewLabel = canOpenExternal ? 'View Profile' : 'View Details';
    const viewMessage = candidate.externalViewMessage || (canOpenExternal
      ? 'Opens the candidate profile in a new tab'
      : 'View detailed candidate information within HumaNet');

    return (
      <div 
        key={candidate.id} 
        className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-5 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {candidate.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{candidate.name}</h3>
                {candidate.currentRole && (
                  <p className="text-sm font-medium text-gray-700 mt-0.5">
                    {candidate.currentRole}
                  </p>
                )}
                {candidate.currentCompany && (
                  <div className="flex items-center text-xs text-gray-600 mt-1">
                    <Building2 className="w-3 h-3 mr-1" />
                    <span>{candidate.currentCompany}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {getPlatformIcon(candidate.source)}
              {getStatusBadge(candidate.status)}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5">
          {/* Key Information Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg p-2">
              <MapPin className="w-4 h-4 mr-2 text-indigo-500 flex-shrink-0" />
              <span className="truncate">{candidate.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-700 bg-gray-50 rounded-lg p-2">
              <Briefcase className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
              <span>{candidate.experience} years</span>
            </div>
            <div className="col-span-2 flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 border border-green-200">
              <div className="flex items-center text-sm font-medium text-green-700">
                <Clock className="w-4 h-4 mr-2" />
                <span>Available:</span>
              </div>
              {getAvailabilityBadge(candidate.availability)}
            </div>
          </div>

          {/* Bio Section */}
          {candidate.bio && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
              {candidate.bio}
            </p>
          )}

          {/* Skills Section */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Top Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.slice(0, 6).map((skill, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-md text-xs font-medium border border-indigo-200"
                >
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 6 && (
                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium border border-gray-200">
                  +{candidate.skills.length - 6} more
                </span>
              )}
            </div>
          </div>

          {/* Scores Section */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className={`text-center p-3 rounded-lg border ${getScoreColor(candidate.atsScore)}`}>
              <div className="text-xl font-bold">{candidate.atsScore}%</div>
              <div className="text-[10px] font-medium uppercase tracking-wide mt-0.5">ATS Score</div>
            </div>
            <div className={`text-center p-3 rounded-lg border ${getScoreColor(candidate.matchScore)}`}>
              <div className="text-xl font-bold">{candidate.matchScore}%</div>
              <div className="text-[10px] font-medium uppercase tracking-wide mt-0.5">Match</div>
            </div>
            <div className="text-center p-3 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700">
              <div className="text-lg font-bold">{formatCurrency(candidate.expectedCtc)}</div>
              <div className="text-[10px] font-medium uppercase tracking-wide mt-0.5">Expected CTC</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
            <button
              onClick={() => handleViewCandidate(candidate)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-200 shadow-sm hover:shadow"
              title={viewMessage}
              aria-label={viewLabel}
            >
              <ViewIcon className="w-4 h-4" />
              <span>{viewLabel}</span>
            </button>
            {candidate.status === 'discovered' && (
              <button
                onClick={() => handleInviteCandidate(candidate)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>Invite</span>
              </button>
            )}
            {candidate.status === 'invited' && (
              <div className="flex-1 flex items-center justify-center space-x-2 text-blue-600 text-sm font-medium bg-blue-50 py-2.5 rounded-lg border border-blue-200">
                <CheckCircle className="w-4 h-4" />
                <span>Invited</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Talent Scout</h1>
              <p className="text-gray-600">
                Discover and connect with top talent from LinkedIn & Naukri
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
              activeTab === 'search'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Search Candidates</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Saved Candidates</span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {savedCandidates.length}
              </span>
            </div>
          </button>
        </div>

        {activeTab === 'search' && (
          <>
            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-2 mb-5">
                <Filter className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-gray-900">Search Filters</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 text-gray-900 font-medium"
                  >
                    <option value="both">🌐 Both Platforms</option>
                    <option value="linkedin">💼 LinkedIn Only</option>
                    <option value="naukri">🔍 Naukri Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Keywords *
                  </label>
                  <input
                    type="text"
                    value={searchFilters.keywords}
                    onChange={e =>
                      setSearchFilters(prev => ({ ...prev, keywords: e.target.value }))
                    }
                    placeholder="e.g., Software Engineer"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={searchFilters.location}
                    onChange={e =>
                      setSearchFilters(prev => ({ ...prev, location: e.target.value }))
                    }
                    placeholder="e.g., Bangalore"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <span className="text-gray-500 font-medium">to</span>
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
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    placeholder="Type a skill and press Enter"
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddSkill} 
                    variant="outline"
                    className="px-6"
                  >
                    Add
                  </Button>
                </div>
                {searchFilters.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {searchFilters.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-200"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-indigo-900 transition-colors"
                        >
                          <X className="w-4 h-4" />
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
                className="w-full md:w-auto px-8 py-3 text-base bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                {isSearching ? 'Searching...' : 'Search Candidates'}
              </Button>
            </form>

            {/* Search Results */}
            {isSearching && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Searching candidates...
                </h3>
                <p className="text-gray-600">
                  Scanning {searchFilters.platform === 'both' ? 'LinkedIn and Naukri' : searchFilters.platform === 'linkedin' ? 'LinkedIn' : 'Naukri'} for matching profiles
                </p>
              </div>
            )}

            {!isSearching && candidates.length === 0 && searchFilters.keywords && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                <AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">No candidates found</h3>
                <p className="text-gray-600">
                  Try adjusting your search filters or keywords
                </p>
              </div>
            )}

            {!isSearching && candidates.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Search Results <span className="text-indigo-600">({candidates.length})</span>
                  </h2>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium">Sorted by match score</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {candidates.map(candidate => renderCandidateCard(candidate))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'saved' && (
          <div>
            {savedCandidates.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                <AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  No saved candidates yet
                </h3>
                <p className="text-gray-600">
                  Candidates you invite will appear here
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Saved Candidates <span className="text-indigo-600">({savedCandidates.length})</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {savedCandidates.map(candidate => renderCandidateCard(candidate))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Detail Modal for Naukri Candidates */}
        {showDetailModal && selectedCandidate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedCandidate.name}</h2>
                    <p className="text-white/90 text-sm">{selectedCandidate.currentRole}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedCandidate(null);
                  }}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Platform Badge */}
                <div className="mb-6">
                  <div
                    className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg border ${
                      selectedCandidate.source === 'naukri'
                        ? 'bg-orange-100 text-orange-700 border-orange-300'
                        : 'bg-indigo-100 text-indigo-700 border-indigo-300'
                    }`}
                  >
                    {selectedCandidate.source === 'naukri' ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                    <span className="font-semibold">
                      {selectedCandidate.source === 'naukri' ? 'Naukri Profile' : 'Candidate Details'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedCandidate.externalViewMessage || 'Detailed candidate information is available below.'}
                  </p>
                </div>

                {/* Contact Information */}
                <div className="bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl p-5 mb-6 border border-indigo-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <Mail className="w-5 h-5 mr-3 text-indigo-600" />
                      <span className="font-medium">{selectedCandidate.email}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-5 h-5 mr-3 text-indigo-600" />
                      <span className="font-medium">{selectedCandidate.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-indigo-600" />
                      <span className="font-medium">{selectedCandidate.location}</span>
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Professional Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Company</p>
                      <p className="font-semibold text-gray-900">{selectedCandidate.currentCompany || 'Not Specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Current Role</p>
                      <p className="font-semibold text-gray-900">{selectedCandidate.currentRole || 'Not Specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Experience</p>
                      <p className="font-semibold text-gray-900">{selectedCandidate.experience} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Availability</p>
                      {getAvailabilityBadge(selectedCandidate.availability)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Education</p>
                      <p className="font-semibold text-gray-900">{selectedCandidate.education}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Expected CTC</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(selectedCandidate.expectedCtc)}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {selectedCandidate.bio && (
                  <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-700 leading-relaxed">{selectedCandidate.bio}</p>
                  </div>
                )}

                {/* Skills */}
                <div className="bg-white rounded-xl p-5 mb-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700 rounded-lg text-sm font-medium border border-indigo-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-5 rounded-xl border ${getScoreColor(selectedCandidate.atsScore)} text-center`}>
                    <div className="text-3xl font-bold mb-1">{selectedCandidate.atsScore}%</div>
                    <div className="text-sm font-semibold uppercase tracking-wide">ATS Score</div>
                  </div>
                  <div className={`p-5 rounded-xl border ${getScoreColor(selectedCandidate.matchScore)} text-center`}>
                    <div className="text-3xl font-bold mb-1">{selectedCandidate.matchScore}%</div>
                    <div className="text-sm font-semibold uppercase tracking-wide">Match Score</div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedCandidate(null);
                  }}
                  className="px-6"
                >
                  Close
                </Button>
                {selectedCandidate.status === 'discovered' && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowDetailModal(false);
                      handleInviteCandidate(selectedCandidate);
                    }}
                    className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Invitation
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        {showInviteModal && selectedCandidate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between border-b border-white/20">
                <h2 className="text-2xl font-bold">Send Invitation</h2>
                <button
                  onClick={() => {
                    setShowInviteModal(false);
                    setSelectedCandidate(null);
                    setInviteMessage('');
                  }}
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Candidate Info */}
                <div className="flex items-center space-x-4 mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {selectedCandidate.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedCandidate.name}
                    </h3>
                    <p className="text-sm text-gray-600">{selectedCandidate.currentRole} at {selectedCandidate.currentCompany}</p>
                  </div>
                  {getPlatformIcon(selectedCandidate.source)}
                </div>

                {/* Message Textarea */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Invitation Message
                  </label>
                  <textarea
                    value={inviteMessage}
                    onChange={e => setInviteMessage(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    placeholder="Write your personalized invitation message..."
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Personalize your message to increase response rate
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowInviteModal(false);
                      setSelectedCandidate(null);
                      setInviteMessage('');
                    }}
                    className="px-6"
                    disabled={isInviting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSendInvite}
                    isLoading={isInviting}
                    className="px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
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
