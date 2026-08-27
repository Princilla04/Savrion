import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  Briefcase, 
  Upload,
  Loader2,
  ArrowUp,
  ArrowDown,
  GripVertical
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { uploadService } from '../services/uploadService';
import { getMediaUrl } from '../utils/mediaUtils';

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
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [draggedProjectId, setDraggedProjectId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const initialForm = {
    title: '',
    slug: '',
    client: '',
    category: '',
    bannerImage: '',
    logo: '',
    sampleVideo: '',
    shortDescription: '',
    problem: '',
    solution: '',
    results: '',
    features: '',
    technologies: '',
    liveUrl: '',
    websiteUrl: '',
    playStoreUrl: '',
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
      category: project.category || '',
      bannerImage: project.bannerImage || '',
      logo: project.logo || '',
      sampleVideo: project.sampleVideo || '',
      shortDescription: project.shortDescription || '',
      problem: project.problem || '',
      solution: project.solution || '',
      results: project.results || '',
      features: Array.isArray(project.features) ? project.features.join('\n') : (project.features || ''),
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : (project.technologies || ''),
      liveUrl: project.liveUrl || '',
      websiteUrl: project.websiteUrl || '',
      playStoreUrl: project.playStoreUrl || '',
      status: project.status || 'active',
      order: project.order || 0
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleMediaUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingMedia(true);
    try {
      const res = await uploadService.uploadMedia(file);
      if (res.url) {
        setFormData(prev => ({ ...prev, [field]: uploadService.resolveMediaUrl(res.url) }));
      }
    } catch {
      alert('Media upload failed: ' + err.message);
    } finally {
      setUploadingMedia(false);
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
        setSuccessMessage('Product updated successfully.');
      } else {
        await projectService.create(payload);
        setSuccessMessage('New product created successfully.');
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
      setSuccessMessage('Product deleted successfully.');
      fetchProjects();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  const saveReorderedProjects = async (reordered) => {
    const orderedProjects = reordered.map((project, index) => ({ ...project, order: index + 1 }));
    setProjects(orderedProjects);
    setReordering(true);
    try {
      await Promise.all(orderedProjects.map((project) => projectService.update(project._id || project.id, { order: project.order })));
      setSuccessMessage('Product order updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setSuccessMessage('Unable to update product order. Restoring the previous order.');
      fetchProjects();
    } finally {
      setReordering(false);
      setDraggedProjectId(null);
    }
  };

  const handleMoveProject = async (currentIndex, direction) => {
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= projects.length || reordering) return;

    const reordered = [...projects];
    [reordered[currentIndex], reordered[targetIndex]] = [reordered[targetIndex], reordered[currentIndex]];
    await saveReorderedProjects(reordered);
  };

  const handleDrop = async (targetId) => {
    if (!draggedProjectId || draggedProjectId === targetId || reordering || search || categoryFilter !== 'All') return;
    const sourceIndex = projects.findIndex((project) => (project._id || project.id) === draggedProjectId);
    const targetIndex = projects.findIndex((project) => (project._id || project.id) === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const reordered = [...projects];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    await saveReorderedProjects(reordered);
  };

  const categories = ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))];

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Products</h1>
          <p className="page-subtitle">
            Manage the products displayed on the public website
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" id="add-new-project-btn">
          <Plus size={18} />
          <span>Add Product</span>
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
              placeholder="Search products by title, category, or technology..."
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
        {(search || categoryFilter !== 'All') && (
          <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Clear filters to reorder the complete product list.
          </p>
        )}
        {!search && categoryFilter === 'All' && (
          <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            Drag a product row using its handle to set its public website order.
          </p>
        )}
      </div>

      {/* Projects Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Client</th>
                <th>Category</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                    Loading products...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                    No products found matching criteria.
                  </td>
                </tr>
              ) : (
                projects.map((p, index) => {
                  const projectId = p._id || p.id;
                  const canDrag = !reordering && !search && categoryFilter === 'All';
                  return (
                  <tr
                    key={projectId}
                    draggable={canDrag}
                    onDragStart={() => setDraggedProjectId(projectId)}
                    onDragOver={(event) => { if (canDrag) event.preventDefault(); }}
                    onDrop={() => handleDrop(projectId)}
                    onDragEnd={() => setDraggedProjectId(null)}
                    style={{ opacity: draggedProjectId === projectId ? 0.5 : 1, cursor: canDrag ? 'grab' : 'default' }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <GripVertical size={18} color="var(--color-text-muted)" aria-label="Drag to reorder" style={{ flexShrink: 0 }} />
                        {p.bannerImage ? (
                          <img 
                            src={p.bannerImage} 
                            alt={`${p.title} banner`}
                            style={{ width: '96px', height: '54px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', flexShrink: 0 }}
                          />
                        ) : p.logo ? (
                          <div style={{ width: '54px', height: '54px', background: '#fff', borderRadius: 'var(--radius-sm)', padding: '6px', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                            <img src={p.logo} alt={`${p.title} logo`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          </div>
                        ) : (
                          <div style={{ width: '54px', height: '54px', background: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Briefcase size={18} color="var(--color-primary)" />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-white)' }}>{p.title}</div>
                          <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>/products/{p.slug}</div>
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
                      <span className={`badge ${p.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          onClick={() => handleMoveProject(index, -1)}
                          disabled={index === 0 || reordering || search || categoryFilter !== 'All'}
                          className="btn btn-secondary btn-icon"
                          title="Move product up"
                          aria-label={`Move ${p.title} up`}
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button 
                          onClick={() => handleMoveProject(index, 1)}
                          disabled={index === projects.length - 1 || reordering || search || categoryFilter !== 'All'}
                          className="btn btn-secondary btn-icon"
                          title="Move product down"
                          aria-label={`Move ${p.title} down`}
                        >
                          <ArrowDown size={15} />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(p)}
                          className="btn btn-secondary btn-icon"
                          title="Edit Product"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(p._id || p.id)}
                          className="btn btn-danger-outline btn-icon"
                          title="Delete Product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })
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
                {editingProject ? 'Edit Product' : 'Create Product'}
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
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Attendance Management"
                      className="form-input"
                      list="product-category-suggestions"
                      required
                    />
                    <datalist id="product-category-suggestions">
                      {categories.filter((category) => category !== 'All').map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
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
                  <label className="form-label">Product Banner (URL or Upload Image)</label>
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
                      <span>{uploadingMedia ? 'Uploading...' : 'Upload Image'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleMediaUpload(e, 'bannerImage')}
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

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Product Logo (URL or Upload Image)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} placeholder="https://... or /uploads/..." className="form-input" style={{ flex: 1 }} />
                      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Upload size={15} /><span>{uploadingMedia ? 'Uploading...' : 'Upload Logo'}</span>
                        <input type="file" accept="image/*" onChange={(e) => handleMediaUpload(e, 'logo')} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sample Video (URL or Upload Video)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input type="text" value={formData.sampleVideo} onChange={(e) => setFormData({ ...formData, sampleVideo: e.target.value })} placeholder="https://... or /uploads/..." className="form-input" style={{ flex: 1 }} />
                      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Upload size={15} /><span>{uploadingMedia ? 'Uploading...' : 'Upload Video'}</span>
                        <input type="file" accept="video/mp4,video/webm,video/ogg" onChange={(e) => handleMediaUpload(e, 'sampleVideo')} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>
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
                    <label className="form-label">Website Link</label>
                    <input 
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                      placeholder="https://your-product.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Google Play Store Link</label>
                    <input 
                      type="url"
                      value={formData.playStoreUrl}
                      onChange={(e) => setFormData({ ...formData, playStoreUrl: e.target.value })}
                      placeholder="https://play.google.com/store/apps/details?id=..."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Visibility</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', height: '42px' }}>
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
                  <span>{editingProject ? 'Update Product' : 'Create Product'}</span>
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
