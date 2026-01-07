import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, ProgressBar } from '../shared/UIComponents';
import { mockData } from '../../data/mockData';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = mockData.jobs.find(j => j.id === parseInt(id)) || mockData.jobs[0];
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);

  const matchScore = 85;
  const skillsYouHave = 8;
  const skillsRequired = 10;

  const handleApply = () => {
    setApplied(true);
    setShowApplyModal(false);
    setTimeout(() => navigate('/applications'), 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '100px' }}>
      {/* Success Toast */}
      {applied && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--success-bright)',
          color: '#FFF',
          padding: '16px 24px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1001,
          animation: 'slideUp 0.3s ease-out',
          fontWeight: '600'
        }}>
          ✓ Application submitted!
        </div>
      )}

      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        padding: '20px', 
        paddingTop: '60px',
        borderBottom: `3px solid var(--steel-bright)`
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'none',
            border: 'none',
            color: 'var(--steel-bright)',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '16px',
            padding: '0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          ← Back
        </button>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '900', 
          color: 'var(--text-primary)', 
          marginBottom: '8px',
          letterSpacing: '-0.5px'
        }}>
          {job.title}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-tertiary)' }}>
          {job.department}
        </p>
      </div>

      {/* Match Score Hero */}
      <div style={{ padding: '20px' }}>
        <Card variant="elevated" style={{
          background: 'linear-gradient(135deg, var(--success-bright) 0%, var(--success-deep) 100%)',
          textAlign: 'center',
          animation: 'slideUp 0.4s ease-out'
        }}>
          <div style={{ fontSize: '64px', fontWeight: '900', color: '#FFF', marginBottom: '8px', lineHeight: 1 }}>
            {matchScore}%
          </div>
          <div style={{ fontSize: '17px', fontWeight: '700', color: '#FFF', marginBottom: '12px' }}>
            Great Match!
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
            You have {skillsYouHave} out of {skillsRequired} required skills
          </div>
        </Card>
      </div>

      {/* Job Overview */}
      <div style={{ padding: '0 20px 20px' }}>
        <Card variant="elevated" style={{ animation: 'slideUp 0.5s ease-out' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'Pay Range', value: job.payRange, icon: '💰' },
              { label: 'Location', value: job.location, icon: '📍' },
              { label: 'Schedule', value: 'Full-time', icon: '🕐' },
              { label: 'Openings', value: '3 positions', icon: '👥' }
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {item.icon} {item.value}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Skills Match */}
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
          Your Skills Match
        </h2>
        <Card variant="elevated" style={{ animation: 'slideUp 0.6s ease-out' }}>
          <ProgressBar 
            value={skillsYouHave}
            max={skillsRequired}
            height={12}
            showLabel
            color="success"
          />
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {job.skills.map((skill, idx) => (
              <Badge 
                key={idx} 
                variant={idx < skillsYouHave ? 'success' : 'default'}
                size="md"
              >
                {idx < skillsYouHave ? '✓' : '○'} {skill}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Social Proof */}
      <div style={{ padding: '0 20px 20px' }}>
        <Card variant="momentum" style={{
          background: 'var(--steel-glow)',
          border: '1px solid var(--steel-bright)',
          animation: 'slideUp 0.7s ease-out'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>👥</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--steel-bright)', marginBottom: '6px' }}>
            Your Colleagues Advanced Here
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            3 people from your current role were promoted to this position in the last 6 months
          </div>
        </Card>
      </div>

      {/* About the Role */}
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
          About This Role
        </h2>
        <Card variant="elevated" style={{ animation: 'slideUp 0.8s ease-out' }}>
          <p style={{ 
            fontSize: '14px', 
            color: 'var(--text-secondary)', 
            lineHeight: '1.6',
            marginBottom: '16px'
          }}>
            We're looking for motivated team members to join our {job.department} team. This role offers great opportunities for growth and development.
          </p>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Key Responsibilities:
            </div>
            <ul style={{ 
              marginLeft: '20px', 
              fontSize: '14px', 
              color: 'var(--text-secondary)',
              lineHeight: '1.8'
            }}>
              <li>Deliver excellent customer service</li>
              <li>Maintain store standards and cleanliness</li>
              <li>Work collaboratively with team members</li>
              <li>Process transactions accurately</li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              What We Offer:
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Competitive pay, flexible scheduling, career advancement opportunities, employee discounts, and comprehensive training.
            </div>
          </div>
        </Card>
      </div>

      {/* Similar Roles */}
      <div style={{ padding: '0 20px 20px' }}>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          color: 'var(--text-primary)', 
          marginBottom: '12px'
        }}>
          Similar Opportunities
        </h2>
        {mockData.jobs.filter(j => j.id !== job.id).slice(0, 2).map((similarJob, idx) => (
          <Card 
            key={similarJob.id}
            variant="glass"
            onClick={() => navigate(`/job/${similarJob.id}`)}
            style={{ 
              marginBottom: '12px',
              cursor: 'pointer',
              animation: `slideUp ${0.9 + idx * 0.1}s ease-out`
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
              {similarJob.title}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
              {similarJob.department} • {similarJob.payRange}
            </div>
          </Card>
        ))}
      </div>

      {/* Fixed Apply Button */}
      <div style={{ 
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        padding: '16px 20px',
        background: 'linear-gradient(180deg, transparent 0%, var(--bg-primary) 20%)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid var(--bg-elevated)',
        zIndex: 100
      }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => setShowApplyModal(true)}
          icon="🚀"
        >
          Apply Now
        </Button>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div style={{ 
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <Card variant="elevated" style={{ 
            maxWidth: '400px',
            width: '100%',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '16px' }}>
              🎯
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '12px', textAlign: 'center' }}>
              Apply for {job.title}?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.6', textAlign: 'center' }}>
              Your manager will be notified of your interest. They'll review your application and get back to you within 3-5 business days.
            </p>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleApply}
              style={{ marginBottom: '12px' }}
            >
              Confirm Application
            </Button>
            <Button
              variant="ghost"
              size="md"
              fullWidth
              onClick={() => setShowApplyModal(false)}
            >
              Cancel
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
