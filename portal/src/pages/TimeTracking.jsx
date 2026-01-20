// ============================================================
// TIME TRACKING PAGE
// Timesheet approval, clock in/out with geofence feedback
// ============================================================

import { useState, useEffect } from 'react';
import { api, timeApi, locationsApi } from '../lib/api';
import { useAuth } from '../lib/auth';
import { 
  Clock, Check, X, Filter, Download, AlertCircle, CheckCircle, XCircle,
  MapPin, Navigation, Wifi, WifiOff, Play, Square, Coffee, Timer,
} from 'lucide-react';
import { format, parseISO, differenceInMinutes } from 'date-fns';

export default function TimeTracking() {
  const { user, isManager } = useAuth();
  const [entries, setEntries] = useState([]);
  const [pendingEntries, setPendingEntries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState(isManager ? 'pending' : 'clock');
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [filters, setFilters] = useState({
    locationId: '',
    startDate: format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    endDate: format(new Date(), 'yyyy-MM-dd'),
  });

  // Clock state
  const [currentEntry, setCurrentEntry] = useState(null);
  const [clockingIn, setClockingIn] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestLocation, setNearestLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    loadData();
    if (tab === 'clock') {
      getUserLocation();
    }
  }, [tab, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [locResult] = await Promise.all([locationsApi.list()]);
      setLocations(locResult.locations);

      if (tab === 'pending' && isManager) {
        const result = await timeApi.getPending({ locationId: filters.locationId || undefined });
        setPendingEntries(result.entries || []);
      } else if (tab === 'history') {
        const result = await timeApi.getEntries({ ...filters, status: 'all' });
        setEntries(result.entries || []);
      } else if (tab === 'clock') {
        const result = await api.get('/time/current');
        setCurrentEntry(result.entry || null);
      }
    } catch (error) {
      console.error('Failed to load time entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        setUserLocation(loc);
        setLocationError(null);
        findNearestLocation(loc);
      },
      (error) => {
        setLocationError(error.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const findNearestLocation = (userLoc) => {
    if (!locations.length) return;

    let nearest = null;
    let minDistance = Infinity;

    locations.forEach(loc => {
      if (loc.latitude && loc.longitude) {
        const dist = calculateDistance(
          userLoc.latitude, userLoc.longitude,
          parseFloat(loc.latitude), parseFloat(loc.longitude)
        );
        if (dist < minDistance) {
          minDistance = dist;
          nearest = { ...loc, distance: Math.round(dist) };
        }
      }
    });

    setNearestLocation(nearest);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleClockIn = async () => {
    setClockingIn(true);
    try {
      const result = await api.post('/time/clock-in', {
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
        locationId: nearestLocation?.id,
      });
      setCurrentEntry(result.entry);
    } catch (error) {
      alert(error.message || 'Failed to clock in');
    } finally {
      setClockingIn(false);
    }
  };

  const handleClockOut = async () => {
    if (!confirm('Are you sure you want to clock out?')) return;
    try {
      await api.post('/time/clock-out');
      setCurrentEntry(null);
      loadData();
    } catch (error) {
      alert(error.message || 'Failed to clock out');
    }
  };

  const handleApprove = async (id) => {
    try {
      await timeApi.approve(id);
      await loadData();
    } catch (error) {
      console.error('Failed to approve:', error);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejection:');
    if (reason !== null) {
      try {
        await timeApi.reject(id, reason);
        await loadData();
      } catch (error) {
        console.error('Failed to reject:', error);
      }
    }
  };

  const handleBulkApprove = async () => {
    if (selectedEntries.length === 0) return;
    try {
      await timeApi.bulkApprove(selectedEntries);
      setSelectedEntries([]);
      await loadData();
    } catch (error) {
      console.error('Failed to bulk approve:', error);
    }
  };

  const toggleSelectAll = () => {
    if (selectedEntries.length === pendingEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(pendingEntries.map(e => e.id));
    }
  };

  // Calculate worked time
  const workedMinutes = currentEntry 
    ? differenceInMinutes(new Date(), parseISO(currentEntry.clock_in))
    : 0;
  const workedHours = Math.floor(workedMinutes / 60);
  const workedMins = workedMinutes % 60;

  // Geofence status
  const isWithinGeofence = nearestLocation && nearestLocation.distance <= (nearestLocation.geofence_radius || 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Time Tracking</h1>
          <p className="text-slate-600">
            {isManager ? 'Review and approve timesheets' : 'Track your work hours'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {!isManager && (
          <TabButton id="clock" label="Clock In/Out" icon={Clock} active={tab === 'clock'} onClick={() => setTab('clock')} />
        )}
        {isManager && (
          <TabButton id="pending" label="Pending" icon={AlertCircle} active={tab === 'pending'} onClick={() => setTab('pending')} count={pendingEntries.length} />
        )}
        <TabButton id="history" label="History" icon={Timer} active={tab === 'history'} onClick={() => setTab('history')} />
      </div>

      {/* Clock In/Out Tab */}
      {tab === 'clock' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clock Card */}
          <div className="card p-8 text-center">
            {currentEntry ? (
              <>
                <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">Clocked In</span>
                </div>
                <div className="text-6xl font-bold text-slate-900 mb-2">
                  {workedHours}h {workedMins}m
                </div>
                <p className="text-slate-500 mb-2">
                  Since {format(parseISO(currentEntry.clock_in), 'HH:mm')}
                </p>
                {currentEntry.location_name && (
                  <p className="text-slate-500 flex items-center justify-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {currentEntry.location_name}
                  </p>
                )}
                <div className="flex gap-3 justify-center mt-6">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      if (confirm('Start your break now?')) {
                        alert('Break started! Remember to clock back in when you return.');
                      }
                    }}
                  >
                    <Coffee className="w-4 h-4" />
                    Start Break
                  </button>
                  <button onClick={handleClockOut} className="btn btn-danger">
                    <Square className="w-4 h-4" />
                    Clock Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-xl text-slate-500 mb-6">Not clocked in</p>
                <button 
                  onClick={handleClockIn}
                  disabled={clockingIn || !isWithinGeofence}
                  className="btn btn-primary text-lg px-8 py-3"
                >
                  {clockingIn ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Clocking In...
                    </span>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Clock In
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Location Card */}
          <div className="card p-6">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Location Status
            </h3>

            {locationError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
                <WifiOff className="w-5 h-5" />
                <div>
                  <p className="font-medium">Location unavailable</p>
                  <p className="text-sm">{locationError}</p>
                </div>
                <button onClick={getUserLocation} className="ml-auto btn btn-secondary text-sm">
                  Retry
                </button>
              </div>
            ) : !userLocation ? (
              <div className="p-4 bg-slate-50 rounded-lg flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-momentum-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-slate-600">Getting your location...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* User Location */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 text-slate-600 mb-1">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Your Location</span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Accuracy: ±{Math.round(userLocation.accuracy)}m
                  </p>
                </div>

                {/* Nearest Location */}
                {nearestLocation && (
                  <div className={`p-4 rounded-lg border-2 ${
                    isWithinGeofence 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-orange-50 border-orange-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">{nearestLocation.name}</span>
                      <span className={`badge ${isWithinGeofence ? 'badge-success' : 'badge-warning'}`}>
                        {nearestLocation.distance}m away
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{nearestLocation.address_line1}</p>
                    
                    {/* Geofence Indicator */}
                    <div className="mt-3 pt-3 border-t border-slate-200">
                      <div className="flex items-center gap-2">
                        {isWithinGeofence ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-green-700 font-medium">Within work zone</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            <span className="text-orange-700 font-medium">
                              Outside work zone ({nearestLocation.geofence_radius || 100}m radius)
                            </span>
                          </>
                        )}
                      </div>
                      
                      {/* Visual distance bar */}
                      <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${
                            isWithinGeofence ? 'bg-green-500' : 'bg-orange-500'
                          }`}
                          style={{ 
                            width: `${Math.min(100, (nearestLocation.distance / (nearestLocation.geofence_radius || 100)) * 100)}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {isWithinGeofence 
                          ? 'You can clock in from this location'
                          : `Move ${nearestLocation.distance - (nearestLocation.geofence_radius || 100)}m closer to clock in`
                        }
                      </p>
                    </div>
                  </div>
                )}

                <button onClick={getUserLocation} className="btn btn-secondary w-full">
                  <Navigation className="w-4 h-4" />
                  Refresh Location
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pending Tab */}
      {tab === 'pending' && isManager && (
        <>
          <div className="card p-4 flex flex-wrap gap-4">
            <select
              value={filters.locationId}
              onChange={(e) => setFilters({ ...filters, locationId: e.target.value })}
              className="input w-auto"
            >
              <option value="">All Locations</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            <div className="flex-1" />
            {selectedEntries.length > 0 && (
              <button onClick={handleBulkApprove} className="btn btn-primary">
                <Check className="w-4 h-4" />
                Approve Selected ({selectedEntries.length})
              </button>
            )}
          </div>

          <TimeEntriesTable
            entries={pendingEntries}
            loading={loading}
            showCheckbox
            selectedEntries={selectedEntries}
            onToggleSelect={(id) => {
              setSelectedEntries(prev => 
                prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
              );
            }}
            onToggleSelectAll={toggleSelectAll}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </>
      )}

      {/* History Tab */}
      {tab === 'history' && (
        <>
          <div className="card p-4 flex flex-wrap gap-4">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="input w-auto"
            />
            <span className="self-center text-slate-400">to</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="input w-auto"
            />
          </div>

          <TimeEntriesTable entries={entries} loading={loading} />
        </>
      )}
    </div>
  );
}

function TabButton({ id, label, icon: Icon, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
        active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
      {count > 0 && (
        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs">
          {count}
        </span>
      )}
    </button>
  );
}

function TimeEntriesTable({ entries, loading, showCheckbox, selectedEntries = [], onToggleSelect, onToggleSelectAll, onApprove, onReject }) {
  if (loading) {
    return (
      <div className="card flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-momentum-500" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="card text-center py-12">
        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">No time entries found</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              {showCheckbox && (
                <th className="w-10">
                  <input
                    type="checkbox"
                    checked={selectedEntries.length === entries.length && entries.length > 0}
                    onChange={onToggleSelectAll}
                    className="rounded border-slate-300"
                  />
                </th>
              )}
              <th>Employee</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Break</th>
              <th>Total</th>
              <th>Location</th>
              <th>Status</th>
              {onApprove && <th className="w-24">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <tr key={entry.id}>
                {showCheckbox && (
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedEntries.includes(entry.id)}
                      onChange={() => onToggleSelect(entry.id)}
                      className="rounded border-slate-300"
                    />
                  </td>
                )}
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-momentum-100 text-momentum-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {entry.first_name?.[0]}{entry.last_name?.[0]}
                    </div>
                    <span className="font-medium">{entry.first_name} {entry.last_name}</span>
                  </div>
                </td>
                <td>{format(parseISO(entry.clock_in), 'EEE, MMM d')}</td>
                <td>
                  <div>
                    {format(parseISO(entry.clock_in), 'HH:mm')}
                    {entry.clock_in_distance && (
                      <span className={`ml-2 text-xs ${entry.clock_in_distance <= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                        ({entry.clock_in_distance}m)
                      </span>
                    )}
                  </div>
                </td>
                <td>{entry.clock_out ? format(parseISO(entry.clock_out), 'HH:mm') : '-'}</td>
                <td>{entry.total_break_minutes || 0} min</td>
                <td className="font-medium">{entry.total_hours?.toFixed(2) || '-'}h</td>
                <td>{entry.location_name || '-'}</td>
                <td><StatusBadge status={entry.status} /></td>
                {onApprove && (
                  <td>
                    <div className="flex items-center gap-1">
                      <button onClick={() => onApprove(entry.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Approve">
                        <Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => onReject(entry.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Reject">
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
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-danger' };
  const icons = { pending: AlertCircle, approved: CheckCircle, rejected: XCircle };
  const Icon = icons[status] || AlertCircle;
  return (
    <span className={`badge ${styles[status] || 'badge-neutral'} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}
