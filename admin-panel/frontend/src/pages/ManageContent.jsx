import React, { useEffect, useState } from 'react';
import { 
  Save, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  Building, 
  Target, 
  BarChart3, 
  Loader2 
} from 'lucide-react';
import { contentService } from '../services/contentService';

const ManageContent = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await contentService.getContent();
        setContent(data);
      } catch (err) {
        console.warn('Failed to load content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await contentService.updateContent(content);
      setSuccessMessage('Website content updated successfully! Public website updated.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update website content.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'var(--color-primary-light)' }}>
        <Loader2 size={28} className="animate-spin-slow" />
        <div style={{ marginTop: '10px' }}>Loading Website Content Architecture...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Website Content</h1>
          <p className="page-subtitle">
            Configure headlines, company information, about story, and global marketing text
          </p>
        </div>

        <button 
          onClick={handleSave} 
          disabled={saving} 
          className="btn btn-primary"
          id="save-website-content-btn"
        >
          {saving ? <Loader2 size={18} className="animate-spin-slow" /> : <Save size={18} />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div 
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid var(--color-success)',
            color: '#A7F3D0',
            marginBottom: 'var(--space-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <CheckCircle2 size={18} color="var(--color-success)" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="admin-card" style={{ marginBottom: 'var(--space-xl)', padding: '6px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'hero', name: 'Homepage Hero', icon: Sparkles },
            { id: 'about', name: 'About & Mission', icon: Target },
            { id: 'company', name: 'Company & Contact Info', icon: Building },
            { id: 'stats', name: 'Live Statistics', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: 'none',
                  background: activeTab === tab.id ? 'var(--color-surface-hover)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={16} />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* ==========================================================
            TAB 1: HOMEPAGE HERO
            ========================================================== */}
        {activeTab === 'hero' && (
          <div className="admin-card" style={{ padding: 'var(--space-xl)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: 'var(--space-lg)' }}>
              Homepage Hero Section Configuration
            </h3>

            <div className="form-group">
              <label className="form-label">Top Highlight Badge</label>
              <input 
                type="text"
                value={content?.hero?.badge || ''}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, badge: e.target.value } })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Main Headline</label>
              <input 
                type="text"
                value={content?.hero?.title || ''}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, title: e.target.value } })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hero Subtitle Description</label>
              <textarea 
                value={content?.hero?.subtitle || ''}
                onChange={(e) => setContent({ ...content, hero: { ...content.hero, subtitle: e.target.value } })}
                className="form-textarea"
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Primary CTA Button Text</label>
                <input 
                  type="text"
                  value={content?.hero?.primaryCtaText || ''}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, primaryCtaText: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Primary CTA Link</label>
                <input 
                  type="text"
                  value={content?.hero?.primaryCtaLink || ''}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, primaryCtaLink: e.target.value } })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Secondary CTA Button Text</label>
                <input 
                  type="text"
                  value={content?.hero?.secondaryCtaText || ''}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, secondaryCtaText: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Secondary CTA Link</label>
                <input 
                  type="text"
                  value={content?.hero?.secondaryCtaLink || ''}
                  onChange={(e) => setContent({ ...content, hero: { ...content.hero, secondaryCtaLink: e.target.value } })}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 2: ABOUT & MISSION
            ========================================================== */}
        {activeTab === 'about' && (
          <div className="admin-card" style={{ padding: 'var(--space-xl)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: 'var(--space-lg)' }}>
              About Us & Mission Statements
            </h3>

            <div className="form-group">
              <label className="form-label">About Page Headline</label>
              <input 
                type="text"
                value={content?.about?.title || ''}
                onChange={(e) => setContent({ ...content, about: { ...content.about, title: e.target.value } })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Overview / Introduction</label>
              <textarea 
                value={content?.about?.description || ''}
                onChange={(e) => setContent({ ...content, about: { ...content.about, description: e.target.value } })}
                className="form-textarea"
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Mission Statement</label>
                <textarea 
                  value={content?.about?.mission || ''}
                  onChange={(e) => setContent({ ...content, about: { ...content.about, mission: e.target.value } })}
                  className="form-textarea"
                  style={{ minHeight: '90px' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vision Statement</label>
                <textarea 
                  value={content?.about?.vision || ''}
                  onChange={(e) => setContent({ ...content, about: { ...content.about, vision: e.target.value } })}
                  className="form-textarea"
                  style={{ minHeight: '90px' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 3: COMPANY & CONTACT INFO
            ========================================================== */}
        {activeTab === 'company' && (
          <div className="admin-card" style={{ padding: 'var(--space-xl)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: 'var(--space-lg)' }}>
              Company Information & Social Handles
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input 
                  type="text"
                  value={content?.company?.name || ''}
                  onChange={(e) => setContent({ ...content, company: { ...content.company, name: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tagline</label>
                <input 
                  type="text"
                  value={content?.company?.tagline || ''}
                  onChange={(e) => setContent({ ...content, company: { ...content.company, tagline: e.target.value } })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Official Contact Email</label>
                <input 
                  type="email"
                  value={content?.company?.email || ''}
                  onChange={(e) => setContent({ ...content, company: { ...content.company, email: e.target.value } })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Direct Phone</label>
                <input 
                  type="text"
                  value={content?.company?.phone || ''}
                  onChange={(e) => setContent({ ...content, company: { ...content.company, phone: e.target.value } })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Headquarters Physical Address</label>
              <input 
                type="text"
                value={content?.company?.address || ''}
                onChange={(e) => setContent({ ...content, company: { ...content.company, address: e.target.value } })}
                className="form-input"
              />
            </div>

            <h4 style={{ color: 'var(--color-white)', fontSize: '1rem', marginTop: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
              Social Profiles
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">GitHub URL</label>
                <input 
                  type="url"
                  value={content?.company?.socials?.github || ''}
                  onChange={(e) => setContent({ ...content, company: { ...content.company, socials: { ...content.company.socials, github: e.target.value } } })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn URL</label>
                <input 
                  type="url"
                  value={content?.company?.socials?.linkedin || ''}
                  onChange={(e) => setContent({ ...content, company: { ...content.company, socials: { ...content.company.socials, linkedin: e.target.value } } })}
                  className="form-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 4: LIVE STATISTICS
            ========================================================== */}
        {activeTab === 'stats' && (
          <div className="admin-card" style={{ padding: 'var(--space-xl)' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: 'var(--space-lg)' }}>
              Enterprise Performance Counters
            </h3>

            {(content?.stats || []).map((stat, idx) => (
              <div key={idx} className="card" style={{ padding: 'var(--space-md)', background: 'var(--color-surface)', marginBottom: 'var(--space-md)' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Metric Label</label>
                    <input 
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const newStats = [...content.stats];
                        newStats[idx].label = e.target.value;
                        setContent({ ...content, stats: newStats });
                      }}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Display Number / Value (e.g. 150+, 99.99%)</label>
                    <input 
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const newStats = [...content.stats];
                        newStats[idx].value = e.target.value;
                        setContent({ ...content, stats: newStats });
                      }}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Subtext Description</label>
                  <input 
                    type="text"
                    value={stat.description || ''}
                    onChange={(e) => {
                      const newStats = [...content.stats];
                      newStats[idx].description = e.target.value;
                      setContent({ ...content, stats: newStats });
                    }}
                    className="form-input"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'var(--space-xl)', textAlign: 'right' }}>
          <button 
            type="submit" 
            disabled={saving}
            className="btn btn-primary"
            style={{ padding: '12px 28px' }}
          >
            {saving ? <Loader2 size={18} className="animate-spin-slow" /> : <Save size={18} />}
            <span>Save All Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManageContent;
