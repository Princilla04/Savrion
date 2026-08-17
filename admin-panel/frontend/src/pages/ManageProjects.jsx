import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  Briefcase, 
  Star, 
  Upload,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { uploadService } from '../services/uploadService';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals & Feedback
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const initialForm = {
    title: '',
    slug: '',
    client: '',
    category: 'FinTech & Financial Engineering',
    bannerImage: '',
    shortDescription: '',
    problem: '',
    solution: '',
    results: '',
    features: '',
    technologies: '',
    liveUrl: '',
    featured: false,
    status: 'active',
    order: 0
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getAll({
        search: search || undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined
      });
      setProjects(data);
    } catch (err) {
      console.warn('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData(initialForm);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      client: project.client || '',
      category: project.category || 'FinTech & Financial Engineering',
      bannerImage: project.bannerImage || '',
      shortDescription: project.shortDescription || '',
      problem: project.problem || '',
      solution: project.solution || '',
      results: project.results || '',
      features: Array.isArray(project.features) ? project.features.join('\n') : (project.features || ''),
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : (project.technologies || ''),
      liveUrl: project.liveUrl || '',
      featured: project.featured || false,
      status: project.status || 'active',
      order: project.order || 0
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await uploadService.uploadImage(file);
      if (res.url) {
        const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:5050';
        setFormData(prev => ({ ...prev, bannerImage: `${serverUrl}${res.url}` }));
      }
    } catch (err) {
      alert('Image upload failed: ' + err.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.category.trim() || !formData.shortDescription.trim()) {
      setErrorMessage('Title, category, and short description are required.');
      return;
    }

    setFormLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        ...formData,
        features: formData.features.split('\n').filter(Boolean).map(s => s.trim()),
        technologies: formData.technologies.split(',').filter(Boolean).map(s => s.trim())
      };

      if (editingProject) {
        await projectService.update(editingProject._id || editingProject.id, payload);
        setSuccessMessage('Case study updated successfully.');
      } else {
        await projectService.create(payload);
        setSuccessMessage('New project created successfully.');
      }

      setIsModalOpen(false);
      fetchProjects();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Operation failed. Please check inputs.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await projectService.delete(id);
      setDeleteConfirmId(null);
      setSuccessMessage('Project deleted successfully.');
      fetchProjects();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const categories = ['All', 'FinTech & Financial Engineering', 'HealthTech & Telemedicine', 'Logistics & Supply Chain', 'Cybersecurity & Cloud Governance', 'Media & Entertainment', 'Enterprise SaaS'];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Projects & Case Studies</h1>
          <p className="page-subtitle">
            Curate portfolio items and enterprise case studies displayed on the public website
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" id="add-new-project-btn">
          <Plus size={18} />
          <span>Add New Case Study</span>
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

      {/* Filters Bar */}
      <div className="admin-card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-md)' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by title, client, or tech..."
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto' }}
          >
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button type="submit" className="btn btn-secondary">
            Filter
          </button>
        </form>
      </div>

      {/* Projects Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Project & Banner</th>
                <th>Client</th>
                <th>Category</th>
                <th>Featured</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                    No case studies found matching criteria.
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p._id || p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {p.bannerImage ? (
                          <img 
                            src={p.bannerImage} 
                            alt={p.title} 
                            style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }} 
                          />
                        ) : (
                          <div style={{ width: '48px', height: '36px', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Briefcase size={18} color="var(--color-primary)" />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-white)' }}>{p.title}</div>
                          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>/projects/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.client}</td>
                    <td>
                      <span className="badge" style={{ background: 'var(--color-surface)', fontSize: '0.75rem' }}>
                        {p.category}
                      </span>
                    </td>
                    <td>
                      {p.featured ? (
                        <span className="badge badge-unread" style={{ gap: '4px' }}>
                          <Star size={12} fill="var(--color-primary)" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>Standard</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          onClick={() => handleOpenEdit(p)}
                          className="btn btn-secondary btn-icon"
                          title="Edit Project"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(p._id || p.id)}
                          className="btn btn-danger-outline btn-icon"
                          title="Delete Project"
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
          ADD / EDIT PROJECT MODAL
          ========================================================== */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-lg">
            <div className="modal-header">
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-white)' }}>
                {editingProject ? 'Edit Case Study' : 'Create New Project Case Study'}
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
                    <label className="form-label">Project Title *</label>
                    <input 
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. ApexFin: Next-Gen Trading Engine"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Client Name</label>
                    <input 
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      placeholder="e.g. Apex Financial Holdings LLC"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="form-select"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">URL Slug</label>
                    <input 
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="apexfin-platform"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Banner Image URL & File Upload */}
                <div className="form-group">
                  <label className="form-label">Banner Image (URL or Upload Image File)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text"
                      value={formData.bannerImage}
                      onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                      placeholder="https://images.unsplash.com/... or /uploads/..."
                      className="form-input"
                      style={{ flex: 1 }}
                    />
                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Upload size={15} />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        style={{ display: 'none' }} 
                      />
                    </label>
                  </div>
                  {formData.bannerImage && (
                    <div style={{ marginTop: '8px', width: '100%', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                      <img src={formData.bannerImage} alt="Banner Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Short Summary Description *</label>
                  <input 
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    placeholder="Concise overview for cards and meta preview"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Problem / Challenge Statement</label>
                    <textarea 
                      value={formData.problem}
                      onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                      placeholder="What business problems or legacy constraints did the client face?"
                      className="form-textarea"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Savrion Solution Architecture</label>
                    <textarea 
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      placeholder="What modular software or cloud systems did Savrion build?"
                      className="form-textarea"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Results & Business Impact Metrics</label>
                  <textarea 
                    value={formData.results}
                    onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                    placeholder="e.g. Reduced latency by 84%, handled 50,000+ concurrent streams, saved $4.2M..."
                    className="form-textarea"
                    style={{ minHeight: '70px' }}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Features (One per line)</label>
                    <textarea 
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="Real-time WebSocket ticker updates&#10;Multi-asset risk simulation&#10;SOC2 audit logging"
                      className="form-textarea"
                      style={{ minHeight: '70px' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Technologies (Comma separated)</label>
                    <textarea 
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="React.js, Node.js, Express, MongoDB, Redis, Docker"
                      className="form-textarea"
                      style={{ minHeight: '70px' }}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Live Demo / Case URL</label>
                    <input 
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                      placeholder="https://example.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Featured & Visibility</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '42px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input 
                          type="checkbox"
                          checked={formData.featured}
                          onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        />
                        <span>Homepage Featured</span>
                      </label>

                      <select 
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="form-select"
                        style={{ width: 'auto' }}
                      >
                        <option value="active">Active (Visible)</option>
                        <option value="inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>
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
                  id="save-project-submit-btn"
                >
                  {formLoading ? <Loader2 size={16} className="animate-spin-slow" /> : null}
                  <span>{editingProject ? 'Update Case Study' : 'Create Case Study'}</span>
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
              Delete Case Study
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)' }}>
              Are you sure you want to remove this case study from the Savrion portfolio?
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
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProjects;
