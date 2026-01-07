import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { managerDashboard } from '../../data/mockData';

export default function AISchedule() {
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const data = managerDashboard.aiSchedule;

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2300); // Matches the 2.3 seconds in data
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1F1F1F',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '40px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '36px'
      }}>
        <div>
          <button
            onClick={() => navigate('/manager')}
            style={{
              background: 'none',
              border: 'none',
              color: '#4A90E2',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              marginBottom: '12px'
            }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#FFFFFF',
            margin: 0
          }}>
            AI Scheduling
          </h1>
          <div style={{
            fontSize: '16px',
            color: '#9CA3AF',
            fontWeight: '600',
            marginTop: '6px'
          }}>
            Generate optimized schedules in seconds
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {!generated ? (
          <>
            {/* Generate button */}
            <div style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              borderRadius: '32px',
              padding: '60px',
              marginBottom: '40px',
              boxShadow: '0 20px 60px rgba(255, 215, 0, 0.4)'
            }}>
              <div style={{
                fontSize: '64px',
                marginBottom: '24px'
              }}>
                {generating ? '⚡' : '🤖'}
              </div>
              <div style={{
                fontSize: '32px',
                fontWeight: '900',
                color: '#2C2C2C',
                marginBottom: '16px'
              }}>
                {generating ? 'Generating Schedule...' : 'Ready to Generate'}
              </div>
              <div style={{
                fontSize: '18px',
                color: '#2C2C2C',
                opacity: 0.8,
                marginBottom: '32px'
              }}>
                AI will create an optimized schedule for next week
              </div>
              <button
                onClick={handleGenerate}
                disabled={generating}
                style={{
                  padding: '20px 48px',
                  background: '#2C2C2C',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '20px',
                  fontWeight: '900',
                  color: '#FFD700',
                  cursor: generating ? 'default' : 'pointer',
                  opacity: generating ? 0.7 : 1
                }}
              >
                {generating ? 'Generating...' : 'Generate Schedule'}
              </button>
            </div>

            {/* How it works */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '32px',
              textAlign: 'left'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '900',
                color: '#FFFFFF',
                marginBottom: '20px'
              }}>
                How it works
              </h2>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '16px',
                    background: '#FFD700',
                    color: '#2C2C2C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    flexShrink: 0
                  }}>
                    1
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                      Analyze Constraints
                    </div>
                    <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                      Labor budget, required coverage, employee availability
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '16px',
                    background: '#FFD700',
                    color: '#2C2C2C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    flexShrink: 0
                  }}>
                    2
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                      Optimize Assignments
                    </div>
                    <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                      Match skills to shifts, minimize overtime, maximize satisfaction
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '16px',
                    background: '#FFD700',
                    color: '#2C2C2C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    flexShrink: 0
                  }}>
                    3
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF', marginBottom: '4px' }}>
                      Deliver Results
                    </div>
                    <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                      Complete schedule in 2.3 seconds, ready to publish
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Results */}
            <div style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              borderRadius: '32px',
              padding: '60px',
              marginBottom: '32px',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4)'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '24px' }}>✓</div>
              <div style={{
                fontSize: '32px',
                fontWeight: '900',
                color: '#FFFFFF',
                marginBottom: '16px'
              }}>
                Schedule Generated!
              </div>
              <div style={{
                fontSize: '18px',
                color: '#FFFFFF',
                opacity: 0.9,
                marginBottom: '32px'
              }}>
                Generated in {data.generationTime} seconds
              </div>
            </div>

            {/* Stats grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '20px',
                padding: '32px'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  fontWeight: '700',
                  marginBottom: '12px'
                }}>
                  SAVINGS
                </div>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  color: '#10B981',
                  marginBottom: '8px'
                }}>
                  £{data.savings}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  fontWeight: '600'
                }}>
                  under budget
                </div>
              </div>

              <div style={{
                background: 'rgba(74, 144, 226, 0.1)',
                border: '2px solid rgba(74, 144, 226, 0.4)',
                borderRadius: '20px',
                padding: '32px'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  fontWeight: '700',
                  marginBottom: '12px'
                }}>
                  COVERAGE
                </div>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  color: '#4A90E2',
                  marginBottom: '8px'
                }}>
                  {data.coverage}%
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  fontWeight: '600'
                }}>
                  all shifts filled
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 215, 0, 0.1)',
                border: '2px solid rgba(255, 215, 0, 0.4)',
                borderRadius: '20px',
                padding: '32px'
              }}>
                <div style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  fontWeight: '700',
                  marginBottom: '12px'
                }}>
                  SATISFACTION
                </div>
                <div style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  color: '#FFD700',
                  marginBottom: '8px'
                }}>
                  {data.satisfaction}%
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#9CA3AF',
                  fontWeight: '600'
                }}>
                  team happiness
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setGenerated(false)}
                style={{
                  padding: '16px 32px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Generate Again
              </button>
              <button
                style={{
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '900',
                  color: '#2C2C2C',
                  cursor: 'pointer'
                }}
              >
                Publish Schedule
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
