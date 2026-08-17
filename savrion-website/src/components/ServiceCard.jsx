import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Globe, 
  Smartphone, 
  Code, 
  Layout, 
  Cloud, 
  Cpu, 
  Layers, 
  Shield, 
  Zap, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const iconMap = {
  Globe: Globe,
  Smartphone: Smartphone,
  Code: Code,
  Layout: Layout,
  Cloud: Cloud,
  Cpu: Cpu,
  Layers: Layers,
  Shield: Shield,
  Zap: Zap
};

const ServiceCard = ({ service }) => {
  const IconComponent = iconMap[service.icon] || Code;

  return (
    <div 
      className="card card-accent"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: 'var(--space-xl)'
      }}
    >
      <div>
        {/* Service Icon Header */}
        <div 
          style={{
            width: '54px',
            height: '54px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(var(--color-primary-rgb), 0.1)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary-light)',
            marginBottom: 'var(--space-lg)',
            boxShadow: '0 0 16px rgba(var(--color-primary-rgb), 0.15)'
          }}
        >
          <IconComponent size={26} strokeWidth={2} />
        </div>

        {/* Title */}
        <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--color-white)' }}>
          {service.title}
        </h3>

        {/* Short Description */}
        <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', lineHeight: 1.6 }}>
          {service.shortDescription}
        </p>

        {/* Key Capabilities List */}
        {service.capabilities && service.capabilities.length > 0 && (
          <ul 
            style={{ 
              listStyle: 'none', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px', 
              marginBottom: 'var(--space-xl)' 
            }}
          >
            {service.capabilities.slice(0, 3).map((cap, idx) => (
              <li 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  fontSize: '0.85rem', 
                  color: 'var(--color-text-secondary)' 
                }}
              >
                <CheckCircle2 size={15} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span>{cap}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Card Footer / Action */}
      <div style={{ paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border-light)' }}>
        <Link 
          to={`/services/${service.slug}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: 'var(--color-primary-light)',
            transition: 'gap 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.gap = '10px'}
          onMouseOut={(e) => e.currentTarget.style.gap = '6px'}
        >
          <span>Learn More</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
