import React, { useState } from 'react';
import Link from 'next/link';

const ReportPage: React.FC = () => {
  const [name, setName] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (name && neighborhood && message) {
      console.log('Report submitted:', { name, neighborhood, message });
      setName('');
      setNeighborhood('');
      setMessage('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #faf5ff 0%, #f3e8ff 50%, #e9d5ff 100%)',
      padding: '2rem',
      fontFamily: '"SF Pro Display", -apple-system, sans-serif',
      position: 'relative',
    }}>
      {}
      <Link
        href="/"
        style={{
          position: 'fixed',
          top: '2rem',
          left: '2rem',
          zIndex: 100,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          color: '#7c3aed',
          textDecoration: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '0.95rem',
          border: '1px solid rgba(167, 139, 250, 0.3)',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.15)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 25px rgba(124, 58, 237, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(124, 58, 237, 0.15)';
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>←</span>
        Back to Home
      </Link>

      {}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: '4rem',
      }}>
        {}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}>
          

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
          }}>
            Report Your Neighborhood
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: '#6b7280',
            lineHeight: '1.7',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Help improve Torreón by sharing local challenges and ideas. Your input drives better urban planning and community development.
          </p>
        </div>

        {}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '3rem',
          border: '1px solid rgba(167, 139, 250, 0.2)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem',
                letterSpacing: '0.02em',
              }}>
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  fontSize: '1rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  outline: 'none',
                  transition: 'all 0.3s',
                  background: '#ffffff',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#a78bfa';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(167, 139, 250, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem',
                letterSpacing: '0.02em',
              }}>
                Neighborhood
              </label>
              <input
                type="text"
                placeholder="e.g., Centro, Campestre, Torreón Jardín"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  fontSize: '1rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  outline: 'none',
                  transition: 'all 0.3s',
                  background: '#ffffff',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#a78bfa';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(167, 139, 250, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem',
                letterSpacing: '0.02em',
              }}>
                Describe the Issue
              </label>
              <textarea
                placeholder="Share details about environmental challenges, infrastructure issues, or ideas for improvement..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  fontSize: '1rem',
                  borderRadius: '12px',
                  border: '2px solid #e5e7eb',
                  minHeight: '160px',
                  outline: 'none',
                  resize: 'vertical',
                  transition: 'all 0.3s',
                  background: '#ffffff',
                  fontFamily: 'inherit',
                  lineHeight: '1.6',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#a78bfa';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(167, 139, 250, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            {}
            <button
              onClick={handleSubmit}
              style={{
                padding: '1.1rem 2rem',
                fontSize: '1.05rem',
                fontWeight: '600',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                marginTop: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)';
              }}
            >
              Submit Report
            </button>
          </div>

          {}
          {submitted && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1.25rem',
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              borderRadius: '12px',
              border: '1px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                flexShrink: 0,
              }}>
                ✓
              </div>
              <p style={{
                color: '#065f46',
                fontWeight: '600',
                margin: 0,
                fontSize: '0.95rem',
              }}>
                Your report has been submitted successfully! Thank you for helping improve Torreón.
              </p>
            </div>
          )}
        </div>

        {}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginTop: '3rem',
          marginBottom: '3rem',
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '1.75rem',
            borderRadius: '16px',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🌍</div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.5rem',
            }}>
              Community Impact
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              lineHeight: '1.6',
              margin: 0,
            }}>
              Your reports help create data-driven solutions for urban challenges
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '1.75rem',
            borderRadius: '16px',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📊</div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.5rem',
            }}>
              Real-Time Analysis
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              lineHeight: '1.6',
              margin: 0,
            }}>
              Reports are analyzed with NASA satellite data for comprehensive insights
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            padding: '1.75rem',
            borderRadius: '16px',
            border: '1px solid rgba(167, 139, 250, 0.2)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🚀</div>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#1f2937',
              marginBottom: '0.5rem',
            }}>
              Action Driven
            </h3>
            <p style={{
              fontSize: '0.9rem',
              color: '#6b7280',
              lineHeight: '1.6',
              margin: 0,
            }}>
              Your input directly influences urban planning and policy decisions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;