import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = ({
  title = 'Ready to Engineer Your Next Digital Breakthrough?',
  subtitle = "Partner with Savrion's elite software architects to build resilient, scalable, and high-performance digital systems.",
  primaryText = 'Schedule a Strategy Call',
  primaryLink = '/contact',
  secondaryText = 'Explore Our Services',
  secondaryLink = '/services'
}) => (
  <section className="section-py cta-section">
    <div className="container">
      <div className="cta-shell">
        <div className="cta-copy">
          <span className="cta-eyebrow"><Sparkles size={15} /> Accelerate transformation</span>
          <h2>{title}</h2>
          <p>{subtitle}</p>
          <div className="cta-assurances">
            <span><ShieldCheck size={18} /> Strict NDA &amp; IP protection</span>
            <span><CheckCircle2 size={18} /> Senior engineering teams</span>
            <span><CheckCircle2 size={18} /> Flexible engagement models</span>
          </div>
        </div>

        <aside className="cta-action-card" aria-label="Start a conversation with Savrion">
          <span className="cta-action-label">Build with confidence</span>
          <h3>Tell us what you want to create.</h3>
          <p>Start with a focused conversation about your goals, timeline, and technology needs.</p>
          <Link to={primaryLink} className="btn btn-primary btn-lg cta-primary-action" id="cta-primary-btn">
            <span>{primaryText}</span>
            <ArrowRight size={18} />
          </Link>
          <Link to={secondaryLink} className="cta-secondary-action" id="cta-secondary-btn">
            <span>{secondaryText}</span>
            <ArrowRight size={16} />
          </Link>
          <span className="cta-response-note">Typically responds within one business day</span>
        </aside>
      </div>
    </div>
  </section>
);

export default CTASection;
