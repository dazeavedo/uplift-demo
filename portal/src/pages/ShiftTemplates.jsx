// ============================================================
// SHIFT TEMPLATES PAGE
// Create and manage reusable shift templates
// ============================================================

import { useState, useEffect } from 'react';
import { api, locationsApi } from '../lib/api';
import { useAuth } from '../lib/auth';
import {
  Copy, Plus, Edit, Trash, Calendar, Clock, MapPin, Users,
  Play, X, ChevronRight, CheckCircle, AlertCircle,
} from 'lucide-react';
import { format, addDays } from 'date-fns';

export default function ShiftTemplates() {
  const { isManager } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [templatesResult, locResult] = await Promise.all([
        api.get('/shift-templates'),
        locationsApi.list(),
      ]);
      setTemplates(templatesResult.templates || []);
      setLocations(locResult.locations || []);
    } catch (error) {
      console.error('Failed to load templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return;
    try {
      await api.delete(`/shift-templates/${id}`);
      loadData();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleApply = async (templateId, startDate, endDate) => {
    try {
      await api.post(`/shift-templates/${templateId}/apply`, { startDate, endDate });
      setShowApplyModal(false);
      alert('Shifts generated successfully!');
    } catch (error) {
      alert(error.message || 'Failed to generate shifts');
    }
  };

  if (!isManager) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h2 className="text-lg font-medium text-slate-900">Access Restricted</h2>
        <p className="text-slate-500">Only managers can access shift templates</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Shift Templates</h1>
          <p className="text-slate-600">Create reusable shift patterns</p>
        </div>
        <button onClick={() => { setEditingTemplate(null); setShowModal(true); }} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-32 mb-3" />
              <div className="h-4 bg-slate-100 rounded w-48 mb-2" />
              <div className="h-4 bg-slate-100 rounded w-40" />
            </div>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <div className="card p-12 text-center">
          <Copy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No templates yet</h3>
          <p className="text-slate-500 mt-1">Create a template to quickly generate recurring shifts</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary mt-4">
            <Plus className="w-4 h-4" />
            Create First Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <div key={template.id} className="card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900">{template.name}</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => { setEditingTemplate(template); setShowModal(true); }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600 mb-4">
                {template.location_name && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {template.location_name}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {template.start_time} - {template.end_time}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {template.days_of_week?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ') || 'All days'}
                </div>
                {template.headcount > 1 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {template.headcount} shifts per day
                  </div>
                )}
              </div>

              <button
                onClick={() => { setSelectedTemplate(template); setShowApplyModal(true); }}
                className="btn btn-secondary w-full text-sm"
              >
                <Play className="w-4 h-4" />
                Generate Shifts
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TemplateModal
          template={editingTemplate}
          locations={locations}
          onClose={() => { setShowModal(false); setEditingTemplate(null); }}
          onSave={loadData}
        />
      )}

      {showApplyModal && selectedTemplate && (
        <ApplyTemplateModal
          template={selectedTemplate}
          onClose={() => { setShowApplyModal(false); setSelectedTemplate(null); }}
          onApply={handleApply}
        />
      )}
    </div>
  );
}

function TemplateModal({ template, locations, onClose, onSave }) {
  const [form, setForm] = useState({
    name: template?.name || '',
    locationId: template?.location_id || '',
    startTime: template?.start_time || '09:00',
    endTime: template?.end_time || '17:00',
    breakMinutes: template?.break_minutes || 30,
    daysOfWeek: template?.days_of_week || [1, 2, 3, 4, 5],
    headcount: template?.headcount || 1,
    isOpen: template?.is_open || false,
  });
  const [saving, setSaving] = useState(false);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const toggleDay = (day) => {
    setForm(f => ({
      ...f,
      daysOfWeek: f.daysOfWeek.includes(day)
        ? f.daysOfWeek.filter(d => d !== day)
        : [...f.daysOfWeek, day].sort()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (template) {
        await api.put(`/shift-templates/${template.id}`, form);
      } else {
        await api.post('/shift-templates', form);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{template ? 'Edit Template' : 'New Template'}</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="label">Template Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Morning Shift, Weekend Coverage"
              className="input"
            />
          </div>

          <div>
            <label className="label">Location</label>
            <select
              value={form.locationId}
              onChange={e => setForm({ ...form, locationId: e.target.value })}
              className="input"
            >
              <option value="">All locations</option>
              {locations.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Time</label>
              <input
                type="time"
                required
                value={form.startTime}
                onChange={e => setForm({ ...form, startTime: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">End Time</label>
              <input
                type="time"
                required
                value={form.endTime}
                onChange={e => setForm({ ...form, endTime: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Days of Week</label>
            <div className="flex gap-1">
              {dayNames.map((name, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
                    form.daysOfWeek.includes(i)
                      ? 'bg-momentum-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Shifts per Day</label>
              <input
                type="number"
                min="1"
                max="20"
                value={form.headcount}
                onChange={e => setForm({ ...form, headcount: parseInt(e.target.value) || 1 })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Break (min)</label>
              <input
                type="number"
                min="0"
                value={form.breakMinutes}
                onChange={e => setForm({ ...form, breakMinutes: parseInt(e.target.value) || 0 })}
                className="input"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
            <input
              type="checkbox"
              id="isOpen"
              checked={form.isOpen}
              onChange={e => setForm({ ...form, isOpen: e.target.checked })}
              className="rounded border-slate-300"
            />
            <label htmlFor="isOpen" className="text-sm">
              <span className="font-medium text-slate-900">Create as open shifts</span>
              <p className="text-slate-500">Employees can claim these shifts</p>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : template ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ApplyTemplateModal({ template, onClose, onApply }) {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 13), 'yyyy-MM-dd'));
  const [applying, setApplying] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplying(true);
    await onApply(template.id, startDate, endDate);
    setApplying(false);
  };

  // Calculate estimated shifts
  const daysDiff = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
  const matchingDays = Math.floor(daysDiff / 7) * template.days_of_week?.length || 0;
  const estimatedShifts = matchingDays * (template.headcount || 1);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Generate Shifts</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-medium text-slate-900">{template.name}</h3>
            <p className="text-sm text-slate-600">
              {template.start_time} - {template.end_time} • {template.days_of_week?.map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]).join(', ')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                min={startDate}
                className="input"
              />
            </div>
          </div>

          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            This will create approximately <strong>{estimatedShifts}</strong> shifts
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={applying} className="btn btn-primary">
              <Play className="w-4 h-4" />
              {applying ? 'Generating...' : 'Generate Shifts'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
