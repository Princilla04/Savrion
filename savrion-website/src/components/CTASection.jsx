import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

const CTASection = ({ 
  title = "Ready to Engineer Your Next Digital Breakthrough?",
  subtitle = "Partner with Savrion's elite software architects to build resilient, scalable, and high-performance digital systems.",
  primaryText = "Schedule a Strategy Call",
  primaryLink = "/contact",
  secondaryText = "Explore Our Services",
  secondaryLink = "/services"
}) => {
  return (
    <section className="section-py" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container">
        <div 
          className="card"
          style={{
            background: 'linear-gradient(135deg, rgba(11, 18, 20, 0.95) 0%, rgba(0, 174, 169, 0.12) 100%)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            padding: 'clamp(2rem, 5vw, 4rem)',
            textAlign: 'center',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(var(--color-primary-rgb), 0.15)'
          }}
        >
          {/* Subtle Ambient Glow */}
          <div 
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60%',
              height: '60%',
              background: 'radial-gradient(circle, rgba(var(--color-primary-rgb), 0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '780px', margin: '0 auto' }}>
            <div style={{ marginBottom: '16px' }}>
              <span className="badge badge-cyan">
                <Sparkles size={13} color="var(--color-primary)" />
                <span>Accelerate Transformation</span>
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '16px', color: 'var(--color-white)' }}>
              {title}
            </h2>

            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2xl)', lineHeight: 1.7 }}>
              {subtitle}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to={primaryLink} className="btn btn-primary btn-lg" id="cta-primary-btn">
                <span>{primaryText}</span>
                <ArrowRight size={18} />
              </Link>
              <Link to={secondaryLink} className="btn btn-secondary btn-lg" id="cta-secondary-btn">
                <span>{secondaryText}</span>
              </Link>
            </div>

            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px',
                marginTop: 'var(--space-2xl)',
                fontSize: '0.85rem',
                color: 'var(--color-text-muted)',
                flexWrap: 'wrap'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} color="var(--color-primary)" />
                Strict NDA & IP Protection
              </span>
              <span>•</span>
              <span>Flexible Agile Engagement Models</span>
              <span>•</span>
              <span>Dedicated Senior Engineers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
