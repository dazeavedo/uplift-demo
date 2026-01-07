import React from 'react';
import { useNavigate } from 'react-router-dom';
import { applications } from '../../data/mockData';
import WorkerNav from '../shared/WorkerNav';

export default function Applications() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1F1F1F',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#FFFFFF', margin: 0 }}>
          My Applications
        </h1>
      </div>

      <div style={{ padding: '24px' }}>
        {applications.map((app) => (
          <div
            key={app.id}
            style={{
              background: 'rgba(255, 215, 0, 0.08)',
              border: '2px solid rgba(255, 215, 0, 0.4)',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 8px 32px rgba(255, 215, 0, 0.2)'
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '20px'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '22px',
                  fontWeight: '900',
                  marginBottom: '6px',
                  color: '#FFFFFF'
                }}>
                  {app.jobTitle}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  fontWeight: '600'
                }}>
                  {app.location}
                </div>
              </div>
              <div style={{
                padding: '8px 16px',
                borderRadius: '16px',
                fontSize: '13px',
                fontWeight: '700',
                background: 'rgba(74, 144, 226, 0.25)',
                color: '#4A90E2',
                border: '2px solid rgba(74, 144, 226, 0.4)'
              }}>
                {app.status === 'interview' ? 'Interview' : 'In Review'}
              </div>
            </div>

            {/* Timeline */}
            <div style={{ margin: '24px 0', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                {/* Progress line background */}
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  right: '14px',
                  height: '3px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  zIndex: 0
                }} />
                {/* Progress line active */}
                <div style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  width: '66%',
                  height: '3px',
                  background: '#FFD700',
                  zIndex: 1
                }} />
                
                {/* Steps */}
                {app.timeline.map((step, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 2
                    }}
                  >
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '14px',
                      background: step.completed 
                        ? '#FFD700' 
                        : step.current 
                        ? 'rgba(74, 144, 226, 0.3)' 
                        : 'rgba(255, 255, 255, 0.1)',
                      border: step.current ? '3px solid #4A90E2' : '3px solid #1F1F1F',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '8px',
                      boxShadow: step.current ? '0 0 0 4px rgba(74, 144, 226, 0.2)' : 'none'
                    }}>
                      {step.completed && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2C2C2C" strokeWidth="4">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: step.current ? '#4A90E2' : step.completed ? '#FFFFFF' : '#9CA3AF',
                      fontWeight: '700',
                      textAlign: 'center'
                    }}>
                      {step.step}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next action */}
            {app.interview && (
              <div style={{
                background: 'rgba(74, 144, 226, 0.15)',
                borderLeft: '4px solid #4A90E2',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '18px'
              }}>
                <div style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  marginBottom: '6px',
                  color: '#4A90E2'
                }}>
                  Interview Scheduled
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#E5E7EB',
                  lineHeight: '1.5'
                }}>
                  {app.interview.date} at {app.interview.time}<br />
                  <span style={{ color: '#9CA3AF' }}>with {app.interview.interviewer}</span>
                </div>
              </div>
            )}

            {/* Details */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '10px',
                fontSize: '13px'
              }}>
                <span style={{ color: '#9CA3AF', fontWeight: '600' }}>Applied:</span>
                <span style={{ fontWeight: '700', color: '#FFFFFF' }}>{app.appliedDate}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px'
              }}>
                <span style={{ color: '#9CA3AF', fontWeight: '600' }}>Salary:</span>
                <span style={{ fontWeight: '700', color: '#10B981' }}>£{app.salary.toLocaleString()}/year</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <WorkerNav />
    </div>
  );
}
