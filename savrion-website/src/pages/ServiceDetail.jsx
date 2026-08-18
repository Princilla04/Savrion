import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  HelpCircle,
  Clock,
  Code
} from 'lucide-react';
import { contentService } from '../services/contentService';
import CTASection from '../components/CTASection';
import { trackEvent } from '../services/analytics';

const ServiceDetail = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    const fetchServiceData = async () => {
      setLoading(true);
      try {
        const [singleService, all] = await Promise.all([
          contentService.getServiceBySlug(slug),
          contentService.getServices({ status: 'active' })
        ]);
        if (singleService) setService(singleService);
        if (singleService) trackEvent('view_service', { service_slug: slug });
        if (all) setAllServices(all);
      } catch (err) {
        console.warn('Error loading service:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServiceData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container section-py" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-primary-light)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={24} className="animate-spin-slow" />
          <span>Loading Service Architecture...</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container section-py" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '16px', color: 'var(--color-white)' }}>Service Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
          The requested service page does not exist or may have been updated.
        </p>
        <Link to="/services" className="btn btn-primary">
          <ArrowLeft size={18} />
          <span>Back to Services Catalog</span>
        </Link>
      </div>
    );
  }

  const otherServices = allServices.filter(s => s.slug !== slug).slice(0, 3);

  return (
    <div>
      {/* ==========================================================
          HERO & BREADCRUMBS
          ========================================================== */}
      <section 
        style={{
          paddingTop: 'var(--space-3xl)',
          paddingBottom: 'var(--space-3xl)',
          background: 'linear-gradient(180deg, rgba(0, 174, 169, 0.08) 0%, transparent 100%)',
          position: 'relative'
        }}
      >
        <div className="container">
          {/* Breadcrumbs */}
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/services">Services</Link>
            <span>/</span>
            <span className="active">{service.title}</span>
          </div>

          <div style={{ maxWidth: '850px', marginTop: 'var(--space-md)' }}>
            <div style={{ marginBottom: '16px' }}>
              <span className="badge badge-cyan">
                <Sparkles size={13} color="var(--color-primary)" />
                <span>Specialized Domain Service</span>
              </span>
            </div>

            <h1 style={{ marginBottom: '20px' }}>
              {service.title}
            </h1>

            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-2xl)' }}>
              {service.shortDescription}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary btn-lg" id="service-quote-btn">
                <span>Request a Proposal for this Service</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/products" className="btn btn-secondary btn-lg">
                <span>View Our Products</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          DETAILED OVERVIEW & CAPABILITIES
          ========================================================== */}
      <section className="section-py">
        <div className="container">
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: 'var(--space-3xl)'
            }}
            className="grid-detail"
          >
            {/* Left Detailed Description */}
            <div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--color-white)', marginBottom: 'var(--space-md)' }}>
                Comprehensive Engineering Scope
              </h2>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 'var(--space-2xl)' }}>
                <p style={{ marginBottom: '16px' }}>{service.detailedDescription}</p>
                <p>
                  At Savrion, our engineers apply modern modular design patterns, strict static typing, and automated testing to ensure your software is reliable, scalable, and easy to maintain. We build systems ready for millions of concurrent interactions and high data throughput.
                </p>
              </div>

              {/* Technologies Included */}
              {service.technologies && service.technologies.length > 0 && (
                <div style={{ marginBottom: 'var(--space-2xl)' }}>
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--color-white)', marginBottom: '14px' }}>
                    Technology Stack & Tooling
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {service.technologies.map((t, idx) => (
                      <span 
                        key={idx}
                        className="badge"
                        style={{
                          background: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-white)',
                          padding: '8px 14px',
                          fontSize: '0.85rem'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Capabilities Card */}
            <div>
              <div 
                className="card card-glass"
                style={{
                  padding: 'var(--space-2xl)',
                  borderRadius: 'var(--radius-xl)',
                  position: 'sticky',
                  top: '100px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-lg)' }}>
                  <Layers size={22} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '1.3rem', color: 'var(--color-white)' }}>Key Capabilities</h3>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: 'var(--space-xl)' }}>
                  {(service.capabilities || []).map((cap, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                      <CheckCircle2 size={18} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ paddingTop: 'var(--space-md)', borderTop: '1px solid var(--color-border-light)' }}>
                  <Link to="/contact" className="btn btn-primary" style={{ width: '100%' }}>
                    <span>Discuss This Solution</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          OTHER SERVICES CAROUSEL / GRID
          ========================================================== */}
      {otherServices.length > 0 && (
        <section className="section-py" style={{ background: 'var(--color-background-secondary)' }}>
          <div className="container">
            <h3 style={{ fontSize: '1.6rem', color: 'var(--color-white)', marginBottom: 'var(--space-xl)', textAlign: 'center' }}>
              Explore Complementary Services
            </h3>
            <div className="grid-3">
              {otherServices.map((item) => (
                <div key={item.slug} className="card card-accent" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', color: 'var(--color-white)', marginBottom: '8px' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                      {item.shortDescription}
                    </p>
                  </div>
                  <Link to={`/services/${item.slug}`} style={{ color: 'var(--color-primary-light)', fontSize: '0.875rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>Learn More</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <CTASection 
        title={`Accelerate Your Project with ${service.title}`}
        subtitle="Speak directly with our technical lead to discuss architecture, timeline, and deliverables."
      />

      <style>{`
        @media (max-width: 900px) {
          .grid-detail {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceDetail;
