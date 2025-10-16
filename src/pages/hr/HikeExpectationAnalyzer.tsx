import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { Header } from "../../components/layout/Header";
import { useTheme } from "../../contexts/ThemeContext";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart2,
  Info,
  Users,
  DollarSign,
  Target,
} from "lucide-react";
import { HikeAnalysisService } from "../../services/api/hikeAnalysisService";
import { ResumeService, Candidate } from "../../services/api/resumeService";

interface SalaryData {
  role: string;
  currentCTC: number; // candidate current CTC in LPA
  expectedCTC: number; // candidate expected CTC in LPA
  marketMedianCTC: number; // median market CTC in LPA
}

export default function HikeExpectationAnalyzer() {
  const { darkMode } = useTheme();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [benchmarks, setBenchmarks] = useState<any>({});
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [candidatesData, benchmarksData] = await Promise.all([
        ResumeService.getAllCandidates(),
        HikeAnalysisService.getBenchmarks(),
      ]);
      setCandidates(candidatesData);
      setBenchmarks(benchmarksData);
      
      // Auto-select first candidate if available
      if (candidatesData.length > 0) {
        setSelectedCandidate(candidatesData[0]._id!);
        analyzeCandidate(candidatesData[0]._id!);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeCandidate = async (candidateId: string) => {
    const candidate = candidates.find(c => c._id === candidateId);
    if (!candidate) return;

    try {
      setAnalyzing(true);
      const analysisResult = await HikeAnalysisService.analyzeHikeExpectation({
        candidate_id: candidateId,
        current_ctc: candidate.current_ctc,
        expected_ctc: candidate.expected_ctc,
        experience_years: candidate.experience_years,
        role: candidate.role || 'Software Engineer',
        skills: candidate.skills,
      });
      setAnalysis(analysisResult);
    } catch (error) {
      console.error('Error analyzing hike expectation:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCandidateChange = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    analyzeCandidate(candidateId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8 max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
            Hike Expectation Analyzer
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-700"}>
              Analyze candidate salary expectations against market benchmarks and provide data-driven recommendations.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Candidate Selection */}
              <div className={`p-6 rounded-xl shadow-sm mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                <h2 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Select Candidate for Analysis
                </h2>
                <select
                  value={selectedCandidate}
                  onChange={(e) => handleCandidateChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a candidate</option>
                  {candidates.map(candidate => (
                    <option key={candidate._id} value={candidate._id}>
                      {candidate.name} - {candidate.role} ({formatCurrency(candidate.current_ctc)} → {formatCurrency(candidate.expected_ctc)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Analysis Results */}
              {selectedCandidate && analysis && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Key Metrics */}
                  <div className={`p-6 rounded-xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Salary Analysis
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current CTC:</span>
                        <span className="font-semibold">{formatCurrency(analysis.current_ctc)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Expected CTC:</span>
                        <span className="font-semibold">{formatCurrency(analysis.expected_ctc)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Market Average:</span>
                        <span className="font-semibold">{formatCurrency(analysis.market_average)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Hike Requested:</span>
                        <span className={`font-semibold ${
                          analysis.hike_percentage > 50 ? 'text-red-600' :
                          analysis.hike_percentage > 30 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {analysis.hike_percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Risk Assessment */}
                  <div className={`p-6 rounded-xl shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                      Risk Assessment
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          analysis.risk_level === 'high' ? 'bg-red-100 text-red-800' :
                          analysis.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {analysis.risk_level.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Retention Risk:</span>
                        <span className={`font-semibold ${
                          analysis.retention_risk > 70 ? 'text-red-600' :
                          analysis.retention_risk > 40 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {analysis.retention_risk.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Market Fit:</span>
                        <span className={`font-semibold ${
                          analysis.market_fit > 80 ? 'text-green-600' :
                          analysis.market_fit > 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {analysis.market_fit.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {selectedCandidate && analysis && (
                <div className={`p-6 rounded-xl shadow-sm mb-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Recommendations
                  </h3>
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
