import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { User, Users, Building2, SlidersHorizontal } from 'lucide-react';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: 'HR' | 'Admin' | 'Team Lead' | 'CEO' | 'Investor';
}

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'users' | 'company' | 'ats'>('profile');
  const [users, setUsers] = useState<UserRecord[]>([
    { id: '1', name: 'Anjali Sharma', email: 'anjali@humanet.com', role: 'Admin' },
    { id: '2', name: 'Rahul Verma', email: 'rahul@humanet.com', role: 'HR' },
    { id: '3', name: 'Priya Singh', email: 'priya@humanet.com', role: 'Team Lead' },
    { id: '4', name: 'Vikram Rao', email: 'vikram@humanet.com', role: 'CEO' },
    { id: '5', name: 'Nisha Patel', email: 'nisha@humanet.com', role: 'Investor' }
  ]);

  const [profileForm, setProfileForm] = useState({
    name: 'Alex Doe',
    email: 'alex@humanet.com',
    role: 'Admin',
    password: '',
    confirmPassword: ''
  });

  const [companySettings, setCompanySettings] = useState({
    name: 'HumaNet Pvt Ltd',
    locations: 'Bangalore, Chennai, Hyderabad',
    atsThreshold: 75,
    skillsKeywords: 'React, Node.js, Python, Data Science, Leadership'
  });

  const handleAddUser = () => {
    const name = prompt('Enter user name');
    const email = prompt('Enter user email');
    const role = prompt('Enter role (HR, Admin, Team Lead, CEO, Investor)');

    if (!name || !email || !role) return;

    setUsers(prev => [{ id: Date.now().toString(), name, email, role: role as UserRecord['role'] }, ...prev]);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage profile, users, company configuration, and ATS settings</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Management</span>
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'company' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Company Settings</span>
            </button>
            <button
              onClick={() => setActiveTab('ats')}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                activeTab === 'ats' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>ATS Configuration</span>
            </button>
          </div>
        </div>

        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  value={profileForm.name}
                  onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  value={profileForm.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-blue-50 text-blue-700 font-medium">
                  {profileForm.role}
                </div>
              </div>
              <div></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
                <input
                  type="password"
                  value={profileForm.password}
                  onChange={e => setProfileForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={profileForm.confirmPassword}
                  onChange={e => setProfileForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <Button className="mt-6">Save Changes</Button>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">User Management</h2>
              <Button onClick={handleAddUser}>Add User</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="outline" className="mr-2">Edit</Button>
                        <Button variant="outline" onClick={() => handleDeleteUser(user.id)} className="text-red-600">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'company' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Company Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input
                  value={companySettings.name}
                  onChange={e => setCompanySettings(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Locations</label>
                <input
                  value={companySettings.locations}
                  onChange={e => setCompanySettings(prev => ({ ...prev, locations: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
                <input type="file" className="w-full" />
              </div>
            </div>
            <Button className="mt-6">Save Company Settings</Button>
          </div>
        )}

        {activeTab === 'ats' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">ATS Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default ATS Threshold</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={companySettings.atsThreshold}
                  onChange={e => setCompanySettings(prev => ({ ...prev, atsThreshold: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Keyword List</label>
                <textarea
                  value={companySettings.skillsKeywords}
                  onChange={e => setCompanySettings(prev => ({ ...prev, skillsKeywords: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                />
              </div>
            </div>
            <Button className="mt-6">Save ATS Settings</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};
