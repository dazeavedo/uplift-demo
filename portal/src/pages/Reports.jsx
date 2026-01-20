// ============================================================
// REPORTS PAGE
// Analytics and reporting
// ============================================================

import { useState, useEffect } from 'react';
import { reportsApi, locationsApi } from '../lib/api';
import { 
  BarChart3, 
  Download,
  Calendar,
  Users,
  Clock,
  DollarSign,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

const REPORTS = [
  { id: 'hours', name: 'Hours Worked', icon: Clock, description: 'Employee hours by period' },
  { id: 'attendance', name: 'Attendance', icon: Users, description: 'Attendance and punctuality' },
  { id: 'labor-cost', name: 'Labor Cost', icon: DollarSign, description: 'Labor costs over time' },
  { id: 'coverage', name: 'Schedule Coverage', icon: Calendar, description: 'Shift fill rates' },
];

export default function Reports() {
  const [activeReport, setActiveReport] = useState('hours');
  const [data, setData] = useState(null);
  const [totals, setTotals] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    locationId: '',
    groupBy: 'employee',
  });

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    loadReport();
  }, [activeReport, filters]);

  const loadLocations = async () => {
    try {
      const result = await locationsApi.list();
      setLocations(result.locations);
    } catch (error) {
      console.error('Failed to load locations:', error);
    }
  };

  const loadReport = async () => {
    setLoading(true);
    try {
      let result;
      switch (activeReport) {
        case 'hours':
          result = await reportsApi.hours(filters);
          break;
        case 'attendance':
          result = await reportsApi.attendance(filters);
          break;
        case 'labor-cost':
          result = await reportsApi.laborCost(filters);
          break;
        case 'coverage':
          result = await reportsApi.coverage(filters);
          break;
      }
      setData(result?.data || []);
      setTotals(result?.totals || null);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    let url;
    if (activeReport === 'hours') {
      url = reportsApi.exportTimesheets(filters);
    } else {
      url = reportsApi.exportEmployees({ format: 'csv' });
    }
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="text-slate-600">Analytics and insights</p>
        </div>
        <button onClick={handleExport} className="btn btn-secondary">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Report Type Selector */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {REPORTS.map((report) => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            className={`card p-4 text-left hover:shadow-md transition-all ${
              activeReport === report.id ? 'ring-2 ring-momentum-500 bg-momentum-50' : ''
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activeReport === report.id 
                  ? 'bg-momentum-500 text-white' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                <report.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900">{report.name}</p>
                <p className="text-xs text-slate-500">{report.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-4">
        <div>
          <label className="label">Start Date</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="label">End Date</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="label">Location</label>
          <select
            value={filters.locationId}
            onChange={(e) => setFilters({ ...filters, locationId: e.target.value })}
            className="input"
          >
            <option value="">All Locations</option>
            {locations.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>
        </div>
        {activeReport === 'hours' && (
          <div>
            <label className="label">Group By</label>
            <select
              value={filters.groupBy}
              onChange={(e) => setFilters({ ...filters, groupBy: e.target.value })}
              className="input"
            >
              <option value="employee">Employee</option>
              <option value="location">Location</option>
              <option value="day">Day</option>
            </select>
          </div>
        )}
      </div>

      {/* Totals */}
      {totals && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {totals.total_hours !== undefined && (
            <div className="stat-card">
              <p className="stat-value">{parseFloat(totals.total_hours || 0).toFixed(1)}h</p>
              <p className="stat-label">Total Hours</p>
            </div>
          )}
          {totals.regular_hours !== undefined && (
            <div className="stat-card">
              <p className="stat-value">{parseFloat(totals.regular_hours || 0).toFixed(1)}h</p>
              <p className="stat-label">Regular Hours</p>
            </div>
          )}
          {totals.overtime_hours !== undefined && (
            <div className="stat-card">
              <p className="stat-value">{parseFloat(totals.overtime_hours || 0).toFixed(1)}h</p>
              <p className="stat-label">Overtime Hours</p>
            </div>
          )}
          {totals.employee_count !== undefined && (
            <div className="stat-card">
              <p className="stat-value">{totals.employee_count}</p>
              <p className="stat-label">Employees</p>
            </div>
          )}
        </div>
      )}

      {/* Report Data */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-momentum-500" />
          </div>
        ) : data?.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No data for selected period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {activeReport === 'hours' && <HoursTable data={data} groupBy={filters.groupBy} />}
            {activeReport === 'attendance' && <AttendanceTable data={data} />}
            {activeReport === 'labor-cost' && <LaborCostTable data={data} />}
            {activeReport === 'coverage' && <CoverageTable data={data} />}
          </div>
        )}
      </div>
    </div>
  );
}

function HoursTable({ data, groupBy }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>{groupBy === 'employee' ? 'Employee' : groupBy === 'location' ? 'Location' : 'Date'}</th>
          <th className="text-right">Total Hours</th>
          <th className="text-right">Regular</th>
          <th className="text-right">Overtime</th>
          {groupBy === 'employee' && <th className="text-right">Labor Cost</th>}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((row, i) => (
          <tr key={i}>
            <td className="font-medium">
              {groupBy === 'employee' 
                ? `${row.first_name} ${row.last_name}`
                : groupBy === 'location'
                ? row.location_name
                : format(new Date(row.date), 'EEE, MMM d')}
            </td>
            <td className="text-right">{parseFloat(row.total_hours || 0).toFixed(1)}h</td>
            <td className="text-right">{parseFloat(row.regular_hours || 0).toFixed(1)}h</td>
            <td className="text-right">{parseFloat(row.overtime_hours || 0).toFixed(1)}h</td>
            {groupBy === 'employee' && (
              <td className="text-right font-medium">£{parseFloat(row.labor_cost || 0).toFixed(2)}</td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AttendanceTable({ data }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Employee</th>
          <th className="text-right">Scheduled</th>
          <th className="text-right">Worked</th>
          <th className="text-right">Missed</th>
          <th className="text-right">Late</th>
          <th className="text-right">Avg Arrival</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((row, i) => (
          <tr key={i}>
            <td className="font-medium">{row.first_name} {row.last_name}</td>
            <td className="text-right">{row.scheduled_shifts}</td>
            <td className="text-right">{row.worked_shifts}</td>
            <td className="text-right">
              <span className={row.missed_shifts > 0 ? 'text-red-600 font-medium' : ''}>
                {row.missed_shifts}
              </span>
            </td>
            <td className="text-right">
              <span className={row.late_arrivals > 0 ? 'text-orange-600' : ''}>
                {row.late_arrivals}
              </span>
            </td>
            <td className="text-right">
              {row.avg_arrival_diff_mins > 0 ? '+' : ''}{row.avg_arrival_diff_mins?.toFixed(0) || 0} min
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function LaborCostTable({ data }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Period</th>
          <th className="text-right">Employees</th>
          <th className="text-right">Hours</th>
          <th className="text-right">Regular Cost</th>
          <th className="text-right">Overtime Cost</th>
          <th className="text-right">Total Cost</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((row, i) => (
          <tr key={i}>
            <td className="font-medium">{format(new Date(row.period), 'MMM d, yyyy')}</td>
            <td className="text-right">{row.employee_count}</td>
            <td className="text-right">{parseFloat(row.total_hours || 0).toFixed(1)}h</td>
            <td className="text-right">£{parseFloat(row.regular_cost || 0).toFixed(2)}</td>
            <td className="text-right">£{parseFloat(row.overtime_cost || 0).toFixed(2)}</td>
            <td className="text-right font-medium">£{parseFloat(row.total_cost || 0).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CoverageTable({ data }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Location</th>
          <th className="text-right">Total Shifts</th>
          <th className="text-right">Filled</th>
          <th className="text-right">Open</th>
          <th className="text-right">Fill Rate</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {data.map((row, i) => (
          <tr key={i}>
            <td className="font-medium">{format(new Date(row.date), 'EEE, MMM d')}</td>
            <td>{row.location_name}</td>
            <td className="text-right">{row.total_shifts}</td>
            <td className="text-right">{row.filled_shifts}</td>
            <td className="text-right">
              <span className={row.open_shifts > 0 ? 'text-orange-600' : ''}>
                {row.open_shifts}
              </span>
            </td>
            <td className="text-right">
              <span className={`font-medium ${
                row.fill_rate >= 90 ? 'text-green-600' :
                row.fill_rate >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {row.fill_rate || 0}%
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
