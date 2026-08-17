import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, Lock, Mail, ArrowRight, AlertCircle, Loader2, KeyRound } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFillDefaults = () => {
    setEmail('admin@savrion.com');
    setPassword('SavrionAdmin2026!');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-background)',
        padding: 'var(--space-md)',
        position: 'relative'
      }}
    >
      {/* Background Cyber Glow */}
      <div 
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(0, 174, 169, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div 
        className="card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: 'var(--space-2xl)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border)',
          background: 'rgba(11, 18, 20, 0.95)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(var(--color-primary-rgb), 0.15)',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <div 
            style={{
              width: '52px',
              height: '52px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-primary)',
              color: 'var(--color-black)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 20px var(--color-primary-glow)'
            }}
          >
            <Code2 size={30} strokeWidth={2.5} />
          </div>

          <h1 style={{ fontSize: '1.6rem', color: 'var(--color-white)', marginBottom: '6px' }}>
            SAVRION<span style={{ color: 'var(--color-primary)' }}>.</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Enterprise Content Administration Portal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div 
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid var(--color-danger)',
              color: '#FECACA',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: 'var(--space-lg)'
            }}
          >
            <AlertCircle size={18} color="var(--color-danger)" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-login-email">Admin Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                id="admin-login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@savrion.com"
                className="form-input"
                style={{ paddingLeft: '42px' }}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 'var(--space-xl)' }}>
            <label className="form-label" htmlFor="admin-login-password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                id="admin-login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="form-input"
                style={{ paddingLeft: '42px' }}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
            id="admin-submit-login-btn"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin-slow" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper Pill */}
        <div 
          style={{
            marginTop: 'var(--space-xl)',
            paddingTop: 'var(--space-md)',
            borderTop: '1px solid var(--color-border-light)',
            textAlign: 'center'
          }}
        >
          <button
            type="button"
            onClick={handleFillDefaults}
            style={{
              background: 'rgba(var(--color-primary-rgb), 0.08)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              color: 'var(--color-primary-light)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <KeyRound size={14} />
            <span>Fill Default Admin Credentials</span>
          </button>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
            admin@savrion.com / SavrionAdmin2026!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
