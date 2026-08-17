import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { 
  Code2, 
  Menu, 
  X, 
  ChevronRight, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Technologies', path: '/technologies' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        height: '110px',
        display: 'flex',
        alignItems: 'center',
        background: isScrolled ? 'rgba(255, 255, 255, 0.92)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--color-border-light)' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 8% 0 8%' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <img src={logo} alt="Savrion Logo" style={{ height: '90px', width: 'auto', objectFit: 'contain' }} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav 
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '32px'
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              style={({ isActive }) => ({
                fontSize: '0.925rem',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
                position: 'relative',
                padding: '6px 0',
                transition: 'color 0.2s ease'
              })}
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  {isActive && (
                    <span 
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: 'var(--color-primary)',
                        borderRadius: '2px',
                        boxShadow: '0 0 8px var(--color-primary)'
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link 
            to="/contact" 
            className="btn btn-primary"
            style={{ 
              display: 'none',
              padding: '10px 22px', 
              fontSize: '0.875rem' 
            }}
            id="desktop-cta-btn"
          >
            <span>Get Started</span>
            <ArrowRight size={16} />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-white)',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={22} color="var(--color-primary)" /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 'var(--nav-height)',
            left: 0,
            width: '100%',
            height: 'calc(100vh - var(--nav-height))',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid var(--color-border-light)',
            padding: 'var(--space-xl) var(--space-lg)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 99
          }}
          className="animate-fade-in"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(var(--color-primary-rgb), 0.12)' : 'transparent',
                  color: isActive ? 'var(--color-primary-light)' : 'var(--color-text-primary)',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '1.05rem',
                  border: isActive ? '1px solid var(--color-border)' : '1px solid transparent'
                })}
              >
                <span>{link.name}</span>
                <ChevronRight size={18} color="var(--color-primary)" />
              </NavLink>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'var(--space-xl)' }}>
            <Link to="/contact" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              <span>Request a Proposal</span>
              <ArrowRight size={18} />
            </Link>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                color: 'var(--color-text-muted)', 
                fontSize: '0.8rem',
                marginTop: '8px'
              }}
            >
              <ShieldCheck size={16} color="var(--color-primary)" />
              <span>Enterprise Software & Cloud Engineering</span>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          #desktop-cta-btn {
            display: inline-flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
