// ============================================================
// EMPLOYEES PAGE
// Employee list and management
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { employeesApi, departmentsApi, locationsApi } from '../lib/api';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

export default function Employees() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'active';
  const departmentId = searchParams.get('department') || '';
  const locationId = searchParams.get('location') || '';
  const limit = 20;

  useEffect(() => {
    loadData();
  }, [page, search, status, departmentId, locationId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [empResult, deptResult, locResult] = await Promise.all([
        employeesApi.list({
          limit,
          offset: (page - 1) * limit,
          search,
          status,
          departmentId: departmentId || undefined,
          locationId: locationId || undefined,
        }),
        departmentsApi.list(),
        locationsApi.list(),
      ]);
      
      setEmployees(empResult.employees);
      setTotal(empResult.total);
      setDepartments(deptResult.departments);
      setLocations(locResult.locations);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-600">{total} total employees</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="p-4 flex flex-wrap gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="input w-auto"
          >
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="terminated">Terminated</option>
            <option value="all">All Status</option>
          </select>

          {/* Department filter */}
          <select
            value={departmentId}
            onChange={(e) => updateFilter('department', e.target.value)}
            className="input w-auto"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          {/* Location filter */}
          <select
            value={locationId}
            onChange={(e) => updateFilter('location', e.target.value)}
            className="input w-auto"
          >
            <option value="">All Locations</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-momentum-500" />
          </div>
        ) : employees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No employees found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Contact</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <Link to={`/employees/${employee.id}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-momentum-100 text-momentum-600 rounded-full flex items-center justify-center font-medium">
                          {employee.first_name?.[0]}{employee.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 hover:text-momentum-500">
                            {employee.first_name} {employee.last_name}
                          </p>
                          <p className="text-sm text-slate-500">{employee.role_name || employee.employment_type}</p>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <div className="space-y-1">
                        {employee.email && (
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Mail className="w-3 h-3" />
                            {employee.email}
                          </div>
                        )}
                        {employee.phone && (
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Phone className="w-3 h-3" />
                            {employee.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="text-slate-600">{employee.department_name || '-'}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-slate-600">
                        <MapPin className="w-3 h-3" />
                        {employee.location_name || '-'}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${
                        employee.status === 'active' ? 'badge-success' :
                        employee.status === 'on_leave' ? 'badge-warning' :
                        'badge-neutral'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td>
                      <Link 
                        to={`/employees/${employee.id}`}
                        className="p-1 hover:bg-slate-100 rounded inline-block"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateFilter('page', String(page - 1))}
                disabled={page === 1}
                className="btn btn-ghost p-2 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-slate-600">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => updateFilter('page', String(page + 1))}
                disabled={page === totalPages}
                className="btn btn-ghost p-2 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <AddEmployeeModal 
          onClose={() => setShowAddModal(false)} 
          onSuccess={() => { setShowAddModal(false); loadData(); }}
          departments={departments}
          locations={locations}
        />
      )}
    </div>
  );
}

function AddEmployeeModal({ onClose, onSuccess, departments, locations }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employmentType: 'full_time',
    departmentId: '',
    primaryLocationId: '',
    startDate: '',
    hourlyRate: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await employeesApi.create(formData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Add Employee</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Employment Type</label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                className="input"
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="casual">Casual</option>
                <option value="contractor">Contractor</option>
              </select>
            </div>
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="input"
              >
                <option value="">Select...</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <select
                value={formData.primaryLocationId}
                onChange={(e) => setFormData({ ...formData, primaryLocationId: e.target.value })}
                className="input"
              >
                <option value="">Select...</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Hourly Rate (£)</label>
            <input
              type="number"
              step="0.01"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
              className="input"
              placeholder="0.00"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
