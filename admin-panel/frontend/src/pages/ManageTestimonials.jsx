import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Edit3, Loader2, Plus, RefreshCw, Search, Star, Trash2, X } from 'lucide-react';
import { testimonialService } from '../services/testimonialService';

const emptyForm = { clientName: '', company: '', role: '', content: '', rating: 5, status: 'active', order: 0 };
const getId = (item) => item._id || item.id;

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState(emptyForm);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    window.setTimeout(() => setSuccessMessage(''), 4000);
  };

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await testimonialService.getAll();
      setTestimonials(data);
    } catch (err) {
      setLoadError(err.message || 'Unable to load testimonials. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const visibleTestimonials = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return testimonials.filter((testimonial) => {
      const matchesStatus = statusFilter === 'all' || testimonial.status === statusFilter;
      const searchable = [testimonial.clientName, testimonial.company, testimonial.role, testimonial.content].filter(Boolean).join(' ').toLowerCase();
      return matchesStatus && (!query || searchable.includes(query));
    });
  }, [searchTerm, statusFilter, testimonials]);

  const closeModal = () => {
    if (!formLoading) {
      setIsModalOpen(false);
      setErrorMessage('');
    }
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ ...emptyForm, order: testimonials.length + 1 });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      clientName: item.clientName || '', company: item.company || '', role: item.role || '', content: item.content || '',
      rating: Number(item.rating) || 5, status: item.status || 'active', order: Number(item.order) || 0
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleChange = ({ target: { name, value } }) => setFormData((current) => ({
    ...current, [name]: name === 'rating' || name === 'order' ? Number(value) : value
  }));

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!formData.clientName.trim() || !formData.company.trim() || !formData.content.trim()) {
      setErrorMessage('Client name, company, and testimonial content are required.');
      return;
    }
    setFormLoading(true);
    setErrorMessage('');
    const payload = {
      ...formData,
      clientName: formData.clientName.trim(), company: formData.company.trim(),
      role: formData.role.trim() || 'Executive', content: formData.content.trim()
    };
    try {
      if (editingItem) {
        const response = await testimonialService.update(getId(editingItem), payload);
        const updated = response.data || { ...editingItem, ...payload };
        setTestimonials((items) => items.map((item) => (getId(item) === getId(editingItem) ? updated : item)));
        showSuccess('Testimonial updated successfully.');
      } else {
        const response = await testimonialService.create(payload);
        setTestimonials((items) => [...items, response.data].sort((a, b) => (a.order || 0) - (b.order || 0)));
        showSuccess('New testimonial added successfully.');
      }
      setIsModalOpen(false);
    } catch (err) {
      setErrorMessage(err.message || 'Unable to save the testimonial.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await testimonialService.delete(deleteConfirmId);
      setTestimonials((items) => items.filter((item) => getId(item) !== deleteConfirmId));
      setDeleteConfirmId(null);
      showSuccess('Testimonial deleted successfully.');
    } catch (err) {
      setLoadError(err.message || 'Unable to delete the testimonial.');
      setDeleteConfirmId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div><h1 className="page-title">Manage Testimonials</h1><p className="page-subtitle">Configure client reviews and partner endorsements displayed on the website</p></div>
        <button onClick={handleOpenAdd} className="btn btn-primary" id="add-testimonial-btn"><Plus size={18} /><span>Add Testimonial</span></button>
      </div>

      {successMessage && <div className="feedback-alert feedback-alert-success" role="status"><CheckCircle2 size={18} /><span>{successMessage}</span></div>}
      {loadError && <div className="feedback-alert feedback-alert-error" role="alert"><span>{loadError}</span><button className="feedback-alert-action" onClick={fetchTestimonials}>Try again</button></div>}

      <div className="admin-card">
        <div className="admin-card-header testimonial-toolbar">
          <div className="testimonial-search"><Search size={17} /><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search testimonials" aria-label="Search testimonials" /></div>
          <div className="testimonial-toolbar-actions">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="form-select testimonial-status-filter" aria-label="Filter by status"><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
            <button className="btn btn-secondary btn-icon" onClick={fetchTestimonials} disabled={loading} title="Refresh testimonials" aria-label="Refresh testimonials"><RefreshCw size={16} className={loading ? 'animate-spin-slow' : ''} /></button>
          </div>
        </div>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead><tr><th>Client Name &amp; Company</th><th>Role</th><th>Rating</th><th>Testimonial Quote</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="admin-table-message"><Loader2 size={18} className="animate-spin-slow" /> Loading testimonials...</td></tr>
                : visibleTestimonials.length === 0 ? <tr><td colSpan={6} className="admin-table-message">{testimonials.length ? 'No testimonials match your filters.' : 'No testimonials found. Add the first client review.'}</td></tr>
                  : visibleTestimonials.map((testimonial) => (
                    <tr key={getId(testimonial)}>
                      <td><div className="testimonial-client-name">{testimonial.clientName}</div><div className="testimonial-company">{testimonial.company}</div></td>
                      <td className="testimonial-role">{testimonial.role || 'Executive'}</td>
                      <td><div className="testimonial-stars" aria-label={`${testimonial.rating || 5} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={14} fill={index < (testimonial.rating || 5) ? 'currentColor' : 'transparent'} />)}</div></td>
                      <td><div className="testimonial-quote">&quot;{testimonial.content}&quot;</div></td>
                      <td><span className={`badge ${testimonial.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>{testimonial.status}</span></td>
                      <td style={{ textAlign: 'right' }}><div className="testimonial-actions"><button onClick={() => handleOpenEdit(testimonial)} className="btn btn-secondary btn-icon" title="Edit testimonial" aria-label={`Edit ${testimonial.clientName}`}><Edit3 size={15} /></button><button onClick={() => setDeleteConfirmId(getId(testimonial))} className="btn btn-danger-outline btn-icon" title="Delete testimonial" aria-label={`Delete ${testimonial.clientName}`}><Trash2 size={15} /></button></div></td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="testimonial-modal-title"><div className="modal-content"><div className="modal-header"><h3 id="testimonial-modal-title">{editingItem ? 'Edit Client Testimonial' : 'Add Testimonial'}</h3><button onClick={closeModal} className="modal-close-button" aria-label="Close"><X size={20} /></button></div><form onSubmit={handleFormSubmit}><div className="modal-body">
        {errorMessage && <div className="form-error" role="alert">{errorMessage}</div>}
        <div className="form-row"><div className="form-group"><label className="form-label" htmlFor="testimonial-client">Client Name *</label><input id="testimonial-client" name="clientName" value={formData.clientName} onChange={handleChange} placeholder="e.g. David Sterling" className="form-input" required autoFocus /></div><div className="form-group"><label className="form-label" htmlFor="testimonial-company">Company *</label><input id="testimonial-company" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Apex Financial Holdings" className="form-input" required /></div></div>
        <div className="form-row"><div className="form-group"><label className="form-label" htmlFor="testimonial-role">Role / Job Title</label><input id="testimonial-role" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Chief Technology Officer" className="form-input" /></div><div className="form-group"><label className="form-label" htmlFor="testimonial-rating">Star Rating</label><select id="testimonial-rating" name="rating" value={formData.rating} onChange={handleChange} className="form-select">{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} {rating === 1 ? 'Star' : 'Stars'}</option>)}</select></div></div>
        <div className="form-group"><label className="form-label" htmlFor="testimonial-content">Testimonial Feedback *</label><textarea id="testimonial-content" name="content" value={formData.content} onChange={handleChange} placeholder="Share the client feedback..." className="form-textarea" required /></div>
        <div className="form-row"><div className="form-group"><label className="form-label" htmlFor="testimonial-status">Status</label><select id="testimonial-status" name="status" value={formData.status} onChange={handleChange} className="form-select"><option value="active">Active — visible on website</option><option value="inactive">Inactive — hidden on website</option></select></div><div className="form-group"><label className="form-label" htmlFor="testimonial-order">Display Order</label><input id="testimonial-order" name="order" type="number" min="0" value={formData.order} onChange={handleChange} className="form-input" /></div></div>
      </div><div className="modal-footer"><button type="button" onClick={closeModal} className="btn btn-secondary btn-sm">Cancel</button><button type="submit" disabled={formLoading} className="btn btn-primary btn-sm" id="save-testimonial-submit-btn">{formLoading && <Loader2 size={16} className="animate-spin-slow" />}<span>{editingItem ? 'Update' : 'Add'} Testimonial</span></button></div></form></div></div>}

      {deleteConfirmId && <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="delete-testimonial-title"><div className="modal-content modal-confirmation"><Trash2 size={42} className="confirmation-icon" /><h3 id="delete-testimonial-title">Delete Testimonial</h3><p>Are you sure you want to remove this client review? This action cannot be undone.</p><div className="confirmation-actions"><button onClick={() => setDeleteConfirmId(null)} className="btn btn-secondary btn-sm">Cancel</button><button onClick={handleDelete} className="btn btn-danger btn-sm">Delete</button></div></div></div>}
    </div>
  );
};

export default ManageTestimonials;
