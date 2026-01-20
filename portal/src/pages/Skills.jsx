// ============================================================
// SKILLS MANAGEMENT PAGE
// Manage organization skills, employee competencies, verification
// ============================================================

import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import {
  Award, Plus, Search, Filter, Edit, Trash, Check, X, Users,
  Clock, Shield, ChevronRight, Star, AlertCircle, BookOpen
} from 'lucide-react';

export default function Skills() {
  const { isAdmin } = useAuth();
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  useEffect(() => {
    loadSkills();
  }, [search, categoryFilter]);

  const loadSkills = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);
      
      const result = await api.get(`/skills?${params}`);
      setSkills(result.skills || []);
      setCategories(result.categories || []);
    } catch (error) {
      console.error('Failed to load skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill? This will remove it from all employees.')) return;
    try {
      await api.delete(`/skills/${id}`);
      loadSkills();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Skills & Competencies</h1>
          <p className="text-slate-600">Manage your organization's skill framework</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => { setEditingSkill(null); setShowModal(true); }}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-momentum-100 rounded-lg">
              <Award className="w-5 h-5 text-momentum-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{skills.length}</p>
              <p className="text-sm text-slate-500">Total Skills</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{categories.length}</p>
              <p className="text-sm text-slate-500">Categories</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {skills.filter(s => s.requires_verification).length}
              </p>
              <p className="text-sm text-slate-500">Require Verification</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {skills.filter(s => s.expires_after_days).length}
              </p>
              <p className="text-sm text-slate-500">Have Expiry</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="input w-48"
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-momentum-500" />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">{category}</h2>
                <p className="text-sm text-slate-500">{categorySkills.length} skills</p>
              </div>
              <div className="divide-y divide-slate-100">
                {categorySkills.map(skill => (
                  <div 
                    key={skill.id} 
                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        skill.requires_verification ? 'bg-green-100' : 'bg-slate-100'
                      }`}>
                        <Award className={`w-5 h-5 ${
                          skill.requires_verification ? 'text-green-600' : 'text-slate-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{skill.name}</p>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {skill.employee_count || 0} employees
                          </span>
                          {skill.requires_verification && (
                            <span className="flex items-center gap-1 text-green-600">
                              <Shield className="w-3.5 h-3.5" />
                              Requires verification
                            </span>
                          )}
                          {skill.expires_after_days && (
                            <span className="flex items-center gap-1 text-amber-600">
                              <Clock className="w-3.5 h-3.5" />
                              Expires in {skill.expires_after_days} days
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setEditingSkill(skill); setShowModal(true); }}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(skill.id); }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {skills.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">No skills defined</h3>
              <p className="text-slate-500 mt-1">Create your first skill to start tracking competencies</p>
              {isAdmin && (
                <button 
                  onClick={() => setShowModal(true)}
                  className="btn btn-primary mt-4"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Skill Modal */}
      {showModal && (
        <SkillModal
          skill={editingSkill}
          categories={categories}
          onClose={() => { setShowModal(false); setEditingSkill(null); }}
          onSave={() => { setShowModal(false); setEditingSkill(null); loadSkills(); }}
        />
      )}

      {/* Skill Detail Drawer */}
      {selectedSkill && (
        <SkillDetailDrawer
          skill={selectedSkill}
          onClose={() => setSelectedSkill(null)}
          onUpdate={loadSkills}
        />
      )}
    </div>
  );
}

// ============================================================
// SKILL MODAL
// ============================================================

function SkillModal({ skill, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    name: skill?.name || '',
    category: skill?.category || '',
    newCategory: '',
    requiresVerification: skill?.requires_verification || false,
    expiresAfterDays: skill?.expires_after_days || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        name: form.name,
        category: form.newCategory || form.category || null,
        requiresVerification: form.requiresVerification,
        expiresAfterDays: form.expiresAfterDays ? parseInt(form.expiresAfterDays) : null,
      };

      if (skill) {
        await api.put(`/skills/${skill.id}`, data);
      } else {
        await api.post('/skills', data);
      }
      onSave();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-6">
          {skill ? 'Edit Skill' : 'Add New Skill'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Skill Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="e.g., Forklift Operation"
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value, newCategory: ''})}
              className="input"
            >
              <option value="">Select or create new...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {!form.category && (
              <input
                type="text"
                value={form.newCategory}
                onChange={e => setForm({...form, newCategory: e.target.value})}
                placeholder="Or enter new category..."
                className="input mt-2"
              />
            )}
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <input
              type="checkbox"
              id="verification"
              checked={form.requiresVerification}
              onChange={e => setForm({...form, requiresVerification: e.target.checked})}
              className="w-4 h-4 text-momentum-600 rounded"
            />
            <label htmlFor="verification" className="flex-1">
              <span className="font-medium text-slate-900">Requires Verification</span>
              <p className="text-sm text-slate-500">Manager must verify this skill</p>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Expiry Period (days)
            </label>
            <input
              type="number"
              value={form.expiresAfterDays}
              onChange={e => setForm({...form, expiresAfterDays: e.target.value})}
              placeholder="Leave empty for no expiry"
              min="1"
              className="input"
            />
            <p className="text-xs text-slate-500 mt-1">
              For certifications that need renewal (e.g., First Aid: 365 days)
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : skill ? 'Update Skill' : 'Create Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// SKILL DETAIL DRAWER
// ============================================================

function SkillDetailDrawer({ skill, onClose, onUpdate }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, [skill.id]);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const result = await api.get(`/skills/${skill.id}/employees`);
      setEmployees(result.employees || []);
    } catch (error) {
      console.error('Failed to load employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (employeeId, verified) => {
    try {
      await api.put(`/employees/${employeeId}/skills/${skill.id}`, { verified });
      loadEmployees();
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="bg-white w-full max-w-lg h-full overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{skill.name}</h2>
            <p className="text-sm text-slate-500">{skill.category}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Skill Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Employees</p>
              <p className="text-xl font-bold">{employees.length}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-500">Verified</p>
              <p className="text-xl font-bold">
                {employees.filter(e => e.verified).length}
              </p>
            </div>
          </div>

          {skill.requires_verification && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              <Shield className="w-4 h-4" />
              This skill requires manager verification
            </div>
          )}

          {skill.expires_after_days && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-lg text-sm">
              <Clock className="w-4 h-4" />
              Expires after {skill.expires_after_days} days
            </div>
          )}

          {/* Employees with Skill */}
          <div>
            <h3 className="font-medium text-slate-900 mb-3">Employees with this Skill</h3>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-momentum-500" />
              </div>
            ) : employees.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No employees have this skill yet</p>
            ) : (
              <div className="space-y-2">
                {employees.map(emp => (
                  <div key={emp.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-momentum-100 flex items-center justify-center text-momentum-600 font-medium">
                        {emp.first_name?.[0]}{emp.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-medium">{emp.first_name} {emp.last_name}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-slate-500">Level {emp.level || 1}</span>
                          {emp.expires_at && new Date(emp.expires_at) < new Date() && (
                            <span className="text-red-600 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Expired
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Skill Level */}
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(level => (
                          <Star 
                            key={level}
                            className={`w-4 h-4 ${level <= (emp.level || 1) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                      {/* Verification */}
                      {skill.requires_verification && (
                        emp.verified ? (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <Check className="w-4 h-4" /> Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleVerify(emp.id, true)}
                            className="btn btn-secondary text-sm py-1 px-2"
                          >
                            Verify
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
