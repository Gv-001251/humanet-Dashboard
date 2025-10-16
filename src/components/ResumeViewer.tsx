import React, { useState } from 'react';
import { FileText, Download, Eye, User, Mail, Phone, Briefcase, GraduationCap, Award, Calendar } from 'lucide-react';
import { Candidate } from '../services/api/resumeService';
import { ResumeService } from '../services/api/resumeService';

interface ResumeViewerProps {
  candidate: Candidate;
  onClose?: () => void;
  showActions?: boolean;
}

export const ResumeViewer: React.FC<ResumeViewerProps> = ({
  candidate,
  onClose,
  showActions = true,
}) => {
  const [viewingResume, setViewingResume] = useState(false);

  const handleDownloadResume = async () => {
    try {
      await ResumeService.downloadResume(candidate.resume_url);
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const handleViewResume = () => {
    setViewingResume(true);
    window.open(`http://localhost:3001${candidate.resume_url}`, '_blank');
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

  const getFraudRiskLevel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{candidate.name}</h2>
            <p className="text-gray-600">{candidate.role || 'Software Engineer'}</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.application_status)}`}>
              {candidate.application_status.charAt(0).toUpperCase() + candidate.application_status.slice(1)}
            </span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{candidate.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{candidate.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Applied: {formatDate(candidate.applied_date)}</span>
        </div>
      </div>

      {/* Resume Actions */}
      {showActions && (
        <div className="flex space-x-3 mb-6">
          <button
            onClick={handleViewResume}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Resume
          </button>
          <button
            onClick={handleDownloadResume}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Experience & CTC */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              Experience & Compensation
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Experience:</span>
                <span className="text-sm font-medium">{candidate.experience_years} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Current CTC:</span>
                <span className="text-sm font-medium">{formatCurrency(candidate.current_ctc)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Expected CTC:</span>
                <span className="text-sm font-medium">{formatCurrency(candidate.expected_ctc)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Notice Period:</span>
                <span className="text-sm font-medium">{candidate.notice_period} days</span>
              </div>
              {candidate.current_ctc > 0 && candidate.expected_ctc > 0 && (
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm text-gray-600">Hike Expected:</span>
                  <span className="text-sm font-medium text-blue-600">
                    {(((candidate.expected_ctc - candidate.current_ctc) / candidate.current_ctc) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Education
            </h3>
            <p className="text-sm text-gray-600">{candidate.education}</p>
          </div>

          {/* Certifications */}
          {candidate.certifications && candidate.certifications.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Certifications
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skills */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Fraud Detection Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Verification</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${candidate.fraud_check.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {candidate.fraud_check.is_verified ? 'Verified' : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Risk Score:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFraudRiskColor(candidate.fraud_check.risk_score)}`}>
                  {candidate.fraud_check.risk_score}/100 - {getFraudRiskLevel(candidate.fraud_check.risk_score)}
                </span>
              </div>
              {candidate.fraud_check.flags && candidate.fraud_check.flags.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600 block mb-1">Flags:</span>
                  <div className="space-y-1">
                    {candidate.fraud_check.flags.map((flag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800 mr-1">
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resume Text Preview */}
          {candidate.resume_text && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume Preview</h3>
              <div className="max-h-48 overflow-y-auto">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {candidate.resume_text.substring(0, 500)}
                  {candidate.resume_text.length > 500 && '...'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {showActions && (
        <div className="mt-6 flex space-x-3 pt-6 border-t">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
            Shortlist
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Schedule Interview
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Send Offer
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50">
            Reject
          </button>
        </div>
      )}
    </div>
  );
};
