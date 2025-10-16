import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Users, Briefcase, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeProjects: 0,
    hiringThisMonth: 0,
    avgTimeToHire: 0
  });

  const [hiringFunnelData, setHiringFunnelData] = useState([
    { stage: 'Applied', count: 150 },
    { stage: 'Screened', count: 80 },
    { stage: 'Interviewed', count: 45 },
    { stage: 'Offered', count: 20 },
    { stage: 'Hired', count: 15 }
  ]);

  const [projectStatusData, setProjectStatusData] = useState([
    { name: 'Active', value: 12 },
    { name: 'Completed', value: 8 },
    { name: 'On Hold', value: 3 },
    { name: 'Planning', value: 5 }
  ]);

  const [employeeDistribution, setEmployeeDistribution] = useState([
    { department: 'Engineering', count: 45 },
    { department: 'HR', count: 8 },
    { department: 'Sales', count: 12 },
    { department: 'Marketing', count: 10 },
    { department: 'Finance', count: 6 }
  ]);

  const [salaryExpenses] = useState([
    { month: 'Jan', amount: 350000 },
    { month: 'Feb', amount: 360000 },
    { month: 'Mar', amount: 375000 },
    { month: 'Apr', amount: 390000 },
    { month: 'May', amount: 410000 },
    { month: 'Jun', amount: 425000 }
  ]);

  const [recentActivities, setRecentActivities] = useState<Array<{ id: string | number; text: string; time: string; type: string }>>([
    { id: 1, text: 'New candidate shortlisted: John Doe', time: '10 mins ago', type: 'candidate' },
    { id: 2, text: 'Project "AI Dashboard" completed', time: '1 hour ago', type: 'project' },
    { id: 3, text: 'Offer sent to Sarah Johnson', time: '2 hours ago', type: 'offer' },
    { id: 4, text: 'New employee onboarded: Mike Chen', time: '5 hours ago', type: 'employee' },
    { id: 5, text: 'Salary prediction saved for Data Analyst role', time: '1 day ago', type: 'salary' }
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, funnelRes, projectsRes, employeesRes, activitiesRes] = await Promise.all([
          api.get<{ success: boolean; data: typeof stats }>("/analytics/overview"),
          api.get<{ success: boolean; data: { stage: string; count: number }[] }>("/analytics/hiring-funnel"),
          api.get<{ success: boolean; data: { title: string; progress: number; teamSize: number; assignedEmployees: number }[] }>("/analytics/projects"),
          api.get<{ success: boolean; data: Record<string, number> }>("/analytics/employees"),
          api.get<{ success: boolean; data: { id: string | number; text: string; time: string; type: string }[] }>("/analytics/activities")
        ]);

        if (overviewRes.success) {
          setStats(overviewRes.data);
        }

        if (funnelRes.success) {
          setHiringFunnelData(funnelRes.data);
        }

        if (projectsRes.success) {
          const status = [
            { name: 'Active', value: projectsRes.data.filter(p => p.progress < 100).length },
            { name: 'Completed', value: projectsRes.data.filter(p => p.progress >= 100).length },
            { name: 'On Hold', value: Math.max(0, projectsRes.data.length - 3) },
            { name: 'Planning', value: Math.max(1, 3 - projectsRes.data.filter(p => p.progress >= 100).length) }
          ];
          setProjectStatusData(status);
        }

        if (employeesRes.success) {
          const distribution = Object.entries(employeesRes.data).map(([department, count]) => ({
            department,
            count
          }));
          if (distribution.length > 0) {
            setEmployeeDistribution(distribution);
          }
        }

        if (activitiesRes.success) {
          setRecentActivities(activitiesRes.data.map((activity, index) => ({
            id: activity.id ?? index,
            text: activity.text,
            time: activity.time,
            type: activity.type
          })));
        }
      } catch (error) {
        console.error('Error loading dashboard analytics', error);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string }> = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-500', '-100')}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees || 81}
            icon={<Users className="w-8 h-8 text-blue-500" />}
            color="border-blue-500"
          />
          <StatCard
            title="Active Projects"
            value={stats.activeProjects || 28}
            icon={<Briefcase className="w-8 h-8 text-green-500" />}
            color="border-green-500"
          />
          <StatCard
            title="Hiring This Month"
            value={stats.hiringThisMonth || 15}
            icon={<TrendingUp className="w-8 h-8 text-orange-500" />}
            color="border-orange-500"
          />
          <StatCard
            title="Avg Time-to-Hire"
            value={`${stats.avgTimeToHire || 18} days`}
            icon={<Clock className="w-8 h-8 text-purple-500" />}
            color="border-purple-500"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Hiring Funnel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Hiring Funnel</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hiringFunnelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Project Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Project Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(Number(percent) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Employee Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Employee Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeeDistribution} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="department" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Salary Expenses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Salary Expenses (Monthly)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salaryExpenses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${(value as number).toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    activity.type === 'candidate' ? 'bg-blue-500' :
                    activity.type === 'project' ? 'bg-green-500' :
                    activity.type === 'offer' ? 'bg-orange-500' :
                    activity.type === 'employee' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-gray-700">{activity.text}</span>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
