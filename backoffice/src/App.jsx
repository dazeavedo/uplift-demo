// ============================================================
// UPLIFT BACKOFFICE - INTERNAL OPERATIONS PORTAL
// For Uplift team to manage customers, billing, support
// ============================================================

import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  Building2, Users, CreditCard, BarChart3, Settings, Search,
  ChevronDown, LogOut, Bell, TrendingUp, TrendingDown, DollarSign,
  UserPlus, AlertCircle, CheckCircle, Clock, ArrowUpRight,
  MoreHorizontal, Eye, Edit, XCircle, Mail, RefreshCw,
  FileText, Calendar, Shield, Zap, Package, ChevronRight,
  Filter, Download, Plus, ExternalLink
} from 'lucide-react';

// ============================================================
// AUTH CONTEXT
// ============================================================

const AuthContext = createContext(null);

const useAuth = () => useContext(AuthContext);

// ============================================================
// API
// ============================================================

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = {
  async request(method, path, data) {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Request failed');
    }
    return res.json();
  },
  get: (path) => api.request('GET', path),
  post: (path, data) => api.request('POST', path, data),
  patch: (path, data) => api.request('PATCH', path, data),
  delete: (path) => api.request('DELETE', path),
};

// ============================================================
// UTILITY COMPONENTS
// ============================================================

const cn = (...classes) => classes.filter(Boolean).join(' ');

const formatCurrency = (amount, currency = 'GBP') => {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency }).format(amount);
};

const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-emerald-100 text-emerald-700',
    trialing: 'bg-blue-100 text-blue-700',
    past_due: 'bg-amber-100 text-amber-700',
    canceled: 'bg-slate-100 text-slate-600',
    unpaid: 'bg-red-100 text-red-700',
    paid: 'bg-emerald-100 text-emerald-700',
    open: 'bg-blue-100 text-blue-700',
    void: 'bg-slate-100 text-slate-500',
  };
  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', styles[status] || 'bg-slate-100 text-slate-600')}>
      {status?.replace('_', ' ')}
    </span>
  );
};

const Card = ({ children, className }) => (
  <div className={cn('bg-white rounded-xl border border-slate-200 shadow-sm', className)}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  return (
    <button
      className={cn('rounded-lg font-medium transition-colors', variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// ============================================================
// DASHBOARD PAGE
// ============================================================

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/metrics').then(setMetrics).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  const stats = [
    { label: 'Monthly Recurring Revenue', value: formatCurrency(metrics?.mrr || 0), icon: DollarSign, change: '+12.5%', positive: true },
    { label: 'Active Subscriptions', value: metrics?.activeSubscriptions || 0, icon: Package, change: '+8', positive: true },
    { label: 'Total Seats', value: metrics?.seats?.total || 0, icon: Users, subtext: `${metrics?.seats?.core || 0} core · ${metrics?.seats?.flex || 0} flex` },
    { label: 'New Customers (30d)', value: metrics?.newCustomers30d || 0, icon: UserPlus, change: metrics?.churned30d ? `-${metrics.churned30d} churned` : null },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">Business overview and key metrics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-orange-600" />
              </div>
              {stat.change && (
                <span className={cn('text-sm font-medium', stat.positive ? 'text-emerald-600' : 'text-slate-500')}>
                  {stat.change}
                </span>
              )}
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
            <div className="text-sm text-slate-500">{stat.label}</div>
            {stat.subtext && <div className="text-xs text-slate-400 mt-1">{stat.subtext}</div>}
          </Card>
        ))}
      </div>

      {/* Revenue by Plan */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2 p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Revenue by Plan</h3>
          <div className="space-y-4">
            {metrics?.revenueByPlan?.map((plan, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div>
                  <div className="font-medium text-slate-900">{plan.plan_name}</div>
                  <div className="text-sm text-slate-500">{plan.customer_count} customers · {plan.total_core_seats + plan.total_flex_seats} seats</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">{formatCurrency(plan.mrr)}</div>
                  <div className="text-sm text-slate-500">MRR</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Customer Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Active', value: metrics?.customers?.active, color: 'bg-emerald-500' },
              { label: 'Trialing', value: metrics?.customers?.trialing, color: 'bg-blue-500' },
              { label: 'Past Due', value: metrics?.customers?.past_due, color: 'bg-amber-500' },
              { label: 'Canceled', value: metrics?.customers?.canceled, color: 'bg-slate-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('w-2 h-2 rounded-full', item.color)} />
                  <span className="text-sm text-slate-600">{item.label}</span>
                </div>
                <span className="font-medium text-slate-900">{item.value || 0}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================================
// CUSTOMERS PAGE
// ============================================================

const Customers = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (statusFilter) params.set('status', statusFilter);
    
    api.get(`/admin/organizations?${params}`).then(data => {
      setOrganizations(data.organizations);
      setLoading(false);
    });
  }, [search, statusFilter]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500">Manage organizations and subscriptions</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Add Customer</Button>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="trialing">Trialing</option>
            <option value="past_due">Past Due</option>
            <option value="canceled">Canceled</option>
          </select>
          <Button variant="secondary"><Download className="w-4 h-4 mr-2" /> Export</Button>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Organization</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Plan</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Seats</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">MRR</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Last Active</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {organizations.map(org => (
              <tr key={org.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">{org.name}</div>
                  <div className="text-sm text-slate-500">{org.billing_email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-900">{org.plan_name || '—'}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-slate-900">{(org.core_seats || 0) + (org.flex_seats || 0)}</div>
                  <div className="text-xs text-slate-500">{org.core_seats} core · {org.flex_seats || 0} flex</div>
                </td>
                <td className="px-6 py-4 text-slate-900">
                  {formatCurrency((org.core_seats || 0) * 10 + (org.flex_seats || 0) * 10)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={org.subscription_status} />
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {formatDate(org.last_activity)}
                </td>
                <td className="px-6 py-4">
                  <button 
                    className="p-2 hover:bg-slate-100 rounded-lg"
                    onClick={() => setSelected(org)}
                  >
                    <Eye className="w-4 h-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Customer Detail Drawer */}
      {selected && (
        <CustomerDrawer org={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

// ============================================================
// CUSTOMER DETAIL DRAWER
// ============================================================

const CustomerDrawer = ({ org, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    api.get(`/admin/organizations/${org.id}`).then(setDetail).finally(() => setLoading(false));
  }, [org.id]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative w-[600px] bg-white h-full shadow-xl overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{org.name}</h2>
            <p className="text-sm text-slate-500">{org.billing_email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm"><ExternalLink className="w-4 h-4 mr-1" /> Impersonate</Button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
              <XCircle className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6">Loading...</div>
        ) : (
          <>
            {/* Tabs */}
            <div className="border-b border-slate-200 px-6">
              <div className="flex gap-6">
                {['overview', 'billing', 'users', 'activity'].map(tab => (
                  <button
                    key={tab}
                    className={cn(
                      'py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                      activeTab === tab 
                        ? 'border-orange-500 text-orange-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    )}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Subscription Card */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-slate-900">Subscription</h3>
                      <StatusBadge status={detail?.subscription?.status} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-500">Plan</div>
                        <div className="font-medium">{detail?.subscription?.plan?.name || 'None'}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">MRR</div>
                        <div className="font-medium">
                          {formatCurrency(
                            (detail?.subscription?.coreSeats || 0) * (detail?.subscription?.plan?.corePricePerSeat || 0) +
                            (detail?.subscription?.flexSeats || 0) * (detail?.subscription?.plan?.flexPricePerSeat || 0)
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">Core Seats</div>
                        <div className="font-medium">{detail?.usage?.core_used || 0} / {detail?.subscription?.coreSeats || 0}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Flex Seats</div>
                        <div className="font-medium">{detail?.usage?.flex_used || 0} / {detail?.subscription?.flexSeats || 0}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Current Period Ends</div>
                        <div className="font-medium">{formatDate(detail?.subscription?.currentPeriodEnd)}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Created</div>
                        <div className="font-medium">{formatDate(detail?.organization?.created_at)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3">Quick Actions</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" size="sm">Add Seats</Button>
                      <Button variant="secondary" size="sm">Change Plan</Button>
                      <Button variant="secondary" size="sm">Extend Trial</Button>
                      <Button variant="secondary" size="sm">Issue Credit</Button>
                      <Button variant="ghost" size="sm" className="text-red-600">Cancel</Button>
                    </div>
                  </div>

                  {/* Activity Stats */}
                  <div>
                    <h3 className="font-medium text-slate-900 mb-3">Activity</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-slate-900">{detail?.activity?.active_employees || 0}</div>
                        <div className="text-xs text-slate-500">Active Employees</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-slate-900">{detail?.activity?.upcoming_shifts || 0}</div>
                        <div className="text-xs text-slate-500">Upcoming Shifts</div>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold text-slate-900">{detail?.activity?.time_entries_7d || 0}</div>
                        <div className="text-xs text-slate-500">Clock-ins (7d)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <h3 className="font-medium text-slate-900">Recent Invoices</h3>
                  <div className="space-y-2">
                    {detail?.invoices?.map(inv => (
                      <div key={inv.id} className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                          <div className="font-medium text-slate-900">{inv.number}</div>
                          <div className="text-sm text-slate-500">{formatDate(inv.invoice_date)}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">{formatCurrency(inv.total / 100)}</span>
                          <StatusBadge status={inv.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="space-y-4">
                  {detail?.users?.map(user => (
                    <div key={user.id} className="flex items-center justify-between py-3 border-b border-slate-100">
                      <div>
                        <div className="font-medium text-slate-900">{user.first_name} {user.last_name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{user.role}</span>
                        <StatusBadge status={user.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-3">
                  {detail?.events?.map(event => (
                    <div key={event.id} className="flex items-start gap-3 py-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300 mt-2" />
                      <div>
                        <div className="text-sm text-slate-900">{event.event_type}</div>
                        <div className="text-xs text-slate-500">{formatDate(event.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================
// INVOICES PAGE
// ============================================================

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/invoices').then(data => {
      setInvoices(data.invoices);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
        <p className="text-slate-500">View and manage all invoices</p>
      </div>

      <Card>
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Invoice</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Amount</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map(inv => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{inv.number}</td>
                <td className="px-6 py-4 text-slate-600">{inv.organization_name}</td>
                <td className="px-6 py-4 text-slate-900">{formatCurrency(inv.total / 100)}</td>
                <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                <td className="px-6 py-4 text-slate-500">{formatDate(inv.invoice_date)}</td>
                <td className="px-6 py-4">
                  <button 
                    className="p-2 hover:bg-slate-100 rounded-lg"
                    onClick={() => alert(`Invoice ${inv.invoice_number}\n\nOptions:\n• View PDF\n• Send Reminder\n• Mark as Paid\n• Void Invoice`)}
                  >
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ============================================================
// PLANS PAGE
// ============================================================

const Plans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.get('/admin/plans').then(data => setPlans(data.plans));
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Plans</h1>
          <p className="text-slate-500">Manage pricing plans and features</p>
        </div>
        <Button><Plus className="w-4 h-4 mr-2" /> Add Plan</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {plans.map(plan => (
          <Card key={plan.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
              {!plan.is_active && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Inactive</span>}
            </div>
            <p className="text-sm text-slate-500 mb-4">{plan.description}</p>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {plan.core_price_per_seat ? formatCurrency(plan.core_price_per_seat) : 'Custom'}
              {plan.core_price_per_seat && <span className="text-sm font-normal text-slate-500">/seat/mo</span>}
            </div>
            <div className="text-sm text-slate-500 mb-4">
              {plan.min_seats}–{plan.max_seats || '∞'} seats
            </div>
            <div className="pt-4 border-t border-slate-100">
              <div className="text-sm font-medium text-slate-700 mb-2">{plan.active_subscriptions} active subscriptions</div>
              <Button variant="secondary" size="sm" className="w-full">Edit Plan</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@uplift.hr' });

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'customers', label: 'Customers', icon: Building2 },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'plans', label: 'Plans', icon: Package },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'customers': return <Customers />;
      case 'invoices': return <Invoices />;
      case 'plans': return <Plans />;
      default: return <Dashboard />;
    }
  };

  return (
    <AuthContext.Provider value={{ user }}>
      <div className="min-h-screen bg-slate-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 text-white flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold">U</div>
              <span className="font-semibold">Uplift Backoffice</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navigation.map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentPage(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                      currentPage === item.id
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm font-medium">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.name}</div>
                <div className="text-xs text-slate-400 truncate">{user.email}</div>
              </div>
              <button 
                className="p-1 hover:bg-slate-800 rounded"
                onClick={() => {
                  if (confirm('Are you sure you want to log out?')) {
                    localStorage.removeItem('backoffice_token');
                    window.location.reload();
                  }
                }}
              >
                <LogOut className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 overflow-auto">
          {renderPage()}
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
