// ============================================================
// SETTINGS PAGE
// Organization, user management, account, and security settings
// ============================================================

import { useState, useEffect } from 'react';
import { api, organizationApi, authApi } from '../lib/api';
import { useAuth } from '../lib/auth';
import { 
  Building, User, Shield, Users, Save, Key, Mail, Plus, Trash,
  Lock, Unlock, UserX, UserCheck, RefreshCw, Send, X, 
  Monitor, Smartphone, Globe, Clock, Download, AlertTriangle,
  ChevronRight, MoreVertical, Eye, History
} from 'lucide-react';

const TABS = [
  { id: 'organization', name: 'Organization', icon: Building, adminOnly: true },
  { id: 'users', name: 'Users', icon: Users, adminOnly: true },
  { id: 'account', name: 'My Account', icon: User, adminOnly: false },
  { id: 'security', name: 'Security', icon: Shield, adminOnly: false },
  { id: 'sessions', name: 'Sessions', icon: Monitor, adminOnly: false },
  { id: 'privacy', name: 'Privacy & Data', icon: Globe, adminOnly: false },
];

export default function Settings() {
  const { user, isAdmin, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(isAdmin ? 'organization' : 'account');
  const [organization, setOrganization] = useState(null);
  const [users, setUsers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'organization' && isAdmin) {
        const result = await organizationApi.get();
        setOrganization(result.organization);
      } else if (activeTab === 'users' && isAdmin) {
        const result = await api.get('/users');
        setUsers(result.users || []);
      } else if (activeTab === 'sessions') {
        const result = await api.get(`/users/${user.id}/sessions`);
        setSessions(result.sessions || []);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // Filter tabs based on admin status
  const availableTabs = TABS.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600">Manage your organization and account</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Layout */}
      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 shrink-0">
          <nav className="space-y-1">
            {availableTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-momentum-50 text-momentum-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-momentum-500" />
            </div>
          ) : (
            <>
              {activeTab === 'organization' && isAdmin && (
                <OrganizationSettings 
                  organization={organization} 
                  onSave={() => { loadData(); showMsg('Organization settings saved'); }}
                />
              )}
              {activeTab === 'users' && isAdmin && (
                <UsersSettings 
                  users={users}
                  onRefresh={loadData}
                  showMsg={showMsg}
                  onInvite={() => setShowInviteModal(true)}
                  onViewUser={(u) => { setSelectedUser(u); setShowUserModal(true); }}
                />
              )}
              {activeTab === 'account' && (
                <AccountSettings user={user} showMsg={showMsg} />
              )}
              {activeTab === 'security' && (
                <SecuritySettings user={user} showMsg={showMsg} />
              )}
              {activeTab === 'sessions' && (
                <SessionsSettings 
                  sessions={sessions} 
                  onRefresh={loadData}
                  showMsg={showMsg}
                  userId={user.id}
                />
              )}
              {activeTab === 'privacy' && (
                <PrivacySettings user={user} showMsg={showMsg} logout={logout} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showInviteModal && (
        <InviteUserModal 
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => { setShowInviteModal(false); loadData(); showMsg('Invitation sent'); }}
        />
      )}
      {showUserModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => { setShowUserModal(false); setSelectedUser(null); }}
          onRefresh={loadData}
          showMsg={showMsg}
        />
      )}
    </div>
  );
}

// ============================================================
// ORGANIZATION SETTINGS
// ============================================================

function OrganizationSettings({ organization, onSave }) {
  const [form, setForm] = useState({
    name: organization?.name || '',
    timezone: organization?.timezone || 'Europe/London',
    currency: organization?.currency || 'GBP',
    dateFormat: organization?.date_format || 'DD/MM/YYYY',
    weekStartsOn: organization?.week_starts_on || 'monday',
    brandColor: organization?.brand_color || '#F26522',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await organizationApi.update(form);
      onSave();
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Organization Settings</h2>
        <p className="text-sm text-slate-600">Configure your organization's preferences</p>
      </div>

      <div className="grid gap-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
          <select
            value={form.timezone}
            onChange={e => setForm({ ...form, timezone: e.target.value })}
            className="input"
          >
            <option value="Europe/London">London (GMT/BST)</option>
            <option value="America/New_York">New York (EST/EDT)</option>
            <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
            <option value="Asia/Singapore">Singapore (SGT)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
            <select
              value={form.currency}
              onChange={e => setForm({ ...form, currency: e.target.value })}
              className="input"
            >
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Week Starts On</label>
            <select
              value={form.weekStartsOn}
              onChange={e => setForm({ ...form, weekStartsOn: e.target.value })}
              className="input"
            >
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Brand Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={form.brandColor}
              onChange={e => setForm({ ...form, brandColor: e.target.value })}
              className="w-12 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={form.brandColor}
              onChange={e => setForm({ ...form, brandColor: e.target.value })}
              className="input w-32"
            />
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn btn-primary">
        <Save className="w-4 h-4" />
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

// ============================================================
// USERS SETTINGS (Admin)
// ============================================================

function UsersSettings({ users, onRefresh, showMsg, onInvite, onViewUser }) {
  const [filter, setFilter] = useState('all');

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true;
    if (filter === 'locked') return u.isLocked || (u.locked_until && new Date(u.locked_until) > new Date());
    return u.status === filter;
  });

  const getStatusBadge = (user) => {
    if (user.isLocked || (user.locked_until && new Date(user.locked_until) > new Date())) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Locked</span>;
    }
    switch (user.status) {
      case 'active': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Active</span>;
      case 'invited': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Invited</span>;
      case 'inactive': return <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700">Inactive</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
          <p className="text-sm text-slate-600">Manage user accounts and permissions</p>
        </div>
        <button onClick={onInvite} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Invite User
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'active', 'invited', 'locked', 'inactive'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              filter === f 
                ? 'bg-momentum-100 text-momentum-700 font-medium'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Users Table */}
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">User</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Role</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Last Login</th>
              <th className="text-right text-xs font-medium text-slate-500 uppercase px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredUsers.map(u => (
              <tr key={u.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-momentum-100 flex items-center justify-center text-momentum-600 font-medium">
                      {u.first_name?.[0]}{u.last_name?.[0]}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">
                        {u.first_name} {u.last_name}
                        {u.force_password_change && (
                          <Key className="w-3.5 h-3.5 inline ml-1 text-amber-500" title="Password change required" />
                        )}
                      </div>
                      <div className="text-sm text-slate-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="capitalize text-sm text-slate-700">{u.role}</span>
                </td>
                <td className="px-4 py-3">{getStatusBadge(u)}</td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {u.last_login_at ? new Date(u.last_login_at).toLocaleDateString() : 'Never'}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onViewUser(u)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// USER DETAIL MODAL (Admin)
// ============================================================

function UserDetailModal({ user, onClose, onRefresh, showMsg }) {
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [activity, setActivity] = useState([]);
  const [tab, setTab] = useState('details');

  useEffect(() => {
    loadUserData();
  }, [user.id]);

  const loadUserData = async () => {
    try {
      const [sessResult, actResult] = await Promise.all([
        api.get(`/users/${user.id}/sessions`),
        api.get(`/users/${user.id}/activity?limit=20`),
      ]);
      setSessions(sessResult.sessions || []);
      setActivity(actResult.activities || []);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handleAction = async (action, data = {}) => {
    setLoading(true);
    try {
      switch (action) {
        case 'unlock':
          await api.post(`/users/${user.id}/unlock`);
          showMsg('Account unlocked');
          break;
        case 'deactivate':
          await api.post(`/users/${user.id}/deactivate`, { reason: data.reason });
          showMsg('Account deactivated');
          break;
        case 'reactivate':
          await api.post(`/users/${user.id}/reactivate`);
          showMsg('Account reactivated');
          break;
        case 'changeRole':
          await api.patch(`/users/${user.id}/role`, { role: data.role });
          showMsg('Role updated');
          break;
        case 'forcePasswordReset':
          await api.post(`/users/${user.id}/force-password-reset`);
          showMsg('Password reset required on next login');
          break;
        case 'resendInvitation':
          await api.post(`/users/${user.id}/resend-invitation`);
          showMsg('Invitation resent');
          break;
        case 'cancelInvitation':
          await api.post(`/users/${user.id}/cancel-invitation`);
          showMsg('Invitation cancelled');
          break;
        case 'revokeSessions':
          await api.post(`/users/${user.id}/sessions/revoke-all`);
          showMsg('All sessions revoked');
          loadUserData();
          break;
      }
      onRefresh();
    } catch (error) {
      showMsg(error.message || 'Action failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isLocked = user.isLocked || (user.locked_until && new Date(user.locked_until) > new Date());

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-momentum-100 flex items-center justify-center text-momentum-600 font-medium text-lg">
              {user.first_name?.[0]}{user.last_name?.[0]}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user.first_name} {user.last_name}</h2>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b px-6">
          {['details', 'sessions', 'activity'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px ${
                tab === t ? 'border-momentum-500 text-momentum-600' : 'border-transparent text-slate-500'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {tab === 'details' && (
            <div className="space-y-6">
              {/* Status Actions */}
              <div className="flex flex-wrap gap-2">
                {isLocked && (
                  <button onClick={() => handleAction('unlock')} disabled={loading} className="btn btn-secondary">
                    <Unlock className="w-4 h-4" /> Unlock Account
                  </button>
                )}
                {user.status === 'active' && (
                  <button onClick={() => handleAction('deactivate')} disabled={loading} className="btn btn-secondary text-red-600 hover:bg-red-50">
                    <UserX className="w-4 h-4" /> Deactivate
                  </button>
                )}
                {user.status === 'inactive' && (
                  <button onClick={() => handleAction('reactivate')} disabled={loading} className="btn btn-secondary">
                    <UserCheck className="w-4 h-4" /> Reactivate
                  </button>
                )}
                {user.status === 'invited' && (
                  <>
                    <button onClick={() => handleAction('resendInvitation')} disabled={loading} className="btn btn-secondary">
                      <Send className="w-4 h-4" /> Resend Invitation
                    </button>
                    <button onClick={() => handleAction('cancelInvitation')} disabled={loading} className="btn btn-secondary text-red-600">
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </>
                )}
                {user.status === 'active' && (
                  <button onClick={() => handleAction('forcePasswordReset')} disabled={loading} className="btn btn-secondary">
                    <Key className="w-4 h-4" /> Force Password Reset
                  </button>
                )}
                <button onClick={() => handleAction('revokeSessions')} disabled={loading} className="btn btn-secondary">
                  <RefreshCw className="w-4 h-4" /> Revoke All Sessions
                </button>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Role</span>
                  <select
                    value={user.role}
                    onChange={(e) => handleAction('changeRole', { role: e.target.value })}
                    className="input mt-1"
                    disabled={loading}
                  >
                    <option value="worker">Worker</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <span className="text-slate-500">Status</span>
                  <p className="mt-1 font-medium">{isLocked ? 'Locked' : user.status}</p>
                </div>
                <div>
                  <span className="text-slate-500">Email Verified</span>
                  <p className="mt-1">{user.email_verified ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-slate-500">MFA Enabled</span>
                  <p className="mt-1">{user.mfa_enabled ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <span className="text-slate-500">Last Login</span>
                  <p className="mt-1">{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}</p>
                </div>
                <div>
                  <span className="text-slate-500">Created</span>
                  <p className="mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'sessions' && (
            <div className="space-y-3">
              {sessions.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No active sessions</p>
              ) : (
                sessions.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {s.device_type === 'mobile' ? <Smartphone className="w-5 h-5 text-slate-400" /> : <Monitor className="w-5 h-5 text-slate-400" />}
                      <div>
                        <p className="font-medium text-sm">{s.device_name || 'Unknown Device'}</p>
                        <p className="text-xs text-slate-500">{s.browser} • {s.ip_address}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {s.is_current && <span className="text-xs text-green-600 font-medium">Current</span>}
                      <p className="text-xs text-slate-500">{new Date(s.last_active_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'activity' && (
            <div className="space-y-2">
              {activity.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No activity recorded</p>
              ) : (
                activity.map(a => (
                  <div key={a.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{a.action.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-slate-500">{a.ip_address}</p>
                    </div>
                    <div className="text-right">
                      {!a.success && <span className="text-xs text-red-600">Failed</span>}
                      <p className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString()}</p>
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

// ============================================================
// INVITE USER MODAL
// ============================================================

function InviteUserModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: 'worker' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.inviteUser(form);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Invite Team Member</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input type="text" required value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input type="text" required value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="input">
              <option value="worker">Worker</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// ACCOUNT SETTINGS
// ============================================================

function AccountSettings({ user, showMsg }) {
  const [form, setForm] = useState({
    firstName: user?.firstName || user?.first_name || '',
    lastName: user?.lastName || user?.last_name || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authApi.updateProfile(form);
      showMsg('Profile updated');
    } catch (error) {
      showMsg('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">My Account</h2>
        <p className="text-sm text-slate-600">Update your personal information</p>
      </div>

      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
        <div className="w-16 h-16 rounded-full bg-momentum-100 flex items-center justify-center text-momentum-600 font-bold text-xl">
          {form.firstName?.[0]}{form.lastName?.[0]}
        </div>
        <div>
          <p className="font-medium">{form.firstName} {form.lastName}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-momentum-100 text-momentum-700 text-xs font-medium rounded-full capitalize">
            {user?.role}
          </span>
        </div>
      </div>

      <div className="grid gap-4 max-w-xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
            <input type="text" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
            <input type="text" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="input" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input" />
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn btn-primary">
        <Save className="w-4 h-4" />
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}

// ============================================================
// SECURITY SETTINGS
// ============================================================

function SecuritySettings({ user, showMsg }) {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [changing, setChanging] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfaEnabled || user?.mfa_enabled || false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showMsg('Passwords do not match', 'error');
      return;
    }
    if (passwords.new.length < 8) {
      showMsg('Password must be at least 8 characters', 'error');
      return;
    }
    
    setChanging(true);
    try {
      await authApi.changePassword(passwords.current, passwords.new);
      setPasswords({ current: '', new: '', confirm: '' });
      showMsg('Password changed successfully');
    } catch (error) {
      showMsg(error.message || 'Failed to change password', 'error');
    } finally {
      setChanging(false);
    }
  };

  const toggleMfa = async () => {
    try {
      if (mfaEnabled) {
        await authApi.disableMfa();
        setMfaEnabled(false);
        showMsg('Two-factor authentication disabled');
      } else {
        await authApi.enableMfa();
        setMfaEnabled(true);
        showMsg('Two-factor authentication enabled');
      }
    } catch (error) {
      showMsg('Failed to update MFA settings', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Security Settings</h2>
        <p className="text-sm text-slate-600">Manage your password and security options</p>
      </div>

      {/* Change Password */}
      <div className="max-w-xl">
        <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
          <Key className="w-5 h-5 text-slate-400" />
          Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
            <input type="password" required value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input type="password" required minLength={8} value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="input" />
            <p className="text-xs text-slate-500 mt-1">At least 8 characters with uppercase, lowercase, and number</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <input type="password" required value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="input" />
          </div>
          <button type="submit" disabled={changing} className="btn btn-primary">
            {changing ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* MFA */}
      <div className="max-w-xl pt-6 border-t">
        <h3 className="font-medium text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-slate-400" />
          Two-Factor Authentication
        </h3>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <p className="font-medium">Authenticator App</p>
            <p className="text-sm text-slate-500">Add an extra layer of security</p>
          </div>
          <button onClick={toggleMfa} className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mfaEnabled 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
          }`}>
            {mfaEnabled ? 'Enabled' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SESSIONS SETTINGS
// ============================================================

function SessionsSettings({ sessions, onRefresh, showMsg, userId }) {
  const [revoking, setRevoking] = useState(null);

  const revokeSession = async (sessionId) => {
    setRevoking(sessionId);
    try {
      await api.delete(`/users/${userId}/sessions/${sessionId}`);
      showMsg('Session revoked');
      onRefresh();
    } catch (error) {
      showMsg('Failed to revoke session', 'error');
    } finally {
      setRevoking(null);
    }
  };

  const revokeOthers = async () => {
    setRevoking('all');
    try {
      await api.post('/users/me/sessions/revoke-others');
      showMsg('Other sessions revoked');
      onRefresh();
    } catch (error) {
      showMsg('Failed to revoke sessions', 'error');
    } finally {
      setRevoking(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Active Sessions</h2>
          <p className="text-sm text-slate-600">Manage your logged-in devices</p>
        </div>
        {sessions.length > 1 && (
          <button onClick={revokeOthers} disabled={revoking} className="btn btn-secondary text-red-600">
            <RefreshCw className="w-4 h-4" />
            Sign Out Other Devices
          </button>
        )}
      </div>

      <div className="space-y-3">
        {sessions.map(s => (
          <div key={s.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-4">
              {s.device_type === 'mobile' ? <Smartphone className="w-6 h-6 text-slate-400" /> : <Monitor className="w-6 h-6 text-slate-400" />}
              <div>
                <p className="font-medium">
                  {s.device_name || 'Unknown Device'}
                  {s.is_current && <span className="ml-2 text-xs text-green-600 font-medium">This device</span>}
                </p>
                <p className="text-sm text-slate-500">{s.browser} on {s.os} • {s.ip_address}</p>
                <p className="text-xs text-slate-400">Last active: {new Date(s.last_active_at).toLocaleString()}</p>
              </div>
            </div>
            {!s.is_current && (
              <button 
                onClick={() => revokeSession(s.id)} 
                disabled={revoking === s.id}
                className="btn btn-secondary text-red-600 text-sm"
              >
                {revoking === s.id ? 'Revoking...' : 'Revoke'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// PRIVACY & DATA SETTINGS (GDPR)
// ============================================================

function PrivacySettings({ user, showMsg, logout }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const exportData = async () => {
    setExporting(true);
    try {
      const response = await fetch('/api/users/me/data-export', {
        credentials: 'include',
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `uplift-data-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showMsg('Data exported successfully');
    } catch (error) {
      showMsg('Failed to export data', 'error');
    } finally {
      setExporting(false);
    }
  };

  const requestDeletion = async () => {
    if (!deletePassword) {
      showMsg('Please enter your password', 'error');
      return;
    }
    setDeleting(true);
    try {
      await api.post('/users/me/request-deletion', { password: deletePassword });
      showMsg('Deletion requested. Your account will be deleted in 30 days.');
      setShowDeleteConfirm(false);
    } catch (error) {
      showMsg(error.message || 'Failed to request deletion', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const hasPendingDeletion = user?.deletion_requested_at;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Privacy & Data</h2>
        <p className="text-sm text-slate-600">Manage your personal data and account</p>
      </div>

      {/* Export Data */}
      <div className="p-4 border border-slate-200 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Download className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-slate-900">Export Your Data</h3>
            <p className="text-sm text-slate-600 mt-1">Download a copy of all your personal data including profile, activity logs, time entries, and shifts.</p>
            <button onClick={exportData} disabled={exporting} className="btn btn-secondary mt-3">
              {exporting ? 'Preparing...' : 'Download My Data'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-red-900">Delete Account</h3>
            {hasPendingDeletion ? (
              <>
                <p className="text-sm text-red-700 mt-1">Your account is scheduled for deletion. It will be permanently removed in 30 days.</p>
                <button 
                  onClick={async () => {
                    await api.post('/users/me/cancel-deletion');
                    showMsg('Deletion cancelled');
                  }} 
                  className="btn btn-secondary mt-3"
                >
                  Cancel Deletion
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-red-700 mt-1">Permanently delete your account and all associated data. This action cannot be undone after the 30-day grace period.</p>
                <button onClick={() => setShowDeleteConfirm(true)} className="btn mt-3 bg-red-600 text-white hover:bg-red-700">
                  Request Account Deletion
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h2 className="text-lg font-semibold">Delete Account</h2>
            </div>
            <p className="text-slate-600 mb-4">
              This will schedule your account for permanent deletion. You have 30 days to cancel this request. After that, all your data will be permanently removed.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Enter your password to confirm</label>
              <input
                type="password"
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
                className="input"
                placeholder="Your password"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={requestDeletion} disabled={deleting} className="btn bg-red-600 text-white hover:bg-red-700">
                {deleting ? 'Processing...' : 'Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
