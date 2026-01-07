import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { managerDashboard } from '../../data/mockData';

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const data = managerDashboard;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1F1F1F',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '40px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '36px'
      }}>
        <div>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#FFFFFF',
            margin: 0,
            marginBottom: '6px'
          }}>
            Dashboard
          </h1>
          <div style={{
            fontSize: '16px',
            color: '#9CA3AF',
            fontWeight: '600'
          }}>
            Urban Eats Downtown • Wednesday, Jan 7
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/manager/schedule')}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 215, 0, 0.2)',
              border: '2px solid #FFD700',
              borderRadius: '12px',
              color: '#FFD700',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            AI Schedule
          </button>
          <button
            onClick={logout}
            style={{
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Top stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'rgba(255, 215, 0, 0.1)',
          border: '2px solid rgba(255, 215, 0, 0.5)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#9CA3AF',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            CLOCKED IN
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#FFD700',
            marginBottom: '4px'
          }}>
            {data.stats.clockedIn.current} / {data.stats.clockedIn.total}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#10B981',
            fontWeight: '700'
          }}>
            ↑ {data.stats.clockedIn.change}% vs yesterday
          </div>
        </div>

        <div style={{
          background: 'rgba(74, 144, 226, 0.1)',
          border: '2px solid rgba(74, 144, 226, 0.4)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#9CA3AF',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            OPEN SHIFTS
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#4A90E2',
            marginBottom: '4px'
          }}>
            {data.stats.openShifts.current}
          </div>
          <div style={{
            fontSize: '13px',
            color: '#9CA3AF',
            fontWeight: '700'
          }}>
            {data.stats.openShifts.period}
          </div>
        </div>

        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#9CA3AF',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            ATTENDANCE
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#10B981',
            marginBottom: '4px'
          }}>
            {data.stats.attendance.current}%
          </div>
          <div style={{
            fontSize: '13px',
            color: '#10B981',
            fontWeight: '700'
          }}>
            ↑ {data.stats.attendance.change}% {data.stats.attendance.period}
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <div style={{
            fontSize: '14px',
            color: '#9CA3AF',
            fontWeight: '700',
            marginBottom: '8px'
          }}>
            LABOR COST
          </div>
          <div style={{
            fontSize: '48px',
            fontWeight: '900',
            color: '#FFFFFF',
            marginBottom: '4px'
          }}>
            £{(data.stats.laborCost.current / 1000).toFixed(1)}k
          </div>
          <div style={{
            fontSize: '13px',
            color: '#9CA3AF',
            fontWeight: '700'
          }}>
            {data.stats.laborCost.period}
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Alerts */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '900',
            color: '#FFFFFF',
            marginBottom: '20px',
            margin: 0
          }}>
            Alerts
          </h2>
          {data.alerts.map((alert) => (
            <div
              key={alert.id}
              style={{
                background: alert.color === 'red' 
                  ? 'rgba(255, 59, 48, 0.1)' 
                  : alert.color === 'orange'
                  ? 'rgba(255, 149, 0, 0.1)'
                  : 'rgba(255, 215, 0, 0.1)',
                borderLeft: `4px solid ${
                  alert.color === 'red' ? '#FF3B30' :
                  alert.color === 'orange' ? '#FF9500' : '#FFD700'
                }`,
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px'
              }}
            >
              <div style={{
                fontSize: '15px',
                fontWeight: '700',
                color: alert.color === 'red' ? '#FF3B30' :
                  alert.color === 'orange' ? '#FF9500' : '#FFD700',
                marginBottom: '6px'
              }}>
                {alert.title}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#E5E7EB'
              }}>
                {alert.description}
              </div>
            </div>
          ))}
        </div>

        {/* Team status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px'
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '900',
            color: '#FFFFFF',
            marginBottom: '20px',
            margin: 0
          }}>
            Who's Working Now
          </h2>
          {data.teamStatus.map((member, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '12px',
                marginBottom: '12px'
              }}
            >
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '6px',
                background: '#10B981'
              }} />
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  color: '#FFFFFF'
                }}>
                  {member.name}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#9CA3AF'
                }}>
                  {member.role} • Clocked in {member.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
