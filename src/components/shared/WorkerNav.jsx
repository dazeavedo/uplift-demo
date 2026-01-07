import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function WorkerNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/worker', label: 'Feed', icon: '🏠' },
    { path: '/worker/schedule', label: 'Schedule', icon: '📅' },
    { path: '/worker/grow', label: 'Grow', icon: '📈' },
    { path: '/worker/profile', label: 'Profile', icon: '👤' }
  ];

  const isActive = (path) => {
    if (path === '/worker') {
      return location.pathname === '/worker';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#2C2C2C',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0 max(12px, env(safe-area-inset-bottom))',
      zIndex: 1000
    }}>
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          style={{
            background: 'none',
            border: 'none',
            color: isActive(item.path) ? '#FFD700' : '#9CA3AF',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 16px',
            transition: 'color 0.2s ease'
          }}
        >
          <span style={{ fontSize: '24px' }}>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
