import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const defaultImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80";

  return (
    <div 
      className="card card-accent"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {/* Banner Image Container */}
      <div 
        style={{
          position: 'relative',
          height: '210px',
          width: '100%',
          overflow: 'hidden',
          background: 'var(--color-surface)'
        }}
      >
        {project.logo && (
          <div style={{ position: 'absolute', top: '14px', right: '14px', zIndex: 3, width: '52px', height: '52px', background: 'rgba(255, 255, 255, 0.96)', borderRadius: '12px', padding: '6px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)' }}>
            <img src={project.logo} alt={`${project.title} logo`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        )}
        <img 
          src={project.bannerImage || defaultImage} 
          alt={project.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          onError={(e) => {
            e.target.src = defaultImage;
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        />
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(11, 18, 20, 0.95) 0%, rgba(11, 18, 20, 0.2) 60%, transparent 100%)'
          }}
        />

      </div>

      {/* Card Content Body */}
      <div 
        style={{
          padding: 'var(--space-xl)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1
        }}
      >
        <div>
          {/* Client Subtext */}
          <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', marginBottom: '6px', fontWeight: 600, letterSpacing: '0.04em' }}>
            {project.client}
          </div>

          {/* Title */}
          <h3 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: '10px', lineHeight: 1.35 }}>
            {project.title}
          </h3>

          {/* Short Description */}
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', lineHeight: 1.5 }}>
            {project.shortDescription}
          </p>

          {/* Technologies Tag Chips */}
          {project.technologies && project.technologies.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-lg)' }}>
              {project.technologies.slice(0, 4).map((tech, idx) => (
                <span 
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-muted)'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Action Link */}
        <div style={{ paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border-light)' }}>
          <Link 
            to={`/products/${project.slug}`}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'space-between' }}
          >
            <span>View Product</span>
            <ArrowUpRight size={16} color="var(--color-primary)" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
