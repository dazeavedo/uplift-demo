import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../shared/BottomNav';
import { Card, Button, Badge, ProgressBar, StatCard } from '../shared/UIComponents';
import { mockData } from '../../data/mockData';

export default function Grow() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const worker = mockData.workers[0];

  const filters = ['all', 'matched', 'stretch'];

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
          marginBottom: '6px',
          position: 'relative',
          letterSpacing: '-0.5px'
        }}>
          Your Next Move 🎯
        </h1>
        <p style={{ 
          fontSize: '15px', 
          color: 'var(--text-tertiary)',
          position: 'relative'
        }}>
          Explore opportunities matched to your skills
        </p>
      </div>

      {/* Career Progress Card */}
      <div style={{ padding: '20px' }}>
        <Card variant="elevated" style={{
          background: 'linear-gradient(135deg, var(--steel-bright) 0%, var(--steel-deep) 100%)',
          animation: 'slideUp 0.4s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', marginBottom: '4px' }}>
                Current Level
              </div>
              <div style={{ fontSize: '40px', fontWeight: '900', color: '#FFF', lineHeight: 1 }}>
                {worker.level}
              </div>
            </div>
            <Badge variant="default" style={{ background: 'rgba(255,255,255,0.2)', color: '#FFF', fontSize: '13px' }}>
              {worker.skillsCompleted} skills earned
            </Badge>
          </div>
          <ProgressBar 
            value={worker.skillsCompleted} 
            max={50}
            height={10}
            color="momentum"
          />
          <div style={{ 
            fontSize: '12px', 
            color: 'rgba(255,255,255,0.9)', 
            marginTop: '10px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>{50 - worker.skillsCompleted} skills to Level {worker.level + 1}</span>
            <span>{Math.round((worker.skillsCompleted / 50) * 100)}%</span>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--radius-pill)',
                border: 'none',
                background: filter === f ? 'var(--steel-bright)' : 'var(--bg-elevated)',
                color: filter === f ? '#FFF' : 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textTransform: 'capitalize',
                transition: 'all var(--transition-base)'
              }}
            >
              {f === 'all' ? 'All Roles' : f === 'matched' ? 'Great Match' : 'Stretch Goals'}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities */}
      <div style={{ padding: '0 20px 20px' }}>
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
          Available Opportunities
        </h2>
        
        {mockData.jobs.map((job, idx) => {
          const matchPercentage = Math.floor(Math.random() * 30) + 60;
          const isMatched = matchPercentage >= 75;
          
          if (filter === 'matched' && !isMatched) return null;
          if (filter === 'stretch' && isMatched) return null;

          return (
            <Card 
              key={job.id}
              variant="elevated"
              onClick={() => navigate(`/job/${job.id}`)}
              style={{ 
                marginBottom: '16px',
                cursor: 'pointer',
                animation: `slideUp ${0.4 + idx * 0.1}s ease-out`,
                borderLeft: isMatched ? '4px solid var(--success-bright)' : '4px solid var(--steel-bright)'
              }}
            >
              {/* Job Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {job.title}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
                    {job.department}
                  </div>
                </div>
                <div style={{ 
                  background: isMatched ? 'var(--success-glow)' : 'var(--steel-glow)',
                  color: isMatched ? 'var(--success-bright)' : 'var(--steel-bright)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '20px',
                  fontWeight: '900',
                  minWidth: '70px',
                  textAlign: 'center'
                }}>
                  {matchPercentage}%
                </div>
              </div>

              {/* Match Badge */}
              <div style={{ marginBottom: '12px' }}>
                {isMatched ? (
                  <Badge variant="success" size="md">
                    ⭐ Great Match
                  </Badge>
                ) : (
                  <Badge variant="steel" size="md">
                    🎯 Stretch Goal
                  </Badge>
                )}
              </div>

              {/* Skills */}
              <div style={{ 
                display: 'flex', 
                gap: '6px', 
                flexWrap: 'wrap',
                marginBottom: '16px'
              }}>
                {job.skills.slice(0, 4).map((skill, skillIdx) => (
                  <Badge key={skillIdx} variant={isMatched ? 'success' : 'steel'} size="sm">
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 4 && (
                  <Badge variant="default" size="sm">
                    +{job.skills.length - 4}
                  </Badge>
                )}
              </div>

              {/* Job Details */}
              <div style={{ 
                paddingTop: '16px',
                borderTop: '1px solid var(--bg-elevated)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                  <span>💰 {job.payRange}</span>
                  <span>📍 {job.location}</span>
                </div>
                <div style={{ 
                  fontSize: '14px', 
                  color: isMatched ? 'var(--success-bright)' : 'var(--steel-bright)',
                  fontWeight: '600'
                }}>
                  View Details →
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Career Path CTA */}
      <div style={{ padding: '0 20px 24px' }}>
        <Card variant="momentum" style={{
          background: 'var(--momentum-glow)',
          border: '2px solid var(--momentum-bright)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💡</div>
          <div style={{ fontSize: '17px', fontWeight: '700', color: 'var(--momentum-bright)', marginBottom: '6px' }}>
            Not seeing the right fit?
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Keep earning skills and new opportunities will unlock
          </div>
          <Button 
            variant="secondary"
            size="md"
            onClick={() => navigate('/tasks')}
          >
            Earn More Skills
          </Button>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
