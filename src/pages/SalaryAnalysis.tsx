import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { DollarSign, TrendingUp, Award } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PredictionResult {
  role: string;
  min: number;
  ideal: number;
  max: number;
  confidence: number;
  breakdown: {
    base: number;
    skillsPremium: number;
    locationFactor: number;
    industryPremium: number;
  };
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];

export const SalaryAnalysis: React.FC = () => {
  const [formData, setFormData] = useState({
    role: '',
    skills: '',
    experience: '',
    location: 'Bangalore',
    industry: 'IT',
    companySize: 'Medium',
    education: 'Bachelor'
  });

  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [history, setHistory] = useState<PredictionResult[]>([]);

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock prediction algorithm
    const baseMultiplier = Number(formData.experience) || 1;
    const skillCount = formData.skills.split(',').filter(Boolean).length;
    const locationMultipliers: Record<string, number> = {
      Bangalore: 1.2,
      Mumbai: 1.15,
      Hyderabad: 1.1,
      Chennai: 1.0,
      Coimbatore: 0.9
    };

    const base = 400000 + baseMultiplier * 150000;
    const skillsPremium = skillCount * 50000;
    const locationFactor = base * (locationMultipliers[formData.location] - 1);
    const industryPremium = formData.industry === 'IT' ? 50000 : 20000;

    const ideal = base + skillsPremium + locationFactor + industryPremium;
    const min = ideal * 0.85;
    const max = ideal * 1.25;
    const confidence = Math.min(95, 75 + skillCount * 2);

    const result: PredictionResult = {
      role: formData.role,
      min: Math.round(min),
      ideal: Math.round(ideal),
      max: Math.round(max),
      confidence,
      breakdown: {
        base: Math.round(base),
        skillsPremium: Math.round(skillsPremium),
        locationFactor: Math.round(locationFactor),
        industryPremium: Math.round(industryPremium)
      }
    };

    setPrediction(result);
    setHistory(prev => [result, ...prev.slice(0, 4)]);
  };

  const baseIdealSalary = prediction?.ideal ?? 1200000;
  const regionalComparison = [
    { city: 'Bangalore', salary: baseIdealSalary },
    { city: 'Mumbai', salary: baseIdealSalary * 0.96 },
    { city: 'Hyderabad', salary: baseIdealSalary * 0.92 },
    { city: 'Chennai', salary: baseIdealSalary * 0.83 },
    { city: 'Coimbatore', salary: baseIdealSalary * 0.75 }
  ];

  const pieData = prediction
    ? [
        { name: 'Base Salary', value: prediction.breakdown.base },
        { name: 'Skills Premium', value: prediction.breakdown.skillsPremium },
        { name: 'Location Factor', value: Math.abs(prediction.breakdown.locationFactor) },
        { name: 'Industry Premium', value: prediction.breakdown.industryPremium }
      ]
    : [];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Salary Analysis</h1>
            <p className="text-gray-600">AI-powered salary predictions and market benchmarking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Prediction Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Salary Predictor
              </h2>
              <form onSubmit={handlePredict} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role / Job Title</label>
                  <input
                    required
                    value={formData.role}
                    onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
                  <input
                    required
                    value={formData.skills}
                    onChange={e => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="React, Node.js, AWS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (years)</label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={formData.experience}
                    onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select
                    value={formData.location}
                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Bangalore</option>
                    <option>Mumbai</option>
                    <option>Hyderabad</option>
                    <option>Chennai</option>
                    <option>Coimbatore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select
                    value={formData.industry}
                    onChange={e => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>IT</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Retail</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                  <select
                    value={formData.companySize}
                    onChange={e => setFormData(prev => ({ ...prev, companySize: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Startup</option>
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                  <select
                    value={formData.education}
                    onChange={e => setFormData(prev => ({ ...prev, education: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Bachelor</option>
                    <option>Master</option>
                    <option>PhD</option>
                  </select>
                </div>
                <Button type="submit" variant="primary" className="w-full">
                  Predict Salary
                </Button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {prediction ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
                    <p className="text-sm opacity-90">Minimum</p>
                    <p className="text-3xl font-bold mt-1">₹{(prediction.min / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
                    <p className="text-sm opacity-90">Ideal (Expected)</p>
                    <p className="text-3xl font-bold mt-1">₹{(prediction.ideal / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
                    <p className="text-sm opacity-90">Maximum</p>
                    <p className="text-3xl font-bold mt-1">₹{(prediction.max / 100000).toFixed(1)}L</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Salary Breakdown</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(Number(percent) * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${(value as number).toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Regional Comparison</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={regionalComparison}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="city" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${((value as number) / 100000).toFixed(1)}L`} />
                        <Bar dataKey="salary" fill="#3B82F6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Confidence */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Award className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold">Prediction Confidence</h3>
                        <p className="text-sm text-gray-600">Based on market data and job parameters</p>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">{prediction.confidence}%</div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Prediction Yet</h3>
                <p className="text-gray-600">Fill out the form on the left to generate salary predictions.</p>
              </div>
            )}

            {/* History */}
            {history.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Predictions</h3>
                <div className="space-y-3">
                  {history.map((pred, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium text-gray-900">{pred.role}</p>
                        <p className="text-sm text-gray-500">Confidence: {pred.confidence}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-blue-600">₹{(pred.ideal / 100000).toFixed(1)}L</p>
                        <p className="text-xs text-gray-500">
                          ₹{(pred.min / 100000).toFixed(1)}L - ₹{(pred.max / 100000).toFixed(1)}L
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
