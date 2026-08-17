import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUpRight, 
  Shield, 
  Terminal,
  ExternalLink,
  Globe
} from 'lucide-react';

const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Footer = ({ content }) => {
  const company = content?.company || {
    name: 'Savrion',
    tagline: 'Empowering Businesses Through Advanced Software Solutions',
    email: 'contact@savrion.com',
    phone: '+1 (800) 555-0199',
    address: '100 Cyber Tower, Innovation Boulevard, Suite 500, Tech City',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    }
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services Catalog', path: '/services' },
    { name: 'Technologies Matrix', path: '/technologies' },
    { name: 'Case Studies', path: '/projects' },
    { name: 'Contact & Inquiries', path: '/contact' }
  ];

  const serviceLinks = [
    { name: 'Web Application Development', path: '/services/web-development' },
    { name: 'Mobile App Development', path: '/services/mobile-development' },
    { name: 'Custom Software Solutions', path: '/services/custom-software' },
    { name: 'UI/UX Design & Prototyping', path: '/services/ui-ux-design' },
    { name: 'Cloud & DevOps Architecture', path: '/services/cloud-solutions' },
    { name: 'IT Consulting & Audits', path: '/services/it-consulting' }
  ];

  return (
    <footer 
      style={{
        background: 'var(--color-black)',
        borderTop: '1px solid var(--color-border)',
        position: 'relative',
        zIndex: 2,
        paddingTop: 'var(--space-4xl)',
        paddingBottom: 'var(--space-2xl)'
      }}
    >
      <div className="container">
        {/* Top Footer Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--space-2xl)',
            marginBottom: 'var(--space-3xl)'
          }}
        >
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
              <div 
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-black)',
                  boxShadow: '0 0 14px var(--color-primary-glow)'
                }}
              >
                <Code2 size={22} strokeWidth={2.5} />
              </div>
              <span 
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: '800',
                  color: 'var(--color-white)',
                  letterSpacing: '-0.02em'
                }}
              >
                SAVRION<span style={{ color: 'var(--color-primary)' }}>.</span>
              </span>
            </Link>

            <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              {company.tagline || 'Savrion delivers high-impact software solutions, cloud architectures, and digital systems engineered for modern global businesses.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              {company.socials?.github && (
                <a 
                  href={company.socials.github} 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Savrion GitHub"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-secondary)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                >
                  <GithubIcon size={18} />
                </a>
              )}
              {company.socials?.linkedin && (
                <a 
                  href={company.socials.linkedin} 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Savrion LinkedIn"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-secondary)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                >
                  <LinkedinIcon size={18} />
                </a>
              )}
              {company.socials?.twitter && (
                <a 
                  href={company.socials.twitter} 
                  target="_blank" 
                  rel="noreferrer"
                  aria-label="Savrion Twitter"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-secondary)',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = 'var(--color-primary)'; e.currentTarget.style.borderColor = 'var(--color-primary)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
                >
                  <TwitterIcon size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '1rem', marginBottom: 'var(--space-md)', fontWeight: 600 }}>
              Company Links
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    style={{ 
                      color: 'var(--color-text-secondary)', 
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary-light)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Software Services */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '1rem', marginBottom: 'var(--space-md)', fontWeight: 600 }}>
              Engineering Solutions
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {serviceLinks.map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    style={{ 
                      color: 'var(--color-text-secondary)', 
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-primary-light)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Contact Info */}
          <div>
            <h4 style={{ color: 'var(--color-white)', fontSize: '1rem', marginBottom: 'var(--space-md)', fontWeight: 600 }}>
              Headquarters
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{company.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <a href={`mailto:${company.email}`} style={{ color: 'inherit' }}>{company.email}</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <a href={`tel:${company.phone}`} style={{ color: 'inherit' }}>{company.phone}</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          style={{
            borderTop: '1px solid var(--color-border-light)',
            paddingTop: 'var(--space-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-md)',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Savrion Software Solutions. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span>Security First Architecture</span>
            <span>•</span>
            <span>ISO & SOC2 Aligned</span>
            <span>•</span>
            <a 
              href="http://localhost:5174" 
              target="_blank" 
              rel="noreferrer"
              style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Admin Portal</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
