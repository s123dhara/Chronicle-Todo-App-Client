import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button, Card } from '../components/UI';

export default function ForgotPassword() {
  const { colors } = useApp();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError('');
    // TODO: API call for password reset
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: `1px solid ${colors.border}`,
    background: colors.surface,
    color: colors.text,
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: colors.text,
    marginBottom: '8px',
  };

  const errorStyle = {
    fontSize: '12px',
    color: colors.danger,
    marginTop: '4px',
  };

  return (
    <div className="auth-container" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: colors.bg,
    }}>
      <div className="auth-box" style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontFamily: 'DM Serif Display',
            fontSize: '36px',
            color: colors.accent,
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}>Chronicle</h1>
          <p style={{ fontSize: '14px', color: colors.textSub }}>
            {success ? 'Check your email' : 'Reset your password'}
          </p>
        </div>

        <Card style={{ padding: '32px' }}>
          {success ? (
            <div style={{ textAlign: 'center' }}>
              {/* Success Icon */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: colors.successBg,
                border: `2px solid ${colors.success}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '32px',
              }}>
                ✓
              </div>

              <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                color: colors.text,
                marginBottom: '12px',
              }}>
                Reset Link Sent
              </h2>

              <p style={{
                fontSize: '14px',
                color: colors.textSub,
                lineHeight: '1.6',
                marginBottom: '24px',
              }}>
                We've sent a password reset link to <strong style={{ color: colors.text }}>{email}</strong>.
                Please check your inbox and follow the instructions.
              </p>

              <div style={{
                background: colors.infoBg,
                border: `1px solid ${colors.info}40`,
                borderRadius: '10px',
                padding: '12px 16px',
                fontSize: '13px',
                color: colors.textSub,
                marginBottom: '24px',
                textAlign: 'left',
              }}>
                <strong style={{ color: colors.info }}>Note:</strong> The link will expire in 1 hour.
                If you don't see the email, check your spam folder.
              </div>

              <Link to="/login">
                <Button style={{ width: '100%' }}>
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{
                fontSize: '14px',
                color: colors.textSub,
                marginBottom: '24px',
                lineHeight: '1.6',
              }}>
                Enter your email address and we'll send you a link to reset your password.
              </div>

              {/* Email */}
              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="you@example.com"
                  style={{
                    ...inputStyle,
                    borderColor: error ? colors.danger : colors.border,
                  }}
                  onFocus={(e) => e.target.style.borderColor = colors.accent}
                  onBlur={(e) => e.target.style.borderColor = error ? colors.danger : colors.border}
                />
                {error && <div style={errorStyle}>{error}</div>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '15px',
                  fontWeight: 600,
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '16px',
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              {/* Back to Login */}
              <Link to="/login">
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: `1px solid ${colors.border}`,
                    background: 'transparent',
                    color: colors.text,
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = colors.surfaceAlt;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  ← Back to Sign In
                </button>
              </Link>
            </form>
          )}
        </Card>

        {/* Additional Help */}
        {!success && (
          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '13px',
            color: colors.textSub,
          }}>
            Need help?{' '}
            <a href="#" style={{
              color: colors.accent,
              textDecoration: 'none',
              fontWeight: 600,
            }}>
              Contact Support
            </a>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 480px) {
          .auth-box {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
