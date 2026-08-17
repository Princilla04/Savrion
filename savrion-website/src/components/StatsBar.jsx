import React from 'react';
import { Award, Users, CheckCircle, ShieldCheck } from 'lucide-react';

const defaultStats = [
  { label: 'Enterprise Projects Delivered', value: '150+', description: 'Across 18+ industries worldwide' },
  { label: 'Client Satisfaction Rating', value: '99.4%', description: 'Net promoter score rating' },
  { label: 'Expert Software Engineers', value: '45+', description: 'Specialized architects and developers' },
  { label: 'System SLA Uptime', value: '99.99%', description: 'Enterprise reliability guarantee' }
];

const StatsBar = ({ stats = defaultStats }) => {
  const displayStats = (stats && stats.length > 0) ? stats : defaultStats;

  return (
    <div 
      className="card card-glass"
      style={{
        padding: 'var(--space-2xl) var(--space-xl)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(var(--color-primary-rgb), 0.08)'
      }}
    >
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-xl)',
          textAlign: 'center'
        }}
      >
        {displayStats.map((item, idx) => (
          <div 
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <span 
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: '800',
                color: 'var(--color-white)',
                lineHeight: 1.1,
                marginBottom: '6px'
              }}
            >
              <span className="gradient-text">{item.value}</span>
            </span>
            <span 
              style={{
                fontSize: '0.95rem',
                fontWeight: '600',
                color: 'var(--color-text-primary)',
                marginBottom: '4px'
              }}
            >
              {item.label}
            </span>
            {item.description && (
              <span 
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--color-text-muted)',
                  maxWidth: '220px'
                }}
              >
                {item.description}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
