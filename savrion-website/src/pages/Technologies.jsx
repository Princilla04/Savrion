import React, { useEffect, useState } from 'react';
import { Sparkles, Layers, Cpu, Server, ShieldCheck, Database, Cloud } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import TechBadge from '../components/TechBadge';
import CTASection from '../components/CTASection';
import { contentService } from '../services/contentService';

const categories = ['All', 'Frontend', 'Backend', 'Mobile', 'Database', 'Cloud', 'DevOps', 'AI/ML'];

const Technologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTech = async () => {
      try {
        const data = await contentService.getTechnologies({ status: 'active' });
        if (data && data.length > 0) {
          setTechnologies(data);
        }
      } catch (err) {
        console.warn('Error fetching technologies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTech();
  }, []);

  const filteredTech = selectedCategory === 'All' 
    ? technologies 
    : technologies.filter(t => t.category === selectedCategory);

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
              <span>Technology Ecosystem</span>
            </span>
          </div>
          <h1 style={{ marginBottom: '16px' }}>
            Modern Tech Stack & <span className="gradient-text">Platforms</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-2xl)' }}>
            We leverage industry-standard open source frameworks, battle-tested databases, and resilient cloud platforms to build enterprise software solutions.
          </p>

          {/* Category Tabs Filter */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap'
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: selectedCategory === cat ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: selectedCategory === cat ? 'rgba(var(--color-primary-rgb), 0.15)' : 'var(--color-surface)',
                  color: selectedCategory === cat ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
                  boxShadow: selectedCategory === cat ? '0 0 14px rgba(var(--color-primary-rgb), 0.2)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          TECHNOLOGY GRID
          ========================================================== */}
      <section className="section-py">
        <div className="container">
          <div className="grid-4">
            {filteredTech.map((tech) => (
              <TechBadge key={tech._id || tech.name} tech={tech} />
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          STANDARDS & PRINCIPLES
          ========================================================== */}
      <section className="section-py" style={{ background: 'var(--color-background-secondary)' }}>
        <div className="container">
          <SectionHeader 
            badge="Engineering Criteria"
            title="How We Select Our"
            highlightText="Technology Stack"
            subtitle="We maintain strict architectural standards to guarantee long-term maintainability, security, and developer ergonomics."
          />

          <div className="grid-3">
            <div className="card">
              <Cpu size={32} color="var(--color-primary)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-white)', marginBottom: '8px' }}>
                Long-Term Community Support
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                We avoid short-lived hype cycles. Our foundation relies on mature, widely supported languages and ecosystems backed by global communities.
              </p>
            </div>

            <div className="card">
              <ShieldCheck size={32} color="var(--color-primary)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-white)', marginBottom: '8px' }}>
                Zero Vendor Lock-in
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Standard containerized architectures (Docker/Kubernetes) and open REST/GraphQL standards let you host and deploy wherever your business needs.
              </p>
            </div>

            <div className="card">
              <Layers size={32} color="var(--color-primary)" style={{ marginBottom: '12px' }} />
              <h4 style={{ fontSize: '1.15rem', color: 'var(--color-white)', marginBottom: '8px' }}>
                High Concurrency & Throughput
              </h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Asynchronous event-driven pipelines, Redis caching layers, and non-blocking I/O architectures ensure effortless scaling under surge loads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <CTASection 
        title="Looking for a Specific Tech Stack?"
        subtitle="Our engineering leads can assess your existing technical codebase and recommend optimized frameworks."
      />
    </div>
  );
};

export default Technologies;
