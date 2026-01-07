import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../shared/BottomNav';
import { Card, Button, Badge } from '../shared/UIComponents';
import { mockData } from '../../data/mockData';

export default function Applications() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const applications = [
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
    },
    { 
      id: 3, 
      jobId: 3,
      title: 'Shift Supervisor', 
      department: 'Operations',
      status: 'approved', 
      appliedDate: 'Nov 28, 2024',
      lastUpdate: '3 days ago'
    },
  ];

  const getStatusVariant = (status) => {
    switch(status) {
      case 'under_review': return 'warning';
      case 'interview': return 'steel';
      case 'approved': return 'success';
      case 'declined': return 'danger';
      default: return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'under_review': return 'Under Review';
      case 'interview': return 'Interview Scheduled';
      case 'approved': return 'Approved';
      case 'declined': return 'Not Selected';
      default: return status;
    }
  };

  const filters = ['all', 'under_review', 'interview', 'approved'];
  const filteredApps = filter === 'all' ? applications : applications.filter(app => app.status === filter);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        padding: '24px 20px',
        paddingTop: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, var(--steel-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '900', 
          color: 'var(--text-primary)',
          marginBottom: '6px',
          position: 'relative',
          letterSpacing: '-0.5px'
        }}>
          My Applications 📋
        </h1>
        <p style={{ 
          fontSize: '15px', 
          color: 'var(--text-tertiary)',
          position: 'relative'
        }}>
          Track your career opportunities
        </p>
      </div>

      {/* Stats */}
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <Card variant="elevated" style={{ textAlign: 'center', animation: 'slideUp 0.4s ease-out' }}>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {applications.length}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Total
          </div>
        </Card>
        <Card variant="elevated" style={{ textAlign: 'center', animation: 'slideUp 0.5s ease-out' }}>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--alert-warning)', marginBottom: '4px' }}>
            {applications.filter(a => a.status === 'under_review').length}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Pending
          </div>
        </Card>
        <Card variant="elevated" style={{ textAlign: 'center', animation: 'slideUp 0.6s ease-out' }}>
          <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--success-bright)', marginBottom: '4px' }}>
            {applications.filter(a => a.status === 'approved').length}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Approved
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: filter === f ? 'var(--steel-bright)' : 'var(--bg-elevated)',
                color: filter === f ? '#FFF' : 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textTransform: 'capitalize',
                transition: 'all var(--transition-base)'
              }}
            >
              {f === 'all' ? 'All' : getStatusLabel(f)}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div style={{ padding: '0 20px' }}>
        {filteredApps.length === 0 ? (
          <Card variant="elevated" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
              No applications in this category
            </div>
          </Card>
        ) : (
          filteredApps.map((app, idx) => (
            <Card 
              key={app.id}
              variant="elevated"
              onClick={() => navigate(`/job/${app.jobId}`)}
              style={{ 
                marginBottom: '16px',
                cursor: 'pointer',
                animation: `slideUp ${0.4 + idx * 0.1}s ease-out`,
                borderLeft: `4px solid ${app.status === 'approved' ? 'var(--success-bright)' : app.status === 'interview' ? 'var(--steel-bright)' : 'var(--alert-warning)'}`
              }}
            >
              {/* Application Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {app.title}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
                    {app.department}
                  </div>
                </div>
                <Badge variant={getStatusVariant(app.status)} size="md">
                  {getStatusLabel(app.status)}
                </Badge>
              </div>

              {/* Interview Date (if scheduled) */}
              {app.interviewDate && (
                <Card variant="glass" style={{ 
                  background: 'var(--steel-glow)',
                  border: '1px solid var(--steel-bright)',
                  marginBottom: '12px',
                  padding: '12px'
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--steel-bright)', marginBottom: '4px', fontWeight: '600' }}>
                    📅 Interview Scheduled
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {app.interviewDate}
                  </div>
                </Card>
              )}

              {/* Application Meta */}
              <div style={{ 
                paddingTop: '12px',
                borderTop: '1px solid var(--bg-elevated)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'var(--text-tertiary)'
              }}>
                <span>Applied: {app.appliedDate}</span>
                <span>Updated: {app.lastUpdate}</span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Browse More Jobs Button */}
      <div style={{ padding: '20px' }}>
        <Button 
          variant="secondary"
          size="lg"
          fullWidth
          onClick={() => navigate('/grow')}
        >
          Browse More Opportunities →
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}

  const applications = [
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
    },
    { 
      id: 3, 
      jobId: 3,
      title: 'Shift Supervisor', 
      department: 'Operations',
      status: 'approved', 
      appliedDate: 'Nov 28, 2024',
      lastUpdate: '3 days ago'
    },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'under_review': return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'interview': return { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)' };
      case 'approved': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'declined': return { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
      default: return { color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.1)' };
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'under_review': return 'Under Review';
      case 'interview': return 'Interview Scheduled';
      case 'approved': return 'Approved';
      case 'declined': return 'Not Selected';
      default: return status;
    }
  };

  const filters = ['all', 'under_review', 'interview', 'approved'];

  const filteredApps = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  return (
    <div style={{ minHeight: '100vh', background: '#1F1F1F', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ 
        background: '#2C2C2C', 
        padding: '20px', 
        paddingTop: '60px',
        borderBottom: '1px solid #3A3A3A'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: '#FFF', 
          marginBottom: '8px' 
        }}>
          My Applications
        </h1>
        <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
          Track your career opportunities
        </p>
      </div>

      {/* Stats */}
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ 
          background: '#2C2C2C',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #3A3A3A',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>
            {applications.length}
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Total
          </div>
        </div>
        <div style={{ 
          background: '#2C2C2C',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #3A3A3A',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#F59E0B', marginBottom: '4px' }}>
            {applications.filter(a => a.status === 'under_review').length}
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Pending
          </div>
        </div>
        <div style={{ 
          background: '#2C2C2C',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #3A3A3A',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#10B981', marginBottom: '4px' }}>
            {applications.filter(a => a.status === 'approved').length}
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Approved
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: filter === f ? '#6366F1' : '#3A3A3A',
                color: '#FFF',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textTransform: 'capitalize'
              }}
            >
              {f === 'all' ? 'All' : getStatusLabel(f)}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div style={{ padding: '0 20px' }}>
        {filteredApps.length === 0 ? (
          <div style={{ 
            background: '#2C2C2C',
            padding: '40px 20px',
            borderRadius: '12px',
            border: '1px solid #3A3A3A',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📋</div>
            <div style={{ fontSize: '16px', color: '#9CA3AF' }}>
              No applications in this category
            </div>
          </div>
        ) : (
          filteredApps.map(app => {
            const statusStyle = getStatusColor(app.status);
            return (
              <div 
                key={app.id}
                onClick={() => navigate(`/job/${app.jobId}`)}
                style={{ 
                  background: '#2C2C2C',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid #3A3A3A',
                  marginBottom: '12px',
                  cursor: 'pointer'
                }}
              >
                {/* Application Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#FFF', marginBottom: '4px' }}>
                      {app.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                      {app.department}
                    </div>
                  </div>
                  <span style={{ 
                    fontSize: '12px',
                    color: statusStyle.color,
                    background: statusStyle.bg,
                    padding: '4px 8px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    {getStatusLabel(app.status)}
                  </span>
                </div>

                {/* Interview Date (if scheduled) */}
                {app.interviewDate && (
                  <div style={{ 
                    background: 'rgba(99, 102, 241, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontSize: '12px', color: '#6366F1', marginBottom: '4px', fontWeight: '500' }}>
                      📅 Interview Scheduled
                    </div>
                    <div style={{ fontSize: '14px', color: '#FFF' }}>
                      {app.interviewDate}
                    </div>
                  </div>
                )}

                {/* Application Meta */}
                <div style={{ 
                  paddingTop: '12px',
                  borderTop: '1px solid #3A3A3A',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '12px',
                  color: '#9CA3AF'
                }}>
                  <span>Applied: {app.appliedDate}</span>
                  <span>Updated: {app.lastUpdate}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Browse More Jobs Button */}
      <div style={{ padding: '20px' }}>
        <button 
          onClick={() => navigate('/grow')}
          style={{
            width: '100%',
            padding: '16px',
            background: 'transparent',
            color: '#6366F1',
            border: '1px solid #6366F1',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Browse More Opportunities
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
