import React, { useState, useRef, DragEvent } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Sparkles, Loader2, X } from 'lucide-react';

interface AnalysisResult {
  matchScore: number;
  recommendation: string;
  summary: string;
  keyStrengths: string[];
  missingSkills: string[];
  redFlags: string[];
}

export const HireSmartResumeScreener: React.FC = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeResumeMock = (): Promise<AnalysisResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          matchScore: 85,
          recommendation: 'Interview',
          summary: 'Candidate has strong frontend experience but lacks some specific backend knowledge required for the Senior role. Overall, demonstrates solid technical skills and leadership potential.',
          keyStrengths: ['React.js', 'System Design', 'Team Leadership', 'TypeScript'],
          missingSkills: ['GraphQL', 'AWS Deployment'],
          redFlags: []
        });
      }, 2000);
    });
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim() && !file) {
      alert('Please provide a job description or upload a resume.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeResumeMock();
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert('Please upload a PDF or DOCX file.');
      }
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (validTypes.includes(droppedFile.type)) {
        setFile(droppedFile);
      } else {
        alert('Please upload a PDF or DOCX file.');
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score < 50) return 'text-red-600';
    if (score < 75) return 'text-amber-600';
    return 'text-green-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score < 50) return 'bg-red-100 border-red-200';
    if (score < 75) return 'bg-amber-100 border-amber-200';
    return 'bg-green-100 border-green-200';
  };

  const getVerdictColor = (recommendation: string): string => {
    switch (recommendation) {
      case 'Strong Hire':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Interview':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Potential':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Not Recommended':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">AI Resume Screener</h1>
          <p className="text-gray-600 mt-1">Analyze candidate resumes against job descriptions using AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input Zone */}
          <div className="space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-48 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none resize-none text-sm text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Resume Upload */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Resume Upload
              </label>
              {!file ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <UploadCloud className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Drag and drop your resume here
                  </p>
                  <p className="text-xs text-gray-500">
                    or click to browse (PDF, DOCX)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              onClick={handleAnalyze}
              isLoading={isLoading}
              disabled={!jobDescription.trim() && !file}
              className="w-full"
              variant="primary"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Analyze Candidate
            </Button>
          </div>

          {/* Right Column - Intelligence Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
              AI Analysis Results
            </h2>

            {!analysisResult && !isLoading ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <UploadCloud className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No Analysis Yet
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Enter a job description, upload a resume, and click "Analyze Candidate" to see AI-powered insights.
                </p>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center h-96">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-700 font-medium">Analyzing resume...</p>
                <p className="text-sm text-gray-500 mt-1">This may take a few seconds</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Match Score */}
                <div className={`p-6 rounded-xl border ${getScoreBgColor(analysisResult.matchScore)}`}>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${analysisResult.matchScore * 3.52} 352`}
                          className={getScoreColor(analysisResult.matchScore)}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-3xl font-bold ${getScoreColor(analysisResult.matchScore)}`}>
                          {analysisResult.matchScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getVerdictColor(analysisResult.recommendation)}`}>
                      {analysisResult.recommendation}
                    </span>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                    AI Summary
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {analysisResult.summary}
                  </p>
                </div>

                {/* Key Strengths */}
                {analysisResult.keyStrengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Key Strengths
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.keyStrengths.map((strength, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium border border-green-200"
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {analysisResult.missingSkills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-amber-600" />
                      Missing Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.missingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium border border-amber-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Red Flags */}
                {analysisResult.redFlags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                      Red Flags
                    </h4>
                    <div className="space-y-2">
                      {analysisResult.redFlags.map((flag, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg border border-red-200"
                        >
                          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-red-700">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Red Flags Message */}
                {analysisResult.redFlags.length === 0 && (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">No red flags detected</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
