// ============================================================
// TIME OFF PAGE
// Leave request management
// ============================================================

import { useState, useEffect } from 'react';
import { timeOffApi } from '../lib/api';
import { 
  Umbrella, 
  Check, 
  X, 
  Calendar,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

export default function TimeOff() {
  const [requests, setRequests] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqResult, polResult] = await Promise.all([
        timeOffApi.getRequests({ status: tab === 'all' ? undefined : tab }),
        timeOffApi.getPolicies(),
      ]);
      setRequests(reqResult.requests);
      setPolicies(polResult.policies);
    } catch (error) {
      console.error('Failed to load time off data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await timeOffApi.approve(id);
      await loadData();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (id) => {
    const notes = prompt('Reason for rejection (optional):');
    if (notes !== null) {
      try {
        await timeOffApi.reject(id, notes);
        await loadData();
      } catch (error) {
        console.error('Failed to reject:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Time Off</h1>
          <p className="text-slate-600">Manage leave requests</p>
        </div>
      </div>

      {/* Policy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {policies.map((policy) => (
          <div key={policy.id} className="card p-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: policy.color ? `${policy.color}20` : '#F2652220' }}
              >
                <Umbrella 
                  className="w-5 h-5" 
                  style={{ color: policy.color || '#F26522' }}
                />
              </div>
              <div>
                <p className="font-medium text-slate-900">{policy.name}</p>
                <p className="text-sm text-slate-500">
                  {policy.accrual_amount ? `${policy.accrual_amount} days/year` : 'As needed'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {[
          { id: 'pending', label: 'Pending' },
          { id: 'approved', label: 'Approved' },
          { id: 'rejected', label: 'Rejected' },
          { id: 'all', label: 'All' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-momentum-500" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No time off requests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                  {tab === 'pending' && <th className="w-24">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-momentum-100 text-momentum-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {request.first_name?.[0]}{request.last_name?.[0]}
                        </div>
                        <span className="font-medium">{request.first_name} {request.last_name}</span>
                      </div>
                    </td>
                    <td>
                      <span 
                        className="badge"
                        style={{ 
                          backgroundColor: request.color ? `${request.color}20` : '#F2652220',
                          color: request.color || '#F26522',
                        }}
                      >
                        {request.policy_name}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">
                          {format(parseISO(request.start_date), 'MMM d')} - {format(parseISO(request.end_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="font-medium">{request.total_days} day{request.total_days !== 1 ? 's' : ''}</span>
                    </td>
                    <td>
                      <p className="text-sm text-slate-600 truncate max-w-[200px]">
                        {request.reason || '-'}
                      </p>
                    </td>
                    <td>
                      <StatusBadge status={request.status} />
                    </td>
                    {tab === 'pending' && (
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'badge-warning',
    approved: 'badge-success',
    rejected: 'badge-danger',
    cancelled: 'badge-neutral',
  };

  return (
    <span className={`badge ${styles[status] || 'badge-neutral'}`}>
      {status}
    </span>
  );
}
