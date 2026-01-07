import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Team() {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'Marc Hunt',
      role: 'Server',
      status: 'working',
      points: 1282,
      attendance: 96,
      promotion: { ready: true, role: 'Shift Supervisor', match: 85 }
    },
    {
      name: 'Jessica Bano',
      role: 'Bartender',
      status: 'working',
      points: 1104,
      attendance: 94,
      promotion: null
    },
    {
      name: 'Thomas Cane',
      role: 'Line Cook',
      status: 'working',
      points: 987,
      attendance: 98,
      promotion: null
    },
    {
      name: 'Anna Chen',
      role: 'Server',
      status: 'off',
      points: 856,
      attendance: 92,
      promotion: null
    },
    {
      name: 'Sofia Martinez',
      role: 'Host',
      status: 'off',
      points: 723,
      attendance: 89,
      promotion: null
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1F1F1F',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '40px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <button
          onClick={() => navigate('/manager')}
          style={{
            background: 'none',
            border: 'none',
            color: '#4A90E2',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            marginBottom: '12px'
          }}
        >
          ← Back to Dashboard
        </button>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '900',
          color: '#FFFFFF',
          margin: 0
        }}>
          Team
        </h1>
        <div style={{
          fontSize: '16px',
          color: '#9CA3AF',
          fontWeight: '600',
          marginTop: '6px'
        }}>
          {teamMembers.length} team members • {teamMembers.filter(m => m.status === 'working').length} working now
        </div>
      </div>

      {/* Team grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '24px'
      }}>
        {teamMembers.map((member, idx) => (
          <div
            key={idx}
            style={{
              background: member.promotion 
                ? 'rgba(255, 215, 0, 0.08)' 
                : 'rgba(255, 255, 255, 0.03)',
              border: member.promotion 
                ? '2px solid rgba(255, 215, 0, 0.5)' 
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '24px'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{
                  fontSize: '22px',
                  fontWeight: '900',
                  color: '#FFFFFF',
                  marginBottom: '4px'
                }}>
                  {member.name}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  fontWeight: '600'
                }}>
                  {member.role}
                </div>
              </div>
              <div style={{
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                background: member.status === 'working' 
                  ? 'rgba(16, 185, 129, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                color: member.status === 'working' ? '#10B981' : '#9CA3AF'
              }}>
                {member.status === 'working' ? '● Working' : 'Off Today'}
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#FFD700',
                  marginBottom: '4px'
                }}>
                  {member.points.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#9CA3AF',
                  fontWeight: '600'
                }}>
                  Points
                </div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: '900',
                  color: '#10B981',
                  marginBottom: '4px'
                }}>
                  {member.attendance}%
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#9CA3AF',
                  fontWeight: '600'
                }}>
                  Attendance
                </div>
              </div>
            </div>

            {/* Promotion ready */}
            {member.promotion && (
              <div style={{
                background: 'rgba(255, 215, 0, 0.2)',
                borderLeft: '4px solid #FFD700',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#FFD700',
                  marginBottom: '6px'
                }}>
                  🎯 Ready for Promotion
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#E5E7EB',
                  marginBottom: '4px'
                }}>
                  {member.promotion.role}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#9CA3AF'
                }}>
                  {member.promotion.match}% match
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                View Profile
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '12px',
                  background: 'rgba(74, 144, 226, 0.2)',
                  border: '1px solid #4A90E2',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#4A90E2',
                  cursor: 'pointer'
                }}
              >
                Message
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
