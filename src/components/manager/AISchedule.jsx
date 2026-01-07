import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../shared/BottomNav';
import { Card, Button, Badge, StatCard } from '../shared/UIComponents';
import { mockData } from '../../data/mockData';

export default function AISchedule() {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [weekOffset, setWeekOffset] = useState(1);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const scheduleData = {
    totalHours: 320,
    workers: mockData.workers.length,
    avgHours: 32,
    coverage: 98,
    conflicts: 2
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
      {/* Hero Header */}
      <div style={{ 
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        padding: '24px 20px',
        paddingTop: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Momentum glow for AI/innovation context */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, var(--momentum-glow) 0%, transparent 70%)',
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
          ← Back to Dashboard
        </button>
        
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '900', 
          color: 'var(--text-primary)',
          marginBottom: '6px',
          position: 'relative',
          letterSpacing: '-0.5px'
        }}>
          AI Schedule Generator
        </h1>
        <p style={{ 
          fontSize: '15px', 
          color: 'var(--text-tertiary)',
          position: 'relative'
        }}>
          Let AI optimize your team schedule
        </p>
      </div>

      {/* Week Selector */}
      <div style={{ padding: '20px' }}>
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
          Schedule For
        </h2>
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Next Week', 'In 2 Weeks', 'In 3 Weeks'].map((label, idx) => (
            <button
              key={idx}
              onClick={() => setWeekOffset(idx + 1)}
              style={{
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                border: 'none',
                background: weekOffset === idx + 1 ? 'var(--momentum-bright)' : 'var(--bg-secondary)',
                color: weekOffset === idx + 1 ? '#FFF' : 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: weekOffset === idx + 1 ? '0 4px 12px rgba(255, 115, 45, 0.3)' : 'none'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration */}
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
          Optimization Goals
        </h2>
        
        <Card variant="elevated">
          {[
            { label: 'Maximize Coverage', value: true },
            { label: 'Balance Hours Fairly', value: true },
            { label: 'Respect Availability', value: true },
            { label: 'Minimize Overtime', value: true },
            { label: 'Group Experienced Workers', value: false }
          ].map((option, idx, arr) => (
            <div 
              key={idx}
              style={{ 
                padding: '16px 0',
                borderBottom: idx < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '15px', color: 'var(--text-primary)', fontWeight: '500' }}>{option.label}</span>
              <div style={{ 
                width: '48px',
                height: '26px',
                background: option.value ? 'var(--momentum-bright)' : 'var(--bg-tertiary)',
                borderRadius: '13px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}>
                <div style={{ 
                  width: '22px',
                  height: '22px',
                  background: '#FFF',
                  borderRadius: '50%',
                  position: 'absolute',
                  top: '2px',
                  left: option.value ? '24px' : '2px',
                  transition: 'left 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Generate Button */}
      {!generated && (
        <div style={{ padding: '0 20px 20px' }}>
          <Button
            variant="primary"
            fullWidth
            onClick={handleGenerate}
            disabled={generating}
            style={{
              cursor: generating ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '18px'
            }}
          >
            {generating ? (
              <>
                <div style={{ 
                  width: '16px',
                  height: '16px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#FFF',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
                Generating Schedule...
              </>
            ) : (
              <>🤖 Generate Optimal Schedule</>
            )}
          </Button>
        </div>
      )}

      {/* Generated Schedule */}
      {generated && (
        <>
          {/* Success Banner */}
          <div style={{ padding: '0 20px 20px' }}>
            <Card variant="elevated" style={{ 
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
              borderLeft: '4px solid var(--success-bright)'
            }}>
              <div style={{ fontSize: '16px', color: 'var(--success-bright)', marginBottom: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>✓</span> Schedule Generated Successfully
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Optimized for {scheduleData.workers} workers with {scheduleData.coverage}% coverage
              </div>
            </Card>
          </div>

          {/* Stats Grid */}
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <StatCard 
                value={scheduleData.totalHours}
                label="Total Hours"
                trend="neutral"
              />
              <StatCard 
                value={scheduleData.avgHours}
                label="Avg per Worker"
                trend="neutral"
              />
              <StatCard 
                value={scheduleData.conflicts}
                label="Conflicts"
                trend={scheduleData.conflicts > 0 ? 'down' : 'up'}
                color={scheduleData.conflicts > 0 ? 'warning' : 'success'}
              />
            </div>
          </div>

          {/* Team Schedule Preview */}
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
              Team Schedule Preview
            </h2>
            
            <Card variant="elevated">
              {mockData.workers.slice(0, 5).map((worker, idx, arr) => (
                <div 
                  key={worker.id}
                  style={{ 
                    padding: '14px 0',
                    borderBottom: idx < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {worker.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                    32 hours • 4 shifts scheduled
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Action Buttons */}
          <div style={{ padding: '0 20px' }}>
            <Button
              variant="primary"
              fullWidth
              style={{ marginBottom: '12px' }}
            >
              Publish Schedule
            </Button>
            
            <Button
              variant="outline"
              fullWidth
              onClick={() => setGenerated(false)}
            >
              Regenerate
            </Button>
          </div>
        </>
      )}

      <BottomNav />
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
