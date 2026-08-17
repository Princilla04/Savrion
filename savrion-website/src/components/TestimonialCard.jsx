import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div 
      className="card card-accent"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: 'var(--space-xl)',
        background: 'var(--color-card)'
      }}
    >
      <div>
        {/* Rating Stars & Quote Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', gap: '3px' }}>
            {[...Array(testimonial.rating || 5)].map((_, i) => (
              <Star key={i} size={16} fill="var(--color-primary)" color="var(--color-primary)" />
            ))}
          </div>
          <Quote size={24} color="var(--color-primary)" style={{ opacity: 0.4 }} />
        </div>

        {/* Content */}
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 'var(--space-xl)' }}>
          "{testimonial.content}"
        </p>
      </div>

      {/* Author Info */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          paddingTop: 'var(--space-md)',
          borderTop: '1px solid var(--color-border-light)'
        }}
      >
        <div 
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-full)',
            background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-card))',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.9rem',
            color: 'var(--color-white)'
          }}
        >
          {testimonial.clientName ? testimonial.clientName.charAt(0) : 'S'}
        </div>
        <div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--color-white)', fontWeight: 600 }}>
            {testimonial.clientName}
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)' }}>
            {testimonial.role}, {testimonial.company}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
