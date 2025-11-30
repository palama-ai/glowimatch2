import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const API_BASE = import.meta.env?.VITE_BACKEND_URL || 'http://localhost:4000/api';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    published: true
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

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image_url: '',
      published: true
    });
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
      published: b.published === 1 || b.published === true
    });
    setImagePreview(b.image_url || '');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
        setFormData(prev => ({
          ...prev,
          image_url: base64Image
        }));
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
      const payload = { 
        ...formData, 
        published: formData.published ? 1 : 0 
      };
      console.log('[Blogs Admin] Saving blog with payload:', payload);
      
      const url = editingBlog ? `${API_BASE}/admin/blogs/${editingBlog.id}` : `${API_BASE}/admin/blogs`;
      const method = editingBlog ? 'PUT' : 'POST';
      const response = await fetch(url, { 
        method, 
        headers, 
        body: JSON.stringify(payload) 
      });

      if (!response.ok) throw new Error('Failed to save blog');
      
      const result = await response.json();
      console.log('[Blogs Admin] Save result:', result);
      
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
      console.log('[Blogs Admin] Deleting blog:', id);
      const response = await fetch(`${API_BASE}/admin/blogs/${id}`, { method: 'DELETE', headers });
      
      if (!response.ok) throw new Error('Failed to delete blog');
      
      // Update UI immediately
      setBlogs(prevBlogs => prevBlogs.filter(b => b.id !== id));
      setSuccess('Blog deleted successfully');
      
      console.log('[Blogs Admin] Blog deleted successfully');
      
      // Refresh from server after a short delay to ensure consistency
      setTimeout(() => {
        fetchBlogs();
      }, 500);
    } catch (err) {
      console.error('[Blogs Admin] Delete error:', err);
      setError('Failed to delete blog');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-6xl mx-auto px-5 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Manage Blogs</h1>
            <p className="text-muted-foreground">Create, edit, and manage your blog posts</p>
          </div>
          <Button onClick={openCreateModal} className="bg-gradient-to-r from-pink-500 to-rose-500">
            <Icon name="Plus" size={18} className="mr-2" />
            Create Blog
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Icon name="Loader2" size={32} className="animate-spin text-accent" />
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <Icon name="FileText" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No blogs yet. Create your first blog post!</p>
            <Button onClick={openCreateModal} variant="outline">Create Blog</Button>
          </div>
        ) : (
          <div className="grid gap-4">
            {blogs.map(b => (
              <div key={b.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-accent/50 transition-colors">
                <div className="flex items-start gap-6 p-6">
                  {b.image_url && (
                    <div className="flex-shrink-0">
                      <img src={b.image_url} alt={b.title} className="w-32 h-32 object-cover rounded-lg" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">{b.title}</h3>
                      {b.published ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Published</span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Draft</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      <code className="bg-muted px-2 py-1 rounded">{b.slug}</code>
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditModal(b)}
                      className="flex items-center gap-2"
                    >
                      <Icon name="Edit" size={16} />
                      Edit
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => deleteBlog(b.id)}
                      className="flex items-center gap-2 text-destructive hover:bg-destructive/10"
                    >
                      <Icon name="Trash2" size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border/50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-accent/10 to-pink-500/10 border-b border-border/50 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <Icon name="X" size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg flex items-start gap-3">
                  <Icon name="AlertTriangle" size={18} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3">
                  <Icon name="CheckCircle2" size={18} className="flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter blog title"
                  className="w-full"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Slug (URL-friendly) *</label>
                <Input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="enter-blog-slug"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">e.g., simple-skincare-routine</p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Excerpt</label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief summary of the blog post"
                  rows="3"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-accent resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Blog Image</label>
                <div className="border-2 border-dashed border-border rounded-lg p-4 transition-colors hover:border-accent/50">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer">
                          <div className="bg-accent/10 hover:bg-accent/20 text-accent py-2 px-3 rounded-lg text-center text-sm font-medium transition-colors">
                            <Icon name="Upload" size={16} className="inline mr-1" />
                            Change Image
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setFormData(prev => ({ ...prev, image_url: '' }));
                          }}
                          className="flex-1 bg-destructive/10 hover:bg-destructive/20 text-destructive py-2 px-3 rounded-lg text-center text-sm font-medium transition-colors"
                        >
                          <Icon name="Trash2" size={16} className="inline mr-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <div className="text-center py-6">
                        <Icon name="Image" size={32} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm font-medium text-foreground mb-1">Click to upload image</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {uploadingImage && (
                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    Processing image...
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Write your blog post content here..."
                  rows="10"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:border-accent resize-none font-mono text-sm"
                />
              </div>

              {/* Published */}
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-border cursor-pointer"
                />
                <label className="text-sm font-medium text-foreground cursor-pointer flex-1">
                  Publish this blog post
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-border/50 px-6 py-4 flex items-center justify-end gap-3 bg-muted/10">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={saveBlog}
                className="bg-gradient-to-r from-pink-500 to-rose-500"
              >
                <Icon name="Save" size={18} className="mr-2" />
                {editingBlog ? 'Update Blog' : 'Create Blog'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
