import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../shared/BottomNav';
import { Card, Button, Badge } from '../shared/UIComponents';

// Modern SVG Icons Component
const NotificationIcon = ({ type }) => {
  const iconMap = {
    application: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    shift: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    ),
    achievement: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"/>
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
      </svg>
    ),
    schedule: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    skill: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    opportunity: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    )
  };

  return iconMap[type] || iconMap.schedule;
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications] = useState([
    {
      id: 1,
      type: 'application',
      title: 'Application Update',
      message: 'Your application for Team Lead has moved to interview stage',
      time: '2 hours ago',
      read: false,
      action: () => navigate('/worker/applications')
    },
    {
      id: 2,
      type: 'shift',
      title: 'Shift Swap Request',
      message: 'Sarah Chen accepted your shift swap request for Jan 10',
      time: '5 hours ago',
      read: false,
      action: () => navigate('/worker/schedule')
    },
    {
      id: 3,
      type: 'achievement',
      title: 'New Achievement',
      message: 'You earned the Team Player badge',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'schedule',
      title: 'Schedule Posted',
      message: 'Your schedule for next week is now available',
      time: '2 days ago',
      read: true,
      action: () => navigate('/worker/schedule')
    },
    {
      id: 5,
      type: 'skill',
      title: 'Skill Verified',
      message: 'Your manager verified your Customer Service skill',
      time: '3 days ago',
      read: true
    }
  ]);

  const getTypeColor = (type) => {
    const colors = {
      application: 'var(--momentum-bright)',
      shift: 'var(--steel-bright)',
      achievement: 'var(--success-bright)',
      schedule: 'var(--steel-bright)',
      skill: 'var(--success-bright)',
      opportunity: 'var(--momentum-bright)'
    };
    return colors[type] || 'var(--text-tertiary)';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, var(--momentum-glow) 0%, transparent 70%)',
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
          Notifications
        </h1>
        
        {unreadCount > 0 && (
          <p style={{ 
            fontSize: '15px', 
            color: 'var(--text-tertiary)',
            position: 'relative'
          }}>
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ padding: '20px' }}>
        {notifications.length === 0 ? (
          <Card variant="elevated" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: '0.5' }}>
              <NotificationIcon type="skill" />
            </div>
            <div style={{ fontSize: '16px', color: 'var(--text-secondary)' }}>
              You're all caught up!
            </div>
          </Card>
        ) : (
          notifications.map((notification, idx) => (
            <Card
              key={notification.id}
              variant="elevated"
              onClick={notification.action}
              style={{
                marginBottom: '12px',
                cursor: notification.action ? 'pointer' : 'default',
                opacity: notification.read ? 0.7 : 1,
                animation: `slideUp ${0.4 + idx * 0.05}s ease-out`,
                borderLeft: `4px solid ${getTypeColor(notification.type)}`
              }}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'start' }}>
                {/* Icon */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${getTypeColor(notification.type)}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: getTypeColor(notification.type)
                }}>
                  <NotificationIcon type={notification.type} />
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: '700', 
                    color: 'var(--text-primary)', 
                    marginBottom: '4px'
                  }}>
                    {notification.title}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '8px',
                    lineHeight: '1.5'
                  }}>
                    {notification.message}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>{notification.time}</span>
                    {!notification.read && (
                      <>
                        <span>•</span>
                        <Badge variant="momentum" size="sm">New</Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Mark All Read Button */}
      {unreadCount > 0 && (
        <div style={{ padding: '0 20px 20px' }}>
          <Button variant="secondary" size="md" fullWidth>
            Mark All as Read
          </Button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
