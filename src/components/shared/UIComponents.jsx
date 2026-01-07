import React from 'react';

// ============================================
// CARDS & CONTAINERS
// ============================================

export const Card = ({ children, variant = 'default', className = '', onClick, style = {} }) => {
  const variants = {
    default: {
      background: 'var(--bg-secondary)',
      border: '1px solid var(--bg-elevated)',
    },
    elevated: {
      background: 'var(--bg-tertiary)',
      border: '1px solid var(--bg-elevated)',
      boxShadow: 'var(--shadow-md)',
    },
    momentum: {
      background: 'var(--bg-secondary)',
      border: '1px solid var(--bg-elevated)',
      borderLeft: '4px solid var(--momentum-core)',
    },
    glass: {
      background: 'rgba(21, 27, 35, 0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
    }
  };

  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        ...variants[variant],
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        transition: 'all var(--transition-base)',
        cursor: onClick ? 'pointer' : 'default',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export const StatCard = ({ value, label, icon, trend, color = 'momentum' }) => {
  const colors = {
    momentum: {
      bg: 'linear-gradient(135deg, var(--momentum-bright) 0%, var(--momentum-deep) 100%)',
      text: '#FFF'
    },
    steel: {
      bg: 'linear-gradient(135deg, var(--steel-bright) 0%, var(--steel-deep) 100%)',
      text: '#FFF'
    },
    success: {
      bg: 'linear-gradient(135deg, var(--success-bright) 0%, var(--success-deep) 100%)',
      text: '#FFF'
    },
    neutral: {
      bg: 'var(--bg-secondary)',
      text: 'var(--text-primary)'
    }
  };

  return (
    <div style={{
      background: colors[color].bg,
      padding: '20px',
      borderRadius: 'var(--radius-md)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {icon && (
        <div style={{
          position: 'absolute',
          right: '12px',
          top: '12px',
          fontSize: '24px',
          opacity: 0.3
        }}>
          {icon}
        </div>
      )}
      <div style={{ fontSize: '32px', fontWeight: '700', color: colors[color].text, marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', color: colors[color].text, opacity: 0.9 }}>
        {label}
      </div>
      {trend && (
        <div style={{ 
          fontSize: '12px', 
          color: colors[color].text, 
          marginTop: '8px',
          opacity: 0.8
        }}>
          {trend}
        </div>
      )}
    </div>
  );
};

// ============================================
// BUTTONS
// ============================================

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  icon,
  style = {}
}) => {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--momentum-bright) 0%, var(--momentum-deep) 100%)',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 12px rgba(255, 107, 53, 0.25)',
    },
    secondary: {
      background: 'transparent',
      color: 'var(--momentum-bright)',
      border: '1px solid var(--momentum-bright)',
    },
    steel: {
      background: 'linear-gradient(135deg, var(--steel-bright) 0%, var(--steel-deep) 100%)',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 12px rgba(0, 212, 255, 0.25)',
    },
    success: {
      background: 'linear-gradient(135deg, var(--success-bright) 0%, var(--success-deep) 100%)',
      color: 'white',
      border: 'none',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid var(--bg-elevated)',
    },
    danger: {
      background: 'transparent',
      color: 'var(--alert-danger)',
      border: '1px solid var(--alert-danger)',
    }
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '12px 24px', fontSize: '15px' },
    lg: { padding: '16px 32px', fontSize: '17px' }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...variants[variant],
        ...sizes[size],
        width: fullWidth ? '100%' : 'auto',
        borderRadius: 'var(--radius-md)',
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all var(--transition-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'inherit',
        ...style
      }}
      onMouseEnter={(e) => {
        if (!disabled && variant === 'primary') {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.35)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = variants[variant].boxShadow || 'none';
        }
      }}
    >
      {loading ? (
        <div style={{
          width: '16px',
          height: '16px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: '#FFF',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

// ============================================
// BADGES & STATUS
// ============================================

export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    default: { bg: 'var(--bg-elevated)', color: 'var(--text-secondary)' },
    momentum: { bg: 'var(--momentum-glow)', color: 'var(--momentum-bright)' },
    steel: { bg: 'var(--steel-glow)', color: 'var(--steel-bright)' },
    success: { bg: 'var(--success-glow)', color: 'var(--success-bright)' },
    warning: { bg: 'rgba(251, 191, 36, 0.1)', color: 'var(--alert-warning)' },
    danger: { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--alert-danger)' },
  };

  const sizes = {
    sm: { padding: '2px 6px', fontSize: '11px' },
    md: { padding: '4px 8px', fontSize: '12px' },
    lg: { padding: '6px 12px', fontSize: '13px' }
  };

  return (
    <span style={{
      ...sizes[size],
      background: variants[variant].bg,
      color: variants[variant].color,
      borderRadius: 'var(--radius-sm)',
      fontWeight: '600',
      display: 'inline-block',
      whiteSpace: 'nowrap'
    }}>
      {children}
    </span>
  );
};

export const StatusDot = ({ status = 'active', label }) => {
  const statuses = {
    active: { color: 'var(--success-bright)', animation: 'pulse-momentum 2s infinite' },
    pending: { color: 'var(--alert-warning)', animation: 'none' },
    inactive: { color: 'var(--text-quaternary)', animation: 'none' }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: statuses[status].color,
        animation: statuses[status].animation,
        boxShadow: status === 'active' ? `0 0 8px ${statuses[status].color}` : 'none'
      }} />
      {label && <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>}
    </div>
  );
};

// ============================================
// PROGRESS & LOADING
// ============================================

export const ProgressBar = ({ value, max = 100, height = 8, showLabel = false, color = 'momentum' }) => {
  const percentage = (value / max) * 100;
  
  const colors = {
    momentum: 'linear-gradient(90deg, var(--momentum-bright) 0%, var(--momentum-deep) 100%)',
    steel: 'linear-gradient(90deg, var(--steel-bright) 0%, var(--steel-deep) 100%)',
    success: 'linear-gradient(90deg, var(--success-bright) 0%, var(--success-deep) 100%)',
  };

  return (
    <div>
      <div style={{
        width: '100%',
        height: `${height}px`,
        background: 'var(--bg-elevated)',
        borderRadius: 'var(--radius-pill)',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: colors[color],
          borderRadius: 'var(--radius-pill)',
          transition: 'width var(--transition-slow)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: 'shimmer 2s infinite'
          }} />
        </div>
      </div>
      {showLabel && (
        <div style={{
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          marginTop: '4px',
          textAlign: 'right'
        }}>
          {value} / {max}
        </div>
      )}
    </div>
  );
};

export const Skeleton = ({ width = '100%', height = '20px', style = {} }) => {
  return (
    <div style={{
      width,
      height,
      background: 'linear-gradient(90deg, var(--bg-tertiary) 0%, var(--bg-elevated) 50%, var(--bg-tertiary) 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      borderRadius: 'var(--radius-md)',
      ...style
    }} />
  );
};

export const LoadingSpinner = ({ size = 'md', color = 'momentum' }) => {
  const sizes = {
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px'
  };

  const colors = {
    momentum: 'var(--momentum-bright)',
    steel: 'var(--steel-bright)',
    white: '#FFF'
  };

  return (
    <div style={{
      width: sizes[size],
      height: sizes[size],
      border: `3px solid rgba(255, 255, 255, 0.1)`,
      borderTopColor: colors[color],
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
  );
};

// ============================================
// INPUT & FORMS
// ============================================

export const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  icon,
  error,
  fullWidth = true,
  style = {}
}) => {
  return (
    <div style={{ width: fullWidth ? '100%' : 'auto', position: 'relative' }}>
      {icon && (
        <div style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '18px',
          color: 'var(--text-tertiary)'
        }}>
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          width: '100%',
          padding: icon ? '12px 16px 12px 48px' : '12px 16px',
          background: 'var(--bg-secondary)',
          border: `1px solid ${error ? 'var(--alert-danger)' : 'var(--bg-elevated)'}`,
          borderRadius: 'var(--radius-md)',
          color: 'var(--text-primary)',
          fontSize: '15px',
          fontFamily: 'inherit',
          transition: 'all var(--transition-base)',
          ...style
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--momentum-bright)';
          e.target.style.boxShadow = '0 0 0 3px var(--momentum-glow)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? 'var(--alert-danger)' : 'var(--bg-elevated)';
          e.target.style.boxShadow = 'none';
        }}
      />
      {error && (
        <div style={{
          fontSize: '12px',
          color: 'var(--alert-danger)',
          marginTop: '4px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

// ============================================
// TOAST NOTIFICATIONS
// ============================================

export const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const variants = {
    success: {
      background: 'var(--success-bright)',
      icon: '✓'
    },
    error: {
      background: 'var(--alert-danger)',
      icon: '✕'
    },
    warning: {
      background: 'var(--alert-warning)',
      icon: '⚠'
    },
    info: {
      background: 'var(--steel-bright)',
      icon: 'ℹ'
    }
  };

  const variant = variants[type];

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: variant.background,
      color: '#FFF',
      padding: '16px 24px',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 10000,
      animation: 'slideDown 0.3s ease-out',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      maxWidth: '400px',
      minWidth: '280px'
    }}>
      <span style={{ fontSize: '20px' }}>{variant.icon}</span>
      <span style={{ flex: 1, fontSize: '15px', fontWeight: '600' }}>{message}</span>
      {onClose && (
        <button
          onClick={() => {
            setVisible(false);
            if (onClose) setTimeout(onClose, 300);
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#FFF',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '0',
            lineHeight: '1',
            opacity: '0.8'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

// ============================================
// ANIMATIONS
// ============================================

// Add to global styles
const globalStyles = `
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}
