import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  Star, 
  Quote, 
  Loader2 
} from 'lucide-react';
import { testimonialService } from '../services/testimonialService';

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Feedback
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const initialForm = {
    clientName: '',
    company: '',
    role: 'Executive',
    content: '',
    rating: 5,
    status: 'active',
    order: 0
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await testimonialService.getAll();
      setTestimonials(data);
    } catch (err) {
      console.warn('Failed to load testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData(initialForm);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      clientName: item.clientName || '',
      company: item.company || '',
      role: item.role || 'Executive',
      content: item.content || '',
      rating: item.rating ?? 5,
      status: item.status || 'active',
      order: item.order || 0
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.clientName.trim() || !formData.company.trim() || !formData.content.trim()) {
      setErrorMessage('Client name, company, and testimonial content are required.');
      return;
    }

    setFormLoading(true);
    setErrorMessage('');

    try {
      if (editingItem) {
        await testimonialService.update(editingItem._id || editingItem.id, formData);
        setSuccessMessage('Testimonial updated successfully.');
      } else {
        await testimonialService.create(formData);
        setSuccessMessage('New testimonial added successfully.');
      }

      setIsModalOpen(false);
      fetchTestimonials();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Operation failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await testimonialService.delete(id);
      setDeleteConfirmId(null);
      setSuccessMessage('Testimonial deleted successfully.');
      fetchTestimonials();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Testimonials</h1>
          <p className="page-subtitle">
            Configure client reviews and partner endorsements displayed on the website
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" id="add-testimonial-btn">
          <Plus size={18} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div 
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid var(--color-success)',
            color: '#A7F3D0',
            marginBottom: 'var(--space-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <CheckCircle2 size={18} color="var(--color-success)" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Testimonials Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client Name & Company</th>
                <th>Role</th>
                <th>Rating</th>
                <th>Testimonial Quote</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                    Loading testimonials...
                  </td>
                </tr>
              ) : testimonials.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                    No testimonials found.
                  </td>
                </tr>
              ) : (
                testimonials.map((t) => (
                  <tr key={t._id || t.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--color-white)' }}>{t.clientName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)' }}>{t.company}</div>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)' }}>{t.role}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(t.rating || 5)].map((_, i) => (
                          <Star key={i} size={14} fill="var(--color-primary)" color="var(--color-primary)" />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>
                        "{t.content}"
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${t.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          onClick={() => handleOpenEdit(t)}
                          className="btn btn-secondary btn-icon"
                          title="Edit Testimonial"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(t._id || t.id)}
                          className="btn btn-danger-outline btn-icon"
                          title="Delete Testimonial"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-white)' }}>
                {editingItem ? 'Edit Client Testimonial' : 'Add Testimonial'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="modal-body">
                {errorMessage && (
                  <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.15)', color: '#FECACA', marginBottom: 'var(--space-md)', fontSize: '0.85rem' }}>
                    {errorMessage}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Client Name *</label>
                    <input 
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="e.g. David Sterling"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company *</label>
                    <input 
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Apex Financial Holdings"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Role / Job Title</label>
                    <input 
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Chief Technology Officer"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Star Rating (1 - 5)</label>
                    <select 
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="form-select"
                    >
                      <option value={5}>5 Stars (Exceptional)</option>
                      <option value={4}>4 Stars (Very Good)</option>
                      <option value={3}>3 Stars (Good)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Testimonial Feedback Content *</label>
                  <textarea 
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Savrion transformed our legacy interface into a lightning-fast enterprise workstation..."
                    className="form-textarea"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="active">Active (Visible on Website)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={formLoading} 
                  className="btn btn-primary btn-sm"
                  id="save-testimonial-submit-btn"
                >
                  {formLoading ? <Loader2 size={16} className="animate-spin-slow" /> : null}
                  <span>{editingItem ? 'Update' : 'Add'} Testimonial</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center', padding: 'var(--space-xl)' }}>
            <Trash2 size={42} color="var(--color-danger)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-white)', marginBottom: '8px' }}>
              Delete Testimonial
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)' }}>
              Are you sure you want to remove this client review?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTestimonials;
