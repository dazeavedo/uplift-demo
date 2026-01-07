import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleLogin = (role) => {
    login(role);
    navigate(role === 'worker' ? '/worker' : '/manager');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Logo */}
      <div style={{ position: 'absolute', top: '40px', left: '40px' }}>
        <svg width="60" height="50" viewBox="0 0 1000 834" xmlns="http://www.w3.org/2000/svg">
          <rect x="83" y="166" width="66" height="501" fill="#FFD700"/>
          <rect x="817" y="166" width="66" height="501" fill="#FFD700"/>
          <rect x="83" y="600" width="800" height="67" fill="#FFD700"/>
          <rect x="149" y="500" width="200" height="167" fill="#FFD700"/>
          <rect x="349" y="380" width="200" height="287" fill="#FFD700"/>
          <rect x="549" y="250" width="268" height="417" fill="#FFD700"/>
        </svg>
        <div style={{ fontSize: '24px', fontWeight: '900', color: '#FFD700', marginTop: '8px' }}>
          UPLIFT
        </div>
      </div>

      {/* Main card */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.9)',
        padding: '60px',
        borderRadius: '32px',
        border: '2px solid rgba(255, 215, 0, 0.3)',
        backdropFilter: 'blur(40px)',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '900',
          color: '#FFFFFF',
          marginBottom: '16px',
          lineHeight: '1.1'
        }}>
          Welcome to Uplift
        </h1>
        <p style={{
          fontSize: '20px',
          color: '#9CA3AF',
          marginBottom: '48px',
          fontWeight: '600'
        }}>
          Choose how you want to login
        </p>

        {/* Role buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <button
            onClick={() => handleLogin('worker')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(255, 215, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 215, 0, 0.3)';
            }}
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#2C2C2C',
              padding: '24px',
              borderRadius: '16px',
              border: 'none',
              fontSize: '24px',
              fontWeight: '900',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255, 215, 0, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            I'm a Worker
          </button>

          <button
            onClick={() => handleLogin('manager')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.background = '#4A90E2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(74, 144, 226, 0.2)';
            }}
            style={{
              background: 'rgba(74, 144, 226, 0.2)',
              color: '#FFFFFF',
              padding: '24px',
              borderRadius: '16px',
              border: '2px solid #4A90E2',
              fontSize: '24px',
              fontWeight: '900',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            I'm a Manager
          </button>
        </div>

        <p style={{
          marginTop: '32px',
          fontSize: '14px',
          color: '#6B7280',
          fontWeight: '600'
        }}>
          Demo credentials pre-loaded • No password required
        </p>
      </div>
    </div>
  );
}
