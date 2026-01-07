import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../shared/BottomNav';
import { Card, Button, Badge } from '../shared/UIComponents';

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications] = useState([
    {
      id: 1,
      type: 'application',
      icon: '📋',
      title: 'Application Update',
      message: 'Your application for Team Lead has moved to interview stage',
      time: '2 hours ago',
      read: false,
      action: () => navigate('/applications')
    },
    {
      id: 2,
      type: 'shift',
      icon: '🔄',
      title: 'Shift Swap Request',
      message: 'Sarah Chen accepted your shift swap request for Jan 10',
      time: '5 hours ago',
      read: false,
      action: () => navigate('/schedule')
    },
    {
      id: 3,
      type: 'achievement',
      icon: '🎉',
      title: 'New Achievement!',
      message: 'You earned the "Team Player" badge',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'schedule',
      icon: '📅',
      title: 'Schedule Posted',
      message: 'Your schedule for next week is now available',
      time: '2 days ago',
      read: true,
      action: () => navigate('/schedule')
    },
    {
      id: 5,
      type: 'skill',
      icon: '⭐',
      title: 'Skill Verified',
      message: 'Your manager verified your "Customer Service" skill',
      time: '3 days ago',
      read: true
    },
    {
      id: 6,
      type: 'opportunity',
      icon: '💼',
      title: 'New Opportunity',
      message: '3 new job openings match your skills',
      time: '4 days ago',
      read: true,
      action: () => navigate('/grow')
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeVariant = (type) => {
    switch(type) {
      case 'application': return 'steel';
      case 'shift': return 'success';
      case 'achievement': return 'warning';
      case 'schedule': return 'steel';
      case 'skill': return 'success';
      case 'opportunity': return 'momentum';
      default: return 'default';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
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
          Notifications 🔔
        </h1>
        <p style={{ 
          fontSize: '15px', 
          color: 'var(--text-tertiary)',
          position: 'relative'
        }}>
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
        </p>
      </div>

      {/* Notifications List */}
      <div style={{ padding: '20px' }}>
        {notifications.length === 0 ? (
          <Card variant="elevated" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔔</div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              No Notifications
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>
              You're all caught up!
            </p>
          </Card>
        ) : (
          notifications.map((notif, idx) => (
            <Card 
              key={notif.id}
              variant={notif.read ? 'glass' : 'elevated'}
              onClick={notif.action}
              style={{ 
                marginBottom: '12px',
                cursor: notif.action ? 'pointer' : 'default',
                animation: `slideUp ${0.4 + idx * 0.1}s ease-out`,
                border: notif.read ? '1px solid var(--bg-elevated)' : '2px solid var(--momentum-glow)',
                position: 'relative'
              }}
            >
              {/* Unread Indicator */}
              {!notif.read && (
                <div style={{ 
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '10px',
                  height: '10px',
                  background: 'var(--momentum-bright)',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px var(--momentum-glow)'
                }} />
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                {/* Icon */}
                <div style={{ 
                  width: '48px',
                  height: '48px',
                  background: `var(--${getTypeVariant(notif.type)}-glow)`,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  {notif.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingRight: notif.read ? '0' : '20px' }}>
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: '700', 
                    color: 'var(--text-primary)', 
                    marginBottom: '4px' 
                  }}>
                    {notif.title}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {notif.message}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    {notif.time}
                  </div>
                </div>

                {/* Action Arrow */}
                {notif.action && (
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    color: 'var(--text-tertiary)',
                    fontSize: '20px'
                  }}>
                    ›
                  </div>
                )}
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
    {
      id: 1,
      type: 'application',
      icon: '📋',
      title: 'Application Update',
      message: 'Your application for Team Lead has moved to interview stage',
      time: '2 hours ago',
      read: false,
      action: () => navigate('/applications')
    },
    {
      id: 2,
      type: 'shift',
      icon: '🔄',
      title: 'Shift Swap Request',
      message: 'Sarah Chen accepted your shift swap request for Jan 10',
      time: '5 hours ago',
      read: false,
      action: () => navigate('/schedule')
    },
    {
      id: 3,
      type: 'achievement',
      icon: '🎉',
      title: 'New Achievement!',
      message: 'You earned the "Team Player" badge',
      time: '1 day ago',
      read: true
    },
    {
      id: 4,
      type: 'schedule',
      icon: '📅',
      title: 'Schedule Posted',
      message: 'Your schedule for next week is now available',
      time: '2 days ago',
      read: true,
      action: () => navigate('/schedule')
    },
    {
      id: 5,
      type: 'skill',
      icon: '⭐',
      title: 'Skill Verified',
      message: 'Your manager verified your "Customer Service" skill',
      time: '3 days ago',
      read: true
    },
    {
      id: 6,
      type: 'opportunity',
      icon: '💼',
      title: 'New Opportunity',
      message: '3 new job openings match your skills',
      time: '4 days ago',
      read: true,
      action: () => navigate('/grow')
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeColor = (type) => {
    switch(type) {
      case 'application': return { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)' };
      case 'shift': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'achievement': return { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
      case 'schedule': return { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' };
      case 'skill': return { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'opportunity': return { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)' };
      default: return { color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.1)' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1F1F1F', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ 
        background: '#2C2C2C', 
        padding: '20px', 
        paddingTop: '60px',
        borderBottom: '1px solid #3A3A3A'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: '#FFF', 
          marginBottom: '8px' 
        }}>
          Notifications
        </h1>
        <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
          {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
        </p>
      </div>

      {/* Notifications List */}
      <div style={{ padding: '20px' }}>
        {notifications.length === 0 ? (
          <div style={{ 
            background: '#2C2C2C',
            padding: '40px 20px',
            borderRadius: '12px',
            border: '1px solid #3A3A3A',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔔</div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#FFF', marginBottom: '8px' }}>
              No Notifications
            </h2>
            <p style={{ fontSize: '14px', color: '#9CA3AF' }}>
              You're all caught up!
            </p>
          </div>
        ) : (
          notifications.map(notif => {
            const typeStyle = getTypeColor(notif.type);
            return (
              <div 
                key={notif.id}
                onClick={notif.action}
                style={{ 
                  background: notif.read ? '#2C2C2C' : 'rgba(99, 102, 241, 0.05)',
                  padding: '16px',
                  borderRadius: '12px',
                  border: `1px solid ${notif.read ? '#3A3A3A' : 'rgba(99, 102, 241, 0.2)'}`,
                  marginBottom: '12px',
                  cursor: notif.action ? 'pointer' : 'default',
                  display: 'flex',
                  gap: '12px',
                  position: 'relative'
                }}
              >
                {/* Unread Indicator */}
                {!notif.read && (
                  <div style={{ 
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '8px',
                    height: '8px',
                    background: '#6366F1',
                    borderRadius: '50%'
                  }} />
                )}

                {/* Icon */}
                <div style={{ 
                  width: '48px',
                  height: '48px',
                  background: typeStyle.bg,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  flexShrink: 0
                }}>
                  {notif.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    color: '#FFF', 
                    marginBottom: '4px' 
                  }}>
                    {notif.title}
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#D1D5DB', 
                    marginBottom: '6px',
                    lineHeight: '1.4'
                  }}>
                    {notif.message}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#6B7280'
                  }}>
                    {notif.time}
                  </div>
                </div>

                {/* Action Arrow */}
                {notif.action && (
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    color: '#6B7280',
                    fontSize: '20px'
                  }}>
                    ›
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Mark All Read Button */}
      {unreadCount > 0 && (
        <div style={{ padding: '0 20px 20px' }}>
          <button style={{
            width: '100%',
            padding: '14px',
            background: 'transparent',
            color: '#6366F1',
            border: '1px solid #6366F1',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            Mark All as Read
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
