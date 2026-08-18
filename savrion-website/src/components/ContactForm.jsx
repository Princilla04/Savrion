import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { contactService } from '../services/contactService';
import { trackEvent } from '../services/analytics';

const ContactForm = ({ settings = {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message content is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus(null);
    setFeedbackMessage('');

    try {
      const response = await contactService.sendMessage(formData);
      trackEvent('contact_form_submission', { form_name: 'contact_form' });
      trackEvent('generate_lead', { lead_type: 'contact_enquiry' });
      setSubmitStatus('success');
      setFeedbackMessage(response.message || 'Thank you! Your message has been sent successfully. Our team will reach out within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setSubmitStatus('error');
      setFeedbackMessage(err.message || 'Failed to send message. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="card card-glass" 
      style={{
        padding: 'var(--space-2xl)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
      }}
    >
      <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--color-white)' }}>
        {settings.formTitle || 'Initiate a Technical Consultation'}
      </h3>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.925rem', marginBottom: 'var(--space-xl)' }}>
        {settings.formSubtitle || 'Tell us about your technical roadmap, upcoming milestones, or software requirements.'}
      </p>

      {submitStatus === 'success' && (
        <div 
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid var(--color-success)',
            color: '#A7F3D0',
            marginBottom: 'var(--space-xl)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            fontSize: '0.9rem'
          }}
        >
          <CheckCircle2 size={20} color="var(--color-success)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div 
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid var(--color-danger)',
            color: '#FECACA',
            marginBottom: 'var(--space-xl)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            fontSize: '0.9rem'
          }}
        >
          <AlertCircle size={20} color="var(--color-danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{feedbackMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Name and Email */}
        <div className="grid-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="contact-name">Full Name *</label>
            <input 
              id="contact-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Morgan"
              className="form-input"
              style={{ borderColor: errors.name ? 'var(--color-danger)' : undefined }}
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="contact-email">Corporate Email *</label>
            <input 
              id="contact-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@company.com"
              className="form-input"
              style={{ borderColor: errors.email ? 'var(--color-danger)' : undefined }}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
        </div>

        {/* Phone and Company */}
        <div className="grid-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="contact-phone">Phone Number (Optional)</label>
            <input 
              id="contact-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="contact-company">Organization / Company</label>
            <input 
              id="contact-company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Acme Enterprise Inc."
              className="form-input"
            />
          </div>
        </div>

        {/* Subject */}
        <div className="form-group">
          <label className="form-label" htmlFor="contact-subject">Project Scope / Subject *</label>
          <input 
            id="contact-subject"
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="e.g. Enterprise Cloud Architecture Migration & React Frontend"
            className="form-input"
            style={{ borderColor: errors.subject ? 'var(--color-danger)' : undefined }}
          />
          {errors.subject && <span className="form-error">{errors.subject}</span>}
        </div>

        {/* Message */}
        <div className="form-group">
          <label className="form-label" htmlFor="contact-message">Project Details & Requirements *</label>
          <textarea 
            id="contact-message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about the project goals, tech stack preferences, target timeline, or specific engineering challenges..."
            className="form-textarea"
            style={{ borderColor: errors.message ? 'var(--color-danger)' : undefined, minHeight: '130px' }}
          />
          {errors.message && <span className="form-error">{errors.message}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', marginTop: 'var(--space-sm)' }}
          id="submit-contact-form-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin-slow" />
              <span>Transmitting Inquiry...</span>
            </>
          ) : (
            <>
              <span>Send Message</span>
              <Send size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
