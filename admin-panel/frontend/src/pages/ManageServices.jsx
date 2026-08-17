import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  AlertCircle, 
  Layers, 
  CheckCircle2, 
  Globe, 
  Smartphone, 
  Code, 
  Layout, 
  Cloud, 
  Cpu, 
  Zap,
  Loader2
} from 'lucide-react';
import { serviceService } from '../services/serviceService';

const iconOptions = ['Globe', 'Smartphone', 'Code', 'Layout', 'Cloud', 'Cpu', 'Layers', 'Zap'];

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const initialForm = {
    title: '',
    slug: '',
    icon: 'Code',
    shortDescription: '',
    detailedDescription: '',
    capabilities: '',
    technologies: '',
    status: 'active',
    order: 0
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await serviceService.getAll({ 
        search: search || undefined, 
        status: statusFilter || undefined 
      });
      setServices(data);
    } catch (err) {
      console.warn('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchServices();
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData(initialForm);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      slug: service.slug || '',
      icon: service.icon || 'Code',
      shortDescription: service.shortDescription || '',
      detailedDescription: service.detailedDescription || '',
      capabilities: Array.isArray(service.capabilities) ? service.capabilities.join('\n') : (service.capabilities || ''),
      technologies: Array.isArray(service.technologies) ? service.technologies.join(', ') : (service.technologies || ''),
      status: service.status || 'active',
      order: service.order || 0
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.shortDescription.trim() || !formData.detailedDescription.trim()) {
      setErrorMessage('Title, short description, and detailed description are required.');
      return;
    }

    setFormLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        ...formData,
        capabilities: formData.capabilities.split('\n').filter(Boolean).map(s => s.trim()),
        technologies: formData.technologies.split(',').filter(Boolean).map(s => s.trim())
      };

      if (editingService) {
        await serviceService.update(editingService._id || editingService.id, payload);
        setSuccessMessage('Service updated successfully.');
      } else {
        await serviceService.create(payload);
        setSuccessMessage('New service created successfully.');
      }

      setIsModalOpen(false);
      fetchServices();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Operation failed. Please check inputs.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await serviceService.delete(id);
      setDeleteConfirmId(null);
      setSuccessMessage('Service deleted successfully.');
      fetchServices();
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
          <h1 className="page-title">Manage Services</h1>
          <p className="page-subtitle">
            Configure software solution offerings displayed on the Savrion public website
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" id="add-new-service-btn">
          <Plus size={18} />
          <span>Add New Service</span>
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

      {/* Filter and Search Bar */}
      <div className="admin-card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-md)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services by title or description..."
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto' }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit" className="btn btn-secondary">
            Filter
          </button>
        </form>
      </div>

      {/* Services Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service Name & Icon</th>
                <th>Slug URL</th>
                <th>Capabilities Count</th>
                <th>Status</th>
                <th>Order</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                    Loading services catalog...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                    No services found matching filters.
                  </td>
                </tr>
              ) : (
                services.map((s) => (
                  <tr key={s._id || s.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div 
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(var(--color-primary-rgb), 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-primary-light)'
                          }}
                        >
                          <Layers size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-white)' }}>{s.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {s.shortDescription}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-primary-light)' }}>
                      /services/{s.slug}
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'var(--color-surface)' }}>
                        {s.capabilities?.length || 0} features
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${s.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>{s.order || 0}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          onClick={() => handleOpenEdit(s)}
                          className="btn btn-secondary btn-icon"
                          title="Edit Service"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(s._id || s.id)}
                          className="btn btn-danger-outline btn-icon"
                          title="Delete Service"
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

      {/* ==========================================================
          ADD / EDIT SERVICE MODAL
          ========================================================== */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-lg">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-white)' }}>
                {editingService ? 'Edit Service Architecture' : 'Create New Service'}
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
                    <label className="form-label">Service Title *</label>
                    <input 
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Cloud & DevOps Solutions"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL Slug (Auto-generated if empty)</label>
                    <input 
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="cloud-solutions"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Service Icon</label>
                    <select 
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="form-select"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Display Order & Status</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                        className="form-input"
                        style={{ width: '80px' }}
                        title="Display sort order"
                      />
                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="form-select"
                        style={{ flex: 1 }}
                      >
                        <option value="active">Active (Visible)</option>
                        <option value="inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Short Summary Description *</label>
                  <input 
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Short punchy 1-2 sentence description for cards"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Detailed Description *</label>
                  <textarea 
                    value={formData.detailedDescription}
                    onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                    placeholder="Full in-depth engineering overview for the individual service details page..."
                    className="form-textarea"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Key Capabilities (One per line)</label>
                  <textarea 
                    value={formData.capabilities}
                    onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
                    placeholder="Enterprise Full-Stack Architecture&#10;Progressive Web Apps (PWA)&#10;High-Speed API Gateways"
                    className="form-textarea"
                    style={{ minHeight: '80px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Technologies (Comma separated)</label>
                  <input 
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React.js, Node.js, Express, MongoDB, AWS"
                    className="form-input"
                  />
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
                  id="save-service-submit-btn"
                >
                  {formLoading ? <Loader2 size={16} className="animate-spin-slow" /> : null}
                  <span>{editingService ? 'Update Service' : 'Create Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================================================
          DELETE CONFIRMATION MODAL
          ========================================================== */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center', padding: 'var(--space-xl)' }}>
            <Trash2 size={42} color="var(--color-danger)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-white)', marginBottom: '8px' }}>
              Confirm Service Deletion
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)' }}>
              Are you sure you want to permanently delete this service? This action will remove it from the public website.
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
                Delete Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
