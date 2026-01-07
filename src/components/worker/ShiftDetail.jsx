import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shifts } from '../../data/mockData';
import WorkerNav from '../shared/WorkerNav';

export default function ShiftDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shift = shifts.find(s => s.id === id);
  const [swapRequested, setSwapRequested] = useState(false);

  if (!shift) {
    return <div>Shift not found</div>;
  }

  const handleSwapRequest = () => {
    setSwapRequested(true);
    setTimeout(() => {
      alert('Swap request sent! Check your notifications.');
    }, 500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1F1F1F',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <button
          onClick={() => navigate('/worker/schedule')}
          style={{
            background: 'none',
            border: 'none',
            color: '#4A90E2',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
        <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
          {shift.dayName}, Jan {shift.date.split('-')[2]}
        </div>
        <div style={{ fontSize: '14px', color: '#9CA3AF' }}>···</div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Time & location */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#FFFFFF',
            marginBottom: '8px'
          }}>
            {shift.startTime} - {shift.endTime}
          </div>
          <div style={{
            fontSize: '18px',
            color: '#9CA3AF',
            fontWeight: '600'
          }}>
            {shift.duration} hours • £{shift.pay}
          </div>
        </div>

        {/* Location card */}
        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          border: '2px solid rgba(255, 215, 0, 0.5)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            fontSize: '13px',
            color: '#9CA3AF',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            LOCATION
          </div>
          <div style={{
            fontSize: '20px',
            fontWeight: '900',
            color: '#FFFFFF',
            marginBottom: '4px'
          }}>
            {shift.location}
          </div>
          <div style={{ fontSize: '15px', color: '#9CA3AF' }}>
            123 High Street • {shift.distance} away
          </div>
        </div>

        {/* Weather */}
        {shift.weather && (
          <div style={{
            background: 'rgba(74, 144, 226, 0.1)',
            border: '1px solid rgba(74, 144, 226, 0.3)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ fontSize: '48px' }}>{shift.weather.icon}</div>
            <div>
              <div style={{
                fontSize: '18px',
                fontWeight: '900',
                color: '#FFFFFF'
              }}>
                {shift.weather.temp}°C {shift.weather.condition}
              </div>
              <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                Perfect shift weather
              </div>
            </div>
          </div>
        )}

        {/* Team */}
        {shift.team && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '16px',
              fontWeight: '900',
              color: '#FFFFFF',
              marginBottom: '16px'
            }}>
              Your Team ({shift.team.length} people)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {shift.team.map((member, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '22px',
                    background: idx === 0 
                      ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                      : idx === 1
                      ? 'linear-gradient(135deg, #4A90E2, #357ABD)'
                      : 'linear-gradient(135deg, #10B981, #059669)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    color: '#FFFFFF',
                    fontSize: '16px'
                  }}>
                    {member.initials}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#FFFFFF'
                    }}>
                      {member.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                      {member.role} • {member.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            onClick={handleSwapRequest}
            disabled={swapRequested}
            style={{
              padding: '16px',
              background: swapRequested 
                ? 'rgba(16, 185, 129, 0.2)' 
                : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              color: swapRequested ? '#10B981' : '#FFFFFF',
              cursor: swapRequested ? 'default' : 'pointer'
            }}
          >
            {swapRequested ? '✓ Requested' : 'Request Swap'}
          </button>
          <button
            style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '700',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            Call Out Sick
          </button>
        </div>
      </div>

      <WorkerNav />
    </div>
  );
}
