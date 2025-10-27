import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Users, Briefcase, TrendingUp, Clock, DollarSign, Activity, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
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
        setLoading(true);
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
          const planningCount = projectsRes.data.filter(p => p.progress === 0).length;
          const activeCount = projectsRes.data.filter(p => p.progress > 0 && p.progress < 100).length;
          const completedCount = projectsRes.data.filter(p => p.progress >= 100).length;
          const onHoldCount = Math.max(0, projectsRes.data.length - planningCount - activeCount - completedCount);
          
          const status = [
            { name: 'Active', value: activeCount },
            { name: 'Completed', value: completedCount },
            { name: 'On Hold', value: onHoldCount },
            { name: 'Planning', value: planningCount }
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
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    color: string;
    trend?: { value: number; isUp: boolean };
  }> = ({ title, value, icon, color, trend }) => (
    <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-white bg-opacity-90 shadow-md">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-sm font-semibold ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isUp ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-4xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
    </div>
  );

  return (
    <Layout>
      <div className="p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600 flex items-center">
            <Activity className="w-4 h-4 mr-2" />
            Real-time insights into your organization's performance
          </p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees || 81}
              icon={<Users className="w-8 h-8 text-blue-600" />}
              color="from-blue-50 to-blue-100"
              trend={{ value: 12, isUp: true }}
            />
            <StatCard
              title="Active Projects"
              value={stats.activeProjects || 28}
              icon={<Briefcase className="w-8 h-8 text-green-600" />}
              color="from-green-50 to-green-100"
              trend={{ value: 8, isUp: true }}
            />
            <StatCard
              title="Hiring This Month"
              value={stats.hiringThisMonth || 15}
              icon={<TrendingUp className="w-8 h-8 text-orange-600" />}
              color="from-orange-50 to-orange-100"
              trend={{ value: 5, isUp: false }}
            />
            <StatCard
              title="Avg Time-to-Hire"
              value={`${stats.avgTimeToHire || 18} days`}
              icon={<Clock className="w-8 h-8 text-purple-600" />}
              color="from-purple-50 to-purple-100"
              trend={{ value: 3, isUp: false }}
            />
          </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Hiring Funnel</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hiringFunnelData}>
                <defs>
                  <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="stage" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="count" fill="url(#colorBar)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Project Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(Number(percent) * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={2}
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Department Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={employeeDistribution} layout="vertical">
                <defs>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.4}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis type="category" dataKey="department" width={120} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="count" fill="url(#colorGreen)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Salary Expenses Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salaryExpenses}>
                <defs>
                  <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 12 }} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => `₹${(value as number).toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 5 }}
                  activeDot={{ r: 7 }}
                  fill="url(#colorPurple)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
          <div className="flex items-center mb-6">
            <Activity className="w-6 h-6 text-gray-700 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
          </div>
          <div className="space-y-3">
            {recentActivities.map(activity => (
              <div 
                key={activity.id} 
                className="flex items-center justify-between py-4 px-4 border-b last:border-b-0 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-4 shadow-md ${
                    activity.type === 'candidate' ? 'bg-blue-500' :
                    activity.type === 'project' ? 'bg-green-500' :
                    activity.type === 'offer' ? 'bg-orange-500' :
                    activity.type === 'employee' ? 'bg-purple-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-gray-800 font-medium">{activity.text}</span>
                </div>
                <span className="text-sm text-gray-500 font-medium">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
