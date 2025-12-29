import React, { useState, useRef, DragEvent } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { UploadCloud, FileText, CheckCircle, AlertCircle, Sparkles, Loader2, X, Plus } from 'lucide-react';

interface AnalysisResult {
  matchScore: number;
  recommendation: string;
  foundSkills: string[];
  missingSkills: string[];
}

export const HireSmartResumeScreener: React.FC = () => {
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock resume skills for demonstration
  const mockResumeSkills = ['React', 'Tailwind', 'JavaScript', 'Git', 'TypeScript', 'Node.js'];

  const analyzeResumeMock = (skills: string[]): Promise<AnalysisResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundSkills = skills.filter(skill => 
          mockResumeSkills.some(resumeSkill => 
            resumeSkill.toLowerCase() === skill.toLowerCase()
          )
        );
        const missingSkills = skills.filter(skill => 
          !mockResumeSkills.some(resumeSkill => 
            resumeSkill.toLowerCase() === skill.toLowerCase()
          )
        );
        
        const matchScore = skills.length > 0 ? Math.round((foundSkills.length / skills.length) * 100) : 0;
        
        let recommendation = 'Not Recommended';
        if (matchScore >= 80) recommendation = 'Strong Hire';
        else if (matchScore >= 60) recommendation = 'Interview';
        else if (matchScore >= 40) recommendation = 'Potential';

        resolve({
          matchScore,
          recommendation,
          foundSkills,
          missingSkills
        });
      }, 2000);
    });
  };

  const handleAnalyze = async () => {
    if (requiredSkills.length === 0 && !file) {
      alert('Please add required skills or upload a resume.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await analyzeResumeMock(requiredSkills);
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

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;
    
    const exists = requiredSkills.some(existing => existing.toLowerCase() === skill.toLowerCase());
    if (!exists) {
      setRequiredSkills([...requiredSkills, skill]);
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
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
          <p className="text-gray-600 mt-1">Analyze candidate resumes against required skills using AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Input Zone */}
          <div className="space-y-6">
            {/* Required Skills */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Required Skills
              </label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a skill and press Enter..."
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                  />
                  <Button
                    onClick={handleAddSkill}
                    variant="primary"
                    className="px-4"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                {requiredSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200"
                      >
                        <span>{skill}</span>
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-gray-900 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
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
              disabled={requiredSkills.length === 0 && !file}
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
                  Add required skills, upload a resume, and click "Analyze Candidate" to see AI-powered insights.
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

                {/* Matched Skills */}
                {analysisResult.foundSkills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Matched Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.foundSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium border border-green-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Requirements */}
                {analysisResult.missingSkills.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                      Missing Requirements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.missingSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium border border-red-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Skills Matched */}
                {analysisResult.missingSkills.length === 0 && analysisResult.foundSkills.length > 0 && (
                  <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700">All required skills matched!</span>
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