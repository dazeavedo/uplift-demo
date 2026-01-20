// ============================================================
// LOCATIONS PAGE
// Location management
// ============================================================

import { useState, useEffect } from 'react';
import { locationsApi } from '../lib/api';
import { 
  MapPin, 
  Plus, 
  MoreVertical,
  Users,
  Clock,
  Phone,
  X,
  Edit,
} from 'lucide-react';

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const result = await locationsApi.list({ status: 'all' });
      setLocations(result.locations);
    } catch (error) {
      console.error('Failed to load locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (editingLocation) {
        await locationsApi.update(editingLocation.id, data);
      } else {
        await locationsApi.create(data);
      }
      await loadLocations();
      setShowModal(false);
      setEditingLocation(null);
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Locations</h1>
          <p className="text-slate-600">{locations.length} locations</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus className="w-4 h-4" />
          Add Location
        </button>
      </div>

      {/* Locations Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-momentum-500" />
        </div>
      ) : locations.length === 0 ? (
        <div className="card p-12 text-center">
          <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">No locations yet</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            Add your first location
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <div key={location.id} className="card hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-momentum-100 text-momentum-600 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{location.name}</h3>
                      {location.code && (
                        <p className="text-sm text-slate-500">{location.code}</p>
                      )}
                    </div>
                  </div>
                  <span className={`badge ${
                    location.status === 'active' ? 'badge-success' : 'badge-neutral'
                  }`}>
                    {location.status}
                  </span>
                </div>

                {(location.address_line1 || location.city) && (
                  <p className="text-sm text-slate-600 mb-3">
                    {[location.address_line1, location.city, location.postcode].filter(Boolean).join(', ')}
                  </p>
                )}

                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {location.employee_count || 0} employees
                  </span>
                  {location.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {location.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => { setEditingLocation(location); setShowModal(true); }}
                  className="btn btn-ghost text-sm"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <LocationModal
          location={editingLocation}
          onClose={() => { setShowModal(false); setEditingLocation(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function LocationModal({ location, onClose, onSave }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: location?.name || '',
    code: location?.code || '',
    type: location?.type || 'store',
    addressLine1: location?.address_line1 || '',
    city: location?.city || '',
    postcode: location?.postcode || '',
    country: location?.country || 'GB',
    phone: location?.phone || '',
    timezone: location?.timezone || 'Europe/London',
    geofenceRadius: location?.geofence_radius || 100,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {location ? 'Edit Location' : 'Add Location'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label className="label">Code</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="input"
                placeholder="LON-01"
              />
            </div>

            <div>
              <label className="label">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="input"
              >
                <option value="store">Store</option>
                <option value="warehouse">Warehouse</option>
                <option value="office">Office</option>
                <option value="remote">Remote</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Address</label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              className="input"
              placeholder="Street address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Postcode</label>
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div>
            <label className="label">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input"
            />
          </div>

          <div>
            <label className="label">Geofence Radius (meters)</label>
            <input
              type="number"
              value={formData.geofenceRadius}
              onChange={(e) => setFormData({ ...formData, geofenceRadius: parseInt(e.target.value) })}
              className="input"
              min="10"
              max="1000"
            />
            <p className="text-xs text-slate-500 mt-1">
              Employees must be within this distance to clock in
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : (location ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
