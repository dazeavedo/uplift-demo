import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { feedPosts } from '../../data/mockData';
import WorkerNav from '../shared/WorkerNav';

export default function WorkerHome() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleApplyClick = () => {
    navigate('/worker/job/j1');
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
        <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#FFFFFF', margin: 0 }}>
          Feed
        </h1>
        <button
          onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            color: '#9CA3AF',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      {/* Posts */}
      <div style={{ padding: '20px 24px' }}>
        {feedPosts.map((post) => (
          <div
            key={post.id}
            style={{
              background: post.featured 
                ? 'rgba(255, 215, 0, 0.08)' 
                : 'rgba(255, 255, 255, 0.05)',
              border: post.featured 
                ? '2px solid rgba(255, 215, 0, 0.5)' 
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '20px',
              boxShadow: post.featured ? '0 4px 16px rgba(255, 215, 0, 0.2)' : 'none'
            }}
          >
            {/* Author header */}
            {post.author && (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '24px',
                  background: post.featured 
                    ? 'linear-gradient(135deg, #FFD700, #FFA500)' 
                    : 'linear-gradient(135deg, #4A90E2, #357ABD)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '900',
                  color: post.featured ? '#2C2C2C' : '#FFFFFF',
                  marginRight: '12px'
                }}>
                  {post.authorInitials}
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#FFFFFF' }}>
                    {post.author}
                  </div>
                  <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                    {post.authorRole || ''} {post.authorRole && '•'} {post.time}
                  </div>
                </div>
              </div>
            )}

            {/* Job post content */}
            {post.type === 'job' && (
              <div style={{
                background: 'rgba(255, 215, 0, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#FFD700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '8px'
                }}>
                  🎯 {post.title}
                </div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: '900',
                  color: '#FFFFFF',
                  marginBottom: '8px'
                }}>
                  {post.subtitle}
                </div>
                <div style={{
                  fontSize: '15px',
                  color: '#E5E7EB',
                  marginBottom: '12px'
                }}>
                  {post.content}
                </div>
                <button
                  onClick={handleApplyClick}
                  style={{
                    background: '#FFD700',
                    color: '#2C2C2C',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {post.cta} →
                </button>
              </div>
            )}

            {/* Regular update content */}
            {post.type === 'update' && (
              <div style={{
                fontSize: '16px',
                color: '#E5E7EB',
                lineHeight: '1.6',
                marginBottom: '12px'
              }}>
                {post.content}
              </div>
            )}

            {/* Announcement content */}
            {post.type === 'announcement' && (
              <div style={{
                background: 'rgba(74, 144, 226, 0.1)',
                borderLeft: '4px solid #4A90E2',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#4A90E2',
                  marginBottom: '8px'
                }}>
                  📢 ANNOUNCEMENT
                </div>
                <div style={{
                  fontSize: '16px',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  marginBottom: '4px'
                }}>
                  {post.title}
                </div>
                <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                  {post.content}
                </div>
              </div>
            )}

            {/* Engagement stats */}
            {post.likes && (
              <div style={{
                display: 'flex',
                gap: '20px',
                fontSize: '14px',
                color: '#9CA3AF'
              }}>
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments} comments</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <WorkerNav />
    </div>
  );
}
