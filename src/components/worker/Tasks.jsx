import React, { useState } from 'react';
import BottomNav from '../shared/BottomNav';
import { Card, Button, Badge, ProgressBar, StatCard } from '../shared/UIComponents';
import { mockData } from '../../data/mockData';

export default function Tasks() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [celebrating, setCelebrating] = useState(null);

  const handleCompleteTask = (taskTitle) => {
    if (!completedTasks.includes(taskTitle)) {
      setCompletedTasks([...completedTasks, taskTitle]);
      setCelebrating(taskTitle);
      setTimeout(() => setCelebrating(null), 2000);
    }
  };

  const availableTasks = mockData.tasks.filter(t => !completedTasks.includes(t.title));
  const totalPoints = mockData.tasks.reduce((sum, task) => 
    completedTasks.includes(task.title) ? sum + task.points : sum, 0
  );
  const progress = (completedTasks.length / mockData.tasks.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
      {/* Celebration Modal */}
      {celebrating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{ textAlign: 'center', animation: 'slideUp 0.5s ease-out' }}>
            <div style={{ fontSize: '80px', marginBottom: '16px', animation: 'pulse-momentum 1s infinite' }}>
              🎉
            </div>
            <div style={{ fontSize: '28px', fontWeight: '900', color: 'var(--momentum-bright)', marginBottom: '8px' }}>
              Task Complete!
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
              +{mockData.tasks.find(t => t.title === celebrating)?.points} points earned
            </div>
          </div>
        </div>
      )}

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
          background: 'radial-gradient(circle, var(--success-glow) 0%, transparent 70%)',
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
          Quick Wins 🎯
        </h1>
        <p style={{ 
          fontSize: '15px', 
          color: 'var(--text-tertiary)',
          position: 'relative'
        }}>
          Complete tasks to level up faster
        </p>
      </div>

      {/* Points Card */}
      <div style={{ padding: '20px' }}>
        <Card variant="elevated" style={{
          background: 'linear-gradient(135deg, var(--success-bright) 0%, var(--success-deep) 100%)',
          animation: 'slideUp 0.4s ease-out'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '56px', fontWeight: '900', color: '#FFF', marginBottom: '8px', lineHeight: 1 }}>
              {totalPoints}
            </div>
            <div style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
              Points Earned Today
            </div>
            <ProgressBar 
              value={completedTasks.length} 
              max={mockData.tasks.length}
              height={12}
              color="steel"
            />
            <div style={{ 
              fontSize: '13px', 
              color: 'rgba(255,255,255,0.9)', 
              marginTop: '12px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{completedTasks.length} / {mockData.tasks.length} complete</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Goal */}
      {completedTasks.length === mockData.tasks.length && (
        <div style={{ padding: '0 20px 20px' }}>
          <Card variant="momentum" style={{
            background: 'var(--momentum-glow)',
            border: '2px solid var(--momentum-bright)',
            textAlign: 'center',
            animation: 'slideUp 0.5s ease-out'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🏆</div>
            <div style={{ fontSize: '20px', fontWeight: '900', color: 'var(--momentum-bright)', marginBottom: '6px' }}>
              All Done!
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              You crushed today's tasks. Come back tomorrow for more!
            </div>
          </Card>
        </div>
      )}

      {/* Available Tasks */}
      {availableTasks.length > 0 && (
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
            Available Tasks
          </h2>
          
          {availableTasks.map((task, idx) => (
            <Card
              key={idx}
              variant="elevated"
              style={{ 
                marginBottom: '12px',
                animation: `slideUp ${0.4 + idx * 0.1}s ease-out`,
                borderLeft: '3px solid var(--momentum-bright)'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'var(--momentum-glow)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '32px',
                  flexShrink: 0
                }}>
                  {task.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '17px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginBottom: '8px', lineHeight: 1.4 }}>
                    {task.description}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Badge variant="success" size="md">
                      +{task.points} points
                    </Badge>
                    <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                      ⏱️ {task.duration}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="primary"
                fullWidth
                onClick={() => handleCompleteTask(task.title)}
                style={{ marginTop: '8px' }}
              >
                Start Task →
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
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
            Completed ✓
          </h2>
          
          {mockData.tasks.filter(t => completedTasks.includes(t.title)).map((task, idx) => (
            <Card
              key={idx}
              variant="glass"
              style={{ 
                marginBottom: '12px',
                opacity: 0.7,
                borderLeft: '3px solid var(--success-bright)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  background: 'var(--success-glow)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0
                }}>
                  ✓
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '2px' }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--success-bright)', fontWeight: '600' }}>
                    Completed • +{task.points} points earned
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
