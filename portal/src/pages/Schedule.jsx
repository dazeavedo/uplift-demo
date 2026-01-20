// ============================================================
// SCHEDULE PAGE
// Weekly schedule grid with shift swaps and open shift claims
// ============================================================

import { useState, useEffect, useMemo } from 'react';
import { api, shiftsApi, employeesApi, locationsApi } from '../lib/api';
import { useAuth } from '../lib/auth';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar, Users, MapPin, Clock, X, Check,
  RefreshCw, Hand, ArrowLeftRight, AlertCircle, Filter, MoreVertical,
  Copy, Trash, UserPlus, CheckCircle, XCircle,
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, addDays, parseISO, isSameDay } from 'date-fns';

export default function Schedule() {
  const { user, isManager } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [shifts, setShifts] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [activeTab, setActiveTab] = useState('schedule');
  const [swaps, setSwaps] = useState([]);
  const [openShifts, setOpenShifts] = useState([]);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedShiftForSwap, setSelectedShiftForSwap] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedOpenShift, setSelectedOpenShift] = useState(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = useMemo(() => [...Array(7)].map((_, i) => addDays(weekStart, i)), [weekStart]);

  useEffect(() => { loadData(); }, [weekStart, selectedLocation, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [shiftsResult, empResult, locResult] = await Promise.all([
        shiftsApi.list({ startDate: format(weekStart, 'yyyy-MM-dd'), endDate: format(weekEnd, 'yyyy-MM-dd'), locationId: selectedLocation || undefined }),
        employeesApi.list({ status: 'active', limit: 100 }),
        locationsApi.list(),
      ]);
      setShifts(shiftsResult.shifts || []);
      setEmployees(empResult.employees || []);
      setLocations(locResult.locations || []);
      const swapsResult = await api.get('/shift-swaps?status=pending');
      setSwaps(swapsResult.swaps || []);
      const openResult = await api.get('/open-shifts');
      setOpenShifts(openResult.shifts || []);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const getShiftsForDay = (date) => shifts.filter(s => isSameDay(parseISO(s.date), date));

  const handleCreateShift = async (shiftData) => {
    try {
      await shiftsApi.create(shiftData);
      await loadData();
      setShowAddModal(false);
      setSelectedSlot(null);
    } catch (error) { console.error('Failed to create shift:', error); }
  };

  const handleSwapAction = async (swapId, action, reason = '') => {
    try {
      await api.put(`/shift-swaps/${swapId}/${action}`, { reason });
      await loadData();
    } catch (error) { console.error(`Failed to ${action} swap:`, error); }
  };

  const handleClaimShift = async (shiftId) => {
    try {
      await api.post(`/open-shifts/${shiftId}/apply`);
      await loadData();
      setShowClaimModal(false);
    } catch (error) { alert(error.message || 'Failed to claim shift'); }
  };

  const handleAssignShift = async (shiftId, employeeId) => {
    try {
      await api.post(`/open-shifts/${shiftId}/assign`, { employeeId });
      await loadData();
    } catch (error) { console.error('Failed to assign shift:', error); }
  };

  const pendingSwapsCount = swaps.filter(s => s.status === 'pending').length;
  const openShiftsCount = openShifts.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule</h1>
          <p className="text-slate-600">{format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</p>
        </div>
        {isManager && <button onClick={() => setShowAddModal(true)} className="btn btn-primary"><Plus className="w-4 h-4" />Add Shift</button>}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <TabButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={Calendar} label="Schedule" />
        <TabButton active={activeTab === 'swaps'} onClick={() => setActiveTab('swaps')} icon={ArrowLeftRight} label="Shift Swaps" badge={pendingSwapsCount} />
        <TabButton active={activeTab === 'open'} onClick={() => setActiveTab('open')} icon={Hand} label="Open Shifts" badge={openShiftsCount} badgeColor="green" />
      </div>

      {activeTab === 'schedule' && (
        <>
          <div className="card p-4 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="btn btn-ghost p-2"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => setCurrentDate(new Date())} className="btn btn-secondary">Today</button>
              <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="btn btn-ghost p-2"><ChevronRight className="w-5 h-5" /></button>
            </div>
            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="input w-auto">
              <option value="">All Locations</option>
              {locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
            <div className="flex-1" />
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-momentum-500" />Filled</span>
              <span className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-orange-500" />Open</span>
            </div>
          </div>

          <div className="card overflow-hidden">
            {loading ? <ScheduleSkeleton /> : (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-8 border-b border-slate-200">
                    <div className="p-3 bg-slate-50 border-r border-slate-200"><span className="text-sm font-semibold text-slate-500">Employee</span></div>
                    {weekDays.map((day) => (
                      <div key={day.toISOString()} className={`p-3 text-center border-r border-slate-200 last:border-r-0 ${isSameDay(day, new Date()) ? 'bg-momentum-50' : 'bg-slate-50'}`}>
                        <p className="text-xs text-slate-500">{format(day, 'EEE')}</p>
                        <p className={`text-lg font-semibold ${isSameDay(day, new Date()) ? 'text-momentum-600' : 'text-slate-900'}`}>{format(day, 'd')}</p>
                      </div>
                    ))}
                  </div>
                  {employees.slice(0, 15).map((employee) => (
                    <div key={employee.id} className="grid grid-cols-8 border-b border-slate-100 last:border-b-0">
                      <div className="p-3 border-r border-slate-100 flex items-center gap-2">
                        <div className="w-8 h-8 bg-momentum-100 text-momentum-600 rounded-full flex items-center justify-center text-sm font-medium">{employee.first_name?.[0]}{employee.last_name?.[0]}</div>
                        <span className="text-sm font-medium text-slate-900 truncate">{employee.first_name} {employee.last_name}</span>
                      </div>
                      {weekDays.map((day) => {
                        const dayShifts = getShiftsForDay(day).filter(s => s.employee_id === employee.id);
                        return (
                          <div key={day.toISOString()} className={`p-1 border-r border-slate-100 last:border-r-0 min-h-[60px] cursor-pointer hover:bg-slate-50 ${isSameDay(day, new Date()) ? 'bg-momentum-50/30' : ''}`} onClick={() => { if (isManager) { setSelectedSlot({ date: day, employeeId: employee.id }); setShowAddModal(true); }}}>
                            {dayShifts.map((shift) => (
                              <ShiftCard key={shift.id} shift={shift} onSwapRequest={() => { setSelectedShiftForSwap(shift); setShowSwapModal(true); }} />
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <div className="grid grid-cols-8 border-t-2 border-slate-200 bg-orange-50/30">
                    <div className="p-3 border-r border-slate-200 flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center"><Users className="w-4 h-4" /></div>
                      <span className="text-sm font-medium text-slate-700">Open Shifts</span>
                    </div>
                    {weekDays.map((day) => {
                      const dayOpenShifts = getShiftsForDay(day).filter(s => s.is_open && !s.employee_id);
                      return (
                        <div key={day.toISOString()} className="p-1 border-r border-slate-200 last:border-r-0 min-h-[60px]">
                          {dayOpenShifts.map((shift) => (
                            <div key={shift.id} onClick={() => { setSelectedOpenShift(shift); setShowClaimModal(true); }} className="p-1.5 rounded text-xs bg-orange-100 text-orange-800 border border-orange-200 cursor-pointer hover:bg-orange-200 mb-1">
                              <p className="font-medium">{format(parseISO(shift.start_time), 'HH:mm')} - {format(parseISO(shift.end_time), 'HH:mm')}</p>
                              <p className="truncate opacity-75">{shift.location_name}</p>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'swaps' && <ShiftSwapsTab swaps={swaps} isManager={isManager} onAction={handleSwapAction} loading={loading} />}
      {activeTab === 'open' && <OpenShiftsTab shifts={openShifts} employees={employees} isManager={isManager} onClaim={handleClaimShift} onAssign={handleAssignShift} loading={loading} />}

      {showAddModal && <AddShiftModal onClose={() => { setShowAddModal(false); setSelectedSlot(null); }} onSubmit={handleCreateShift} employees={employees} locations={locations} defaultDate={selectedSlot?.date} defaultEmployeeId={selectedSlot?.employeeId} />}
      {showSwapModal && selectedShiftForSwap && <SwapRequestModal shift={selectedShiftForSwap} employees={employees} onClose={() => { setShowSwapModal(false); setSelectedShiftForSwap(null); }} onSubmit={async (data) => { try { await api.post('/shift-swaps', data); await loadData(); setShowSwapModal(false); setSelectedShiftForSwap(null); } catch (error) { alert(error.message || 'Failed to request swap'); }}} />}
      {showClaimModal && selectedOpenShift && <ClaimShiftModal shift={selectedOpenShift} employees={employees} isManager={isManager} onClose={() => { setShowClaimModal(false); setSelectedOpenShift(null); }} onClaim={() => handleClaimShift(selectedOpenShift.id)} onAssign={(employeeId) => { handleAssignShift(selectedOpenShift.id, employeeId); setShowClaimModal(false); }} />}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, badge, badgeColor = 'orange' }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${active ? 'border-momentum-500 text-momentum-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
      <Icon className="w-4 h-4" />{label}
      {badge > 0 && <span className={`px-2 py-0.5 ${badgeColor === 'green' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'} text-xs rounded-full`}>{badge}</span>}
    </button>
  );
}

function ShiftCard({ shift, onSwapRequest }) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className={`p-1.5 rounded text-xs relative group mb-1 ${shift.is_open ? 'bg-orange-100 text-orange-800 border border-orange-200' : 'bg-momentum-100 text-momentum-800 border border-momentum-200'}`}>
      <p className="font-medium">{format(parseISO(shift.start_time), 'HH:mm')} - {format(parseISO(shift.end_time), 'HH:mm')}</p>
      {shift.location_name && <p className="truncate opacity-75">{shift.location_name}</p>}
      <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="absolute top-1 right-1 p-0.5 opacity-0 group-hover:opacity-100 hover:bg-white/50 rounded"><MoreVertical className="w-3 h-3" /></button>
      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 w-36">
            <button onClick={(e) => { e.stopPropagation(); onSwapRequest(); setShowMenu(false); }} className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 flex items-center gap-2"><ArrowLeftRight className="w-3 h-3" />Request Swap</button>
            <button onClick={(e) => { e.stopPropagation(); onSwapRequest(); setShowMenu(false); }} className="w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 flex items-center gap-2"><Hand className="w-3 h-3" />Give Away</button>
          </div>
        </>
      )}
    </div>
  );
}

function ShiftSwapsTab({ swaps, isManager, onAction, loading }) {
  if (loading) return <ListSkeleton count={3} />;
  if (swaps.length === 0) return <div className="card p-12 text-center"><ArrowLeftRight className="w-12 h-12 text-slate-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-slate-900">No pending swap requests</h3><p className="text-slate-500 mt-1">Swap requests will appear here</p></div>;
  return (
    <div className="space-y-4">
      {swaps.map(swap => (
        <div key={swap.id} className="card p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-momentum-100 text-momentum-600 rounded-full flex items-center justify-center font-medium mx-auto">{swap.from_employee_name?.[0]}{swap.from_employee_last?.[0]}</div>
                <p className="text-sm font-medium mt-1">{swap.from_employee_name}</p>
                <p className="text-xs text-slate-500">{swap.from_shift_date && format(parseISO(swap.from_shift_date), 'MMM d')}</p>
                <p className="text-xs text-slate-500">{swap.from_shift_start && format(parseISO(swap.from_shift_start), 'HH:mm')} - {swap.from_shift_end && format(parseISO(swap.from_shift_end), 'HH:mm')}</p>
              </div>
              <div className="pt-4"><ArrowLeftRight className="w-5 h-5 text-slate-400" /></div>
              {swap.type === 'swap' && swap.to_employee_id ? (
                <div className="text-center">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium mx-auto">{swap.to_employee_name?.[0]}{swap.to_employee_last?.[0]}</div>
                  <p className="text-sm font-medium mt-1">{swap.to_employee_name}</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto"><Hand className="w-5 h-5" /></div>
                  <p className="text-sm font-medium mt-1">Give Away</p>
                </div>
              )}
            </div>
            <div className="text-right">
              <span className={`badge ${swap.status === 'pending' ? 'badge-warning' : swap.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>{swap.status}</span>
              {isManager && swap.status === 'pending' && (
                <div className="mt-3 flex gap-2">
                  <button onClick={() => onAction(swap.id, 'approve')} className="btn btn-primary text-sm py-1 px-3"><Check className="w-3 h-3" />Approve</button>
                  <button onClick={() => onAction(swap.id, 'reject')} className="btn btn-secondary text-sm py-1 px-3"><X className="w-3 h-3" />Reject</button>
                </div>
              )}
            </div>
          </div>
          {swap.reason && <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-2 rounded"><span className="font-medium">Reason:</span> {swap.reason}</p>}
        </div>
      ))}
    </div>
  );
}

function OpenShiftsTab({ shifts, employees, isManager, onClaim, onAssign, loading }) {
  const [selectedShift, setSelectedShift] = useState(null);
  if (loading) return <ListSkeleton count={3} />;
  if (shifts.length === 0) return <div className="card p-12 text-center"><Hand className="w-12 h-12 text-slate-300 mx-auto mb-4" /><h3 className="text-lg font-medium text-slate-900">No open shifts available</h3><p className="text-slate-500 mt-1">Open shifts will appear here</p></div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {shifts.map(shift => (
        <div key={shift.id} className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-slate-900">{shift.date && format(parseISO(shift.date), 'EEEE, MMM d')}</p>
              <p className="text-lg font-bold text-momentum-600">{shift.start_time && format(parseISO(shift.start_time), 'HH:mm')} - {shift.end_time && format(parseISO(shift.end_time), 'HH:mm')}</p>
            </div>
            <span className="badge badge-success">Open</span>
          </div>
          <div className="space-y-2 text-sm text-slate-600 mb-4">
            {shift.location_name && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{shift.location_name}</div>}
          </div>
          {isManager ? (
            <button onClick={() => setSelectedShift(shift)} className="btn btn-primary w-full text-sm"><UserPlus className="w-4 h-4" />Assign</button>
          ) : (
            <button onClick={() => onClaim(shift.id)} className="btn btn-primary w-full"><Hand className="w-4 h-4" />Claim Shift</button>
          )}
        </div>
      ))}
      {selectedShift && <AssignModal shift={selectedShift} employees={employees} onClose={() => setSelectedShift(null)} onAssign={(empId) => { onAssign(selectedShift.id, empId); setSelectedShift(null); }} />}
    </div>
  );
}

function AddShiftModal({ onClose, onSubmit, employees, locations, defaultDate, defaultEmployeeId }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ date: defaultDate ? format(defaultDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'), startTime: '09:00', endTime: '17:00', breakMinutes: 30, locationId: locations[0]?.id || '', employeeId: defaultEmployeeId || '', isOpen: false });
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); const startTime = new Date(`${formData.date}T${formData.startTime}`); const endTime = new Date(`${formData.date}T${formData.endTime}`); await onSubmit({ ...formData, startTime: startTime.toISOString(), endTime: endTime.toISOString(), employeeId: formData.isOpen ? null : formData.employeeId }); setLoading(false); };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Add Shift</h2><button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5 text-slate-400" /></button></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="label">Date</label><input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="input" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Start</label><input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="input" required /></div>
            <div><label className="label">End</label><input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="input" required /></div>
          </div>
          <div><label className="label">Location</label><select value={formData.locationId} onChange={(e) => setFormData({ ...formData, locationId: e.target.value })} className="input" required>{locations.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}</select></div>
          <div className="flex items-center gap-2"><input type="checkbox" id="isOpen" checked={formData.isOpen} onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })} className="rounded border-slate-300" /><label htmlFor="isOpen" className="text-sm text-slate-700">Open shift</label></div>
          {!formData.isOpen && <div><label className="label">Assign To</label><select value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} className="input"><option value="">Select...</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}</select></div>}
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button><button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Creating...' : 'Create'}</button></div>
        </form>
      </div>
    </div>
  );
}

function SwapRequestModal({ shift, employees, onClose, onSubmit }) {
  const [type, setType] = useState('swap');
  const [toEmployeeId, setToEmployeeId] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); await onSubmit({ fromShiftId: shift.id, type, toEmployeeId: type === 'swap' ? toEmployeeId : null, reason }); setLoading(false); };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Request Shift Change</h2><button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5 text-slate-400" /></button></div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 rounded-lg"><p className="text-sm text-slate-500">Your Shift</p><p className="font-medium">{shift.date && format(parseISO(shift.date), 'EEEE, MMM d')}</p><p className="text-momentum-600">{shift.start_time && format(parseISO(shift.start_time), 'HH:mm')} - {shift.end_time && format(parseISO(shift.end_time), 'HH:mm')}</p></div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setType('swap')} className={`flex-1 p-3 rounded-lg border-2 text-center ${type === 'swap' ? 'border-momentum-500 bg-momentum-50' : 'border-slate-200'}`}><ArrowLeftRight className={`w-5 h-5 mx-auto mb-1 ${type === 'swap' ? 'text-momentum-600' : 'text-slate-400'}`} /><p className="font-medium text-sm">Swap</p></button>
            <button type="button" onClick={() => setType('giveaway')} className={`flex-1 p-3 rounded-lg border-2 text-center ${type === 'giveaway' ? 'border-momentum-500 bg-momentum-50' : 'border-slate-200'}`}><Hand className={`w-5 h-5 mx-auto mb-1 ${type === 'giveaway' ? 'text-momentum-600' : 'text-slate-400'}`} /><p className="font-medium text-sm">Give Away</p></button>
          </div>
          {type === 'swap' && <div><label className="label">Swap With</label><select value={toEmployeeId} onChange={(e) => setToEmployeeId(e.target.value)} className="input" required><option value="">Select coworker...</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}</select></div>}
          <div><label className="label">Reason</label><textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className="input" placeholder="Why do you need this change?" /></div>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button><button type="submit" disabled={loading} className="btn btn-primary">{loading ? 'Submitting...' : 'Submit'}</button></div>
        </form>
      </div>
    </div>
  );
}

function ClaimShiftModal({ shift, employees, isManager, onClose, onClaim, onAssign }) {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">{isManager ? 'Assign Shift' : 'Claim Shift'}</h2><button onClick={onClose} className="p-1 hover:bg-slate-100 rounded"><X className="w-5 h-5 text-slate-400" /></button></div>
        <div className="p-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg"><p className="font-semibold text-lg">{shift.date && format(parseISO(shift.date), 'EEEE, MMM d')}</p><p className="text-2xl font-bold text-momentum-600">{shift.start_time && format(parseISO(shift.start_time), 'HH:mm')} - {shift.end_time && format(parseISO(shift.end_time), 'HH:mm')}</p><div className="flex items-center gap-2 mt-2 text-slate-600"><MapPin className="w-4 h-4" />{shift.location_name}</div></div>
          {isManager ? (
            <><select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="input"><option value="">Select employee...</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}</select><div className="flex justify-end gap-3"><button onClick={onClose} className="btn btn-secondary">Cancel</button><button onClick={() => onAssign(selectedEmployee)} disabled={!selectedEmployee} className="btn btn-primary">Assign</button></div></>
          ) : (
            <div className="flex justify-end gap-3"><button onClick={onClose} className="btn btn-secondary">Cancel</button><button onClick={onClaim} className="btn btn-primary"><Hand className="w-4 h-4" />Claim This Shift</button></div>
          )}
        </div>
      </div>
    </div>
  );
}

function AssignModal({ shift, employees, onClose, onAssign }) {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">Assign Shift</h2>
        <div className="p-3 bg-slate-50 rounded-lg mb-4"><p className="font-medium">{shift.date && format(parseISO(shift.date), 'EEEE, MMM d')}</p><p className="text-momentum-600">{shift.start_time && format(parseISO(shift.start_time), 'HH:mm')} - {shift.end_time && format(parseISO(shift.end_time), 'HH:mm')}</p></div>
        <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} className="input mb-4"><option value="">Select employee...</option>{employees.map((e) => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}</select>
        <div className="flex justify-end gap-3"><button onClick={onClose} className="btn btn-secondary">Cancel</button><button onClick={() => onAssign(selectedEmployee)} disabled={!selectedEmployee} className="btn btn-primary">Assign</button></div>
      </div>
    </div>
  );
}

function ScheduleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-8 border-b border-slate-200">
        <div className="p-3 bg-slate-50 border-r"><div className="h-4 bg-slate-200 rounded w-20" /></div>
        {[...Array(7)].map((_, i) => <div key={i} className="p-3 bg-slate-50 border-r last:border-r-0"><div className="h-3 bg-slate-200 rounded w-8 mx-auto mb-1" /><div className="h-6 bg-slate-200 rounded w-6 mx-auto" /></div>)}
      </div>
      {[...Array(5)].map((_, i) => <div key={i} className="grid grid-cols-8 border-b border-slate-100"><div className="p-3 border-r flex items-center gap-2"><div className="w-8 h-8 bg-slate-200 rounded-full" /><div className="h-4 bg-slate-200 rounded w-24" /></div>{[...Array(7)].map((_, j) => <div key={j} className="p-2 border-r last:border-r-0 min-h-[60px]">{Math.random() > 0.7 && <div className="h-10 bg-slate-100 rounded" />}</div>)}</div>)}
    </div>
  );
}

function ListSkeleton({ count = 3 }) {
  return <div className="space-y-4">{[...Array(count)].map((_, i) => <div key={i} className="card p-4 animate-pulse"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-slate-200 rounded-full" /><div className="flex-1"><div className="h-4 bg-slate-200 rounded w-32 mb-2" /><div className="h-3 bg-slate-200 rounded w-48" /></div><div className="h-6 bg-slate-200 rounded w-20" /></div></div>)}</div>;
}
