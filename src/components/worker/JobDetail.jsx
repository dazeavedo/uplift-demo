import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobs } from '../../data/mockData';
import WorkerNav from '../shared/WorkerNav';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = jobs.find(j => j.id === id);
  const [applied, setApplied] = useState(false);

  if (!job) {
    return <div>Job not found</div>;
  }

  const handleApply = () => {
    setApplied(true);
    setTimeout(() => {
      navigate('/worker/applications');
    }, 1500);
  };

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
        <button
          onClick={() => navigate('/worker/grow')}
          style={{
            background: 'none',
            border: 'none',
            color: '#4A90E2',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
        <div style={{ fontSize: '14px', color: '#9CA3AF' }}>Job Details</div>
        <div style={{ fontSize: '14px', color: '#9CA3AF' }}>···</div>
      </div>

      <div style={{ padding: '24px' }}>
        {/* Job header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '36px',
            fontWeight: '900',
            color: '#FFFFFF',
            marginBottom: '8px'
          }}>
            {job.title}
          </div>
          <div style={{
            fontSize: '16px',
            color: '#9CA3AF',
            marginBottom: '16px'
          }}>
            {job.location} • Posted {job.posted}
          </div>
          <div style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: 'rgba(255, 215, 0, 0.2)',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '700',
            color: '#FFD700'
          }}>
            {job.match}% Match • Ready in {job.timeToReady}
          </div>
        </div>

        {/* Salary */}
        <div style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px',
          color: '#2C2C2C'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: '700',
            marginBottom: '12px',
            opacity: 0.8
          }}>
            SALARY
          </div>
          <div style={{
            fontSize: '32px',
            fontWeight: '900',
            marginBottom: '8px'
          }}>
            £{job.newSalary.toLocaleString()}/year
          </div>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>
            £{job.newHourly}/hour • +£{job.increase.toLocaleString()} vs current
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '900',
            color: '#FFFFFF',
            marginBottom: '12px'
          }}>
            About the Role
          </div>
          <div style={{
            fontSize: '16px',
            color: '#E5E7EB',
            lineHeight: '1.6'
          }}>
            {job.description}
          </div>
        </div>

        {/* Skills required */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            fontSize: '18px',
            fontWeight: '900',
            color: '#FFFFFF',
            marginBottom: '16px'
          }}>
            Skills Required
          </div>
          {job.skills.map((skill, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  marginBottom: '4px'
                }}>
                  {skill.name}
                </div>
                <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                  {skill.status === 'complete' && 'You have this skill'}
                  {skill.status === 'inProgress' && `${skill.progress}% complete`}
                  {skill.status === 'needed' && 'Training needed'}
                </div>
              </div>
              <div style={{
                fontSize: '24px',
                color: skill.status === 'complete' ? '#10B981' : '#FFD700'
              }}>
                {skill.status === 'complete' ? '✓' : '→'}
              </div>
            </div>
          ))}
        </div>

        {/* Apply button */}
        <button
          onClick={handleApply}
          disabled={applied}
          style={{
            width: '100%',
            padding: '20px',
            background: applied 
              ? 'linear-gradient(135deg, #10B981, #059669)' 
              : 'linear-gradient(135deg, #FFD700, #FFA500)',
            border: 'none',
            borderRadius: '16px',
            fontSize: '18px',
            fontWeight: '900',
            color: applied ? '#FFFFFF' : '#2C2C2C',
            cursor: applied ? 'default' : 'pointer',
            boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          {applied ? '✓ Application Submitted!' : 'Apply Now'}
        </button>

        {applied && (
          <div style={{
            textAlign: 'center',
            marginTop: '16px',
            fontSize: '14px',
            color: '#10B981',
            fontWeight: '700'
          }}>
            Redirecting to applications...
          </div>
        )}
      </div>

      <WorkerNav />
    </div>
  );
}
