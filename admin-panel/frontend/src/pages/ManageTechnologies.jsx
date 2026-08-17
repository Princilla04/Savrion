import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  Cpu, 
  Layers, 
  Loader2 
} from 'lucide-react';
import { technologyService } from '../services/technologyService';

const categories = ['All', 'Frontend', 'Backend', 'Mobile', 'Cloud', 'Database', 'DevOps', 'AI/ML', 'Other'];
const icons = ['Layers', 'Code', 'Zap', 'Server', 'Cpu', 'Terminal', 'Database', 'HardDrive', 'Smartphone', 'Cloud', 'Box', 'Network', 'GitBranch'];

const ManageTechnologies = () => {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals & Feedback
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const initialForm = {
    name: '',
    category: 'Frontend',
    icon: 'Layers',
    proficiency: 95,
    status: 'active',
    order: 0
  };
  const [formData, setFormData] = useState(initialForm);

  const fetchTech = async () => {
    setLoading(true);
    try {
      const data = await technologyService.getAll({
        category: categoryFilter !== 'All' ? categoryFilter : undefined
      });
      setTechnologies(data);
    } catch (err) {
      console.warn('Failed to load technologies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTech();
  }, [categoryFilter]);

  const handleOpenAdd = () => {
    setEditingTech(null);
    setFormData(initialForm);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tech) => {
    setEditingTech(tech);
    setFormData({
      name: tech.name || '',
      category: tech.category || 'Frontend',
      icon: tech.icon || 'Layers',
      proficiency: tech.proficiency ?? 95,
      status: tech.status || 'active',
      order: tech.order || 0
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.category.trim()) {
      setErrorMessage('Technology name and category are required.');
      return;
    }

    setFormLoading(true);
    setErrorMessage('');

    try {
      if (editingTech) {
        await technologyService.update(editingTech._id || editingTech.id, formData);
        setSuccessMessage('Technology updated successfully.');
      } else {
        await technologyService.create(formData);
        setSuccessMessage('New technology added successfully.');
      }

      setIsModalOpen(false);
      fetchTech();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Operation failed.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await technologyService.delete(id);
      setDeleteConfirmId(null);
      setSuccessMessage('Technology deleted successfully.');
      fetchTech();
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
          <h1 className="page-title">Manage Technologies</h1>
          <p className="page-subtitle">
            Configure framework capabilities and stack proficiencies shown on the public site
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary" id="add-tech-btn">
          <Plus size={18} />
          <span>Add Technology</span>
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

      {/* Filter Bar */}
      <div className="admin-card" style={{ marginBottom: 'var(--space-xl)', padding: 'var(--space-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginRight: '6px' }}>Filter:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: categoryFilter === c ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                background: categoryFilter === c ? 'rgba(var(--color-primary-rgb), 0.15)' : 'var(--color-surface)',
                color: categoryFilter === c ? 'var(--color-primary-light)' : 'var(--color-text-secondary)'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Technologies Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Technology Name</th>
                <th>Category</th>
                <th>Icon Token</th>
                <th>Proficiency</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                    Loading technologies...
                  </td>
                </tr>
              ) : technologies.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                    No technologies found in this category.
                  </td>
                </tr>
              ) : (
                technologies.map((t) => (
                  <tr key={t._id || t.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div 
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(var(--color-primary-rgb), 0.12)',
                            color: 'var(--color-primary-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Cpu size={16} />
                        </div>
                        <span style={{ fontWeight: 600, color: 'var(--color-white)' }}>{t.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ background: 'var(--color-surface)' }}>
                        {t.category}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {t.icon}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '4px', background: 'var(--color-surface)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${t.proficiency}%`, height: '100%', background: 'var(--color-primary)' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>{t.proficiency}%</span>
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
                          title="Edit Technology"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(t._id || t.id)}
                          className="btn btn-danger-outline btn-icon"
                          title="Delete Technology"
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
                {editingTech ? 'Edit Technology' : 'Add New Technology'}
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

                <div className="form-group">
                  <label className="form-label">Technology Name *</label>
                  <input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. React.js, GraphQL, Docker"
                    className="form-input"
                    required
                  />
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
                    <label className="form-label">Icon</label>
                    <select 
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="form-select"
                    >
                      {icons.map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Proficiency Level (0 - 100%)</label>
                    <input 
                      type="number"
                      min="0"
                      max="100"
                      value={formData.proficiency}
                      onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="form-select"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="inactive">Inactive (Hidden)</option>
                    </select>
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
                  id="save-tech-submit-btn"
                >
                  {formLoading ? <Loader2 size={16} className="animate-spin-slow" /> : null}
                  <span>{editingTech ? 'Update' : 'Add'} Technology</span>
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
              Delete Technology
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)' }}>
              Are you sure you want to remove this technology from the stack matrix?
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
                Delete Technology
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTechnologies;
