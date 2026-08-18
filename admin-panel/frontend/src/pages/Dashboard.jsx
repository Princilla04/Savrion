import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Briefcase, 
  MessageSquare, 
  Star, 
  ArrowUpRight, 
  Plus, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Mail,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';

const Dashboard = () => {
  const { admin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (err) {
        console.warn('Error loading dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const statCards = [
    {
      title: 'Active Services',
      value: stats?.servicesCount ?? 0,
      icon: Layers,
      link: '/services',
      color: 'var(--color-primary)'
    },
    {
      title: 'Products',
      value: stats?.projectsCount ?? 0,
      icon: Briefcase,
      link: '/projects',
      color: '#38BDF8'
    },
    {
      title: 'Contact Inquiries',
      value: stats?.contactsTotal ?? 0,
      subtitle: stats?.contactsUnread ? `${stats.contactsUnread} unread` : 'All read',
      icon: MessageSquare,
      link: '/contacts',
      color: '#F59E0B',
      highlight: (stats?.contactsUnread ?? 0) > 0
    },
    {
      title: 'Client Testimonials',
      value: stats?.testimonialsCount ?? 0,
      icon: Star,
      link: '/testimonials',
      color: '#10B981'
    }
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Welcome, {admin?.name || 'Administrator'}
          </h1>
          <p className="page-subtitle">
            Savrion Enterprise Central Command & Content Operations
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/services" className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add Service</span>
          </Link>
          <Link to="/projects" className="btn btn-secondary btn-sm">
            <Plus size={16} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards Grid */}
      <div className="stats-grid">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={idx} 
              to={stat.link} 
              className="stat-card"
              style={{
                textDecoration: 'none',
                borderColor: stat.highlight ? 'var(--color-warning)' : undefined
              }}
            >
              <div 
                className="stat-icon"
                style={{
                  background: `rgba(var(--color-primary-rgb), 0.12)`,
                  color: stat.color
                }}
              >
                <Icon size={24} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="stat-value">{loading ? '...' : stat.value}</div>
                <div className="stat-label">{stat.title}</div>
                {stat.subtitle && (
                  <div 
                    style={{
                      fontSize: '0.75rem',
                      color: stat.highlight ? 'var(--color-warning)' : 'var(--color-text-muted)',
                      marginTop: '2px',
                      fontWeight: stat.highlight ? 600 : 400
                    }}
                  >
                    {stat.subtitle}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Shortcuts Banner */}
      <div 
        className="admin-card"
        style={{
          marginBottom: 'var(--space-xl)',
          padding: 'var(--space-lg)',
          background: 'linear-gradient(135deg, rgba(11, 18, 20, 0.95) 0%, rgba(0, 174, 169, 0.08) 100%)',
          border: '1px solid var(--color-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div 
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(var(--color-primary-rgb), 0.15)',
                color: 'var(--color-primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--color-white)' }}>
                Website Content Architecture
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                Modify hero banners, corporate values, global company information, and live stats in one place.
              </p>
            </div>
          </div>

          <Link to="/content" className="btn btn-primary btn-sm">
            <span>Manage Website Content</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>

      {/* Recent Contact Inquiries Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--color-white)' }}>
              Recent Contact Inquiries
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              Incoming submissions from prospective enterprise clients
            </p>
          </div>

          <Link to="/contacts" className="btn btn-secondary btn-sm">
            <span>View All ({stats?.contactsTotal || 0})</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject & Organization</th>
                <th>Status</th>
                <th>Received</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                    Loading inquiries...
                  </td>
                </tr>
              ) : (!stats?.recentContacts || stats.recentContacts.length === 0) ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)' }}>
                    No contact inquiries received yet.
                  </td>
                </tr>
              ) : (
                stats.recentContacts.map((c) => (
                  <tr key={c._id || c.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-white)' }}>{c.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{c.email}</div>
                    </td>
                    <td>
                      <div style={{ color: 'var(--color-text-primary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.subject}
                      </div>
                      {c.company && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)' }}>
                          {c.company}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${c.status === 'unread' ? 'badge-unread' : 'badge-read'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to="/contacts" className="btn btn-secondary btn-sm">
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
