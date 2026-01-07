import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      path: '/worker', 
      label: 'Home', 
      icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10'
    },
    { 
      path: '/worker/schedule', 
      label: 'Schedule',
      icon: 'M3 4h18v18H3V4z M16 2v4 M8 2v4 M3 10h18'
    },
    { 
      path: '/worker/tasks', 
      label: 'Tasks',
      icon: 'M9 11l3 3L22 4 M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11'
    },
    { 
      path: '/worker/grow', 
      label: 'Grow',
      icon: 'M12 20V10 M18 20V4 M6 20v-4'
    },
    { 
      path: '/worker/profile', 
      label: 'You',
      icon: 'M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z'
    }
  ];

  const isActive = (path) => {
    if (path === '/worker') {
      return location.pathname === '/worker';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-default)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0 max(10px, env(safe-area-inset-bottom))',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      {navItems.map((item) => {
        const active = isActive(item.path);
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: 'none',
              border: 'none',
              color: active ? 'var(--momentum-bright)' : 'var(--text-tertiary)',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              transition: 'all 0.2s ease',
              flex: 1,
              maxWidth: '80px',
              position: 'relative',
              transform: active ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {/* Active indicator dot */}
            {active && (
              <div style={{
                position: 'absolute',
                top: '0',
                width: '4px',
                height: '4px',
                background: 'var(--momentum-bright)',
                borderRadius: '50%',
                boxShadow: '0 0 8px var(--momentum-bright)'
              }} />
            )}
            
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={active ? '2.5' : '2'}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: 'all 0.2s ease',
                filter: active ? 'drop-shadow(0 0 4px rgba(255, 115, 45, 0.5))' : 'none'
              }}
            >
              <path d={item.icon} />
            </svg>
            <span style={{ 
              letterSpacing: '0.3px',
              textShadow: active ? '0 0 8px rgba(255, 115, 45, 0.3)' : 'none'
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
