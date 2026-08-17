import React, { useEffect, useState } from 'react';
import { Sparkles, Layers, ArrowRight, Search } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ProjectCard from '../components/ProjectCard';
import CTASection from '../components/CTASection';
import { contentService } from '../services/contentService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await contentService.getProjects({ status: 'active' });
        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        console.warn('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Extract unique categories
  const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];

  const filteredProjects = projects.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.technologies && p.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCat && matchesSearch;
  });

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
              <span>Proven Track Record</span>
            </span>
          </div>
          <h1 style={{ marginBottom: '16px' }}>
            Featured Case Studies & <span className="gradient-text">Projects</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-2xl)' }}>
            Discover how Savrion architects high-concurrency systems, cloud platforms, and modern enterprise software across diverse industries.
          </p>

          {/* Search & Category Filter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '440px', position: 'relative' }}>
              <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects by name, client, or tech..."
                className="form-input"
                style={{ paddingLeft: '44px', background: 'var(--color-card)', borderRadius: 'var(--radius-full)' }}
              />
            </div>

            {categories.length > 1 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '6px 16px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.825rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: selectedCategory === cat ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: selectedCategory === cat ? 'rgba(var(--color-primary-rgb), 0.15)' : 'var(--color-surface)',
                      color: selectedCategory === cat ? 'var(--color-primary-light)' : 'var(--color-text-secondary)'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==========================================================
          PROJECTS GRID
          ========================================================== */}
      <section className="section-py">
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div className="card text-center" style={{ padding: 'var(--space-3xl)', textAlign: 'center' }}>
              <h3 style={{ color: 'var(--color-white)', marginBottom: '8px' }}>No case studies found</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Try selecting a different category or search term.</p>
            </div>
          ) : (
            <div className="grid-2" style={{ gap: 'var(--space-2xl)' }}>
              {filteredProjects.map((project) => (
                <ProjectCard key={project._id || project.slug} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <CTASection 
        title="Have a Vision for Your Next Software Product?"
        subtitle="Schedule a technical exploration session with Savrion's lead software engineers."
      />
    </div>
  );
};

export default Projects;
