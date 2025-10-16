import React, { useState } from 'react';
import { Sidebar } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { DollarSign, TrendingUp, MapPin, Briefcase, Building, Search } from 'lucide-react';

interface SalaryData {
  role: string;
  experience: string;
  region: string;
  industry: string;
  minSalary: number;
  avgSalary: number;
  maxSalary: number;
  currency: string;
  lastUpdated: string;
}

const mockSalaryData: SalaryData[] = [
  {
    role: 'Frontend Developer',
    experience: '0-2 years',
    region: 'Coimbatore, Tamil Nadu',
    industry: 'IT Services',
    minSalary: 300000,
    avgSalary: 450000,
    maxSalary: 600000,
    currency: '₹',
    lastUpdated: '2025-10-01',
  },
  {
    role: 'Frontend Developer',
    experience: '3-5 years',
    region: 'Coimbatore, Tamil Nadu',
    industry: 'IT Services',
    minSalary: 600000,
    avgSalary: 850000,
    maxSalary: 1200000,
    currency: '₹',
    lastUpdated: '2025-10-01',
  },
  {
    role: 'Backend Developer',
    experience: '0-2 years',
    region: 'Coimbatore, Tamil Nadu',
    industry: 'IT Services',
    minSalary: 350000,
    avgSalary: 500000,
    maxSalary: 700000,
    currency: '₹',
    lastUpdated: '2025-10-01',
  },
  {
    role: 'Backend Developer',
    experience: '3-5 years',
    region: 'Coimbatore, Tamil Nadu',
    industry: 'IT Services',
    minSalary: 700000,
    avgSalary: 950000,
    maxSalary: 1400000,
    currency: '₹',
    lastUpdated: '2025-10-01',
  },
  {
    role: 'UI/UX Designer',
    experience: '0-2 years',
    region: 'Coimbatore, Tamil Nadu',
    industry: 'Design',
    minSalary: 280000,
    avgSalary: 400000,
    maxSalary: 550000,
    currency: '₹',
    lastUpdated: '2025-10-01',
  },
  {
    role: 'UI/UX Designer',
    experience: '3-5 years',
    region: 'Coimbatore, Tamil Nadu',
    industry: 'Design',
    minSalary: 550000,
    avgSalary: 750000,
    maxSalary: 1000000,
    currency: '₹',
    lastUpdated: '2025-10-01',
  },
  {
    role: 'Machine Learning Engineer',
    experience: '0-2 years',
    region: 'Coimbatore, Tamil Nadu',
    industry: 'AI/ML',
    minSalary: 500000,
    avgSalary: 700000,
    maxSalary: 900000,
    currency: '₹',
    lastUpdated: '2025-10-01',
  },
  {
    role: 'Machine Learning Engineer',
    experience: '3-5 years',
    region: 'Coimbatore, Tamil Nadu',
    industry: 'AI/ML',
    minSalary: 900000,
    avgSalary: 1300000,
    maxSalary: 1800000,
    currency: '₹',
    lastUpdated: '2025-10-01',
  },
  {
    role: 'Data Scientist',
    experience: '0-2 years',
    region: 'Coimbatore, Tamil Nadu',
    industry: 'Data Analytics',
    minSalary: 450000,
    avgSalary: 650000,
    maxSalary: 850000,
    currency: '₹',
    lastUpdated: '2025-10-01',
  },
  {
    role: 'Product Manager',
    experience: '3-5 years',
    region: 'Coimbatore, Tamil Nadu',
    industry: 'Product',
    minSalary: 1000000,
    avgSalary: 1500000,
    maxSalary: 2200000,
    currency: '₹',
    lastUpdated: '2025-10-01',
  },
];

const roles = [
  'All Roles',
  'Frontend Developer',
  'Backend Developer',
  'UI/UX Designer',
  'Machine Learning Engineer',
  'Data Scientist',
  'Product Manager',
  'DevOps Engineer',
  'Software Engineer',
];

const experienceLevels = ['All Experience', '0-2 years', '3-5 years', '6-10 years', '10+ years'];

const regions = [
  'All Regions',
  'Coimbatore, Tamil Nadu',
  'Chennai, Tamil Nadu',
  'Bangalore, Karnataka',
  'Hyderabad, Telangana',
  'Pune, Maharashtra',
  'Mumbai, Maharashtra',
  'Delhi NCR',
];

const SalaryPrediction: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<string>('All Roles');
  const [selectedExperience, setSelectedExperience] = useState<string>('All Experience');
  const [selectedRegion, setSelectedRegion] = useState<string>('Coimbatore, Tamil Nadu');
  const [customRole, setCustomRole] = useState<string>('');

  const filteredData = mockSalaryData.filter(data => {
    const roleMatch = selectedRole === 'All Roles' || data.role === selectedRole;
    const expMatch = selectedExperience === 'All Experience' || data.experience === selectedExperience;
    const regionMatch = selectedRegion === 'All Regions' || data.region === selectedRegion;
    return roleMatch && expMatch && regionMatch;
  });

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Salary Prediction & Benchmarking</h1>
            <p className="text-gray-600">
              Market-based salary insights for competitive compensation planning across regions and roles
            </p>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Search & Filter</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Experience Level</label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {experienceLevels.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Custom Role Search (For new positions)
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter custom role (e.g., Blockchain Developer, AI Researcher)"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {customRole && (
                <p className="mt-2 text-sm text-blue-600">
                  Searching AI-predicted salary data for "{customRole}" in {selectedRegion}...
                </p>
              )}
            </div>
          </div>

          {/* Results Summary */}
          {filteredData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Minimum Salary</h3>
                </div>
                <p className="text-3xl font-bold text-green-700">
                  {formatCurrency(Math.min(...filteredData.map(d => d.minSalary)))}
                </p>
                <p className="text-sm text-gray-600 mt-1">Starting range</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Average Salary</h3>
                </div>
                <p className="text-3xl font-bold text-blue-700">
                  {formatCurrency(
                    filteredData.reduce((sum, d) => sum + d.avgSalary, 0) / filteredData.length
                  )}
                </p>
                <p className="text-sm text-gray-600 mt-1">Market average</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-700">Maximum Salary</h3>
                </div>
                <p className="text-3xl font-bold text-purple-700">
                  {formatCurrency(Math.max(...filteredData.map(d => d.maxSalary)))}
                </p>
                <p className="text-sm text-gray-600 mt-1">Top range</p>
              </div>
            </div>
          )}

          {/* Salary Data Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                Salary Benchmarks ({filteredData.length} results)
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Experience</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Region</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Industry</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Min Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Avg Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Max Salary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{data.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{data.experience}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {data.region}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Building className="w-4 h-4" />
                          {data.industry}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">
                        {formatCurrency(data.minSalary)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-600">
                        {formatCurrency(data.avgSalary)}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-purple-600">
                        {formatCurrency(data.maxSalary)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500 text-lg">No salary data found for selected filters</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search criteria or use custom role search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryPrediction;
