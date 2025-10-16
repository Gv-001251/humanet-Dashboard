import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { useTheme } from '../../contexts/ThemeContext';
import { Upload, CheckCircle, XCircle, FileText, ShieldAlert, BadgeCheck, AlertTriangle, User, Eye, Download } from 'lucide-react';
import { FraudDetectionService, DocumentVerification, DocumentUploadRequest } from '../../services/api/fraudDetectionService';
import { ResumeService, Candidate } from '../../services/api/resumeService';

export default function DocumentFraudDetection() {
  const { darkMode } = useTheme();
  const [uploadedDocs, setUploadedDocs] = useState<DocumentVerification[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Upload form state
  const [uploadForm, setUploadForm] = useState<DocumentUploadRequest>({
    candidate_id: '',
    document_type: 'resume',
    verified_by: 'hr_team',
    document: null as any,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoadingDocs(true);
      const [docsData, candidatesData] = await Promise.all([
        FraudDetectionService.getFraudReports(),
        ResumeService.getAllCandidates(),
      ]);
      setUploadedDocs(docsData);
      setCandidates(candidatesData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, JPG, or PNG file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uploadData: DocumentUploadRequest = {
        ...uploadForm,
        document: file,
      };

      const result = await FraudDetectionService.verifyDocument(uploadData);
      setUploadedDocs(prev => [result, ...prev]);
      
      // Reset form
      setUploadForm({
        candidate_id: '',
        document_type: 'resume',
        verified_by: 'hr_team',
        document: null as any,
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      console.error('Error uploading document:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'fraud_detected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-100';
    if (score < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskLevel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <BadgeCheck className="w-10 h-10 text-green-500" />;
      case 'fraud_detected':
        return <XCircle className="w-10 h-10 text-red-500" />;
      default:
        return <FileText className="w-10 h-10 text-yellow-500" />;
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCandidateName = (candidateId: string) => {
    const candidate = candidates.find(c => c._id === candidateId);
    return candidate ? candidate.name : 'Unknown Candidate';
  };

  const downloadDocument = async (documentUrl: string, filename: string) => {
    try {
      const response = await fetch(`http://localhost:3001${documentUrl}`);
      if (!response.ok) throw new Error('Failed to download document');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      setError('Failed to download document');
      console.error('Error downloading document:', error);
    }
  };

  if (loadingDocs) {
    return (
      <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
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
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
              AI Document Fraud Detection
            </h1>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Upload candidate documents for auto-verification.<br />
              Our AI system checks for manipulation, mismatches, and verifies authenticity.
            </p>
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

          {/* Upload Section */}
          <div className={`mb-8 p-6 rounded-2xl border-2 border-dashed transition ${
            darkMode
              ? "bg-gray-800 border-gray-600 text-white"
              : "bg-white border-gray-300 text-gray-900"
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Upload Document for Verification
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Candidate Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Candidate
                </label>
                <select
                  name="candidate_id"
                  value={uploadForm.candidate_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a candidate...</option>
                  {candidates.map(candidate => (
                    <option key={candidate._id} value={candidate._id}>
                      {candidate.name} ({candidate.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Document Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Type
                </label>
                <select
                  name="document_type"
                  value={uploadForm.document_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="resume">Resume</option>
                  <option value="payslip">Payslip</option>
                  <option value="bank_statement">Bank Statement</option>
                  <option value="id_proof">ID Proof</option>
                  <option value="experience_letter">Experience Letter</option>
                  <option value="education_certificate">Education Certificate</option>
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div
              className="p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 mb-2 text-blue-600" />
              <p className="mb-2 font-semibold">Click or drag-and-drop to upload a document</p>
              <p className="text-sm text-gray-400">PDF, JPG, PNG allowed (Max 5MB)</p>
              <input
                type="file"
                accept="application/pdf,image/*"
                hidden
                ref={fileInputRef}
                onChange={handleFileUpload}
                disabled={loading || !uploadForm.candidate_id}
              />
              {loading && (
                <span className="mt-4 text-blue-600 animate-pulse">Analyzing document...</span>
              )}
            </div>
          </div>

          {/* Verification History */}
          <div>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Verification History ({uploadedDocs.length} documents)
            </h2>
            
            {uploadedDocs.length === 0 ? (
              <div className={`text-center py-12 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <FileText className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                  No documents uploaded yet
                </p>
                <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"} mt-2`}>
                  Upload documents to start fraud detection analysis
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {uploadedDocs.map((doc) => (
                  <div
                    key={doc._id}
                    className={`rounded-xl p-6 border flex items-start gap-4 transition shadow-sm ${
                      darkMode
                        ? `bg-gray-800 border-gray-700`
                        : `bg-white border-gray-200`
                    }`}
                  >
                    <div className="pt-1">
                      {getStatusIcon(doc.verification_status)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {doc.document_url.split('/').pop()}
                        </h3>
                        <span className={`px-2 py-1 rounded border text-xs font-semibold ${getStatusColor(doc.verification_status)}`}>
                          {FraudDetectionService.getStatusText(doc.verification_status)}
                        </span>
                      </div>
                      
                      <div className="flex items-center flex-wrap gap-4 mb-2 text-sm">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {getCandidateName(doc.candidate_id)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {doc.document_type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldAlert className="w-4 h-4" />
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(doc.fraud_score)}`}>
                            {doc.fraud_score}/100 - {getRiskLevel(doc.fraud_score)}
                          </span>
                        </span>
                        <span>
                          Verified: {formatDate(doc.verified_at)}
                        </span>
                      </div>

                      {/* Fraud Indicators */}
                      {doc.fraud_indicators && doc.fraud_indicators.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-red-600 mb-1">Fraud Indicators:</p>
                          <div className="flex flex-wrap gap-1">
                            {doc.fraud_indicators.map((indicator, index) => (
                              <span key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                {indicator}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => downloadDocument(doc.document_url, doc.document_url.split('/').pop() || 'document')}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                        <button
                          onClick={() => window.open(`http://localhost:5000${doc.document_url}`, '_blank')}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </button>
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
  );
}