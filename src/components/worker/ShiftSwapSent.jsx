import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../shared/UIComponents';

export default function ShiftSwapSent() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Success glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, var(--success-glow) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: 'pulse 2s ease-in-out infinite'
      }} />

      {/* Success Icon */}
      <div style={{ 
        width: '100px',
        height: '100px',
        background: 'var(--success-bright)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '48px',
        marginBottom: '32px',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
        position: 'relative',
        animation: 'scaleIn 0.5s ease-out'
      }}>
        <span style={{ color: '#FFF' }}>✓</span>
      </div>

      {/* Success Message */}
      <h1 style={{ 
        fontSize: '32px', 
        fontWeight: '900', 
        color: 'var(--text-primary)', 
        marginBottom: '12px',
        textAlign: 'center',
        position: 'relative',
        letterSpacing: '-0.5px',
        animation: 'slideUp 0.6s ease-out'
      }}>
        Request Sent!
      </h1>
      
      <p style={{ 
        fontSize: '16px', 
        color: 'var(--text-secondary)',
        textAlign: 'center',
        marginBottom: '48px',
        maxWidth: '340px',
        lineHeight: '1.5',
        position: 'relative',
        animation: 'slideUp 0.7s ease-out'
      }}>
        Your shift swap request has been sent. You'll be notified when they respond.
      </p>

      {/* Action Buttons */}
      <div style={{ 
        width: '100%', 
        maxWidth: '340px',
        position: 'relative',
        animation: 'slideUp 0.8s ease-out'
      }}>
        <Button 
          variant="primary"
          fullWidth
          onClick={() => navigate('/schedule')}
          style={{ marginBottom: '12px' }}
        >
          Back to Schedule
        </Button>

        <Button 
          variant="outline"
          fullWidth
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
