import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Target, 
  Eye, 
  ShieldCheck, 
  Award, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  GitPullRequest,
  Lock,
  Layers,
  Zap
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import StatsBar from '../components/StatsBar';
import CTASection from '../components/CTASection';

const About = () => {
  const { content } = useOutletContext() || {};

  const about = content?.about || {
    title: 'Engineering the Future of Digital Innovation',
    description: 'Savrion is a premier software solutions and technology services firm dedicated to transforming ambitious ideas into secure, scalable, and high-impact digital products.',
    mission: 'To empower organizations worldwide with state-of-the-art software systems, cloud technologies, and exceptional engineering expertise.',
    vision: 'To be the most trusted technology innovation partner for businesses navigating the digital era.',
    coreValues: [
      { title: 'Engineering Excellence', description: 'Upholding uncompromising standards of code quality, scalability, and security in every project.' },
      { title: 'Client-Centric Agility', description: 'Delivering tailored software solutions aligned strictly with enterprise ROI and operational goals.' },
      { title: 'Continuous Innovation', description: 'Adopting bleeding-edge frameworks, AI integrations, and cloud architectures to keep clients ahead.' },
      { title: 'Radical Transparency', description: 'Maintaining open code repos, direct engineer communication, and predictable delivery timelines.' }
    ]
  };

  const processSteps = [
    {
      step: '01',
      title: 'Architectural Discovery',
      desc: 'We analyze your business requirements, existing system dependencies, scale targets, and security posture.'
    },
    {
      step: '02',
      title: 'Modular System Design',
      desc: 'Our architects draft the decoupled system blueprints, API specifications, and interactive Figma UI prototypes.'
    },
    {
      step: '03',
      title: 'Agile Engineering Sprints',
      desc: 'We develop clean, tested code in two-week iterative sprints with continuous stakeholder demos and CI/CD releases.'
    },
    {
      step: '04',
      title: 'Quality & Security Audits',
      desc: 'Comprehensive automated unit/integration testing, penetration scans, and performance benchmarking before deployment.'
    },
    {
      step: '05',
      title: 'Deployment & SLA Support',
      desc: 'Zero-downtime production deployment with automated cloud monitoring, APM logging, and dedicated SLA maintenance.'
    }
  ];

  return (
    <div>
      {/* ==========================================================
          PAGE HEADER
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
              <span>About Savrion</span>
            </span>
          </div>
          <h1 style={{ marginBottom: '16px' }}>
            {about.title || 'Engineering the Future of Digital Innovation'}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            {about.description}
          </p>
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
          MISSION & VISION
          ========================================================== */}
      <section className="section-py">
        <div className="container">
          <div className="grid-2" style={{ gap: 'var(--space-2xl)' }}>
            {/* Mission */}
            <div 
              className="card card-accent"
              style={{
                padding: 'var(--space-2xl)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div 
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(var(--color-primary-rgb), 0.12)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary-light)'
                }}
              >
                <Target size={26} />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-white)' }}>Our Mission</h3>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                {about.mission}
              </p>
            </div>

            {/* Vision */}
            <div 
              className="card card-accent"
              style={{
                padding: 'var(--space-2xl)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div 
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(var(--color-primary-rgb), 0.12)',
                  border: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-primary-light)'
                }}
              >
                <Eye size={26} />
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--color-white)' }}>Our Vision</h3>
              <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
                {about.vision}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================
          CORE VALUES
          ========================================================== */}
      <section className="section-py" style={{ background: 'var(--color-background-secondary)' }}>
        <div className="container">
          <SectionHeader 
            badge="Guiding Principles"
            title="Our Core"
            highlightText="Values"
            subtitle="The foundational philosophies that drive how we engineer software, respect client partnerships, and deliver enterprise value."
          />

          <div className="grid-2" style={{ gap: 'var(--space-xl)' }}>
            {(about.coreValues || []).map((val, idx) => (
              <div 
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  background: 'var(--color-card)'
                }}
              >
                <div 
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(var(--color-primary-rgb), 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary)',
                    flexShrink: 0
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--color-white)', marginBottom: '6px' }}>
                    {val.title}
                  </h4>
                  <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    {val.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          DEVELOPMENT LIFECYCLE & PROCESS
          ========================================================== */}
      <section className="section-py">
        <div className="container">
          <SectionHeader 
            badge="Proven Methodology"
            title="How We Deliver"
            highlightText="Software Excellence"
            subtitle="Our disciplined 5-stage software delivery lifecycle ensures high velocity, predictable schedules, and zero production surprises."
          />

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 'var(--space-lg)'
            }}
          >
            {processSteps.map((step, idx) => (
              <div 
                key={idx}
                className="card card-accent"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative'
                }}
              >
                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: 'var(--color-primary)',
                    opacity: 0.8
                  }}
                >
                  {step.step}
                </span>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--color-white)' }}>
                  {step.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          BOTTOM CTA
          ========================================================== */}
      <CTASection 
        title="Ready to Build Scalable Software with Savrion?"
        subtitle="Let our senior architects review your architecture and provide a strategic roadmap."
      />
    </div>
  );
};

export default About;
