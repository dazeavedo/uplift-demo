import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../shared/BottomNav';
import { Card, Button, Badge, StatCard } from '../shared/UIComponents';
import { mockData } from '../../data/mockData';

export default function Schedule() {
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState(0);

  const weeks = ['This Week', 'Next Week', 'In 2 Weeks'];

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
          left: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, var(--steel-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '900', 
          color: 'var(--text-primary)',
          marginBottom: '16px',
          position: 'relative',
          letterSpacing: '-0.5px'
        }}>
          My Schedule 📅
        </h1>
        
        {/* Week Selector */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', position: 'relative' }}>
          {weeks.map((week, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedWeek(idx)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: selectedWeek === idx ? 'var(--steel-bright)' : 'var(--bg-elevated)',
                color: selectedWeek === idx ? '#FFF' : 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-base)'
              }}
            >
              {week}
            </button>
          ))}
        </div>
      </div>

      {/* Total Hours Card */}
      <div style={{ padding: '20px' }}>
        <StatCard
          value="32.5"
          label="Hours Scheduled This Week"
          color="steel"
          icon="⏱️"
        />
      </div>

      {/* Shifts List */}
      <div style={{ padding: '0 20px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: 'var(--text-primary)', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ 
            width: '4px', 
            height: '18px', 
            background: 'var(--momentum-bright)',
            borderRadius: '2px'
          }} />
          Your Shifts
        </h2>
        
        {mockData.shifts.map((shift, idx) => {
          const statusColors = {
            confirmed: { variant: 'success', color: 'var(--success-bright)' },
            pending: { variant: 'warning', color: 'var(--alert-warning)' },
            cancelled: { variant: 'danger', color: 'var(--alert-danger)' }
          };
          const statusStyle = statusColors[shift.status] || statusColors.confirmed;

          return (
            <Card 
              key={shift.id}
              variant="elevated"
              onClick={() => navigate(`/shift/${shift.id}`)}
              style={{ 
                marginBottom: '16px',
                cursor: 'pointer',
                animation: `slideUp ${0.4 + idx * 0.1}s ease-out`,
                borderLeft: `4px solid ${statusStyle.color}`
              }}
            >
              {/* Shift Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {shift.role}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
                    {shift.location}
                  </div>
                </div>
                <Badge variant={statusStyle.variant} size="md">
                  {shift.status}
                </Badge>
              </div>

              {/* Shift Details */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: shift.swappable ? '12px' : '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <span>📅</span>
                  <span>{shift.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <span>🕐</span>
                  <span>{shift.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <span>⏱️</span>
                  <span>{shift.duration}</span>
                </div>
              </div>

              {/* Swap Badge */}
              {shift.swappable && (
                <div style={{ 
                  paddingTop: '12px',
                  borderTop: '1px solid var(--bg-elevated)'
                }}>
                  <Badge variant="steel" size="md">
                    🔄 Swap Available
                  </Badge>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Request Time Off Button */}
      <div style={{ padding: '20px' }}>
        <Button
          variant="secondary"
          size="lg"
          fullWidth
        >
          Request Time Off
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
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
          marginBottom: '16px' 
        }}>
          My Schedule
        </h1>
        
        {/* Week Selector */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {weeks.map((week, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedWeek(idx)}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: selectedWeek === idx ? '#6366F1' : '#3A3A3A',
                color: '#FFF',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {week}
            </button>
          ))}
        </div>
      </div>

      {/* Total Hours */}
      <div style={{ padding: '20px' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '36px', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>
            32.5
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            Hours Scheduled This Week
          </div>
        </div>
      </div>

      {/* Shifts List */}
      <div style={{ padding: '0 20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', marginBottom: '16px' }}>
          Your Shifts
        </h2>
        
        {mockData.shifts.map((shift, idx) => (
          <div 
            key={shift.id}
            onClick={() => navigate(`/shift/${shift.id}`)}
            style={{ 
              background: '#2C2C2C',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #3A3A3A',
              marginBottom: '12px',
              cursor: 'pointer'
            }}
          >
            {/* Shift Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#FFF', marginBottom: '4px' }}>
                  {shift.role}
                </div>
                <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                  {shift.location}
                </div>
              </div>
              <span style={{ 
                fontSize: '12px', 
                color: shift.status === 'confirmed' ? '#10B981' : shift.status === 'pending' ? '#F59E0B' : '#EF4444',
                background: shift.status === 'confirmed' ? 'rgba(16, 185, 129, 0.1)' : shift.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                padding: '4px 8px',
                borderRadius: '6px',
                textTransform: 'capitalize'
              }}>
                {shift.status}
              </span>
            </div>

            {/* Shift Details */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '16px' }}>📅</span>
                <span style={{ fontSize: '14px', color: '#9CA3AF' }}>{shift.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '16px' }}>🕐</span>
                <span style={{ fontSize: '14px', color: '#9CA3AF' }}>{shift.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '16px' }}>⏱️</span>
                <span style={{ fontSize: '14px', color: '#9CA3AF' }}>{shift.duration}</span>
              </div>
            </div>

            {/* Swap Available Badge */}
            {shift.swappable && (
              <div style={{ 
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid #3A3A3A'
              }}>
                <span style={{ 
                  fontSize: '12px',
                  color: '#6366F1',
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '6px'
                }}>
                  🔄 Swap Available
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Request Time Off Button */}
      <div style={{ padding: '20px' }}>
        <button style={{
          width: '100%',
          padding: '16px',
          background: '#6366F1',
          color: '#FFF',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Request Time Off
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
