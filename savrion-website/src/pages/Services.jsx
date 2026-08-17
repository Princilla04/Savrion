import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Shield, Zap, Search } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ServiceCard from '../components/ServiceCard';
import CTASection from '../components/CTASection';
import { contentService } from '../services/contentService';

const Services = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await contentService.getServices({ status: 'active' });
        if (data && data.length > 0) {
          setServices(data);
        }
      } catch (err) {
        console.warn('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((s) => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.capabilities && s.capabilities.some(c => c.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div>
      {/* ==========================================================
          HEADER SECTION
          ========================================================== */}
      <section 
        style={{
          paddingTop: 'var(--space-3xl)',
          paddingBottom: 'var(--space-2xl)',
          background: 'linear-gradient(180deg, rgba(0, 174, 169, 0.08) 0%, transparent 100%)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span className="badge badge-cyan">
              <Sparkles size={13} color="var(--color-primary)" />
              <span>Full-Spectrum Solutions</span>
            </span>
          </div>
          <h1 style={{ marginBottom: '16px' }}>
            Enterprise <span className="gradient-text">Software & Cloud</span> Services
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-2xl)' }}>
            Savrion provides high-performance custom software engineering, scalable cloud infrastructure, mobile architectures, and digital transformation solutions.
          </p>

          {/* Quick Search Input */}
          <div 
            style={{
              maxWidth: '480px',
              margin: '0 auto',
              position: 'relative'
            }}
          >
            <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by capability, tech, or service..."
              className="form-input"
              style={{ paddingLeft: '44px', background: 'var(--color-card)', borderRadius: 'var(--radius-full)' }}
            />
          </div>
        </div>
      </section>

      {/* ==========================================================
          SERVICES GRID
          ========================================================== */}
      <section className="section-py">
        <div className="container">
          {filteredServices.length === 0 ? (
            <div className="card text-center" style={{ padding: 'var(--space-3xl)', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '8px' }}>No services found</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid-3">
              {filteredServices.map((service) => (
                <ServiceCard key={service._id || service.slug} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ==========================================================
          ENGAGEMENT GUARANTEES
          ========================================================== */}
      <section className="section-py" style={{ background: 'var(--color-background-secondary)' }}>
        <div className="container">
          <SectionHeader 
            badge="Client Assurance"
            title="Our Commitment to"
            highlightText="Engineering Quality"
            subtitle="Every engagement includes strict architectural safeguards and enterprise-grade SLAs."
          />

          <div className="grid-3">
            <div className="card">
              <Shield size={32} color="var(--color-primary)" style={{ marginBottom: '14px' }} />
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-white)', marginBottom: '8px' }}>
                Full Intellectual Property Transfer
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                You retain 100% ownership of all source code, documentation, infrastructure scripts, and design artifacts.
              </p>
            </div>

            <div className="card">
              <Zap size={32} color="var(--color-primary)" style={{ marginBottom: '14px' }} />
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-white)', marginBottom: '8px' }}>
                Automated CI/CD Deployment
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Continuous integration pipelines with automated linting, unit testing, and container deployment from day one.
              </p>
            </div>

            <div className="card">
              <CheckCircle2 size={32} color="var(--color-primary)" style={{ marginBottom: '14px' }} />
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-white)', marginBottom: '8px' }}>
                Post-Launch SLA Support
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Dedicated Tier-1 technical maintenance, security vulnerability patching, and uptime monitoring guarantees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          BOTTOM CTA
          ========================================================== */}
      <CTASection 
        title="Need a Custom Engineering Solution?"
        subtitle="Let's tailor an agile team to your specific tech stack and project milestones."
      />
    </div>
  );
};

export default Services;
