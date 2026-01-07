import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../shared/BottomNav';
import { Card, Button, Badge, StatCard } from '../shared/UIComponents';
import { mockData } from '../../data/mockData';

export default function ManagerDashboard() {
  const navigate = useNavigate();

  const stats = {
    teamSize: mockData.workers.length,
    openShifts: 12,
    pendingApplications: 8,
    avgSkillLevel: 7.2,
    retention: 94,
    industryRetention: 78
  };

  const recentActivity = [
    { icon: '📋', text: 'New application from Maria Garcia for Team Lead', time: '2h ago', type: 'application' },
    { icon: '🔄', text: 'Shift swap approved between John and Sarah', time: '4h ago', type: 'shift' },
    { icon: '⭐', text: 'Skills verified for 3 team members', time: '1d ago', type: 'skill' },
    { icon: '📅', text: 'Next week schedule published', time: '2d ago', type: 'schedule' }
  ];

  const topPerformers = mockData.workers
    .sort((a, b) => b.skillsCompleted - a.skillsCompleted)
    .slice(0, 5);

  const readyForPromotion = mockData.workers.filter(w => w.skillsCompleted >= 25).length;

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
          background: 'radial-gradient(circle, var(--momentum-glow) 0%, transparent 70%)',
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
          Team Dashboard 📊
        </h1>
        <p style={{ 
          fontSize: '15px', 
          color: 'var(--text-tertiary)',
          position: 'relative'
        }}>
          Your team overview & insights
        </p>
      </div>

      {/* Coaching Prompt (Marc Benioff's feedback) */}
      {readyForPromotion > 0 && (
        <div style={{ padding: '20px' }}>
          <Card variant="momentum" style={{
            background: 'var(--momentum-glow)',
            border: '2px solid var(--momentum-bright)',
            animation: 'slideUp 0.4s ease-out'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💡</div>
            <div style={{ fontSize: '17px', fontWeight: '700', color: 'var(--momentum-bright)', marginBottom: '6px' }}>
              Coaching Opportunity
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
              {readyForPromotion} of your team members are ready for promotion based on skill completion
            </div>
            <Button variant="secondary" size="sm" onClick={() => navigate('/manager/team')}>
              Review Team →
            </Button>
          </Card>
        </div>
      )}

      {/* Key Metrics with Competitive Benchmarking (Martin Sorrell's feedback) */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '12px' }}>
          <StatCard
            value={stats.teamSize}
            label="Team Members"
            icon="👥"
            color="steel"
          />
          <StatCard
            value={`${stats.retention}%`}
            label="Retention Rate"
            trend={`↑ ${stats.retention - stats.industryRetention}% vs industry (${stats.industryRetention}%)`}
            color="success"
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <StatCard
            value={stats.openShifts}
            label="Open Shifts"
            color="neutral"
          />
          <StatCard
            value={stats.pendingApplications}
            label="Pending Apps"
            color="neutral"
          />
          <StatCard
            value={stats.avgSkillLevel}
            label="Avg Skills"
            color="neutral"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '0 20px 20px' }}>
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
            background: 'var(--momentum-bright)',
            borderRadius: '2px'
          }} />
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {[
            { icon: '📅', label: 'AI Schedule', route: '/manager/ai-schedule', color: 'var(--steel-bright)' },
            { icon: '👥', label: 'My Team', route: '/manager/team', color: 'var(--success-bright)' },
            { icon: '📋', label: 'Applications', count: stats.pendingApplications, color: 'var(--alert-warning)' },
            { icon: '📊', label: 'Analytics', color: 'var(--momentum-bright)' }
          ].map((action, idx) => (
            <Card
              key={idx}
              variant="elevated"
              onClick={() => action.route && navigate(action.route)}
              style={{
                padding: '20px',
                cursor: 'pointer',
                position: 'relative',
                animation: `slideUp ${0.4 + idx * 0.1}s ease-out`
              }}
            >
              {action.count && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: action.color,
                  color: '#FFF',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '4px 8px',
                  borderRadius: '10px',
                  minWidth: '24px',
                  textAlign: 'center'
                }}>
                  {action.count}
                </div>
              )}
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{action.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                {action.label}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div style={{ padding: '0 20px 20px' }}>
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
            background: 'var(--success-bright)',
            borderRadius: '2px'
          }} />
          Top Performers This Month
        </h2>
        <Card variant="elevated">
          {topPerformers.map((worker, idx) => (
            <div 
              key={worker.id}
              style={{ 
                padding: '12px 0',
                borderBottom: idx < topPerformers.length - 1 ? '1px solid var(--bg-elevated)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{ 
                width: '36px',
                height: '36px',
                background: idx < 3 ? 'var(--alert-warning)' : 'var(--bg-elevated)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                color: '#FFF',
                flexShrink: 0
              }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {worker.name}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                  {worker.role}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--success-bright)' }}>
                  {worker.skillsCompleted}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>
                  skills
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Recent Activity */}
      <div style={{ padding: '0 20px 20px' }}>
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
          Recent Activity
        </h2>
        <Card variant="elevated">
          {recentActivity.map((activity, idx) => (
            <div 
              key={idx}
              style={{ 
                padding: '12px 0',
                borderBottom: idx < recentActivity.length - 1 ? '1px solid var(--bg-elevated)' : 'none',
                display: 'flex',
                alignItems: 'start',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '22px', marginTop: '2px' }}>{activity.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px', lineHeight: '1.4' }}>
                  {activity.text}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}

  const recentActivity = [
    { icon: '📋', text: 'New application from Maria Garcia for Team Lead', time: '2h ago', type: 'application' },
    { icon: '🔄', text: 'Shift swap approved between John and Sarah', time: '4h ago', type: 'shift' },
    { icon: '⭐', text: 'Skills verified for 3 team members', time: '1d ago', type: 'skill' },
    { icon: '📅', text: 'Next week schedule published', time: '2d ago', type: 'schedule' }
  ];

  const topPerformers = mockData.workers
    .sort((a, b) => b.skillsCompleted - a.skillsCompleted)
    .slice(0, 5);

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
          Manager Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
          Your team overview
        </p>
      </div>

      {/* Key Metrics */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '12px' }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>
              {stats.teamSize}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
              Team Members
            </div>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>
              {stats.retention}%
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
              Retention Rate
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          <div style={{ 
            background: '#2C2C2C',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #3A3A3A',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#F59E0B', marginBottom: '4px' }}>
              {stats.openShifts}
            </div>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
              Open Shifts
            </div>
          </div>
          <div style={{ 
            background: '#2C2C2C',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #3A3A3A',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#6366F1', marginBottom: '4px' }}>
              {stats.pendingApplications}
            </div>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
              Pending Apps
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
              {stats.avgSkillLevel}
            </div>
            <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
              Avg Skills
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '0 20px 20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', marginBottom: '12px' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {[
            { icon: '📅', label: 'AI Schedule', route: '/manager/ai-schedule', color: '#6366F1' },
            { icon: '👥', label: 'My Team', route: '/manager/team', color: '#10B981' },
            { icon: '📋', label: 'Applications', count: stats.pendingApplications, color: '#F59E0B' },
            { icon: '📊', label: 'Analytics', color: '#8B5CF6' }
          ].map((action, idx) => (
            <button
              key={idx}
              onClick={() => action.route && navigate(action.route)}
              style={{
                background: '#2C2C2C',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #3A3A3A',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              {action.count && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: action.color,
                  color: '#FFF',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {action.count}
                </div>
              )}
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{action.icon}</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFF' }}>
                {action.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Top Performers */}
      <div style={{ padding: '0 20px 20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', marginBottom: '12px' }}>
          Top Performers This Month
        </h2>
        <div style={{ 
          background: '#2C2C2C',
          borderRadius: '12px',
          border: '1px solid #3A3A3A',
          overflow: 'hidden'
        }}>
          {topPerformers.map((worker, idx) => (
            <div 
              key={worker.id}
              style={{ 
                padding: '12px 16px',
                borderBottom: idx < topPerformers.length - 1 ? '1px solid #3A3A3A' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{ 
                width: '32px',
                height: '32px',
                background: idx < 3 ? '#F59E0B' : '#3A3A3A',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '700',
                color: '#FFF',
                flexShrink: 0
              }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#FFF', marginBottom: '2px' }}>
                  {worker.name}
                </div>
                <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                  {worker.role}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#10B981' }}>
                  {worker.skillsCompleted}
                </div>
                <div style={{ fontSize: '11px', color: '#9CA3AF' }}>
                  skills
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ padding: '0 20px 20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', marginBottom: '12px' }}>
          Recent Activity
        </h2>
        <div style={{ 
          background: '#2C2C2C',
          borderRadius: '12px',
          border: '1px solid #3A3A3A',
          overflow: 'hidden'
        }}>
          {recentActivity.map((activity, idx) => (
            <div 
              key={idx}
              style={{ 
                padding: '12px 16px',
                borderBottom: idx < recentActivity.length - 1 ? '1px solid #3A3A3A' : 'none',
                display: 'flex',
                alignItems: 'start',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '20px', marginTop: '2px' }}>{activity.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', color: '#D1D5DB', marginBottom: '4px' }}>
                  {activity.text}
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
