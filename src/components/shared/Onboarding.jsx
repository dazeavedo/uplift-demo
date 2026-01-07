import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './UIComponents';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: '🚀',
      title: 'Welcome to Uplift',
      subtitle: 'Your Career GPS',
      description: 'We help frontline workers like you discover opportunities, build skills, and advance your career—right where you work.',
      animation: 'pulse-momentum 2s infinite'
    },
    {
      icon: '📈',
      title: 'See Your Path Forward',
      subtitle: 'Skills-Based Career Mapping',
      description: 'Know exactly what skills you need for your next role. We show you the roadmap, you walk the path.',
      stat: { value: '87%', label: 'match to Team Lead' }
    },
    {
      icon: '⭐',
      title: 'Earn as You Learn',
      subtitle: 'Every Shift Builds Your Future',
      description: 'Complete tasks, earn skill points, level up. Your daily work translates into career progress.',
      stat: { value: '12', label: 'skills to next level' }
    },
    {
      icon: '💪',
      title: 'You\'re in Control',
      subtitle: 'Apply When Ready',
      description: 'Browse internal opportunities matched to your skills. When you see the right fit, apply with confidence—your manager will support you.',
      stat: { value: '3', label: 'open positions matched to you' }
    }
  ];

  const currentStep = steps[step];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, var(--momentum-glow) 0%, transparent 70%)',
        pointerEvents: 'none',
        animation: currentStep.animation || 'none'
      }} />

      {/* Progress indicators */}
      <div style={{
        padding: '60px 20px 20px',
        display: 'flex',
        gap: '8px',
        justifyContent: 'center'
      }}>
        {steps.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: '40px',
              height: '4px',
              background: idx <= step ? 'var(--momentum-bright)' : 'var(--bg-elevated)',
              borderRadius: '2px',
              transition: 'all var(--transition-base)'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        {/* Icon */}
        <div style={{
          width: '120px',
          height: '120px',
          background: 'var(--momentum-glow)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '64px',
          marginBottom: '32px',
          animation: currentStep.animation || 'none'
        }}>
          {currentStep.icon}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: '900',
          color: 'var(--text-primary)',
          marginBottom: '8px',
          letterSpacing: '-0.5px'
        }}>
          {currentStep.title}
        </h1>

        {/* Subtitle */}
        <div style={{
          fontSize: '17px',
          fontWeight: '600',
          color: 'var(--momentum-bright)',
          marginBottom: '24px'
        }}>
          {currentStep.subtitle}
        </div>

        {/* Description */}
        <p style={{
          fontSize: '16px',
          lineHeight: '1.6',
          color: 'var(--text-secondary)',
          maxWidth: '400px',
          marginBottom: '32px'
        }}>
          {currentStep.description}
        </p>

        {/* Stat callout */}
        {currentStep.stat && (
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--bg-elevated)',
            borderLeft: '4px solid var(--momentum-bright)',
            padding: '20px 24px',
            borderRadius: 'var(--radius-md)',
            maxWidth: '300px',
            width: '100%'
          }}>
            <div style={{
              fontSize: '48px',
              fontWeight: '900',
              color: 'var(--momentum-bright)',
              lineHeight: 1,
              marginBottom: '8px'
            }}>
              {currentStep.stat.value}
            </div>
            <div style={{
              fontSize: '14px',
              color: 'var(--text-tertiary)'
            }}>
              {currentStep.stat.label}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{
        padding: '24px 32px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => {
            if (step < steps.length - 1) {
              setStep(step + 1);
            } else {
              // Mark onboarding complete and navigate
              localStorage.setItem('onboarding_complete', 'true');
              navigate('/');
            }
          }}
        >
          {step < steps.length - 1 ? 'Continue' : 'Get Started 🚀'}
        </Button>

        {step < steps.length - 1 ? (
          <button
            onClick={() => {
              localStorage.setItem('onboarding_complete', 'true');
              navigate('/');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-tertiary)',
              fontSize: '14px',
              padding: '12px',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            Skip
          </button>
        ) : (
          <div style={{ height: '44px' }} /> // Spacer for consistency
        )}
      </div>
    </div>
  );
}

// Helper component for showing onboarding on first launch
export const useOnboarding = () => {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(() => {
    return !localStorage.getItem('onboarding_complete');
  });

  const completeOnboarding = () => {
    localStorage.setItem('onboarding_complete', 'true');
    setShouldShowOnboarding(false);
  };

  return { shouldShowOnboarding, completeOnboarding };
};
