import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../shared/UIComponents';
import { mockData } from '../../data/mockData';

export default function ShiftDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shift = mockData.shifts.find(s => s.id === parseInt(id)) || mockData.shifts[0];

  const statusColor = shift.status === 'confirmed' ? 'success' : shift.status === 'pending' ? 'warning' : 'danger';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div style={{ 
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        padding: '24px 20px',
        paddingTop: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Steel glow for operational context */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, var(--steel-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'none',
            border: 'none',
            color: 'var(--momentum-bright)',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '16px',
            padding: '0',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ← Back
        </button>
        
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '900', 
          color: 'var(--text-primary)',
          marginBottom: '8px',
          position: 'relative',
          letterSpacing: '-0.5px'
        }}>
          {shift.role}
        </h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', position: 'relative' }}>
          <Badge variant={statusColor}>{shift.status}</Badge>
          <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>•</span>
          <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>{shift.date}</span>
        </div>
      </div>

      {/* Shift Details */}
      <div style={{ padding: '20px' }}>
        <Card variant="elevated" style={{ animation: 'slideUp 0.4s ease-out', borderLeft: '4px solid var(--steel-bright)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Time</div>
              <div style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: '700' }}>{shift.time}</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duration</div>
              <div style={{ fontSize: '18px', color: 'var(--text-primary)', fontWeight: '700' }}>{shift.duration}</div>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</div>
            <div style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: '600' }}>📍 {shift.location}</div>
          </div>

          {shift.manager && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Manager</div>
              <div style={{ fontSize: '16px', color: 'var(--text-primary)', fontWeight: '600' }}>👤 {shift.manager}</div>
            </div>
          )}
        </Card>

        {/* Tasks Section */}
        {shift.tasks && shift.tasks.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: 'var(--text-primary)', 
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ 
                width: '4px', 
                height: '18px', 
                background: 'var(--steel-bright)',
                borderRadius: '2px'
              }} />
              Shift Tasks
            </h2>
            
            <Card variant="elevated" style={{ animation: 'slideUp 0.5s ease-out' }}>
              {shift.tasks.map((task, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    paddingBottom: idx < shift.tasks.length - 1 ? '12px' : '0',
                    marginBottom: idx < shift.tasks.length - 1 ? '12px' : '0',
                    borderBottom: idx < shift.tasks.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    display: 'flex',
                    alignItems: 'start',
                    gap: '12px'
                  }}
                >
                  <span style={{ 
                    color: 'var(--steel-bright)', 
                    fontSize: '18px',
                    marginTop: '2px'
                  }}>•</span>
                  <span style={{ fontSize: '15px', color: 'var(--text-primary)', flex: 1 }}>
                    {task}
                  </span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        {shift.swappable && (
          <div style={{ marginTop: '24px' }}>
            <Button 
              variant="primary"
              fullWidth
              onClick={() => navigate(`/shift-swap-request/${shift.id}`)}
              style={{ marginBottom: '12px' }}
            >
              🔄 Request Shift Swap
            </Button>
          </div>
        )}

        <Button 
          variant="outline-danger"
          fullWidth
          style={{ marginTop: shift.swappable ? '0' : '24px' }}
        >
          Cancel Shift
        </Button>

        {/* Notes Section */}
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: 'var(--text-primary)', 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ 
              width: '4px', 
              height: '18px', 
              background: 'var(--steel-bright)',
              borderRadius: '2px'
            }} />
            Notes
          </h2>
          
          <Card variant="elevated" style={{ animation: 'slideUp 0.6s ease-out' }}>
            <div style={{ 
              fontSize: '15px',
              color: shift.notes ? 'var(--text-primary)' : 'var(--text-tertiary)',
              lineHeight: '1.6',
              fontStyle: shift.notes ? 'normal' : 'italic'
            }}>
              {shift.notes || 'No notes for this shift'}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
