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
                borderRadius: '20px',
                border: 'none',
                background: selectedWeek === idx ? 'var(--momentum-bright)' : 'var(--bg-secondary)',
                color: selectedWeek === idx ? '#FFF' : 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: selectedWeek === idx ? '0 4px 12px rgba(255, 115, 45, 0.3)' : 'none'
              }}
            >
              {week}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div style={{ padding: '20px' }}>
        <div style={{
          background: 'var(--bg-secondary)',
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          borderLeft: '4px solid var(--steel-bright)',
          animation: 'slideUp 0.4s ease-out'
        }}>
          <div style={{ fontSize: '32px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '8px' }}>
            32.5
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Hours Scheduled This Week
          </div>
        </div>
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
            background: 'var(--steel-bright)',
            borderRadius: '2px'
          }} />
          Your Shifts
        </h2>
        
        {mockData.shifts.map((shift, idx) => (
          <Card
            key={shift.id}
            variant="elevated"
            onClick={() => navigate(`/worker/shift/${shift.id}`)}
            style={{ 
              marginBottom: '16px',
              cursor: 'pointer',
              animation: `slideUp ${0.5 + idx * 0.05}s ease-out`,
              borderLeft: '4px solid var(--steel-bright)'
            }}
          >
            {/* Shift Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {shift.role}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
                  {shift.location}
                </div>
              </div>
              <Badge 
                variant={shift.status === 'confirmed' ? 'success' : shift.status === 'pending' ? 'warning' : 'danger'}
              >
                {shift.status}
              </Badge>
            </div>

            {/* Shift Details */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              flexWrap: 'wrap',
              paddingTop: '12px',
              borderTop: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '16px' }}>📅</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{shift.date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '16px' }}>🕐</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{shift.time}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '16px' }}>⏱️</span>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{shift.duration}</span>
              </div>
            </div>

            {/* Swap Available Badge */}
            {shift.swappable && (
              <div style={{ 
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <Badge variant="default">
                  🔄 Swap Available
                </Badge>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Request Time Off Button */}
      <div style={{ padding: '20px' }}>
        <Button
          variant="outline"
          fullWidth
        >
          Request Time Off
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
