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
