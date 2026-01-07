import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge } from '../shared/UIComponents';
import { mockData } from '../../data/mockData';

export default function ShiftSwapRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shift = mockData.shifts.find(s => s.id === parseInt(id)) || mockData.shifts[0];
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [message, setMessage] = useState('');

  const availableWorkers = [
    { id: 1, name: 'Sarah Chen', role: 'Sales Associate', availability: 'Available', image: '👩' },
    { id: 2, name: 'Mike Johnson', role: 'Sales Associate', availability: 'Available', image: '👨' },
    { id: 3, name: 'Emma Davis', role: 'Cashier', availability: 'Maybe', image: '👩‍🦱' },
  ];

  const handleSubmit = () => {
    navigate('/shift-swap-sent');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '40px' }}>
      {/* Hero Header */}
      <div style={{ 
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        padding: '24px 20px',
        paddingTop: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Steel glow for operational flow */}
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
          ← Back
        </button>
        
        <h1 style={{ 
          fontSize: '32px', 
          fontWeight: '900', 
          color: 'var(--text-primary)',
          marginBottom: '6px',
          position: 'relative',
          letterSpacing: '-0.5px'
        }}>
          Request Shift Swap
        </h1>
        <p style={{ 
          fontSize: '15px', 
          color: 'var(--text-tertiary)',
          position: 'relative'
        }}>
          Select a colleague to swap shifts with
        </p>
      </div>

      {/* Current Shift Info */}
      <div style={{ padding: '20px' }}>
        <Card variant="elevated" style={{ 
          animation: 'slideUp 0.4s ease-out',
          borderLeft: '4px solid var(--steel-bright)'
        }}>
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Your Shift
          </div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px' }}>
            {shift.role}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span>📅 {shift.date}</span>
            <span>•</span>
            <span>🕐 {shift.time}</span>
          </div>
        </Card>
      </div>

      {/* Available Workers */}
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
          Available Colleagues
        </h2>
        
        {availableWorkers.map((worker, idx) => (
          <div 
            key={worker.id}
            onClick={() => setSelectedWorker(worker.id)}
            style={{ 
              background: 'var(--bg-secondary)',
              padding: '16px',
              borderRadius: 'var(--radius-lg)',
              border: `2px solid ${selectedWorker === worker.id ? 'var(--momentum-bright)' : 'var(--border-default)'}`,
              marginBottom: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease',
              animation: `slideUp ${0.5 + idx * 0.1}s ease-out`,
              boxShadow: selectedWorker === worker.id ? '0 0 0 4px rgba(255, 115, 45, 0.1)' : 'none'
            }}
          >
            <div style={{ 
              width: '48px',
              height: '48px',
              background: 'var(--bg-tertiary)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              {worker.image}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>
                {worker.name}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                {worker.role}
              </div>
            </div>
            <Badge variant={worker.availability === 'Available' ? 'success' : 'warning'}>
              {worker.availability}
            </Badge>
          </div>
        ))}
      </div>

      {/* Message */}
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
          Add a Message (Optional)
        </h2>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Let them know why you need to swap..."
          style={{
            width: '100%',
            minHeight: '120px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            fontSize: '15px',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            resize: 'vertical',
            animation: 'slideUp 0.8s ease-out'
          }}
        />
      </div>

      {/* Submit Button */}
      <div style={{ padding: '0 20px' }}>
        <Button 
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={!selectedWorker}
          style={{
            opacity: selectedWorker ? 1 : 0.5,
            cursor: selectedWorker ? 'pointer' : 'not-allowed'
          }}
        >
          Send Swap Request
        </Button>
      </div>
    </div>
  );
}
