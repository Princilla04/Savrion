import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  Zap, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Globe, 
  TrendingUp, 
  Code2, 
  Server,
  Database,
  Smartphone
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ServiceCard from '../components/ServiceCard';
import ProjectCard from '../components/ProjectCard';
import StatsBar from '../components/StatsBar';
import TestimonialCard from '../components/TestimonialCard';
import CTASection from '../components/CTASection';
import { contentService } from '../services/contentService';

const Home = () => {
  const { content } = useOutletContext() || {};
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, projectsData, testimonialsData] = await Promise.all([
          contentService.getServices({ status: 'active' }),
          contentService.getProjects({ status: 'active' }),
          contentService.getTestimonials({ status: 'active' })
        ]);

        if (servicesData && servicesData.length > 0) setServices(servicesData);
        if (projectsData && projectsData.length > 0) setProjects(projectsData);
        if (testimonialsData && testimonialsData.length > 0) setTestimonials(testimonialsData);
      } catch (err) {
        console.warn('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const hero = content?.hero || {
    badge: 'Next-Generation Software Engineering',
    title: 'Architecting Intelligent Software Solutions for Global Enterprises',
    subtitle: 'Savrion empowers market leaders with high-performance web applications, scalable cloud infrastructure, custom software engineering, and intelligent digital systems.',
    primaryCtaText: 'Get Started',
    primaryCtaLink: '/contact',
    secondaryCtaText: 'Explore Services',
    secondaryCtaLink: '/services'
  };

  const pillars = [
    {
      icon: Cpu,
      title: 'Resilient Microservice Architecture',
      description: 'Engineered for high concurrency, fault tolerance, and sub-millisecond response times under peak enterprise traffic.'
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise-Grade Security',
      description: 'Zero-trust architecture, robust encryption at rest and in transit, and continuous compliance with SOC2 and ISO benchmarks.'
    },
    {
      icon: Zap,
      title: 'Accelerated Time-to-Market',
      description: 'Modern DevOps CI/CD pipelines, reusable component systems, and agile sprints to deploy production software rapidly.'
    },
    {
      icon: Layers,
      title: 'Centralized Scalable Design',
      description: 'Unified theme tokens, modular UI libraries, and clean REST/GraphQL APIs that evolve seamlessly as your business expands.'
    }
  ];

  return (
    <div>
      {/* ==========================================================
          HERO SECTION
          ========================================================== */}
      <section 
        style={{
          position: 'relative',
          paddingTop: 'clamp(3rem, 8vw, 6rem)',
          paddingBottom: 'clamp(3rem, 8vw, 6rem)',
          overflow: 'hidden',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 'var(--space-3xl)',
              alignItems: 'center'
            }}
            className="hero-grid"
          >
            {/* Hero Left Content */}
            <div className="animate-fade-in">


              {/* Main Headline */}
              <h1 style={{ marginBottom: '20px', lineHeight: 1.15 }}>
                {hero.title ? (
                  <>
                    Architecting <span className="gradient-text">Intelligent Software</span> Solutions for Global Leaders
                  </>
                ) : (
                  'Architecting Intelligent Software Solutions for Global Enterprises'
                )}
              </h1>

              {/* Subdescription */}
              <p 
                style={{
                  fontSize: '1.15rem',
                  lineHeight: 1.7,
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--space-2xl)',
                  maxWidth: '600px'
                }}
              >
                {hero.subtitle || 'Savrion empowers market leaders with high-performance web applications, scalable cloud infrastructure, custom software engineering, and intelligent digital systems.'}
              </p>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: 'var(--space-2xl)' }}>
                <Link to={hero.primaryCtaLink || '/contact'} className="btn btn-primary btn-lg" id="hero-primary-cta">
                  <span>{hero.primaryCtaText || 'Get Started'}</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to={hero.secondaryCtaLink || '/services'} className="btn btn-secondary btn-lg" id="hero-secondary-cta">
                  <span>{hero.secondaryCtaText || 'Explore Services'}</span>
                </Link>
              </div>

              {/* Credibility Keypoints */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-muted)',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" />
                  <span>100% Production Ready</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" />
                  <span>Full-Stack Web & Cloud</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} color="var(--color-primary)" />
                  <span>99.99% Reliability SLA</span>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* ==========================================================
          STATS SECTION
          ========================================================== */}
      <section style={{ paddingBottom: 'var(--space-3xl)' }}>
        <div className="container">
          <StatsBar stats={content?.stats} />
        </div>
      </section>

      {/* ==========================================================
          SERVICES OVERVIEW
          ========================================================== */}
      <section className="section-py" id="services-overview">
        <div className="container">
          <SectionHeader 
            badge="Tailored Capabilities"
            title="Comprehensive Technology &"
            highlightText="Software Services"
            subtitle="From responsive full-stack web applications to automated multi-cloud infrastructures, Savrion engineers digital products built to scale."
          />

          <div className="grid-3">
            {services.slice(0, 6).map((service) => (
              <ServiceCard key={service._id || service.slug} service={service} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
            <Link to="/services" className="btn btn-secondary btn-lg" id="view-all-services-btn">
              <span>View All Technology Services</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================================
          WHY CHOOSE SAVRION / ENGINEERING PILLARS
          ========================================================== */}
      <section className="section-py" style={{ background: 'var(--color-background-secondary)' }}>
        <div className="container">
          <SectionHeader 
            badge="Engineering Excellence"
            title="Why Modern Enterprises"
            highlightText="Choose Savrion"
            subtitle="We combine deep technical craftsmanship, battle-tested architectural patterns, and transparent agile delivery."
          />

          <div className="grid-2" style={{ gap: 'var(--space-xl)' }}>
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div 
                  key={idx}
                  className="card card-accent"
                  style={{ display: 'flex', gap: 'var(--space-lg)', alignItems: 'flex-start' }}
                >
                  <div 
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(var(--color-primary-rgb), 0.12)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-primary-light)',
                      flexShrink: 0
                    }}
                  >
                    <IconComp size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--color-white)' }}>
                      {pillar.title}
                    </h3>
                    <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================================
          FEATURED PROJECTS / CASE STUDIES
          ========================================================== */}
      <section className="section-py">
        <div className="container">
          <SectionHeader 
            badge="Proven Impact"
            title="Featured Projects &"
            highlightText="Case Studies"
            subtitle="Explore how Savrion engineered mission-critical platforms that delivered measurable revenue and operational milestones."
          />

          <div className="grid-2" style={{ gap: 'var(--space-2xl)' }}>
            {projects.slice(0, 2).map((project) => (
              <ProjectCard key={project._id || project.slug} project={project} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
            <Link to="/projects" className="btn btn-secondary btn-lg" id="view-all-projects-btn">
              <span>Explore All Case Studies</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ==========================================================
          TESTIMONIALS SECTION
          ========================================================== */}
      {testimonials.length > 0 && (
        <section className="section-py" style={{ background: 'var(--color-background-secondary)' }}>
          <div className="container">
            <SectionHeader 
              badge="Client Endorsements"
              title="Trusted by Leaders"
              highlightText="Across Industries"
              subtitle="Read what technology executives and product directors say about partnering with Savrion."
            />

            <div className="grid-2" style={{ gap: 'var(--space-xl)' }}>
              {testimonials.slice(0, 4).map((testimonial) => (
                <TestimonialCard key={testimonial._id || testimonial.clientName} testimonial={testimonial} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==========================================================
          CALL TO ACTION BANNER
          ========================================================== */}
      <CTASection />

      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-visual-card {
            margin-top: var(--space-xl);
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
