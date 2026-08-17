import React from 'react';
import { 
  Layers, 
  Code, 
  Zap, 
  Server, 
  Cpu, 
  Terminal, 
  Database, 
  HardDrive, 
  Smartphone, 
  Cloud, 
  Box, 
  Network, 
  GitBranch 
} from 'lucide-react';

const iconMap = {
  Layers,
  Code,
  Zap,
  Server,
  Cpu,
  Terminal,
  Database,
  HardDrive,
  Smartphone,
  Cloud,
  Box,
  Network,
  GitBranch
};

const TechBadge = ({ tech }) => {
  const IconComponent = iconMap[tech.icon] || Cpu;

  return (
    <div 
      className="card"
      style={{
        padding: 'var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(var(--color-primary-rgb), 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-light)'
            }}
          >
            <IconComponent size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', color: 'var(--color-white)', fontWeight: 600 }}>
              {tech.name}
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>
              {tech.category}
            </span>
          </div>
        </div>

        {tech.proficiency && (
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
            {tech.proficiency}%
          </span>
        )}
      </div>

      {/* Proficiency Bar */}
      {tech.proficiency && (
        <div 
          style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}
        >
          <div 
            style={{
              width: `${tech.proficiency}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-primary-dark), var(--color-primary))',
              borderRadius: 'var(--radius-full)'
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TechBadge;
