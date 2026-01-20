// ============================================================
// API CLIENT
// Centralized HTTP client with httpOnly cookie auth + CSRF protection
// ============================================================

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Helper to get cookie value
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

class ApiClient {
  constructor() {
    this.isAuthenticated = false;
  }

  setAuthenticated(value) {
    this.isAuthenticated = value;
  }

  async request(method, path, data, options = {}) {
    const url = `${API_URL}${path}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add CSRF token for non-GET requests
    if (method !== 'GET') {
      const csrfToken = getCookie('csrfToken');
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
    }

    const config = {
      method,
      headers,
      credentials: 'include', // Always include cookies
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);
      
      // Handle token expiry - refresh automatically
      if (response.status === 401) {
        const result = await response.json();
        if (result.code === 'TOKEN_EXPIRED') {
          // Try to refresh (cookie-based)
          const refreshed = await this.refreshToken();
          if (refreshed) {
            // Retry original request
            const retryResponse = await fetch(url, config);
            return this.handleResponse(retryResponse);
          }
        }
        // Clear auth state and redirect
        this.setAuthenticated(false);
        window.location.href = '/login';
        throw new Error('Session expired');
      }

      // Handle CSRF error - fetch new token and retry
      if (response.status === 403) {
        const result = await response.json();
        if (result.code === 'CSRF_ERROR') {
          await this.fetchCsrfToken();
          // Retry with new token
          headers['X-CSRF-Token'] = getCookie('csrfToken');
          const retryResponse = await fetch(url, { ...config, headers });
          return this.handleResponse(retryResponse);
        }
      }

      return this.handleResponse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.error || 'Request failed');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  }

  async refreshToken() {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': getCookie('csrfToken'),
        },
      });
      
      if (response.ok) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  async fetchCsrfToken() {
    try {
      await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
    } catch {
      // Ignore errors
    }
  }

  // Convenience methods
  get(path, options) {
    return this.request('GET', path, null, options);
  }

  post(path, data, options) {
    return this.request('POST', path, data, options);
  }

  patch(path, data, options) {
    return this.request('PATCH', path, data, options);
  }

  put(path, data, options) {
    return this.request('PUT', path, data, options);
  }

  delete(path, options) {
    return this.request('DELETE', path, null, options);
  }
}

export const api = new ApiClient();

// ============================================================
// API ENDPOINTS
// ============================================================

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  register: (data) => api.post('/auth/register', data),
  requestPasswordReset: (email) => api.post('/auth/password/reset-request', { email }),
  resetPassword: (token, password) => api.post('/auth/password/reset', { token, password }),
  changePassword: (currentPassword, newPassword) => 
    api.post('/auth/password/change', { currentPassword, newPassword }),
  inviteUser: (data) => api.post('/auth/users/invite', data),
  getUsers: () => api.get('/auth/users'),
};

export const employeesApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/employees?${query}`);
  },
  get: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.patch(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  addSkill: (employeeId, data) => api.post(`/employees/${employeeId}/skills`, data),
  verifySkill: (employeeId, skillId) => api.post(`/employees/${employeeId}/skills/${skillId}/verify`),
};

export const locationsApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/locations?${query}`);
  },
  get: (id) => api.get(`/locations/${id}`),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.patch(`/locations/${id}`, data),
};

export const departmentsApi = {
  list: () => api.get('/departments'),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.patch(`/departments/${id}`, data),
};

export const rolesApi = {
  list: () => api.get('/roles'),
  create: (data) => api.post('/roles', data),
};

export const skillsApi = {
  list: () => api.get('/skills'),
  create: (data) => api.post('/skills', data),
};

export const shiftsApi = {
  list: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/shifts?${query}`);
  },
  get: (id) => api.get(`/shifts/${id}`),
  create: (data) => api.post('/shifts', data),
  createBulk: (shifts) => api.post('/shifts/bulk', { shifts }),
  update: (id, data) => api.patch(`/shifts/${id}`, data),
  delete: (id) => api.delete(`/shifts/${id}`),
  assignOpen: (id, employeeId) => api.post(`/shifts/${id}/assign`, { employeeId }),
  getSwaps: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/shifts/swaps?${query}`);
  },
  approveSwap: (id, notes) => api.post(`/shifts/swaps/${id}/approve`, { notes }),
  rejectSwap: (id, notes) => api.post(`/shifts/swaps/${id}/reject`, { notes }),
  getTemplates: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/shift-templates?${query}`);
  },
  createTemplate: (data) => api.post('/shift-templates', data),
  generateFromTemplate: (templateId, data) => 
    api.post(`/shift-templates/${templateId}/generate`, data),
  getPeriods: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/schedule/periods?${query}`);
  },
  createPeriod: (data) => api.post('/schedule/periods', data),
  publishPeriod: (id) => api.post(`/schedule/periods/${id}/publish`),
};

export const timeApi = {
  getEntries: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/time/entries?${query}`);
  },
  getPending: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/time/pending?${query}`);
  },
  approve: (id) => api.post(`/time/entries/${id}/approve`),
  reject: (id, reason) => api.post(`/time/entries/${id}/reject`, { reason }),
  bulkApprove: (entryIds) => api.post('/time/entries/bulk-approve', { entryIds }),
  adjust: (id, data) => api.patch(`/time/entries/${id}`, data),
};

export const timeOffApi = {
  getPolicies: () => api.get('/time-off/policies'),
  createPolicy: (data) => api.post('/time-off/policies', data),
  getRequests: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/time-off/requests?${query}`);
  },
  approve: (id, notes) => api.post(`/time-off/requests/${id}/approve`, { notes }),
  reject: (id, notes) => api.post(`/time-off/requests/${id}/reject`, { notes }),
  getBalances: (employeeId) => api.get(`/time-off/balances?employeeId=${employeeId}`),
};

export const dashboardApi = {
  get: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/dashboard?${query}`);
  },
};

export const reportsApi = {
  hours: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reports/hours?${query}`);
  },
  attendance: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reports/attendance?${query}`);
  },
  laborCost: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reports/labor-cost?${query}`);
  },
  coverage: (params) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/reports/coverage?${query}`);
  },
  exportTimesheets: (params) => {
    const query = new URLSearchParams(params).toString();
    return `${API_URL}/exports/timesheets?${query}`;
  },
  exportEmployees: (params) => {
    const query = new URLSearchParams(params).toString();
    return `${API_URL}/exports/employees?${query}`;
  },
};

export const organizationApi = {
  get: () => api.get('/organization'),
  update: (data) => api.patch('/organization', data),
};

export const notificationsApi = {
  list: (unreadOnly = false) => api.get(`/notifications?unreadOnly=${unreadOnly}`),
  markRead: (id) => api.post(`/notifications/${id}/read`),
  markAllRead: () => api.post('/notifications/read-all'),
};

export default api;
