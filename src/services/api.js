// ============================================
// API SERVICE LAYER
// Abstracts data fetching with loading/error states
// Ready for production API integration
// ============================================

import { mockData } from '../data/mockData';

// Simulate network delay for realistic loading states
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// API Base Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'https://api.uplift.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// ============================================
// ERROR HANDLING
// ============================================

class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'APIError';
  }
}

const handleError = (error) => {
  if (error.response) {
    // Server responded with error
    throw new APIError(
      error.response.data.message || 'Server error',
      error.response.status,
      error.response.data
    );
  } else if (error.request) {
    // Request made but no response
    throw new APIError('Network error - please check your connection', 0);
  } else {
    // Something else happened
    throw new APIError(error.message || 'Unknown error occurred');
  }
};

// ============================================
// WORKER API
// ============================================

export const WorkerAPI = {
  // Get current worker profile
  getProfile: async (workerId) => {
    await delay(500); // Simulate network
    try {
      // In production: return await fetch(`${API_CONFIG.baseURL}/workers/${workerId}`)
      const worker = mockData.workers.find(w => w.id === workerId) || mockData.workers[0];
      return { data: worker, error: null };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Get worker's skills
  getSkills: async (workerId) => {
    await delay(400);
    try {
      const worker = mockData.workers.find(w => w.id === workerId) || mockData.workers[0];
      return { 
        data: {
          completed: worker.skills,
          inProgress: ['Time Management', 'Conflict Resolution'],
          available: ['Leadership', 'Inventory Management']
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Update worker profile
  updateProfile: async (workerId, updates) => {
    await delay(600);
    try {
      // In production: return await fetch(`${API_CONFIG.baseURL}/workers/${workerId}`, { method: 'PATCH', body: JSON.stringify(updates) })
      return { data: { ...mockData.workers[0], ...updates }, error: null };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  }
};

// ============================================
// SCHEDULE API
// ============================================

export const ScheduleAPI = {
  // Get shifts for a worker
  getShifts: async (workerId, { startDate, endDate } = {}) => {
    await delay(500);
    try {
      // In production: return await fetch(`${API_CONFIG.baseURL}/shifts?workerId=${workerId}&start=${startDate}&end=${endDate}`)
      return { data: mockData.shifts, error: null };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Get shift detail
  getShift: async (shiftId) => {
    await delay(400);
    try {
      const shift = mockData.shifts.find(s => s.id === shiftId);
      return { data: shift || mockData.shifts[0], error: null };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Request shift swap
  requestSwap: async (shiftId, targetWorkerId, message) => {
    await delay(700);
    try {
      // In production: POST request
      return { 
        data: { 
          id: Date.now(), 
          shiftId, 
          targetWorkerId, 
          status: 'pending',
          message 
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Cancel shift
  cancelShift: async (shiftId, reason) => {
    await delay(600);
    try {
      return { data: { shiftId, status: 'cancelled', reason }, error: null };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  }
};

// ============================================
// JOBS API
// ============================================

export const JobsAPI = {
  // Get job listings
  getJobs: async (filters = {}) => {
    await delay(500);
    try {
      // In production: return await fetch(`${API_CONFIG.baseURL}/jobs?${new URLSearchParams(filters)}`)
      let jobs = mockData.jobs;
      
      if (filters.department) {
        jobs = jobs.filter(j => j.department.toLowerCase() === filters.department.toLowerCase());
      }
      
      return { data: jobs, error: null };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Get job detail with match score
  getJob: async (jobId, workerId) => {
    await delay(400);
    try {
      const job = mockData.jobs.find(j => j.id === jobId);
      const matchScore = Math.floor(Math.random() * 30) + 60; // 60-90%
      
      return { 
        data: { 
          ...job,
          matchScore,
          matchReasons: [
            'You have 8/10 required skills',
            'Your experience aligns well',
            '3 of your colleagues advanced from your role'
          ]
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Apply for job
  applyForJob: async (jobId, workerId) => {
    await delay(800);
    try {
      // In production: POST request
      return { 
        data: {
          applicationId: Date.now(),
          jobId,
          workerId,
          status: 'under_review',
          appliedAt: new Date().toISOString()
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Get worker's applications
  getApplications: async (workerId) => {
    await delay(500);
    try {
      return {
        data: [
          {
            id: 1,
            jobId: 1,
            title: 'Senior Sales Associate',
            department: 'Sales',
            status: 'under_review',
            appliedDate: 'Dec 15, 2024',
            lastUpdate: '2 days ago'
          },
          {
            id: 2,
            jobId: 2,
            title: 'Team Lead',
            department: 'Operations',
            status: 'interview',
            appliedDate: 'Dec 10, 2024',
            lastUpdate: '1 week ago',
            interviewDate: 'Jan 12, 2025'
          }
        ],
        error: null
      };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  }
};

// ============================================
// TASKS API
// ============================================

export const TasksAPI = {
  // Get daily tasks
  getTasks: async (workerId) => {
    await delay(400);
    try {
      return { data: mockData.tasks, error: null };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Complete a task
  completeTask: async (taskId, workerId) => {
    await delay(600);
    try {
      const task = mockData.tasks.find(t => t.title === taskId);
      return { 
        data: {
          taskId,
          points: task?.points || 0,
          newTotalPoints: 150,
          completedAt: new Date().toISOString()
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  }
};

// ============================================
// MANAGER API
// ============================================

export const ManagerAPI = {
  // Get team overview
  getTeam: async (managerId) => {
    await delay(600);
    try {
      return { data: mockData.workers, error: null };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Get team metrics
  getMetrics: async (managerId) => {
    await delay(500);
    try {
      return {
        data: {
          teamSize: mockData.workers.length,
          openShifts: 12,
          pendingApplications: 8,
          avgSkillLevel: 7.2,
          retention: 94,
          hoursThisMonth: 1280,
          avgHoursPerWorker: 32
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Generate AI schedule
  generateSchedule: async (managerId, config) => {
    await delay(2000); // Longer for AI generation
    try {
      return {
        data: {
          schedule: mockData.shifts,
          coverage: 98,
          conflicts: 2,
          totalHours: 320,
          generatedAt: new Date().toISOString()
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Approve/reject application
  reviewApplication: async (applicationId, status, feedback) => {
    await delay(700);
    try {
      return {
        data: {
          applicationId,
          status,
          feedback,
          reviewedAt: new Date().toISOString()
        },
        error: null
      };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  }
};

// ============================================
// NOTIFICATIONS API
// ============================================

export const NotificationsAPI = {
  // Get notifications
  getNotifications: async (userId) => {
    await delay(400);
    try {
      return {
        data: [
          {
            id: 1,
            type: 'application',
            title: 'Application Update',
            message: 'Your application for Team Lead has moved to interview stage',
            read: false,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            type: 'shift',
            title: 'Shift Swap Request',
            message: 'Sarah Chen accepted your shift swap request',
            read: false,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
          }
        ],
        error: null
      };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    await delay(300);
    try {
      return { data: { notificationId, read: true }, error: null };
    } catch (error) {
      return { data: null, error: handleError(error) };
    }
  }
};

// ============================================
// REACT HOOKS FOR DATA FETCHING
// ============================================

import { useState, useEffect } from 'react';

// Generic data fetching hook with loading and error states
export const useAPI = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
};

// Example usage in components:
/*
import { useAPI, WorkerAPI } from '../services/api';

function WorkerProfile() {
  const { data: worker, loading, error } = useAPI(() => WorkerAPI.getProfile(1));
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <div>{worker.name}</div>;
}
*/
