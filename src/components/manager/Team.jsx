import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../shared/BottomNav';
import { Card, Button, Badge } from '../shared/UIComponents';
import { mockData } from '../../data/mockData';

export default function Team() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filters = ['all', 'sales', 'operations', 'customer service'];

  const filteredWorkers = mockData.workers.filter(worker => {
    const matchesFilter = filter === 'all' || worker.department.toLowerCase() === filter;
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          worker.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        {/* Steel glow for team/operational context */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, var(--steel-glow) 0%, transparent 70%)',
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
          My Team
        </h1>
        <p style={{ 
          fontSize: '15px', 
          color: 'var(--text-tertiary)',
          position: 'relative'
        }}>
          {mockData.workers.length} team members
        </p>
      </div>

      {/* Search */}
      <div style={{ padding: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '16px 18px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--text-primary)',
            fontSize: '15px',
            fontFamily: 'inherit',
            animation: 'slideUp 0.4s ease-out'
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {filters.map((f, idx) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '10px 18px',
                borderRadius: '20px',
                border: 'none',
                background: filter === f ? 'var(--momentum-bright)' : 'var(--bg-secondary)',
                color: filter === f ? '#FFF' : 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease',
                boxShadow: filter === f ? '0 4px 12px rgba(255, 115, 45, 0.3)' : 'none',
                animation: `slideUp ${0.5 + idx * 0.05}s ease-out`
              }}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Team Members */}
      <div style={{ padding: '0 20px' }}>
        {filteredWorkers.length === 0 ? (
          <Card variant="elevated" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px', opacity: '0.5' }}>🔍</div>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
              No team members found
            </div>
          </Card>
        ) : (
          filteredWorkers.map((worker, idx) => (
            <Card 
              key={worker.id}
              variant="elevated"
              style={{ 
                marginBottom: '16px',
                cursor: 'pointer',
                animation: `slideUp ${0.6 + idx * 0.05}s ease-out`,
                borderLeft: '4px solid var(--steel-bright)'
              }}
            >
              {/* Worker Header */}
              <div style={{ display: 'flex', gap: '14px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '56px',
                  height: '56px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0
                }}>
                  👤
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {worker.name}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {worker.role} • {worker.department}
                  </div>
                  <Badge variant="success" size="sm">
                    Level {worker.level}
                  </Badge>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {worker.skillsCompleted}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Skills
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {worker.hoursWorked}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Hours
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {worker.shiftsCompleted}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Shifts
                  </div>
                </div>
              </div>

              {/* Skills Preview */}
              {worker.skills && worker.skills.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Top Skills
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {worker.skills.slice(0, 3).map((skill, idx) => (
                      <Badge 
                        key={idx}
                        variant="default"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {worker.skills.length > 3 && (
                      <span style={{ 
                        fontSize: '13px',
                        color: 'var(--text-tertiary)',
                        alignSelf: 'center'
                      }}>
                        +{worker.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="outline"
                  size="sm"
                  style={{ flex: 1 }}
                >
                  View Profile
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  style={{ flex: 1 }}
                >
                  Verify Skill
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
