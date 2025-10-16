import React, { useState, useEffect, FormEvent } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import {
  DollarSign,
  TrendingUp,
  Building,
  Search,
  Sparkles,
  Award,
  Brain,
  Loader2,
  BarChart2,
  Layers,
  LineChart,
  ShieldCheck
} from 'lucide-react';
import type {
  SalaryPrediction,
  SalaryFactors,
  SalaryPredictionRequest
} from '../../services/api/salaryPredictionService';
import { SalaryPredictionService } from '../../services/api/salaryPredictionService';

interface PredictionHistoryItem {
  id: string;
  timestamp: string;
  request: SalaryPredictionRequest;
  prediction: SalaryPrediction;
}

const skillOptions = [
  'React',
  'Node.js',
  'TypeScript',
  'Python',
  'Java',
  'AWS',
  'Docker',
  'Kubernetes',
  'MongoDB',
  'SQL',
  'Figma',
  'TensorFlow',
  'Data Analysis',
  'Machine Learning'
];

const educationLevels = [
  'Bachelor',
  'Master',
  'PhD',
  'Diploma'
];

const locations = [
  'Bangalore, Karnataka',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Coimbatore, Tamil Nadu',
  'Mumbai, Maharashtra',
  'Pune, Maharashtra',
  'Delhi NCR',
  'Remote / Anywhere'
];

const defaultRequest: SalaryPredictionRequest = {
  role: 'Full Stack Developer',
  experience_years: 4,
  education: 'Bachelor',
  location: 'Bangalore, Karnataka',
  skills: ['React', 'Node.js', 'TypeScript', 'MongoDB']
};

const SalaryPredictionPage: React.FC = () => {
  const [formData, setFormData] = useState<SalaryPredictionRequest>(defaultRequest);
  const [customSkill, setCustomSkill] = useState('');
  const [prediction, setPrediction] = useState<SalaryPrediction | null>(null);
  const [factors, setFactors] = useState<SalaryFactors | null>(null);
  const [history, setHistory] = useState<PredictionHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFactors = async () => {
      try {
        const response = await SalaryPredictionService.getSalaryFactors();
        setFactors(response);
      } catch (err) {
        console.error('Failed to load salary factors', err);
      }
    };

    loadFactors();
  }, []);

  const handlePredict = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await SalaryPredictionService.predictSalary(formData);
      setPrediction(result);

      setHistory(prev => [
        {
          id: `${Date.now()}`,
          timestamp: new Date().toISOString(),
          request: formData,
          prediction: result
        },
        ...prev.slice(0, 9)
      ]);
    } catch (err) {
      console.error(err);
      setError('Unable to predict salary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleAddCustomSkill = () => {
    if (!customSkill.trim()) return;
    const skill = customSkill.trim();
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills : [...prev.skills, skill]
    }));
    setCustomSkill('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const renderPredictionInsights = () => {
    if (!prediction) return null;

    const salaryGap = prediction.max_salary - prediction.min_salary;

    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="col-span-1 xl:col-span-2 bg-white border border-blue-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Predicted Compensation Range</h2>
              <p className="text-gray-500 text-sm">AI-powered salary estimate for the selected profile</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                <DollarSign className="w-4 h-4" /> Minimum
              </div>
              <p className="text-2xl font-bold text-green-700 mt-2">{formatCurrency(prediction.min_salary)}</p>
              <p className="text-xs text-green-600 mt-1">Conservative offer</p>
            </div>
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                <TrendingUp className="w-4 h-4" /> Market Average
              </div>
              <p className="text-2xl font-bold text-blue-700 mt-2">{formatCurrency(prediction.predicted_salary)}</p>
              <p className="text-xs text-blue-600 mt-1">Competitive salary</p>
            </div>
            <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
              <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm">
                <Award className="w-4 h-4" /> Maximum
              </div>
              <p className="text-2xl font-bold text-purple-700 mt-2">{formatCurrency(prediction.max_salary)}</p>
              <p className="text-xs text-purple-600 mt-1">Premium talent</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase text-gray-500">Confidence Level</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{prediction.confidence.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Model confidence in prediction accuracy</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase text-gray-500">Salary Spread</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(salaryGap)}</p>
              <p className="text-sm text-gray-600">Range across market percentiles</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase text-gray-500">Market Position</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(prediction.market_comparison.at_market)}</p>
              <p className="text-sm text-gray-600">Ideal offer for maximum acceptance</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Negotiation Guardrails</h2>
              <p className="text-gray-500 text-sm">Smart recommendations for competitive offers</p>
            </div>
          </div>

          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="text-emerald-500">•</span>
              Offer between {formatCurrency(prediction.min_salary)} and {formatCurrency(prediction.max_salary)} to stay market competitive.
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">•</span>
              Keep counter-offers within ±10% of {formatCurrency(prediction.predicted_salary)} for optimal retention.
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">•</span>
              Leverage skill premium insights to justify offer adjustments.
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-500">•</span>
              Re-evaluate every quarter for high-demand skill sets.
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const renderFactorBreakdown = () => {
    if (!prediction || !factors) return null;

    const impactEntries = Object.entries(prediction.factors);

    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Brain className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Model Factor Breakdown</h2>
            <p className="text-gray-500 text-sm">How different inputs shaped the prediction</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Impact Scores</h3>
            <div className="space-y-4">
              {impactEntries.map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full"
                      style={{ width: value }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Skill Premiums</h3>
            <div className="grid grid-cols-2 gap-3">
              {formData.skills.map(skill => (
                <div key={skill} className="border border-indigo-100 rounded-xl p-3 bg-indigo-50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-800">{skill}</span>
                    <span className="text-xs font-semibold text-indigo-600">
                      +{factors.skill_premiums[skill] || 3}%
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 mt-1">
                    Market premium for {skill}
                  </p>
                </div>
              ))}
              {formData.skills.length === 0 && (
                <p className="text-sm text-gray-500">
                  Select skills to view market premiums.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    if (history.length === 0) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Recent Predictions</h2>
              <p className="text-sm text-gray-500">Latest salary simulations for different talent profiles</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Predicted Salary</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Range</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Confidence</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {history.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.request.role}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.timestamp).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.request.experience_years} yrs</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.request.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex flex-wrap gap-1">
                      {item.request.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                      {item.request.skills.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{item.request.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                    {formatCurrency(item.prediction.predicted_salary)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">
                    {formatCurrency(item.prediction.min_salary)} - {formatCurrency(item.prediction.max_salary)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">
                    {item.prediction.confidence.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <main className="pt-20 px-8 pb-10">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Salary Intelligence</h1>
              <p className="text-gray-600">Predict competitive salaries, understand market premiums, and craft winning offers.</p>
            </div>
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl text-blue-600 text-sm">
              <BarChart2 className="w-4 h-4" />
              Powered by market benchmarks and skill premiums
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <form onSubmit={handlePredict} className="xl:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <LineChart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Profile Configuration</h2>
                  <p className="text-gray-500 text-sm">Define candidate attributes to simulate accurate salary ranges.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role / Title</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g., Senior Frontend Engineer"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                  <input
                    type="number"
                    min={0}
                    max={40}
                    value={formData.experience_years}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience_years: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Location</label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                  <select
                    value={formData.education}
                    onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {educationLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Skills</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {skillOptions.map(skill => (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                        formData.skills.includes(skill)
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200'
                      }`}
                    >
                      <span>{skill}</span>
                      {formData.skills.includes(skill) && <Sparkles className="w-4 h-4" />}
                    </button>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <input
                    type="text"
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Add custom skill"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Add Skill
                  </button>
                </div>

                {formData.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
                      Predict Salary Now
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Secure AI inference • No PII stored
                </div>
              </div>
            </form>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Building className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Market Insights</h2>
                  <p className="text-sm text-gray-500">Key benchmarks shaping compensation decisions</p>
                </div>
              </div>

              {factors ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase font-semibold text-gray-500 mb-2">Impact Weightage</p>
                    <ul className="space-y-2">
                      {factors.most_impactful.map(item => (
                        <li key={item.name} className="flex items-center justify-between text-sm text-gray-700">
                          <span>{item.name}</span>
                          <span className="font-semibold text-gray-900">{item.weight}%</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-xs uppercase font-semibold text-gray-500 mb-2">AI Suggestions</p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex gap-2">
                        <span className="text-emerald-500">•</span>
                        Combine niche skills with seniority for higher bands.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-emerald-500">•</span>
                        Metro locations command 10-15% higher compensation.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-emerald-500">•</span>
                        Education boosts base but skills drive premiums.
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
                  Loading market intelligence...
                </div>
              )}
            </div>
          </div>

          {prediction && (
            <>
              {renderPredictionInsights()}
              {renderFactorBreakdown()}
            </>
          )}

          {renderHistory()}
        </main>
      </div>
    </div>
  );
};

export default SalaryPredictionPage;
