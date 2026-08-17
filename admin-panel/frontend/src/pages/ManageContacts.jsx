import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Trash2, 
  X, 
  CheckCircle2, 
  Mail, 
  Phone, 
  Building, 
  Clock, 
  Eye, 
  Send,
  MessageSquare,
  Filter
} from 'lucide-react';
import { contactService } from '../services/contactService';

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Modals & Active Enquiry
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await contactService.getAll({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search || undefined
      });
      setContacts(data);
    } catch (err) {
      console.warn('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchContacts();
  };

  const handleOpenDetails = async (contact) => {
    setSelectedEnquiry(contact);
    // If unread, mark as read automatically
    if (contact.status === 'unread') {
      try {
        await contactService.updateStatus(contact._id || contact.id, 'read');
        setContacts(prev => prev.map(c => (c._id || c.id) === (contact._id || contact.id) ? { ...c, status: 'read' } : c));
      } catch (err) {
        // silent
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await contactService.updateStatus(id, newStatus);
      setContacts(prev => prev.map(c => (c._id || c.id) === id ? { ...c, status: newStatus } : c));
      if (selectedEnquiry && (selectedEnquiry._id || selectedEnquiry.id) === id) {
        setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
      }
      setSuccessMessage(`Enquiry marked as ${newStatus}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Status update failed: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await contactService.delete(id);
      setDeleteConfirmId(null);
      if (selectedEnquiry && (selectedEnquiry._id || selectedEnquiry.id) === id) {
        setSelectedEnquiry(null);
      }
      setSuccessMessage('Enquiry removed successfully.');
      fetchContacts();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Manage Contact Inquiries</h1>
          <p className="page-subtitle">
            Review and respond to client project requests and technical consultation inquiries
          </p>
        </div>
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
              placeholder="Search by sender name, email, company, or subject..."
              className="form-input"
              style={{ paddingLeft: '38px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['all', 'unread', 'read', 'replied'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  border: statusFilter === st ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  background: statusFilter === st ? 'rgba(var(--color-primary-rgb), 0.15)' : 'var(--color-surface)',
                  color: statusFilter === st ? 'var(--color-primary-light)' : 'var(--color-text-secondary)'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Contacts Inbox Table */}
      <div className="admin-card">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender & Email</th>
                <th>Subject</th>
                <th>Company</th>
                <th>Status</th>
                <th>Received</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                    Loading inquiries...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: 'var(--color-text-muted)' }}>
                    No contact inquiries found matching filter.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c._id || c.id} style={{ background: c.status === 'unread' ? 'rgba(0, 174, 169, 0.03)' : undefined }}>
                    <td>
                      <div style={{ fontWeight: c.status === 'unread' ? 700 : 500, color: 'var(--color-white)' }}>
                        {c.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        {c.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: c.status === 'unread' ? 600 : 400, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.subject}
                      </div>
                    </td>
                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                      {c.company || '—'}
                    </td>
                    <td>
                      <span className={`badge ${c.status === 'unread' ? 'badge-unread' : c.status === 'replied' ? 'badge-active' : 'badge-read'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {new Date(c.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button 
                          onClick={() => handleOpenDetails(c)}
                          className="btn btn-secondary btn-icon"
                          title="View Inquiry Details"
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmId(c._id || c.id)}
                          className="btn btn-danger-outline btn-icon"
                          title="Delete Inquiry"
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
          INQUIRY DETAILS MODAL
          ========================================================== */}
      {selectedEnquiry && (
        <div className="modal-overlay">
          <div className="modal-content modal-content-lg">
            <div className="modal-header">
              <div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-white)' }}>
                  Inquiry: {selectedEnquiry.subject}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Received on {new Date(selectedEnquiry.createdAt).toLocaleString()}
                </span>
              </div>
              <button 
                onClick={() => setSelectedEnquiry(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Sender Details Cards */}
              <div className="grid-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <div className="card" style={{ padding: 'var(--space-md)', background: 'var(--color-surface)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Sender</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-white)', marginTop: '2px' }}>{selectedEnquiry.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-light)', marginTop: '2px' }}>
                    <a href={`mailto:${selectedEnquiry.email}`} style={{ color: 'inherit' }}>{selectedEnquiry.email}</a>
                  </div>
                </div>

                <div className="card" style={{ padding: 'var(--space-md)', background: 'var(--color-surface)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Organization & Contact</div>
                  <div style={{ fontWeight: 600, color: 'var(--color-white)', marginTop: '2px' }}>{selectedEnquiry.company || 'Not Specified'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    {selectedEnquiry.phone || 'No phone provided'}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="card" style={{ padding: 'var(--space-lg)', background: 'var(--color-card)', marginBottom: 'var(--space-lg)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Project Ingestion Message
                </div>
                <div style={{ color: 'var(--color-text-primary)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Status:</span>
                  <button 
                    onClick={() => handleUpdateStatus(selectedEnquiry._id || selectedEnquiry.id, 'unread')}
                    className={`btn btn-sm ${selectedEnquiry.status === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Unread
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedEnquiry._id || selectedEnquiry.id, 'read')}
                    className={`btn btn-sm ${selectedEnquiry.status === 'read' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Read
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedEnquiry._id || selectedEnquiry.id, 'replied')}
                    className={`btn btn-sm ${selectedEnquiry.status === 'replied' ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    Replied
                  </button>
                </div>

                <a 
                  href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(selectedEnquiry.subject)} - Savrion Software Solutions`}
                  className="btn btn-primary btn-sm"
                  target="_blank" 
                  rel="noreferrer"
                >
                  <Send size={15} />
                  <span>Send Direct Email Reply</span>
                </a>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '420px', textAlign: 'center', padding: 'var(--space-xl)' }}>
            <Trash2 size={42} color="var(--color-danger)" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-white)', marginBottom: '8px' }}>
              Delete Inquiry
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: 'var(--space-xl)' }}>
              Are you sure you want to delete this contact submission?
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

export default ManageContacts;
