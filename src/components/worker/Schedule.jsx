import React from 'react';
import { useNavigate } from 'react-router-dom';
import { shifts } from '../../data/mockData';
import WorkerNav from '../shared/WorkerNav';

export default function Schedule() {
  const navigate = useNavigate();

  const getColorForShift = (index) => {
    const colors = [
      { bg: 'rgba(255, 215, 0, 0.1)', border: '#FFD700', color: '#FFD700' },
      { bg: 'rgba(74, 144, 226, 0.1)', border: '#4A90E2', color: '#4A90E2' },
      { bg: 'rgba(16, 185, 129, 0.1)', border: '#10B981', color: '#10B981' }
    ];
    return colors[index % colors.length];
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1F1F1F',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#FFFFFF', margin: 0 }}>
            Schedule
          </h1>
          <div style={{
            padding: '8px 16px',
            background: 'rgba(255, 215, 0, 0.2)',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '700',
            color: '#FFD700'
          }}>
            This Week
          </div>
        </div>
        <div style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '600', marginTop: '4px' }}>
          Jan 7-13, 2026
        </div>
      </div>

      {/* Shifts list */}
      <div style={{ padding: '20px 24px' }}>
        {shifts.map((shift, index) => {
          const colors = getColorForShift(index);
          return (
            <div
              key={shift.id}
              onClick={() => navigate(`/worker/shift/${shift.id}`)}
              style={{
                background: colors.bg,
                borderLeft: `4px solid ${colors.border}`,
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Date and duration */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <div>
                  <div style={{
                    fontSize: '13px',
                    color: '#9CA3AF',
                    fontWeight: '600',
                    marginBottom: '4px',
                    textTransform: 'uppercase'
                  }}>
                    {shift.dayName.toUpperCase()}, JAN {shift.date.split('-')[2]}
                  </div>
                  <div style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    color: '#FFFFFF'
                  }}>
                    {shift.startTime} - {shift.endTime}
                  </div>
                </div>
                <div style={{
                  padding: '6px 12px',
                  background: `${colors.color}33`,
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: colors.color
                }}>
                  {shift.duration}h
                </div>
              </div>

              {/* Location and pay */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{
                    fontSize: '15px',
                    color: '#E5E7EB',
                    fontWeight: '600'
                  }}>
                    {shift.role} • {shift.location}
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#9CA3AF',
                    marginTop: '4px'
                  }}>
                    {shift.distance} away
                  </div>
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '900',
                  color: colors.color
                }}>
                  £{shift.pay}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary card */}
      <div style={{ padding: '0 24px 24px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>
              Total Hours
            </div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#FFFFFF' }}>
              {shifts.reduce((sum, s) => sum + s.duration, 0)}h
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>
              Total Pay
            </div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#10B981' }}>
              £{shifts.reduce((sum, s) => sum + s.pay, 0)}
            </div>
          </div>
        </div>
      </div>

      <WorkerNav />
    </div>
  );
}
