import React, { useState, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Plus, User, Mail, Phone, Calendar, Building, DollarSign, Edit, Trash2, Search } from 'lucide-react';
import { EmployeeService, Employee } from '../../services/api/employeeService';

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-700',
  Invited: 'bg-purple-100 text-purple-700',
};

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Add Employee Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    current_ctc: '',
    expected_ctc: '',
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const employeesData = await EmployeeService.getAllEmployees();
      setEmployees(employeesData);
    } catch (err) {
      setError('Failed to load employees');
      console.error('Error loading employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const employeeData = {
        ...formData,
        current_ctc: parseInt(formData.current_ctc) || 0,
        expected_ctc: parseInt(formData.expected_ctc) || 0,
      };

      if (editingEmployee) {
        await EmployeeService.updateEmployee(editingEmployee._id!, employeeData);
        setEmployees(prev => 
          prev.map(emp => 
            emp._id === editingEmployee._id 
              ? { ...emp, ...employeeData }
              : emp
          )
        );
        setEditingEmployee(null);
      } else {
        const newEmployee = await EmployeeService.createEmployee(employeeData);
        setEmployees(prev => [newEmployee, ...prev]);
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        role: '',
        current_ctc: '',
        expected_ctc: '',
      });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to save employee');
      console.error('Error saving employee:', err);
    }
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      role: employee.role,
      current_ctc: employee.current_ctc.toString(),
      expected_ctc: employee.expected_ctc.toString(),
    });
    setShowAddForm(true);
  };

  const handleDelete = async (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await EmployeeService.deleteEmployee(employeeId);
        setEmployees(prev => prev.filter(emp => emp._id !== employeeId));
      } catch (err) {
        setError('Failed to delete employee');
        console.error('Error deleting employee:', err);
      }
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

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeEmployees = employees.filter(emp => emp.name); // All employees are considered active for now
  const inactiveEmployees = employees.filter(emp => !emp.name); // None for now

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Header />
          <div className="pt-20 px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Header />
        <div className="pt-20 px-8 py-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-900">Employee</h1>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-6 items-center mb-8">
            <span className="text-green-600 font-semibold">• Active {activeEmployees.length}</span>
            <span className="text-gray-500 font-semibold">• Inactive {inactiveEmployees.length}</span>
            <div className="flex ml-auto gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-5 py-2 font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Employee
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map(emp => (
              <div key={emp._id} className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow flex flex-col p-6 relative">
                <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full ${statusColors.Active}`}>
                  Active
                </span>
                
                <div className="flex items-center justify-end gap-2 absolute top-4 right-4">
                  <button
                    onClick={() => handleEdit(emp)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="Edit Employee"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id!)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Delete Employee"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex flex-col items-center mb-5 mt-2">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-3 border-4 border-gray-100">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{emp.name}</h3>
                  <p className="text-gray-500 text-sm">{emp.role}</p>
                </div>

                <div className="mb-4 text-xs text-gray-500 font-semibold">
                  #{emp._id?.substring(0, 8)}
                </div>

                <div className="space-y-2 text-xs text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Building className="w-3 h-3" />
                    <span>{emp.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    <span>{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    <span>{emp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>Joined: {emp.created_at ? formatDate(emp.created_at) : 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3 h-3" />
                    <span>CTC: {formatCurrency(emp.current_ctc)}</span>
                  </div>
                </div>

                <button className="w-full mt-auto bg-blue-50 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                  View details →
                </button>
              </div>
            ))}
          </div>

          {filteredEmployees.length === 0 && !loading && (
            <div className="text-center py-12">
              <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg text-gray-500">No employees found</p>
              <p className="text-sm text-gray-400 mt-2">
                {searchTerm ? 'Try adjusting your search criteria' : 'Add your first employee to get started'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Product">Product</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="HR">HR</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role *
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current CTC (₹)
                    </label>
                    <input
                      type="number"
                      name="current_ctc"
                      value={formData.current_ctc}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 800000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected CTC (₹)
                    </label>
                    <input
                      type="number"
                      name="expected_ctc"
                      value={formData.expected_ctc}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 1000000"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingEmployee(null);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        department: '',
                        role: '',
                        current_ctc: '',
                        expected_ctc: '',
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingEmployee ? 'Update Employee' : 'Add Employee'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;