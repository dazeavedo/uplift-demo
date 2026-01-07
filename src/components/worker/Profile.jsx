import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { leaderboard } from '../../data/mockData';
import WorkerNav from '../shared/WorkerNav';

export default function Profile() {
  const { currentUser, logout } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1F1F1F',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Header with logout */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#FFFFFF', margin: 0 }}>
          Profile
        </h1>
        <button
          onClick={logout}
          style={{
            background: 'rgba(255, 59, 48, 0.2)',
            border: '1px solid #FF3B30',
            color: '#FF3B30',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Profile header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '96px',
            height: '96px',
            borderRadius: '48px',
            background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '42px',
            fontWeight: '900',
            border: '4px solid rgba(255, 215, 0, 0.3)',
            boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
            color: '#2C2C2C'
          }}>
            {currentUser.initials}
          </div>
          <div style={{
            fontSize: '28px',
            fontWeight: '900',
            marginTop: '16px',
            color: '#FFFFFF'
          }}>
            {currentUser.name}
          </div>
          <div style={{
            fontSize: '15px',
            color: '#9CA3AF',
            marginTop: '4px'
          }}>
            {currentUser.role} • {currentUser.tenure} at {currentUser.location}
          </div>
        </div>

        {/* Points card */}
        <div style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          borderRadius: '24px',
          padding: '32px',
          color: '#2C2C2C',
          marginBottom: '24px',
          boxShadow: '0 12px 40px rgba(255, 215, 0, 0.4)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px'
          }}>
            <div>
              <div style={{
                fontSize: '14px',
                opacity: 0.8,
                fontWeight: '600'
              }}>
                Total Points
              </div>
              <div style={{
                fontSize: '64px',
                fontWeight: '900',
                lineHeight: 1
              }}>
                {currentUser.points.toLocaleString()}
              </div>
            </div>
            <div style={{
              padding: '12px 24px',
              background: 'rgba(44, 44, 44, 0.3)',
              borderRadius: '16px',
              fontSize: '18px',
              fontWeight: '900'
            }}>
              {currentUser.level}
            </div>
          </div>
          <div style={{
            background: 'rgba(44, 44, 44, 0.2)',
            height: '12px',
            borderRadius: '6px',
            overflow: 'hidden',
            marginBottom: '12px'
          }}>
            <div style={{
              background: '#2C2C2C',
              height: '100%',
              width: `${currentUser.levelProgress}%`,
              borderRadius: '6px'
            }} />
          </div>
          <div style={{
            fontSize: '14px',
            opacity: 0.9,
            fontWeight: '700'
          }}>
            {currentUser.pointsToNext} points to Gold • {currentUser.streak}-day streak 🔥
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '36px',
              fontWeight: '900',
              color: '#FFD700',
              marginBottom: '4px'
            }}>
              {currentUser.attendance}%
            </div>
            <div style={{
              fontSize: '13px',
              color: '#9CA3AF',
              fontWeight: '600'
            }}>
              Attendance
            </div>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '36px',
              fontWeight: '900',
              color: '#FFD700',
              marginBottom: '4px'
            }}>
              {currentUser.tasksCompleted}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#9CA3AF',
              fontWeight: '600'
            }}>
              Tasks Done
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          padding: '24px'
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '900',
            color: '#FFFFFF',
            marginBottom: '20px'
          }}>
            This Week's Leaderboard
          </div>
          {leaderboard.map((entry) => (
            <div
              key={entry.rank}
              style={{
                background: entry.highlight 
                  ? 'rgba(255, 215, 0, 0.1)' 
                  : 'transparent',
                border: entry.highlight 
                  ? '2px solid rgba(255, 215, 0, 0.5)' 
                  : 'none',
                borderRadius: '16px',
                padding: entry.highlight ? '18px' : '20px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  fontSize: entry.rank === 1 ? '48px' : '36px',
                  fontWeight: '900',
                  color: entry.rank === 1 ? '#FFD700' : '#9CA3AF',
                  minWidth: '50px'
                }}>
                  #{entry.rank}
                </div>
                <div>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '900',
                    color: '#FFFFFF'
                  }}>
                    {entry.name}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: entry.change > 0 ? '#10B981' : entry.change < 0 ? '#FF3B30' : '#9CA3AF',
                    marginTop: '2px'
                  }}>
                    {entry.change > 0 ? '↑' : entry.change < 0 ? '↓' : '−'}
                    {Math.abs(entry.change)} {entry.change !== 0 ? 'places' : ''}
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '900',
                color: entry.highlight ? '#FFD700' : '#10B981'
              }}>
                {entry.points.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <WorkerNav />
    </div>
  );
}
