import React, { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Users, Briefcase, TrendingUp, Clock, DollarSign, Activity, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';

const COLORS = ['#1E40AF', '#059669', '#D97706', '#DC2626', '#0284C7'];

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
    iconBg: string;
    trend?: { value: number; isUp: boolean };
  }> = ({ title, value, icon, iconBg, trend }) => (
    <div className="bg-white rounded-xl shadow-subtle hover:shadow-lg transition-shadow duration-300 ease-gentle p-6 border border-neutral-border">
      <div className="flex items-start justify-between mb-5">
        <div className={`p-3 rounded-lg ${iconBg}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md ${
            trend.isUp 
              ? 'text-semantic-success bg-green-50' 
              : 'text-semantic-error bg-red-50'
          }`}>
            {trend.isUp ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-neutral-muted text-sm font-medium mb-2 tracking-wide uppercase">{title}</p>
        <p className="text-3xl font-bold text-neutral-text tracking-tight">{value}</p>
      </div>
    </div>
  );

  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-subtle p-6 animate-pulse border border-neutral-border">
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-slate-200 rounded w-3/4"></div>
    </div>
  );

  const topOfFunnel = hiringFunnelData[0]?.count ?? 0;
  const finalStage = hiringFunnelData[hiringFunnelData.length - 1]?.count ?? 0;
  const conversionRate = topOfFunnel ? Math.round((finalStage / topOfFunnel) * 100) : 0;
  const dropOffRate = topOfFunnel ? Math.max(0, 100 - conversionRate) : 0;
  const screeningStage = hiringFunnelData[1]?.count ?? 0;
  const screeningDropOff = Math.max(topOfFunnel - screeningStage, 0);
  const screeningDropOffRate = topOfFunnel ? Math.round((screeningDropOff / topOfFunnel) * 100) : 0;

  const strategicHighlights = [
    {
      label: 'Talent Demand',
      title: 'AI delivery ramp needs senior data talent',
      description: 'Four senior data scientists are in final interviews. Align compensation guardrails to secure offers by Friday.',
      tone: 'info' as const,
    },
    {
      label: 'Retention Watch',
      title: 'Design org attrition stabilised',
      description: 'Voluntary exits down to 2.4% after manager coaching initiatives. Maintain monthly pulse conversations.',
      tone: 'success' as const,
    },
    {
      label: 'Capacity Risk',
      title: 'Project Phoenix approaching bandwidth limits',
      description: 'Two additional full-stack engineers required to protect Q2 delivery commitments.',
      tone: 'warning' as const,
    },
  ];

  const workforceSnapshot = [
    {
      label: 'Offer acceptance rate',
      value: '82%',
      badge: '+5 pts vs last month',
      tone: 'success' as const,
      description: 'Improved close rate after refreshed EVP collateral in candidate nurture.',
    },
    {
      label: 'Attrition risk',
      value: '2.8%',
      badge: 'Stable QoQ',
      tone: 'info' as const,
      description: 'Retention steady with targeted manager check-ins across critical teams.',
    },
    {
      label: 'Bench capacity',
      value: '12 roles',
      badge: 'Ready to deploy',
      tone: 'warning' as const,
      description: 'Deployment-ready engineers aligned for upcoming enterprise implementations.',
    },
  ];

  const toneClasses: Record<'info' | 'success' | 'warning', string> = {
    info: 'bg-semantic-info/10 text-semantic-info',
    success: 'bg-semantic-success/10 text-semantic-success',
    warning: 'bg-semantic-warning/10 text-semantic-warning',
  };

  const dotClasses: Record<'info' | 'success' | 'warning', string> = {
    info: 'bg-semantic-info',
    success: 'bg-semantic-success',
    warning: 'bg-semantic-warning',
  };

  const activityToneMap: Record<string, string> = {
    candidate: 'bg-brand-primary',
    project: 'bg-semantic-success',
    offer: 'bg-semantic-warning',
    employee: 'bg-semantic-info',
    salary: 'bg-brand-accent',
  };

  const activityLabelMap: Record<string, string> = {
    candidate: 'Candidate',
    project: 'Project',
    offer: 'Offer',
    employee: 'Employee',
    salary: 'Compensation',
  };

  const activityTextToneMap: Record<string, string> = {
    candidate: 'text-brand-primary',
    project: 'text-semantic-success',
    offer: 'text-semantic-warning',
    employee: 'text-semantic-info',
    salary: 'text-brand-accent',
  };

  const totalProjects = projectStatusData.reduce((sum, project) => sum + project.value, 0);
  const totalEmployees = stats.totalEmployees || 81;
  const activeProjects = stats.activeProjects || 28;
  const hiringThisMonth = stats.hiringThisMonth || 15;
  const latestExpense = salaryExpenses[salaryExpenses.length - 1]?.amount ?? 0;
  const firstExpense = salaryExpenses[0]?.amount ?? 0;
  const expenseChange = firstExpense ? Math.round(((latestExpense - firstExpense) / firstExpense) * 100) : 0;

  const formatCurrency = (value: number) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <Layout>
      <div className="p-8 bg-neutral-background min-h-screen">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-neutral-text mb-2 tracking-tight">Dashboard Overview</h1>
          <p className="text-neutral-subtler flex items-center gap-2 text-[15px]">
            <Activity className="w-4 h-4" />
            Real-time insights into your organization's performance
          </p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard
              title="Total Employees"
              value={stats.totalEmployees || 81}
              icon={<Users className="w-6 h-6 text-brand-primary" />}
              iconBg="bg-blue-50"
              trend={{ value: 12, isUp: true }}
            />
            <StatCard
              title="Active Projects"
              value={stats.activeProjects || 28}
              icon={<Briefcase className="w-6 h-6 text-semantic-success" />}
              iconBg="bg-green-50"
              trend={{ value: 8, isUp: true }}
            />
            <StatCard
              title="Hiring This Month"
              value={stats.hiringThisMonth || 15}
              icon={<TrendingUp className="w-6 h-6 text-semantic-warning" />}
              iconBg="bg-amber-50"
              trend={{ value: 5, isUp: false }}
            />
            <StatCard
              title="Avg Time-to-Hire"
              value={`${stats.avgTimeToHire || 18} days`}
              icon={<Clock className="w-6 h-6 text-semantic-info" />}
              iconBg="bg-cyan-50"
              trend={{ value: 3, isUp: false }}
            />
          </div>
        )}

        {/* Talent Intelligence */}
        <div className="grid gap-6 xl:grid-cols-[2fr_1fr] mb-10">
          <div className="bg-white rounded-2xl border border-neutral-border shadow-subtle p-6">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-muted">
                  <BarChart3 className="h-4 w-4 text-brand-primary" />
                  <span>Talent Pipeline</span>
                </div>
                <h2 className="mt-2 text-xl font-semibold text-neutral-text">Hiring velocity by stage</h2>
                <p className="mt-2 text-sm text-neutral-subtler max-w-2xl">
                  Conversion across the funnel shows how effectively candidates progress this week.
                </p>
              </div>
              <div className="min-w-[150px]">
                <p className="text-xs font-semibold uppercase text-neutral-muted">Conversion to hire</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-brand-primary">{conversionRate}%</span>
                  <span className="text-xs text-neutral-muted">from applied</span>
                </div>
                <p className="mt-2 text-xs text-neutral-subtler">Drop-off {dropOffRate}% overall</p>
              </div>
            </div>
            <div className="mt-8 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringFunnelData} barSize={28}>
                  <defs>
                    <linearGradient id="pipelineBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E40AF" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.65} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 8" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="stage"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Inter' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Inter' }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(30, 64, 175, 0.06)' }}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #E2E8F0',
                      boxShadow: '0px 16px 32px rgba(15, 23, 42, 0.08)',
                      fontFamily: 'Inter',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="count" fill="url(#pipelineBar)" radius={[8, 8, 4, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-dashed border-neutral-border/70 bg-neutral-background px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-muted">Screening drop-off</p>
                <p className="mt-2 text-lg font-semibold text-neutral-text">{screeningDropOffRate}%</p>
                <p className="mt-1 text-sm text-neutral-subtler">
                  Most attrition occurs between screening and interview readiness.
                </p>
              </div>
              <div className="rounded-xl border border-dashed border-neutral-border/70 bg-neutral-background px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-muted">Finalists in pipeline</p>
                <p className="mt-2 text-lg font-semibold text-neutral-text">{finalStage} candidates</p>
                <p className="mt-1 text-sm text-neutral-subtler">
                  {Math.max(finalStage - hiringThisMonth, 0)} offers pending across priority roles.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-border shadow-subtle p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-muted">Strategic Outlook</p>
            <h2 className="mt-2 text-xl font-semibold text-neutral-text">Leadership priorities</h2>
            <p className="mt-2 text-sm text-neutral-subtler">
              Highlights curated for the weekly workforce review.
            </p>
            <div className="mt-6 space-y-4">
              {strategicHighlights.map((item) => (
                <div key={item.title} className="rounded-xl border border-neutral-border/70 bg-neutral-background px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md ${toneClasses[item.tone]}`}
                  >
                    <span className={`h-2 w-2 rounded-full ${dotClasses[item.tone]}`} />
                    {item.label}
                  </span>
                  <p className="mt-3 text-sm font-semibold text-neutral-text">{item.title}</p>
                  <p className="mt-1 text-sm text-neutral-subtler leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio & Composition */}
        <div className="grid gap-6 xl:grid-cols-2 mb-10">
          <div className="bg-white rounded-2xl border border-neutral-border shadow-subtle p-6">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-muted">Portfolio Overview</p>
                <h2 className="mt-2 text-xl font-semibold text-neutral-text">Project status distribution</h2>
                <p className="mt-2 text-sm text-neutral-subtler">
                  Snapshot of delivery health across active and planned initiatives.
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase text-neutral-muted">Active projects</p>
                <p className="mt-1 text-2xl font-semibold text-neutral-text">{activeProjects}</p>
              </div>
            </div>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {projectStatusData.map((segment, index) => (
                      <Cell key={segment.name} fill={COLORS[index % COLORS.length]} stroke="#F8FAFC" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #E2E8F0',
                      boxShadow: '0px 16px 32px rgba(15, 23, 42, 0.08)',
                      fontFamily: 'Inter',
                      fontSize: '13px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {projectStatusData.map((segment, index) => {
                const percentage = totalProjects ? Math.round((segment.value / totalProjects) * 100) : 0;
                return (
                  <div
                    key={segment.name}
                    className="flex items-center justify-between rounded-lg border border-neutral-border/70 bg-neutral-background px-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <p className="text-sm font-medium text-neutral-text">{segment.name}</p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-subtler">{percentage}%</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-border shadow-subtle p-6">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-muted">Workforce Composition</p>
                <h2 className="mt-2 text-xl font-semibold text-neutral-text">Headcount by department</h2>
                <p className="mt-2 text-sm text-neutral-subtler">
                  Resource allocation across core teams and enabling functions.
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase text-neutral-muted">Total employees</p>
                <p className="mt-1 text-2xl font-semibold text-neutral-text">{totalEmployees}</p>
              </div>
            </div>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employeeDistribution} layout="vertical" barSize={18}>
                  <defs>
                    <linearGradient id="departmentBar" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#0F172A" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid horizontal={false} stroke="#E2E8F0" strokeDasharray="2 8" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Inter' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="department"
                    width={140}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Inter' }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #E2E8F0',
                      boxShadow: '0px 16px 32px rgba(15, 23, 42, 0.08)',
                      fontFamily: 'Inter',
                      fontSize: '13px',
                    }}
                    cursor={{ fill: 'rgba(15, 23, 42, 0.06)' }}
                  />
                  <Bar dataKey="count" fill="url(#departmentBar)" radius={[4, 12, 12, 4]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Compensation */}
        <div className="mb-10">
          <div className="bg-white rounded-2xl border border-neutral-border shadow-subtle p-6">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-muted">Compensation Oversight</p>
                <h2 className="mt-2 text-xl font-semibold text-neutral-text">Salary expense trajectory</h2>
                <p className="mt-2 text-sm text-neutral-subtler">
                  Six-month view of total payroll commitments across the organisation.
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase text-neutral-muted">Current run rate</p>
                <p className="mt-1 text-2xl font-semibold text-brand-primary">{formatCurrency(latestExpense)}</p>
                <p className="mt-1 text-xs text-neutral-subtler">
                  {expenseChange >= 0 ? '+' : ''}
                  {expenseChange}% versus January
                </p>
              </div>
            </div>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salaryExpenses}>
                  <defs>
                    <linearGradient id="expenseArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E40AF" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="2 8" stroke="#E2E8F0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Inter' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#475569', fontSize: 12, fontFamily: 'Inter' }}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #E2E8F0',
                      boxShadow: '0px 16px 32px rgba(15, 23, 42, 0.08)',
                      fontFamily: 'Inter',
                      fontSize: '13px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#1E40AF"
                    strokeWidth={2.5}
                    dot={{ r: 4, stroke: '#FFFFFF', strokeWidth: 2, fill: '#1E40AF' }}
                    activeDot={{ r: 6, strokeWidth: 2 }}
                    fill="url(#expenseArea)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Activity & Snapshot */}
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <div className="bg-white rounded-2xl border border-neutral-border shadow-subtle p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-muted">Timeline</p>
                <h2 className="mt-2 text-xl font-semibold text-neutral-text">Recent activity</h2>
                <p className="mt-2 text-sm text-neutral-subtler">
                  Highlights from the last 24 hours across hiring, projects, and compensation.
                </p>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-brand-primary hover:text-brand-primaryHover transition-colors"
              >
                View all
              </button>
            </div>
            <div className="mt-6 space-y-6">
              {recentActivities.map((activity, index) => {
                const isLast = index === recentActivities.length - 1;
                return (
                  <div key={activity.id} className="relative pl-8">
                    {!isLast && <span className="absolute left-[7px] top-7 h-full w-px bg-neutral-border/80" />}
                    <span
                      className={`absolute left-0 top-1.5 flex h-3 w-3 items-center justify-center rounded-full ${
                        activityToneMap[activity.type] ?? 'bg-brand-accent'
                      }`}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`text-xs font-semibold uppercase tracking-wide ${
                            activityTextToneMap[activity.type] ?? 'text-neutral-text'
                          }`}
                        >
                          {activityLabelMap[activity.type] ?? 'Update'}
                        </span>
                        <span className="text-xs text-neutral-muted">{activity.time}</span>
                      </div>
                      <p className="text-sm font-medium text-neutral-text leading-relaxed">{activity.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-border shadow-subtle p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-muted">Workforce Pulse</p>
            <h2 className="mt-2 text-xl font-semibold text-neutral-text">Executive snapshot</h2>
            <p className="mt-2 text-sm text-neutral-subtler">
              Key KPIs aligned to this morning’s leadership stand-up.
            </p>
            <div className="mt-6 space-y-4">
              {workforceSnapshot.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-xl border border-dashed border-neutral-border/70 bg-neutral-background px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-text">{signal.label}</p>
                      <p className="mt-2 text-2xl font-semibold text-neutral-text">{signal.value}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${toneClasses[signal.tone]}`}>
                      {signal.badge}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-neutral-subtler leading-relaxed">{signal.description}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-primary hover:text-brand-primaryHover transition-colors"
            >
              Review workforce plan
              <ArrowUp className="h-3.5 w-3.5 rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
