import React from 'react';
import { Sparkles } from 'lucide-react';

const SectionHeader = ({ 
  badge, 
  title, 
  highlightText, 
  subtitle, 
  centered = true,
  align = 'center'
}) => {
  return (
    <div 
      className={`section-header ${!centered ? 'text-left' : ''}`}
      style={{
        textAlign: centered ? 'center' : align,
        marginLeft: centered ? 'auto' : 0,
        marginRight: centered ? 'auto' : 0,
        marginBottom: 'var(--space-3xl)'
      }}
    >
      {badge && (
        <div style={{ marginBottom: '14px' }}>
          <span className="badge badge-cyan">
            <Sparkles size={13} color="var(--color-primary)" />
            <span>{badge}</span>
          </span>
        </div>
      )}

      <h2>
        {title}{' '}
        {highlightText && (
          <span className="gradient-text">{highlightText}</span>
        )}
      </h2>

      {subtitle && (
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '10px' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
