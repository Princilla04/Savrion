import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Terminal } from 'lucide-react';

const NotFound = () => {
  return (
    <div 
      className="container"
      style={{
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-4xl)'
      }}
    >
      <div 
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(5rem, 12vw, 9rem)',
          fontWeight: '900',
          lineHeight: 1,
          color: 'var(--color-primary)',
          textShadow: '0 0 40px var(--color-primary-glow)',
          marginBottom: 'var(--space-md)'
        }}
      >
        404
      </div>

      <h1 style={{ fontSize: '2rem', marginBottom: '16px', color: 'var(--color-white)' }}>
        Route Architecture Not Found
      </h1>

      <p style={{ maxWidth: '540px', color: 'var(--color-text-secondary)', fontSize: '1.1rem', marginBottom: 'var(--space-2xl)', lineHeight: 1.6 }}>
        The requested endpoint or URL does not exist within the Savrion application routing map.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary btn-lg">
          <Home size={18} />
          <span>Return to Homepage</span>
        </Link>
        <Link to="/services" className="btn btn-secondary btn-lg">
          <span>Explore Services</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
