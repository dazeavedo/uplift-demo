import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../shared/BottomNav';
import { Card, StatCard, Button, Badge, ProgressBar, LoadingSpinner } from '../shared/UIComponents';
import { mockData } from '../../data/mockData';

export default function WorkerHome() {
  const navigate = useNavigate();
  const worker = mockData.workers[0];
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 800);

    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'var(--bg-primary)', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
      {/* Hero Header with Momentum */}
      <div style={{ 
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        padding: '24px 20px',
        paddingTop: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative element */}
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
          {greeting}, {worker.name.split(' ')[0]}! 👋
        </h1>
        <p style={{ 
          fontSize: '15px', 
          color: 'var(--text-tertiary)',
          position: 'relative'
        }}>
          You're building momentum—{worker.skillsCompleted} skills earned
        </p>
      </div>

      {/* Level Progress Card */}
      <div style={{ padding: '20px' }}>
        <Card variant="momentum" style={{ 
          animation: 'slideUp 0.4s ease-out',
          background: 'linear-gradient(135deg, var(--momentum-bright) 0%, var(--momentum-deep) 100%)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginBottom: '4px' }}>
                Career Level
              </div>
              <div style={{ fontSize: '36px', fontWeight: '900', color: '#FFF', lineHeight: 1 }}>
                {worker.level}
              </div>
            </div>
            <Badge variant="default" style={{ background: 'rgba(255,255,255,0.2)', color: '#FFF' }}>
              {50 - worker.skillsCompleted} to Level {worker.level + 1}
            </Badge>
          </div>
          <ProgressBar 
            value={worker.skillsCompleted} 
            max={50}
            height={10}
            color="success"
          />
          <div style={{ 
            fontSize: '12px', 
            color: 'rgba(255,255,255,0.9)', 
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Keep going!</span>
            <span>{Math.round((worker.skillsCompleted / 50) * 100)}% complete</span>
          </div>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ 
        padding: '0 20px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        animation: 'slideUp 0.5s ease-out'
      }}>
        <StatCard
          value={worker.hoursWorked}
          label="Hours This Month"
          icon="⏱️"
          color="steel"
        />
        <StatCard
          value={worker.shiftsCompleted}
          label="Shifts Completed"
          icon="✓"
          color="success"
        />
      </div>

      {/* Next Shift - High Priority */}
      <div style={{ padding: '0 20px 24px' }}>
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
          Next Up
        </h2>
        <Card 
          variant="elevated"
          onClick={() => navigate('/shift/1')}
          style={{ 
            borderLeft: '4px solid var(--momentum-bright)',
            cursor: 'pointer',
            animation: 'slideUp 0.6s ease-out'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                {mockData.shifts[0].role}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                {mockData.shifts[0].location}
              </div>
            </div>
            <Badge variant="success">Confirmed</Badge>
          </div>
          <div style={{ 
            display: 'flex',
            gap: '16px',
            fontSize: '14px',
            color: 'var(--text-secondary)'
          }}>
            <span>📅 {mockData.shifts[0].date}</span>
            <span>🕐 {mockData.shifts[0].time}</span>
          </div>
          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--bg-elevated)',
            fontSize: '13px',
            color: 'var(--momentum-bright)',
            fontWeight: '600'
          }}>
            Tap to view details →
          </div>
        </Card>
      </div>

      {/* Growth Opportunities */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '12px'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
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
            Your Next Move
          </h2>
          <button
            onClick={() => navigate('/grow')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--steel-bright)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            See All →
          </button>
        </div>
        
        {mockData.jobs.slice(0, 2).map((job, idx) => {
          const matchScore = idx === 0 ? 87 : 72;
          return (
            <Card
              key={job.id}
              variant="glass"
              onClick={() => navigate(`/job/${job.id}`)}
              style={{ 
                marginBottom: '12px',
                cursor: 'pointer',
                animation: `slideUp ${0.7 + idx * 0.1}s ease-out`,
                border: idx === 0 ? '1px solid var(--steel-glow)' : '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                    {job.department}
                  </div>
                </div>
                <div style={{ 
                  background: matchScore >= 80 ? 'var(--success-glow)' : 'var(--steel-glow)',
                  color: matchScore >= 80 ? 'var(--success-bright)' : 'var(--steel-bright)',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '16px',
                  fontWeight: '900'
                }}>
                  {matchScore}%
                </div>
              </div>

              {idx === 0 && (
                <div style={{
                  background: 'var(--success-glow)',
                  color: 'var(--success-bright)',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginBottom: '8px'
                }}>
                  ⭐ Great Match
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                gap: '6px', 
                flexWrap: 'wrap',
                marginBottom: '12px'
              }}>
                {job.skills.slice(0, 3).map((skill, skillIdx) => (
                  <Badge key={skillIdx} variant="steel" size="sm">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div style={{
                paddingTop: '12px',
                borderTop: '1px solid var(--bg-elevated)',
                fontSize: '13px',
                color: 'var(--text-tertiary)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>💰 {job.payRange}</span>
                <span style={{ color: 'var(--steel-bright)', fontWeight: '600' }}>Learn More →</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Today's Tasks */}
      <div style={{ padding: '0 20px 24px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '12px'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
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
            Quick Wins
          </h2>
          <button
            onClick={() => navigate('/tasks')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--success-bright)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '0'
            }}
          >
            All Tasks →
          </button>
        </div>

        <Card variant="elevated" style={{ animation: 'slideUp 0.9s ease-out' }}>
          {mockData.tasks.slice(0, 3).map((task, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                paddingBottom: idx < 2 ? '16px' : '0',
                marginBottom: idx < 2 ? '16px' : '0',
                borderBottom: idx < 2 ? '1px solid var(--bg-elevated)' : 'none'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--momentum-glow)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                flexShrink: 0
              }}>
                {task.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {task.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                  {task.duration} • +{task.points} points
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/tasks');
                }}
              >
                Start
              </Button>
            </div>
          ))}
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
