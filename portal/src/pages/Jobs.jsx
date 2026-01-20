// ============================================================
// INTERNAL MOBILITY - JOBS PAGE
// Job postings, applications, career opportunities
// ============================================================

import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import {
  Briefcase, Plus, Search, Filter, MapPin, Clock, Users, Building,
  ChevronRight, Star, Award, Check, X, Calendar, DollarSign,
  TrendingUp, Send, Eye, Edit, Trash, AlertCircle
} from 'lucide-react';

export default function Jobs() {
  const { user, isAdmin, isManager } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    loadJobs();
  }, [statusFilter]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      const result = await api.get(`/jobs?${params}`);
      setJobs(result.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      loadJobs();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const activeJobs = jobs.filter(j => j.status === 'active');
  const draftJobs = jobs.filter(j => j.status === 'draft');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Internal Opportunities</h1>
          <p className="text-slate-600">Grow your career within the organization</p>
        </div>
        {(isAdmin || isManager) && (
          <button 
            onClick={() => { setEditingJob(null); setShowModal(true); }}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            Post New Role
          </button>
        )}
      </div>

      {/* Stats for Managers */}
      {(isAdmin || isManager) && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{activeJobs.length}</p>
                <p className="text-sm text-slate-500">Active Postings</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Edit className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{draftJobs.length}</p>
                <p className="text-sm text-slate-500">Drafts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {jobs.reduce((sum, j) => sum + (j.application_count || 0), 0)}
                </p>
                <p className="text-sm text-slate-500">Total Applications</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-momentum-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-momentum-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {jobs.filter(j => j.status === 'filled').length}
                </p>
                <p className="text-sm text-slate-500">Positions Filled</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !statusFilter ? 'bg-momentum-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'active' ? 'bg-momentum-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Open Now
          </button>
          {(isAdmin || isManager) && (
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === 'draft' ? 'bg-momentum-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              Drafts
            </button>
          )}
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-momentum-500" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No opportunities available</h3>
          <p className="text-slate-500 mt-1">Check back soon for new internal positions</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              isAdmin={isAdmin || isManager}
              onClick={() => setSelectedJob(job)}
              onEdit={() => { setEditingJob(job); setShowModal(true); }}
              onDelete={() => handleDelete(job.id)}
            />
          ))}
        </div>
      )}

      {/* Job Modal (Create/Edit) */}
      {showModal && (
        <JobModal
          job={editingJob}
          onClose={() => { setShowModal(false); setEditingJob(null); }}
          onSave={() => { setShowModal(false); setEditingJob(null); loadJobs(); }}
        />
      )}

      {/* Job Detail Drawer */}
      {selectedJob && (
        <JobDetailDrawer
          job={selectedJob}
          isAdmin={isAdmin || isManager}
          onClose={() => setSelectedJob(null)}
          onUpdate={loadJobs}
        />
      )}
    </div>
  );
}

// ============================================================
// JOB CARD
// ============================================================

function JobCard({ job, isAdmin, onClick, onEdit, onDelete }) {
  const statusColors = {
    active: 'bg-green-100 text-green-700',
    draft: 'bg-slate-100 text-slate-600',
    closed: 'bg-red-100 text-red-700',
    filled: 'bg-blue-100 text-blue-700',
  };

  return (
    <div 
      className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-momentum-200 transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[job.status] || statusColors.draft}`}>
          {job.status === 'active' ? 'Open' : job.status?.charAt(0).toUpperCase() + job.status?.slice(1)}
        </div>
        {isAdmin && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-momentum-600 transition-colors">
        {job.title}
      </h3>

      <div className="space-y-2 text-sm text-slate-500 mb-4">
        {job.department_name && (
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            {job.department_name}
          </div>
        )}
        {job.location_name && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {job.location_name}
          </div>
        )}
        {(job.hourly_rate_min || job.hourly_rate_max) && (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            £{job.hourly_rate_min || '?'} - £{job.hourly_rate_max || '?'}/hr
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1 text-sm text-slate-500">
          <Users className="w-4 h-4" />
          {job.application_count || 0} applicants
        </div>
        {job.closes_at && (
          <div className="text-sm text-slate-500">
            Closes {new Date(job.closes_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// JOB MODAL
// ============================================================

function JobModal({ job, onClose, onSave }) {
  const [form, setForm] = useState({
    title: job?.title || '',
    description: job?.description || '',
    departmentId: job?.department_id || '',
    locationId: job?.location_id || '',
    roleId: job?.role_id || '',
    employmentType: job?.employment_type || 'full-time',
    hourlyRateMin: job?.hourly_rate_min || '',
    hourlyRateMax: job?.hourly_rate_max || '',
    visibility: job?.visibility || 'internal',
    closesAt: job?.closes_at?.split('T')[0] || '',
    status: job?.status || 'draft',
  });
  const [departments, setDepartments] = useState([]);
  const [locations, setLocations] = useState([]);
  const [roles, setRoles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    try {
      const [depts, locs, rolesList] = await Promise.all([
        api.get('/departments'),
        api.get('/locations'),
        api.get('/roles'),
      ]);
      setDepartments(depts.departments || []);
      setLocations(locs.locations || []);
      setRoles(rolesList.roles || []);
    } catch (error) {
      console.error('Failed to load options:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        title: form.title,
        description: form.description,
        departmentId: form.departmentId || null,
        locationId: form.locationId || null,
        roleId: form.roleId || null,
        employmentType: form.employmentType,
        hourlyRateMin: form.hourlyRateMin ? parseFloat(form.hourlyRateMin) : null,
        hourlyRateMax: form.hourlyRateMax ? parseFloat(form.hourlyRateMax) : null,
        visibility: form.visibility,
        closesAt: form.closesAt || null,
        status: form.status,
      };

      if (job) {
        await api.put(`/jobs/${job.id}`, data);
      } else {
        await api.post('/jobs', data);
      }
      onSave();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
        <h2 className="text-lg font-semibold mb-6">
          {job ? 'Edit Job Posting' : 'Create New Job Posting'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g., Senior Barista, Shift Supervisor"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              rows={4}
              placeholder="Describe the role, responsibilities, and requirements..."
              className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select
                value={form.departmentId}
                onChange={e => setForm({...form, departmentId: e.target.value})}
                className="input"
              >
                <option value="">Select department...</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <select
                value={form.locationId}
                onChange={e => setForm({...form, locationId: e.target.value})}
                className="input"
              >
                <option value="">Any location...</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role/Position</label>
              <select
                value={form.roleId}
                onChange={e => setForm({...form, roleId: e.target.value})}
                className="input"
              >
                <option value="">Select role...</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
              <select
                value={form.employmentType}
                onChange={e => setForm({...form, employmentType: e.target.value})}
                className="input"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="casual">Casual</option>
                <option value="contract">Contract</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate Min (£)</label>
              <input
                type="number"
                step="0.01"
                value={form.hourlyRateMin}
                onChange={e => setForm({...form, hourlyRateMin: e.target.value})}
                placeholder="e.g., 12.00"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate Max (£)</label>
              <input
                type="number"
                step="0.01"
                value={form.hourlyRateMax}
                onChange={e => setForm({...form, hourlyRateMax: e.target.value})}
                placeholder="e.g., 15.00"
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Closes On</label>
              <input
                type="date"
                value={form.closesAt}
                onChange={e => setForm({...form, closesAt: e.target.value})}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({...form, status: e.target.value})}
                className="input"
              >
                <option value="draft">Draft</option>
                <option value="active">Active (Publish)</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : job ? 'Update Posting' : 'Create Posting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// JOB DETAIL DRAWER
// ============================================================

function JobDetailDrawer({ job, isAdmin, onClose, onUpdate }) {
  const [fullJob, setFullJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('details');
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    loadJobDetails();
  }, [job.id]);

  const loadJobDetails = async () => {
    setLoading(true);
    try {
      const result = await api.get(`/jobs/${job.id}`);
      setFullJob(result.job);

      if (isAdmin) {
        const [apps, matchResult] = await Promise.all([
          api.get(`/jobs/${job.id}/applications`),
          api.get(`/jobs/${job.id}/matches`),
        ]);
        setApplications(apps.applications || []);
        setMatches(matchResult.matches || []);
      }
    } catch (error) {
      console.error('Failed to load job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await api.post(`/jobs/${job.id}/apply`, { coverLetter });
      loadJobDetails();
    } catch (error) {
      alert(error.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleUpdateApplication = async (appId, status) => {
    try {
      await api.put(`/jobs/${job.id}/applications/${appId}`, { status });
      loadJobDetails();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="bg-white w-full max-w-2xl h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b z-10">
          <div className="px-6 py-4 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{fullJob?.title}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                {fullJob?.department_name && (
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {fullJob.department_name}
                  </span>
                )}
                {fullJob?.location_name && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {fullJob.location_name}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          {isAdmin && (
            <div className="px-6 flex gap-4 border-t">
              {['details', 'applications', 'matches'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    tab === t 
                      ? 'border-momentum-500 text-momentum-600' 
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {t === 'applications' && applications.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-momentum-100 text-momentum-600 text-xs rounded-full">
                      {applications.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === 'details' && (
            <div className="space-y-6">
              {/* Status & Pay */}
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  fullJob?.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {fullJob?.status === 'active' ? 'Open for Applications' : fullJob?.status}
                </span>
                {(fullJob?.hourly_rate_min || fullJob?.hourly_rate_max) && (
                  <span className="text-lg font-semibold text-slate-900">
                    £{fullJob.hourly_rate_min} - £{fullJob.hourly_rate_max}/hr
                  </span>
                )}
              </div>

              {/* Description */}
              {fullJob?.description && (
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">About this Role</h3>
                  <p className="text-slate-600 whitespace-pre-wrap">{fullJob.description}</p>
                </div>
              )}

              {/* Required Skills */}
              {fullJob?.requiredSkillsList?.length > 0 && (
                <div>
                  <h3 className="font-medium text-slate-900 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {fullJob.requiredSkillsList.map(skill => (
                      <span key={skill.id} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Section */}
              {fullJob?.status === 'active' && !isAdmin && (
                <div className="border-t pt-6">
                  {fullJob.myApplication ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">You've applied for this role</span>
                      </div>
                      <p className="text-sm text-green-600 mt-1">
                        Status: {fullJob.myApplication.status}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-medium text-slate-900">Apply for this Position</h3>
                      <textarea
                        value={coverLetter}
                        onChange={e => setCoverLetter(e.target.value)}
                        rows={4}
                        placeholder="Why are you interested in this role? (optional)"
                        className="input"
                      />
                      <button 
                        onClick={handleApply}
                        disabled={applying}
                        className="btn btn-primary w-full"
                      >
                        <Send className="w-4 h-4" />
                        {applying ? 'Submitting...' : 'Submit Application'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {tab === 'applications' && isAdmin && (
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No applications yet
                </div>
              ) : (
                applications.map(app => (
                  <div key={app.id} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-momentum-100 flex items-center justify-center text-momentum-600 font-medium">
                          {app.first_name?.[0]}{app.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium">{app.first_name} {app.last_name}</p>
                          <p className="text-sm text-slate-500">{app.department_name} • {app.role_name}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        app.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                        app.status === 'interviewing' ? 'bg-amber-100 text-amber-700' :
                        app.status === 'offered' ? 'bg-green-100 text-green-700' :
                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    {/* Skills */}
                    {app.skills?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {app.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs flex items-center gap-1">
                            {skill.verified && <Check className="w-3 h-3 text-green-500" />}
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Cover Letter */}
                    {app.cover_letter && (
                      <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded">
                        {app.cover_letter}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="mt-3 flex gap-2">
                      {app.status === 'applied' && (
                        <>
                          <button 
                            onClick={() => handleUpdateApplication(app.id, 'interviewing')}
                            className="btn btn-secondary text-sm py-1"
                          >
                            Schedule Interview
                          </button>
                          <button 
                            onClick={() => handleUpdateApplication(app.id, 'rejected')}
                            className="btn btn-secondary text-sm py-1 text-red-600 hover:bg-red-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {app.status === 'interviewing' && (
                        <>
                          <button 
                            onClick={() => handleUpdateApplication(app.id, 'offered')}
                            className="btn btn-primary text-sm py-1"
                          >
                            Make Offer
                          </button>
                          <button 
                            onClick={() => handleUpdateApplication(app.id, 'rejected')}
                            className="btn btn-secondary text-sm py-1"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'matches' && isAdmin && (
            <div className="space-y-4">
              <p className="text-sm text-slate-500">
                Employees who match the required skills for this role
              </p>
              {matches.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  No matching employees found
                </div>
              ) : (
                matches.map(match => (
                  <div key={match.id} className="p-4 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-momentum-100 flex items-center justify-center text-momentum-600 font-medium">
                        {match.first_name?.[0]}{match.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium">{match.first_name} {match.last_name}</p>
                        <p className="text-sm text-slate-500">{match.department_name} • {match.role_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-momentum-600">
                        {match.match_percentage}%
                      </div>
                      <p className="text-xs text-slate-500">
                        {match.matched_skills}/{match.required_skills_count} skills
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
