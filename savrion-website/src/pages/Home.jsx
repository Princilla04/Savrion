import React, { useEffect, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Cpu, 
  Layers, 
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ServiceCard from '../components/ServiceCard';
import ProjectCard from '../components/ProjectCard';
import StatsBar from '../components/StatsBar';
import TestimonialCard from '../components/TestimonialCard';
import CTASection from '../components/CTASection';
import { contentService } from '../services/contentService';
import heroEngineer from '../assets/hero-engineer.png';

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
      <section className="home-hero">
        <div className="container">
          <div className="home-hero-grid home-hero-with-person">
            <div className="home-hero-copy animate-fade-in">
              <span className="home-hero-eyebrow"><Sparkles size={15} /> {hero.badge || 'Next-Generation Software Engineering'}</span>
              <h1>{hero.title || 'Architecting Intelligent Software Solutions for Global Enterprises'}</h1>
              <p>{hero.subtitle || 'Savrion empowers market leaders with high-performance web applications, scalable cloud infrastructure, custom software engineering, and intelligent digital systems.'}</p>
              <div className="home-hero-actions">
                <Link to={hero.primaryCtaLink || '/contact'} className="btn btn-primary btn-lg" id="hero-primary-cta"><span>{hero.primaryCtaText || 'Get Started'}</span><ArrowRight size={18} /></Link>
                <Link to={hero.secondaryCtaLink || '/services'} className="btn btn-secondary btn-lg" id="hero-secondary-cta"><span>{hero.secondaryCtaText || 'Explore Services'}</span></Link>
              </div>
              <div className="home-hero-proof"><span><CheckCircle2 size={16} /> Production-ready delivery</span><span><CheckCircle2 size={16} /> Full-stack web &amp; cloud</span></div>
            </div>
            <div className="home-hero-person" aria-label="Savrion engineer working at a computer">
              <img src={heroEngineer} alt="Software engineer working at a laptop" />
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
            title="Featured"
            highlightText="Products"
            subtitle="Explore how Savrion engineered mission-critical platforms that delivered measurable revenue and operational milestones."
          />

          <div className="grid-2" style={{ gap: 'var(--space-2xl)' }}>
            {projects.slice(0, 2).map((project) => (
              <ProjectCard key={project._id || project.slug} project={project} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
            <Link to="/products" className="btn btn-secondary btn-lg" id="view-all-projects-btn">
              <span>Explore All Products</span>
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

    </div>
  );
};

export default Home;
