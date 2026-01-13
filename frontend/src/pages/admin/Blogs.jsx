import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Icon from '../../components/AppIcon';
import RichTextEditor from '../../components/admin/RichTextEditor';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'https://backend-three-sigma-81.vercel.app/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    published: true,
    layout: 'classic'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const raw = localStorage.getItem('gm_auth');
      const headers = raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {};
      const r = await fetch(`${API_BASE}/admin/blogs`, { headers });
      const j = await r.json();
      setBlogs(j.data || []);
    } catch (err) {
      setError('Failed to fetch blogs');
    }
    setLoading(false);
  };

  useEffect(() => { fetchBlogs(); }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(b => {
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchTitle = b.title?.toLowerCase().includes(q);
        const matchSlug = b.slug?.toLowerCase().includes(q);
        if (!matchTitle && !matchSlug) return false;
      }
      // Status filter
      if (filterStatus === 'published' && !b.published) return false;
      if (filterStatus === 'draft' && b.published) return false;
      return true;
    });
  }, [blogs, searchQuery, filterStatus]);

  const stats = useMemo(() => ({
    total: blogs.length,
    published: blogs.filter(b => b.published).length,
    draft: blogs.filter(b => !b.published).length,
  }), [blogs]);

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData({ title: '', slug: '', excerpt: '', content: '', image_url: '', published: true, layout: 'classic' });
    setImagePreview('');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const openEditModal = (b) => {
    setEditingBlog(b);
    setFormData({
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt || '',
      content: b.content || '',
      image_url: b.image_url || '',
      published: b.published === 1 || b.published === true,
      layout: b.layout || 'classic'
    });
    setImagePreview(b.image_url || '');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  // Handle rich text content change
  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  // Handle layout template change
  const handleLayoutChange = (layout) => {
    setFormData(prev => ({ ...prev, layout }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    setUploadingImage(true);
    setError('');
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Image = event.target?.result;
        setImagePreview(base64Image);
        setFormData(prev => ({ ...prev, image_url: base64Image }));
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to process image');
      setUploadingImage(false);
    }
  };

  const saveBlog = async () => {
    setError('');
    if (!formData.title || !formData.slug) {
      setError('Title and Slug are required');
      return;
    }

    const raw = localStorage.getItem('gm_auth');
    const headers = { 'Content-Type': 'application/json', ...(raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {}) };

    try {
      const payload = { ...formData, published: formData.published ? 1 : 0 };
      const url = editingBlog ? `${API_BASE}/admin/blogs/${editingBlog.id}` : `${API_BASE}/admin/blogs`;
      const method = editingBlog ? 'PUT' : 'POST';
      const response = await fetch(url, { method, headers, body: JSON.stringify(payload) });

      if (!response.ok) throw new Error('Failed to save blog');

      setSuccess(editingBlog ? 'Blog updated successfully' : 'Blog created successfully');
      setTimeout(() => {
        setShowModal(false);
        fetchBlogs();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Failed to save blog');
    }
  };

  const deleteBlog = async (id) => {
    if (!confirm('Delete this blog?')) return;
    const raw = localStorage.getItem('gm_auth');
    const headers = { ...(raw ? { Authorization: `Bearer ${JSON.parse(raw).token}` } : {}) };
    try {
      const response = await fetch(`${API_BASE}/admin/blogs/${id}`, { method: 'DELETE', headers });
      if (!response.ok) throw new Error('Failed to delete blog');
      setBlogs(prevBlogs => prevBlogs.filter(b => b.id !== id));
      setSuccess('Blog deleted successfully');
      setTimeout(() => fetchBlogs(), 500);
    } catch (err) {
      setError('Failed to delete blog');
    }
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--admin-text-primary)', margin: 0 }}>
            Blog Management
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--admin-text-secondary)', marginTop: '4px' }}>
            Create, edit, and manage your blog posts
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, var(--admin-accent) 0%, var(--admin-purple) 100%)',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
          }}
        >
          <Icon name="Plus" size={18} />
          Create Blog
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div className="admin-stat-card blue" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Total Posts</div>
              <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.total}</div>
            </div>
            <div className="admin-stat-card-icon">
              <Icon name="FileText" size={24} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card green" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Published</div>
              <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.published}</div>
            </div>
            <div className="admin-stat-card-icon">
              <Icon name="CheckCircle2" size={24} />
            </div>
          </div>
        </div>
        <div className="admin-stat-card orange" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="admin-stat-card-title" style={{ fontSize: '12px' }}>Drafts</div>
              <div className="admin-stat-card-value" style={{ fontSize: '28px' }}>{stats.draft}</div>
            </div>
            <div className="admin-stat-card-icon">
              <Icon name="FileEdit" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div className="admin-search" style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}>
          <Icon name="Search" size={18} style={{ color: 'var(--admin-text-muted)' }} />
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="admin-range-selector">
          {['all', 'published', 'draft'].map(status => (
            <button
              key={status}
              className={`admin-range-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={fetchBlogs} className="admin-quick-btn" style={{ padding: '10px 16px' }}>
          <Icon name="RefreshCw" size={16} />
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="admin-loading">
          <div className="admin-loading-spinner"></div>
          <span className="admin-loading-text">Loading blogs...</span>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="admin-content-card" style={{ textAlign: 'center', padding: '60px' }}>
          <Icon name="FileText" size={48} style={{ color: 'var(--admin-text-muted)', marginBottom: '16px', opacity: 0.5 }} />
          <p style={{ color: 'var(--admin-text-muted)', margin: '0 0 16px' }}>No blogs found</p>
          <button
            onClick={openCreateModal}
            className="admin-quick-btn"
            style={{ padding: '10px 20px' }}
          >
            Create your first blog
          </button>
        </div>
      ) : (
        /* Blogs Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredBlogs.map(b => (
            <div
              key={b.id}
              className="admin-content-card"
              style={{ padding: 0, overflow: 'hidden' }}
            >
              {/* Blog Image */}
              {b.image_url ? (
                <div style={{ height: '160px', overflow: 'hidden' }}>
                  <img
                    src={b.image_url}
                    alt={b.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <div style={{
                  height: '160px',
                  background: 'linear-gradient(135deg, var(--admin-bg-primary) 0%, var(--admin-bg-secondary) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon name="Image" size={40} style={{ color: 'var(--admin-text-muted)', opacity: 0.3 }} />
                </div>
              )}

              {/* Blog Content */}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--admin-text-primary)',
                    margin: 0,
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {b.title}
                  </h3>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: b.published ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                    color: b.published ? 'var(--admin-success)' : 'var(--admin-warning)',
                    flexShrink: 0,
                  }}>
                    {b.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div style={{
                  fontSize: '12px',
                  color: 'var(--admin-accent)',
                  marginBottom: '8px',
                  padding: '4px 8px',
                  background: 'var(--admin-bg-primary)',
                  borderRadius: '4px',
                  display: 'inline-block',
                }}>
                  /{b.slug}
                </div>

                <p style={{
                  fontSize: '13px',
                  color: 'var(--admin-text-muted)',
                  margin: '12px 0',
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {b.excerpt || 'No excerpt available'}
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--admin-border)' }}>
                  <button
                    onClick={() => openEditModal(b)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--admin-border)',
                      background: 'transparent',
                      color: 'var(--admin-text-primary)',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--admin-bg-card-hover)';
                      e.currentTarget.style.borderColor = 'var(--admin-accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'var(--admin-border)';
                    }}
                  >
                    <Icon name="Edit" size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBlog(b.id)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: 'var(--admin-danger)',
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: 'var(--admin-bg-card)',
            border: '1px solid var(--admin-border)',
            borderRadius: '16px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--admin-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--admin-bg-primary)',
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--admin-text-primary)', margin: 0 }}>
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--admin-bg-card)',
                  color: 'var(--admin-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {error && (
                <div className="admin-error" style={{ marginBottom: '20px' }}>
                  <div className="admin-error-content">
                    <Icon name="AlertTriangle" size={16} />
                    <span className="admin-error-text">{error}</span>
                  </div>
                </div>
              )}
              {success && (
                <div className="admin-success-alert" style={{ marginBottom: '20px' }}>
                  <Icon name="CheckCircle2" size={16} />
                  {success}
                </div>
              )}

              {/* Form Fields */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--admin-text-primary)', marginBottom: '8px' }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter blog title"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid var(--admin-border)',
                      background: 'var(--admin-bg-primary)',
                      color: 'var(--admin-text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Slug */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--admin-text-primary)', marginBottom: '8px' }}>
                    Slug (URL-friendly) *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="enter-blog-slug"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid var(--admin-border)',
                      background: 'var(--admin-bg-primary)',
                      color: 'var(--admin-text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--admin-text-primary)', marginBottom: '8px' }}>
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief summary of the blog post"
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: '1px solid var(--admin-border)',
                      background: 'var(--admin-bg-primary)',
                      color: 'var(--admin-text-primary)',
                      fontSize: '14px',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--admin-text-primary)', marginBottom: '8px' }}>
                    Blog Image
                  </label>
                  <div style={{
                    border: '2px dashed var(--admin-border)',
                    borderRadius: '10px',
                    padding: '16px',
                    textAlign: 'center',
                  }}>
                    {imagePreview ? (
                      <div>
                        <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <label style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: 'var(--admin-bg-card-hover)',
                            color: 'var(--admin-text-primary)',
                            fontSize: '13px',
                            cursor: 'pointer',
                          }}>
                            Change Image
                            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} style={{ display: 'none' }} />
                          </label>
                          <button
                            type="button"
                            onClick={() => { setImagePreview(''); setFormData(prev => ({ ...prev, image_url: '' })); }}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: 'var(--admin-danger)',
                              fontSize: '13px',
                              cursor: 'pointer',
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label style={{ cursor: 'pointer', display: 'block', padding: '20px' }}>
                        <Icon name="Image" size={32} style={{ color: 'var(--admin-text-muted)', marginBottom: '8px' }} />
                        <p style={{ fontSize: '14px', color: 'var(--admin-text-primary)', margin: '0 0 4px' }}>Click to upload image</p>
                        <p style={{ fontSize: '12px', color: 'var(--admin-text-muted)', margin: 0 }}>PNG, JPG, GIF up to 10MB</p>
                        <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} style={{ display: 'none' }} />
                      </label>
                    )}
                  </div>
                </div>

                {/* Content - Rich Text Editor */}
                <div>
                  <RichTextEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write your blog post content here..."
                    selectedLayout={formData.layout}
                    onLayoutChange={handleLayoutChange}
                  />
                </div>

                {/* Published Checkbox */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  background: 'var(--admin-bg-primary)',
                  borderRadius: '10px',
                }}>
                  <input
                    type="checkbox"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label style={{ fontSize: '14px', color: 'var(--admin-text-primary)', cursor: 'pointer' }}>
                    Publish this blog post
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--admin-border)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              background: 'var(--admin-bg-primary)',
            }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--admin-border)',
                  background: 'transparent',
                  color: 'var(--admin-text-primary)',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveBlog}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, var(--admin-accent) 0%, var(--admin-purple) 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Icon name="Save" size={16} />
                {editingBlog ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Blogs;
