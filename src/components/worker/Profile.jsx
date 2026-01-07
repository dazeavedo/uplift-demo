import React from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../shared/BottomNav';
import { Card, Button, Badge, StatCard } from '../shared/UIComponents';
import { mockData } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const worker = mockData.workers[0];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>
      {/* Hero Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--momentum-bright) 0%, var(--momentum-deep) 100%)',
        padding: '40px 20px',
        paddingTop: '80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{ 
            width: '96px',
            height: '96px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            margin: '0 auto 20px',
            border: '4px solid rgba(255,255,255,0.3)'
          }}>
            👤
          </div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: '900', 
            color: '#FFF', 
            marginBottom: '6px',
            letterSpacing: '-0.5px'
          }}>
            {worker.name}
          </h1>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', marginBottom: '4px' }}>
            {worker.role}
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            {worker.department}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '-30px', position: 'relative' }}>
        <StatCard
          value={worker.level}
          label="Level"
          color="neutral"
        />
        <StatCard
          value={worker.skillsCompleted}
          label="Skills"
          color="neutral"
        />
        <StatCard
          value={worker.hoursWorked}
          label="Hours"
          color="neutral"
        />
      </div>

      {/* Personal Information */}
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
          Personal Information
        </h2>
        <Card variant="elevated">
          {[
            { label: 'Employee ID', value: worker.id },
            { label: 'Email', value: worker.email },
            { label: 'Phone', value: worker.phone },
            { label: 'Start Date', value: worker.startDate },
            { label: 'Location', value: worker.location }
          ].map((item, idx, arr) => (
            <div 
              key={idx}
              style={{ 
                padding: '16px 0',
                borderBottom: idx < arr.length - 1 ? '1px solid var(--bg-elevated)' : 'none'
              }}
            >
              <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
                {item.value}
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Verified Skills */}
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
          Verified Skills
        </h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {worker.skills.map((skill, idx) => (
            <Badge key={idx} variant="success" size="md">
              ✓ {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Settings Menu */}
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
          Settings
        </h2>
        <Card variant="elevated">
          {[
            { icon: '🔔', label: 'Notifications', onClick: () => navigate('/notifications') },
            { icon: '🔒', label: 'Privacy & Security' },
            { icon: '❓', label: 'Help & Support' },
            { icon: '📄', label: 'Terms & Policies' }
          ].map((item, idx, arr) => (
            <button 
              key={idx}
              onClick={item.onClick}
              style={{ 
                width: '100%',
                padding: '16px 0',
                background: 'none',
                border: 'none',
                borderBottom: idx < arr.length - 1 ? '1px solid var(--bg-elevated)' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                fontFamily: 'inherit'
              }}
            >
              <span style={{ fontSize: '24px' }}>{item.icon}</span>
              <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)', flex: 1 }}>
                {item.label}
              </span>
              <span style={{ fontSize: '20px', color: 'var(--text-tertiary)' }}>›</span>
            </button>
          ))}
        </Card>
      </div>

      {/* Logout Button */}
      <div style={{ padding: '0 20px' }}>
        <Button 
          variant="danger"
          size="lg"
          fullWidth
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
}
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        padding: '40px 20px',
        paddingTop: '80px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            margin: '0 auto 16px'
          }}>
            👤
          </div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#FFF', 
            marginBottom: '4px' 
          }}>
            {worker.name}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
            {worker.role} • {worker.department}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '-30px' }}>
        <div style={{ 
          background: '#2C2C2C',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #3A3A3A',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>
            {worker.level}
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Level
          </div>
        </div>
        <div style={{ 
          background: '#2C2C2C',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #3A3A3A',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>
            {worker.skillsCompleted}
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Skills
          </div>
        </div>
        <div style={{ 
          background: '#2C2C2C',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #3A3A3A',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#FFF', marginBottom: '4px' }}>
            {worker.hoursWorked}
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
            Hours
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div style={{ padding: '0 20px 20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', marginBottom: '12px' }}>
          Personal Information
        </h2>
        <div style={{ 
          background: '#2C2C2C',
          borderRadius: '12px',
          border: '1px solid #3A3A3A',
          overflow: 'hidden'
        }}>
          {[
            { label: 'Employee ID', value: worker.id },
            { label: 'Email', value: worker.email },
            { label: 'Phone', value: worker.phone },
            { label: 'Start Date', value: worker.startDate },
            { label: 'Location', value: worker.location }
          ].map((item, idx, arr) => (
            <div 
              key={idx}
              style={{ 
                padding: '16px',
                borderBottom: idx < arr.length - 1 ? '1px solid #3A3A3A' : 'none'
              }}
            >
              <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '4px' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '15px', color: '#FFF' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div style={{ padding: '0 20px 20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', marginBottom: '12px' }}>
          Verified Skills
        </h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {worker.skills.map((skill, idx) => (
            <span 
              key={idx}
              style={{ 
                fontSize: '13px',
                color: '#10B981',
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}
            >
              ✓ {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div style={{ padding: '0 20px 20px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#FFF', marginBottom: '12px' }}>
          Settings
        </h2>
        <div style={{ 
          background: '#2C2C2C',
          borderRadius: '12px',
          border: '1px solid #3A3A3A',
          overflow: 'hidden'
        }}>
          {[
            { icon: '🔔', label: 'Notifications', onClick: () => navigate('/notifications') },
            { icon: '🔒', label: 'Privacy & Security' },
            { icon: '❓', label: 'Help & Support' },
            { icon: '📄', label: 'Terms & Policies' }
          ].map((item, idx, arr) => (
            <button 
              key={idx}
              onClick={item.onClick}
              style={{ 
                width: '100%',
                padding: '16px',
                background: 'none',
                border: 'none',
                borderBottom: idx < arr.length - 1 ? '1px solid #3A3A3A' : 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <span style={{ fontSize: '15px', color: '#FFF', flex: 1 }}>{item.label}</span>
              <span style={{ fontSize: '18px', color: '#6B7280' }}>›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div style={{ padding: '0 20px' }}>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '16px',
            background: 'transparent',
            color: '#EF4444',
            border: '1px solid #EF4444',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Log Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
