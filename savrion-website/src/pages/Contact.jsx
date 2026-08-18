import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ChevronDown, 
  MessageSquare,
  Globe,
  Terminal
} from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  const { content } = useOutletContext() || {};
  const [openFaq, setOpenFaq] = useState(null);

  const company = content?.company || {
    name: 'Savrion',
    email: 'contact@savrion.com',
    phone: '+1 (800) 555-0199',
    address: '100 Cyber Tower, Innovation Boulevard, Suite 500, Tech City'
  };

  const contact = content?.contact || {};

  const defaultFaqs = [
    {
      q: 'How quickly can Savrion assemble and deploy an engineering team?',
      a: 'Depending on project scope and required tech stack, we typically onboard and begin initial architectural sprints within 1 to 2 weeks.'
    },
    {
      q: 'Who owns the intellectual property and codebase?',
      a: 'You retain 100% full legal ownership of all intellectual property, source code, Git repositories, and architecture diagrams.'
    },
    {
      q: 'What engagement and billing models do you offer?',
      a: 'We offer Dedicated Engineering Teams (time & material sprints), Fixed-Scope Deliverables for defined milestones, and ongoing SLA maintenance retainers.'
    },
    {
      q: 'How do you guarantee code quality and security?',
      a: 'All code undergoes mandatory dual peer review, automated static linting, unit/integration testing suites, CI/CD vulnerability scanning, and adheres strictly to OWASP top 10 benchmarks.'
    }
  ];
  const faqs = contact.faqs?.length ? contact.faqs.map((faq) => ({ q: faq.question, a: faq.answer })) : defaultFaqs;

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div>
      {/* ==========================================================
          HEADER SECTION
          ========================================================== */}
      <section 
        style={{
          paddingTop: 'var(--space-3xl)',
          paddingBottom: 'var(--space-2xl)',
          background: contact.heroImage ? `linear-gradient(rgba(4, 13, 15, 0.78), rgba(4, 13, 15, 0.9)), url(${contact.heroImage}) center/cover` : 'linear-gradient(180deg, rgba(0, 174, 169, 0.08) 0%, transparent 100%)',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ marginBottom: '16px' }}>
            <span className="badge badge-cyan">
              <Sparkles size={13} color="var(--color-primary)" />
              <span>{contact.badge || "Let's Build Together"}</span>
            </span>
          </div>
          <h1 style={{ marginBottom: '16px' }}>
            {contact.title || 'Contact Savrion Engineering'}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>
            {contact.subtitle || 'Have a project in mind or want to modernize your software architecture? Connect directly with our solutions architects.'}
          </p>
        </div>
      </section>

      {/* ==========================================================
          MAIN CONTACT FORM & DIRECT INFO
          ========================================================== */}
      <section className="section-py">
        <div className="container">
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '0.85fr 1.15fr',
              gap: 'var(--space-3xl)',
              alignItems: 'flex-start'
            }}
            className="grid-contact"
          >
            {/* Direct Contact Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--color-white)', marginBottom: '8px' }}>
                  {contact.directTitle || 'Direct Channels'}
                </h2>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {contact.directSubtitle || 'Our technical leadership team reviews all incoming inquiries promptly.'}
                </p>
              </div>

              {/* Email Card */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: 'var(--space-lg)' }}>
                <div 
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(var(--color-primary-rgb), 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-light)',
                    flexShrink: 0
                  }}
                >
                  <Mail size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Us</div>
                  <a href={`mailto:${company.email}`} style={{ color: 'var(--color-white)', fontWeight: 600, fontSize: '1rem' }}>
                    {company.email}
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: 'var(--space-lg)' }}>
                <div 
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(var(--color-primary-rgb), 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-light)',
                    flexShrink: 0
                  }}
                >
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Call Our Desk</div>
                  <a href={`tel:${company.phone}`} style={{ color: 'var(--color-white)', fontWeight: 600, fontSize: '1rem' }}>
                    {company.phone}
                  </a>
                </div>
              </div>

              {/* Office Location Card */}
              <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: 'var(--space-lg)' }}>
                <div 
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(var(--color-primary-rgb), 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-light)',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate Headquarters</div>
                  <p style={{ color: 'var(--color-white)', fontWeight: 500, fontSize: '0.95rem', marginTop: '2px', lineHeight: 1.5 }}>
                    {company.address}
                  </p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: 'var(--space-lg)' }}>
                <div 
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(var(--color-primary-rgb), 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-light)',
                    flexShrink: 0
                  }}
                >
                  <Clock size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Operating Hours</div>
                  <p style={{ color: 'var(--color-white)', fontWeight: 500, fontSize: '0.95rem', marginTop: '2px' }}>
                    {contact.businessHours || 'Mon – Fri: 8:00 AM – 7:00 PM EST (24/7 SLA Support)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Form Component */}
            <ContactForm settings={contact} />
          </div>
        </div>
      </section>

      {/* ==========================================================
          FAQ ACCORDION SECTION
          ========================================================== */}
      <section className="section-py" style={{ background: 'var(--color-background-secondary)' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <SectionHeader 
            badge="Common Inquiries"
            title="Frequently Asked"
            highlightText="Questions"
            subtitle="Clear answers about our engineering process, SLAs, contracts, and delivery schedules."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="card"
                  style={{
                    padding: 0,
                    overflow: 'hidden',
                    borderColor: isOpen ? 'var(--color-border-hover)' : 'var(--color-border)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      color: 'var(--color-white)',
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown 
                      size={20} 
                      color="var(--color-primary)" 
                      style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0
                      }}
                    />
                  </button>

                  {isOpen && (
                    <div 
                      style={{
                        padding: '0 24px 20px 24px',
                        color: 'var(--color-text-secondary)',
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                        borderTop: '1px solid var(--color-border-light)',
                        paddingTop: '16px'
                      }}
                      className="animate-fade-in"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .grid-contact {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
