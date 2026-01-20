// ============================================================
// DASHBOARD PAGE
// ============================================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../lib/api';
import { useAuth } from '../lib/auth';
import {
  Users,
  Calendar,
  Clock,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  XCircle,
  ArrowRight,
  Award,
  Briefcase,
} from 'lucide-react';
import DemandForecast from '../components/DemandForecast';

export default function Dashboard() {
  const { user, isManager } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const result = await dashboardApi.get();
      setData(result);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-momentum-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.firstName}
        </h1>
        <p className="text-slate-600">
          Here's what's happening today
        </p>
      </div>

      {isManager ? (
        // Manager/Admin Dashboard
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Calendar}
              label="Today's Shifts"
              value={data?.today?.shifts?.total || 0}
              subValue={`${data?.today?.shifts?.filled || 0} filled`}
              color="blue"
            />
            <StatCard
              icon={Users}
              label="Active Employees"
              value={data?.activeEmployees || 0}
              color="green"
            />
            <StatCard
              icon={AlertCircle}
              label="Open Shifts"
              value={data?.openShifts || 0}
              color="orange"
              alert={data?.openShifts > 0}
            />
            <StatCard
              icon={Clock}
              label="Pending Approvals"
              value={data?.pendingApprovals?.timesheets + data?.pendingApprovals?.time_off || 0}
              color="purple"
              alert={(data?.pendingApprovals?.timesheets || 0) > 0}
            />
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Approvals */}
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Pending Approvals</h2>
                <Link to="/time-tracking" className="text-sm text-momentum-500 hover:text-momentum-600 flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="card-body space-y-3">
                {data?.pendingApprovals && (
                  <>
                    <ApprovalItem
                      label="Timesheet Entries"
                      count={data.pendingApprovals.timesheets || 0}
                      href="/time-tracking"
                    />
                    <ApprovalItem
                      label="Time Off Requests"
                      count={data.pendingApprovals.time_off || 0}
                      href="/time-off"
                    />
                    <ApprovalItem
                      label="Shift Swaps"
                      count={data.pendingApprovals.swaps || 0}
                      href="/schedule"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Week Summary */}
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold text-slate-900">This Week</h2>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {parseFloat(data?.weekMetrics?.scheduled || 0).toFixed(0)}h
                    </p>
                    <p className="text-sm text-slate-500">Hours Scheduled</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {parseFloat(data?.weekMetrics?.worked || 0).toFixed(0)}h
                    </p>
                    <p className="text-sm text-slate-500">Hours Worked</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      £{parseFloat(data?.weekMetrics?.cost_scheduled || 0).toFixed(0)}
                    </p>
                    <p className="text-sm text-slate-500">Scheduled Cost</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      £{parseFloat(data?.weekMetrics?.cost_actual || 0).toFixed(0)}
                    </p>
                    <p className="text-sm text-slate-500">Actual Cost</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Demand Forecast */}
          <DemandForecast compact />

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h2 className="font-semibold text-slate-900">Quick Actions</h2>
            </div>
            <div className="card-body">
              <div className="flex flex-wrap gap-3">
                <Link to="/schedule" className="btn btn-primary">
                  <Calendar className="w-4 h-4" />
                  Create Schedule
                </Link>
                <Link to="/employees" className="btn btn-secondary">
                  <Users className="w-4 h-4" />
                  Add Employee
                </Link>
                <Link to="/skills" className="btn btn-secondary">
                  <Award className="w-4 h-4" />
                  Manage Skills
                </Link>
                <Link to="/jobs" className="btn btn-secondary">
                  <Briefcase className="w-4 h-4" />
                  Post Job
                </Link>
                <Link to="/reports" className="btn btn-secondary">
                  <TrendingUp className="w-4 h-4" />
                  View Reports
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        // Worker Dashboard
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Your Upcoming Shifts</h2>
                <Link to="/schedule" className="text-sm text-momentum-500 hover:text-momentum-600">
                  View all
                </Link>
              </div>
              <div className="card-body">
                {data?.upcomingShifts?.length > 0 ? (
                  <div className="space-y-3">
                    {data.upcomingShifts.map((shift) => (
                      <div key={shift.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-900">
                            {new Date(shift.date).toLocaleDateString('en-GB', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-sm text-slate-600">
                            {new Date(shift.start_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} - 
                            {new Date(shift.end_time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">{shift.location_name}</p>
                          <span className={`badge ${shift.status === 'confirmed' ? 'badge-success' : 'badge-info'}`}>
                            {shift.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No upcoming shifts</p>
                )}
              </div>
            </div>

            {/* Career Opportunities Card */}
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Career Opportunities</h2>
                <Link to="/career" className="text-sm text-momentum-500 hover:text-momentum-600">
                  View all
                </Link>
              </div>
              <div className="card-body">
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-momentum-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-momentum-600" />
                  </div>
                  <h3 className="font-medium text-slate-900 mb-1">Grow Your Career</h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Track your skills and discover internal opportunities
                  </p>
                  <Link to="/career" className="btn btn-primary">
                    <Award className="w-4 h-4" />
                    View My Career
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Time Off Balance */}
          {data?.timeOffBalance?.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold text-slate-900">Time Off Balance</h2>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {data.timeOffBalance.map((balance) => (
                    <div key={balance.id} className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-2xl font-bold text-slate-900">
                        {(balance.entitlement || 0) + (balance.carried_over || 0) - (balance.used || 0) - (balance.pending || 0)}
                      </p>
                      <p className="text-sm text-slate-500">{balance.name} Available</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, subValue, color, alert }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className={`stat-card ${alert ? 'ring-2 ring-orange-200' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="stat-value">{value}</p>
          <p className="stat-label">{label}</p>
          {subValue && <p className="text-xs text-slate-400">{subValue}</p>}
        </div>
      </div>
    </div>
  );
}

function ApprovalItem({ label, count, href }) {
  return (
    <Link 
      to={href}
      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
    >
      <span className="text-slate-700">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`badge ${count > 0 ? 'badge-warning' : 'badge-neutral'}`}>
          {count}
        </span>
        <ArrowRight className="w-4 h-4 text-slate-400" />
      </div>
    </Link>
  );
}
