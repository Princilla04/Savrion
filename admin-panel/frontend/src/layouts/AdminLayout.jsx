import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Code2, 
  LayoutDashboard, 
  Layers, 
  Briefcase, 
  Cpu, 
  MessageSquare, 
  Star, 
  Globe, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  User, 
  ChevronRight,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { contactService } from '../services/contactService';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const websiteUrl = import.meta.env.VITE_WEBSITE_URL || 'http://localhost:5173';

  // Fetch unread messages count periodically
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const contacts = await contactService.getAll({ status: 'unread' });
        if (contacts) setUnreadCount(contacts.length);
      } catch (err) {
        // silent
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Services', path: '/services', icon: Layers },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Technologies', path: '/technologies', icon: Cpu },
    { name: 'Contact Inquiries', path: '/contacts', icon: MessageSquare, badge: unreadCount },
    { name: 'Testimonials', path: '/testimonials', icon: Star },
    { name: 'Website Content', path: '/content', icon: Globe }
  ];

  return (
    <div className="admin-layout">
      {/* ==========================================================
          SIDEBAR NAVIGATION
          ========================================================== */}
      <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div 
              style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-black)',
                fontWeight: 'bold'
              }}
            >
              <Code2 size={20} strokeWidth={2.5} />
            </div>
            <span>SAVRION<span style={{ color: 'var(--color-primary)' }}>.</span></span>
          </div>

          <button 
            className="mobile-sidebar-toggle" 
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="sidebar-nav">
          <div style={{ padding: '0 8px 8px 8px', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 600, letterSpacing: '0.06em' }}>
            Administration
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} color="var(--color-primary)" />
                <span style={{ flex: 1 }}>{item.name}</span>
                {item.badge > 0 && (
                  <span 
                    style={{
                      background: 'var(--color-primary)',
                      color: 'var(--color-black)',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '2px 7px',
                      borderRadius: 'var(--radius-full)'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info & Logout */}
        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(var(--color-primary-rgb), 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary-light)',
                border: '1px solid var(--color-border)'
              }}
            >
              <User size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {admin?.name || 'Administrator'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {admin?.email || 'admin@savrion.com'}
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center', color: 'var(--color-danger)' }}
            id="admin-logout-btn"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ==========================================================
          MAIN CONTENT AREA
          ========================================================== */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              className="mobile-sidebar-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Savrion Management Portal
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a 
              href={websiteUrl} 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Live Website</span>
              <ExternalLink size={14} color="var(--color-primary)" />
            </a>
          </div>
        </header>

        {/* Dynamic Admin Module Page */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
