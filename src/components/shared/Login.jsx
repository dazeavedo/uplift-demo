import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from './UIComponents';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (role) => {
    login(role);
    navigate(role === 'worker' ? '/worker' : '/manager');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Gradient */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-20%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, var(--momentum-glow) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-20%',
        width: '60%',
        height: '60%',
        background: 'radial-gradient(circle, var(--steel-glow) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: 'var(--bg-secondary)',
        borderRadius: '24px',
        padding: '48px 32px',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center',
        position: 'relative',
        border: '1px solid var(--bg-elevated)'
      }}>
        {/* Logo with Industrial Accent */}
        <div style={{ position: 'relative', marginBottom: '40px' }}>
          <div style={{
            fontSize: '48px',
            fontWeight: '900',
            background: 'linear-gradient(135deg, var(--momentum-bright) 0%, var(--momentum-deep) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px',
            letterSpacing: '-1px',
            textTransform: 'uppercase'
          }}>
            UPLIFT
          </div>
          <div style={{
            width: '60px',
            height: '4px',
            background: 'linear-gradient(90deg, var(--momentum-bright) 0%, var(--momentum-deep) 100%)',
            margin: '0 auto 12px',
            borderRadius: '2px'
          }} />
          <div style={{
            fontSize: '16px',
            color: 'var(--text-tertiary)',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }}>
            Career GPS for Frontline Workers
          </div>
        </div>

        {/* Welcome Message */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: '900',
          color: 'var(--text-primary)',
          marginBottom: '12px',
          lineHeight: '1.2'
        }}>
          Welcome Back
        </h1>
        
        <p style={{
          fontSize: '15px',
          color: 'var(--text-tertiary)',
          marginBottom: '36px',
          fontWeight: '500'
        }}>
          Choose your role to continue
        </p>

        {/* Role Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          <button
            onClick={() => handleLogin('worker')}
            style={{
              background: 'linear-gradient(135deg, var(--momentum-bright) 0%, var(--momentum-deep) 100%)',
              color: '#FFF',
              padding: '18px 24px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              fontSize: '17px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 8px 24px var(--momentum-glow)',
              transition: 'all var(--transition-base)',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 32px var(--momentum-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px var(--momentum-glow)';
            }}
          >
            Continue as Worker →
          </button>

          <button
            onClick={() => handleLogin('manager')}
            style={{
              background: 'transparent',
              color: 'var(--steel-bright)',
              padding: '18px 24px',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--steel-bright)',
              fontSize: '17px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all var(--transition-base)',
              fontFamily: 'inherit'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--steel-bright)';
              e.currentTarget.style.color = '#FFF';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--steel-bright)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Continue as Manager →
          </button>
        </div>

        {/* Demo Notice */}
        <div style={{
          padding: '12px',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--bg-elevated)'
        }}>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-tertiary)',
            fontWeight: '600',
            margin: 0
          }}>
            🎭 Demo Mode • No password required
          </p>
        </div>
      </div>
    </div>
  );
}
