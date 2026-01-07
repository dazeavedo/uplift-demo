import React from 'react';
import { useNavigate } from 'react-router-dom';
import { jobs } from '../../data/mockData';
import WorkerNav from '../shared/WorkerNav';

export default function Grow() {
  const navigate = useNavigate();
  const job = jobs[0]; // For demo, showing one job

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1F1F1F',
      paddingBottom: '80px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Header */}
      <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '900',
          color: '#FFFFFF',
          margin: 0,
          marginBottom: '8px'
        }}>
          Grow
        </h1>
        <div style={{ fontSize: '15px', color: '#9CA3AF', fontWeight: '600' }}>
          Your path to promotion
        </div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Next role card */}
        <div style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          borderRadius: '24px',
          padding: '28px',
          color: '#2C2C2C',
          boxShadow: '0 16px 48px rgba(255, 215, 0, 0.5)',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: '700',
                opacity: 0.7,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '8px'
              }}>
                NEXT ROLE
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '900',
                marginBottom: '6px',
                lineHeight: 1
              }}>
                {job.title}
              </div>
              <div style={{
                fontSize: '15px',
                opacity: 0.8,
                fontWeight: '600'
              }}>
                Ready in {job.timeToReady}
              </div>
            </div>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(44, 44, 44, 0.25)',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700'
            }}>
              {job.match}% Match
            </div>
          </div>

          {/* Salary comparison */}
          <div style={{
            background: 'rgba(44, 44, 44, 0.25)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontSize: '15px',
              fontWeight: '600'
            }}>
              <span style={{ opacity: 0.8 }}>Your current:</span>
              <span style={{ fontWeight: '900' }}>£{job.currentSalary.toLocaleString()}/year</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontSize: '15px',
              fontWeight: '600'
            }}>
              <span style={{ opacity: 0.8 }}>New role:</span>
              <span style={{ fontWeight: '900' }}>£{job.newSalary.toLocaleString()}/year</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontSize: '15px',
              fontWeight: '600'
            }}>
              <span style={{ opacity: 0.8 }}>Hourly:</span>
              <span style={{ fontWeight: '900' }}>£{job.currentHourly} → £{job.newHourly}</span>
            </div>
            <div style={{
              paddingTop: '16px',
              marginTop: '16px',
              borderTop: '2px solid rgba(44, 44, 44, 0.3)',
              fontSize: '28px',
              fontWeight: '900',
              color: '#FFFFFF',
              textAlign: 'center'
            }}>
              +£{job.increase.toLocaleString()}/year (+{job.increasePercent}%)
            </div>
          </div>

          {/* Skills */}
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '700',
              marginBottom: '12px',
              opacity: 0.9
            }}>
              Skills needed:
            </div>
            <div style={{
              background: 'rgba(44, 44, 44, 0.2)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              {job.skills.map((skill, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: '14px',
                    marginBottom: idx < job.skills.length - 1 ? '10px' : 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>
                    {skill.status === 'complete' ? '✓' : '→'}
                  </span>
                  <span style={{ fontWeight: '600' }}>{skill.name}</span>
                  <span style={{ opacity: 0.7, fontSize: '13px' }}>
                    {skill.status === 'complete' && '(you have this)'}
                    {skill.status === 'inProgress' && `(${skill.progress}% complete)`}
                    {skill.status === 'needed' && '(need training)'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Apply button */}
        <button
          onClick={() => navigate(`/worker/job/${job.id}`)}
          style={{
            width: '100%',
            padding: '20px',
            background: '#4A90E2',
            border: 'none',
            borderRadius: '16px',
            fontSize: '18px',
            fontWeight: '900',
            color: '#FFFFFF',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(74, 144, 226, 0.4)'
          }}
        >
          View Details
        </button>
      </div>

      <WorkerNav />
    </div>
  );
}
