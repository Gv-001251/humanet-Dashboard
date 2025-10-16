import React from 'react';
import { Layout } from '../components/layout/Layout';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Button } from '../components/common/Button';
import { Download } from 'lucide-react';

const hiringTrendData = [
  { month: 'Jan', hires: 12, attrition: 5 },
  { month: 'Feb', hires: 18, attrition: 4 },
  { month: 'Mar', hires: 24, attrition: 6 },
  { month: 'Apr', hires: 22, attrition: 3 },
  { month: 'May', hires: 28, attrition: 5 },
  { month: 'Jun', hires: 32, attrition: 4 }
];

const productivityData = [
  { department: 'Engineering', score: 92 },
  { department: 'Product', score: 88 },
  { department: 'Marketing', score: 79 },
  { department: 'Sales', score: 85 },
  { department: 'HR', score: 75 }
];

const engagementData = [
  { metric: 'Engagement', HR: 80, Tech: 95, Sales: 65 },
  { metric: 'Learning', HR: 85, Tech: 90, Sales: 70 },
  { metric: 'Retention', HR: 78, Tech: 88, Sales: 60 },
  { metric: 'Innovation', HR: 72, Tech: 93, Sales: 55 },
  { metric: 'Collaboration', HR: 88, Tech: 91, Sales: 68 }
];

const roleFilters = ['HR', 'Team Lead', 'CEO', 'Investor'];

export const Analytics: React.FC = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Advanced Analytics</h1>
            <p className="text-gray-600">KPI dashboards, performance insights, and role-based analytics</p>
          </div>
          <div className="flex items-center space-x-3">
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              {roleFilters.map(role => (
                <option key={role}>{role}</option>
              ))}
            </select>
            <Button variant="outline" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Hiring vs Attrition Trend</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={hiringTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="hires" stroke="#3B82F6" strokeWidth={3} />
                <Line type="monotone" dataKey="attrition" stroke="#EF4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Department Productivity Score</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Engagement Radar</h3>
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart outerRadius={90} data={engagementData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="HR" dataKey="HR" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Radar name="Tech" dataKey="Tech" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
                <Radar name="Sales" dataKey="Sales" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">People Analytics Insights</h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                • Engineering team shows 92% productivity with strong engagement and retention metrics.
              </li>
              <li>
                • Hiring pipeline growth of 18% quarter-over-quarter with improved offer acceptance rate.
              </li>
              <li>
                • Leadership engagement shows increasing collaboration scores across functions.
              </li>
              <li>
                • Recommend investment in Sales skill development to improve productivity by 12%.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};
