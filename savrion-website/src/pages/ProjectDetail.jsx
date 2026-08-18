import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  ShieldAlert, 
  Zap, 
  TrendingUp,
  Building,
  Tag
} from 'lucide-react';
import { contentService } from '../services/contentService';
import CTASection from '../components/CTASection';
import { trackEvent } from '../services/analytics';

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allProjects, setAllProjects] = useState([]);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const [singleProject, all] = await Promise.all([
          contentService.getProjectBySlug(slug),
          contentService.getProjects({ status: 'active' })
        ]);
        if (singleProject) setProject(singleProject);
        if (singleProject) trackEvent('view_product', { product_slug: slug });
        if (all) setAllProjects(all);
      } catch (err) {
        console.warn('Error loading project:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container section-py" style={{ textAlign: 'center', minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--color-primary-light)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={24} className="animate-spin-slow" />
          <span>Loading product...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container section-py" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ marginBottom: '16px', color: 'var(--color-white)' }}>Product Not Found</h2>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
          The requested product does not exist or may have been updated.
        </p>
        <Link to="/products" className="btn btn-primary">
          <ArrowLeft size={18} />
          <span>Back to Products</span>
        </Link>
      </div>
    );
  }

  const defaultBanner = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80";
  const otherProjects = allProjects.filter(p => p.slug !== slug).slice(0, 2);

  return (
    <div>
      {/* ==========================================================
          HERO & BREADCRUMBS
          ========================================================== */}
      <section 
        style={{
          paddingTop: 'var(--space-3xl)',
          paddingBottom: 'var(--space-2xl)',
          background: 'linear-gradient(180deg, rgba(0, 174, 169, 0.08) 0%, transparent 100%)',
          position: 'relative'
        }}
      >
        <div className="container">
          {/* Breadcrumbs */}
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/products">Products</Link>
            <span>/</span>
            <span className="active">{project.title}</span>
          </div>

          <div style={{ maxWidth: '900px', marginTop: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span className="badge badge-cyan">
                {project.category}
              </span>
              <span 
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Building size={14} color="var(--color-primary)" />
                Client: {project.client}
              </span>
            </div>

            {project.logo && (
              <img src={project.logo} alt={`${project.title} logo`} style={{ width: '72px', height: '72px', objectFit: 'contain', background: '#fff', borderRadius: '14px', padding: '8px', marginBottom: '16px' }} />
            )}
            <h1 style={{ marginBottom: '20px' }}>
              {project.title}
            </h1>

            <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-2xl)' }}>
              {project.shortDescription}
            </p>

            {(project.websiteUrl || project.liveUrl || project.playStoreUrl) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {(project.websiteUrl || project.liveUrl) && (
                  <a href={project.websiteUrl || project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-primary" id="visit-product-website-btn">
                    <span>Visit Website</span>
                    <ExternalLink size={16} />
                  </a>
                )}
                {project.playStoreUrl && (
                  <a href={project.playStoreUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                    <span>Get it on Google Play</span>
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {project.sampleVideo && (
        <section style={{ paddingBottom: 'var(--space-3xl)' }}>
          <div className="container">
            <h2 style={{ fontSize: '1.6rem', marginBottom: 'var(--space-lg)' }}>Product Walkthrough</h2>
            <video controls preload="metadata" style={{ width: '100%', maxHeight: '620px', borderRadius: 'var(--radius-xl)', background: '#000', border: '1px solid var(--color-border)' }}>
              <source src={project.sampleVideo} />
              Your browser does not support video playback.
            </video>
          </div>
        </section>
      )}

      {/* ==========================================================
          BANNER IMAGE SHOWCASE
          ========================================================== */}
      <section style={{ paddingBottom: 'var(--space-3xl)' }}>
        <div className="container">
          <div 
            style={{
              width: '100%',
              maxHeight: '520px',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(var(--color-primary-rgb), 0.15)'
            }}
          >
            <img 
              src={project.bannerImage || defaultBanner} 
              alt={project.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = defaultBanner; }}
            />
          </div>
        </div>
      </section>

      {/* ==========================================================
          CASE STUDY CONTENT: PROBLEM, SOLUTION, RESULTS
          ========================================================== */}
      <section className="section-py">
        <div className="container">
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1.25fr 0.75fr',
              gap: 'var(--space-3xl)'
            }}
            className="grid-project-detail"
          >
            {/* Left Content Blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
              {/* Problem Statement */}
              {project.problem && (
                <div className="card" style={{ padding: 'var(--space-2xl)', background: 'var(--color-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <ShieldAlert size={22} color="#EF4444" />
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--color-white)' }}>The Challenge & Problem</h3>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                    {project.problem}
                  </p>
                </div>
              )}

              {/* Solution Architecture */}
              {project.solution && (
                <div className="card card-accent" style={{ padding: 'var(--space-2xl)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <Zap size={22} color="var(--color-primary)" />
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--color-white)' }}>Savrion's Engineered Solution</h3>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                    {project.solution}
                  </p>
                </div>
              )}

              {/* Results & Business Outcomes */}
              {project.results && (
                <div className="card" style={{ padding: 'var(--space-2xl)', background: 'rgba(0, 174, 169, 0.04)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <TrendingUp size={22} color="var(--color-primary-light)" />
                    <h3 style={{ fontSize: '1.35rem', color: 'var(--color-white)' }}>Measured Business Impact</h3>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                    {project.results}
                  </p>
                </div>
              )}
            </div>

            {/* Right Meta Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
              {/* Features List */}
              {project.features && project.features.length > 0 && (
                <div className="card card-glass" style={{ padding: 'var(--space-xl)' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: 'var(--space-md)' }}>
                    Core Architecture Features
                  </h3>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {project.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                        <CheckCircle2 size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '3px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies Used */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="card" style={{ padding: 'var(--space-xl)', background: 'var(--color-surface)' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-white)', marginBottom: 'var(--space-md)' }}>
                    Technology Stack
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {project.technologies.map((t, idx) => (
                      <span 
                        key={idx}
                        style={{
                          background: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          color: 'var(--color-white)'
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Widget */}
              <div className="card card-accent" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                <h4 style={{ color: 'var(--color-white)', fontSize: '1.1rem', marginBottom: '8px' }}>
                  Ready to build a similar platform?
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
                  Our senior engineering leads can consult on your product architecture.
                </p>
                <Link to="/contact" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  <span>Book a Consultation</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <CTASection 
        title="Ready to Build Scalable Solutions Like This?"
        subtitle="Let's discuss how Savrion can accelerate your product development roadmap."
      />

      <style>{`
        @media (max-width: 900px) {
          .grid-project-detail {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetail;
