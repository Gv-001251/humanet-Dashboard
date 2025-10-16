import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/dashboard/StatCard';
import { Users, UserCheck, UserX, Clock, Briefcase, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { EmployeeService, Employee } from '../../services/api/employeeService';
import { ResumeService, Candidate } from '../../services/api/resumeService';
import { OfferService, Offer } from '../../services/api/offerService';

interface DashboardStats {
  totalEmployees: number;
  newEmployeesThisMonth: number;
  totalCandidates: number;
  pendingOffers: number;
  acceptedOffers: number;
  rejectedOffers: number;
  highRiskCandidates: number;
}

export const HRDashboard: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    newEmployeesThisMonth: 0,
    totalCandidates: 0,
    pendingOffers: 0,
    acceptedOffers: 0,
    rejectedOffers: 0,
    highRiskCandidates: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [employeesData, candidatesData, offersData] = await Promise.all([
        EmployeeService.getAllEmployees(),
        ResumeService.getAllCandidates(),
        OfferService.getAllOffers(),
      ]);

      setEmployees(employeesData);
      setCandidates(candidatesData);
      setOffers(offersData);

      // Calculate stats
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const newEmployeesThisMonth = employeesData.filter(emp => {
        const empDate = new Date(emp.created_at || '');
        return empDate.getMonth() === currentMonth && empDate.getFullYear() === currentYear;
      }).length;

      const highRiskCandidates = candidatesData.filter(candidate => 
        candidate.fraud_check.risk_score > 70
      ).length;

      setStats({
        totalEmployees: employeesData.length,
        newEmployeesThisMonth,
        totalCandidates: candidatesData.length,
        pendingOffers: offersData.filter(offer => offer.status === 'pending').length,
        acceptedOffers: offersData.filter(offer => offer.status === 'accepted').length,
        rejectedOffers: offersData.filter(offer => offer.status === 'rejected').length,
        highRiskCandidates,
      });
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDepartmentStats = () => {
    const departmentCounts = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(departmentCounts).map(([dept, count]) => ({
      department: dept,
      count,
      percentage: Math.round((count / employees.length) * 100)
    }));
  };

  const getRecentCandidates = () => {
    return candidates
      .sort((a, b) => new Date(b.applied_date).getTime() - new Date(a.applied_date).getTime())
      .slice(0, 5);
  };

  const getRecentOffers = () => {
    return offers
      .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
      .slice(0, 5);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HR Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your team today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Employees"
          value={stats.totalEmployees.toString()}
          change={`+${stats.newEmployeesThisMonth} new employees this month`}
          changeType={stats.newEmployeesThisMonth > 0 ? "increase" : "neutral"}
          icon={Users}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Total Candidates"
          value={stats.totalCandidates.toString()}
          change={`${candidates.filter(c => c.application_status === 'new').length} new applications`}
          changeType="increase"
          icon={Briefcase}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Pending Offers"
          value={stats.pendingOffers.toString()}
          change={`${stats.acceptedOffers} accepted, ${stats.rejectedOffers} rejected`}
          changeType="neutral"
          icon={TrendingUp}
          iconBg="bg-yellow-100"
        />
        <StatCard
          title="High Risk Documents"
          value={stats.highRiskCandidates.toString()}
          change="Documents requiring verification"
          changeType={stats.highRiskCandidates > 0 ? "decrease" : "neutral"}
          icon={AlertTriangle}
          iconBg="bg-red-100"
        />
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Department Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Department Distribution</h3>
          </div>
          <div className="space-y-4">
            {getDepartmentStats().map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{dept.department}</span>
                    <span className="text-sm text-gray-500">{dept.count} employees</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Offers */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Offers</h3>
            <button className="text-blue-600 text-sm font-medium">See all</button>
          </div>
          <div className="space-y-4">
            {getRecentOffers().map((offer, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{offer.candidate_name}</p>
                  <p className="text-xs text-gray-500">{offer.position}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(offer.offered_ctc)}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  offer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {offer.status}
                </span>
              </div>
            ))}
            {getRecentOffers().length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No recent offers</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Candidates */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Candidates</h3>
          <button className="text-blue-600 text-sm font-medium">See all</button>
        </div>
        <div className="space-y-4">
          {getRecentCandidates().map((candidate, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">{candidate.name}</p>
                <p className="text-xs text-gray-500">{candidate.email}</p>
                <p className="text-xs text-gray-500">
                  {candidate.experience_years} years • {formatCurrency(candidate.expected_ctc)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  candidate.application_status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                  candidate.application_status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {candidate.application_status}
                </span>
                {candidate.fraud_check.risk_score > 70 && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-800">
                    High Risk
                  </span>
                )}
              </div>
            </div>
          ))}
          {getRecentCandidates().length === 0 && (
            <p className="text-gray-500 text-sm text-center py-4">No recent candidates</p>
          )}
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Employees</h3>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {/* Add employee functionality */}}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700"
            >
              <span>+</span>
              Add New Employee
            </button>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">See all</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Employee Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Department</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Current CTC</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.slice(0, 10).map((employee, index) => (
                <tr key={employee._id || index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-900">{employee.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{employee.department}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{employee.role}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{employee.email}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{formatCurrency(employee.current_ctc)}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">
                    {employee.created_at ? formatDate(employee.created_at) : 'N/A'}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-gray-600 hover:text-gray-900">⋯</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {employees.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No employees found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};