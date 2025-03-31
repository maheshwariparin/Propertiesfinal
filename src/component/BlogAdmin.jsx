import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FiEdit, FiTrash2, FiUpload, FiSave, 
  FiPlus, FiImage, FiLink, FiTag,
  FiEye, FiCalendar, FiUser, FiMenu, FiHome
} from 'react-icons/fi';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { MdAdminPanelSettings } from "react-icons/md";
import Loader from "./Loader";

const BlogAdmin = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const navigate = useNavigate();

  // Form state with all necessary fields
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    meta_description: '',
    content: '',
    author: '',
    featured_image_url: '',
    is_published: false,
    tags: '',
    seo_keywords: '',
    category: '',
    reading_time: '',
    canonical_url: ''
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    title: false,
    slug: false,
    meta_description: false,
    content: false
  });

  // Fetch all blogs
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blogdmh')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data);
    } catch (error) {
      toast.error('Failed to fetch blogs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  // Generate slug from title
  const generateSlug = (title) => {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 60);
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {
      title: !formData.title,
      slug: !formData.slug,
      meta_description: !formData.meta_description,
      content: !formData.content
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      // First ensure we have a valid slug
      const slug = formData.slug || generateSlug(formData.title);
      if (!slug) {
        throw new Error('Cannot upload image without a title or slug');
      }

      // For new blogs, create a temporary entry with required fields
      let blogId = currentBlog?.id;
      
      if (!blogId) {
        const { data, error } = await supabase
          .from('blogdmh')
          .insert([{ 
            title: formData.title || 'Untitled Blog',
            slug: slug,
            content: 'Temporary content',
            meta_description: 'Temporary description'
          }])
          .select()
          .single();

        if (error) throw error;
        blogId = data.id;
        setCurrentBlog(data);
      }

      // Upload to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${blogId}/${Date.now()}.${fileExt}`;
      const filePath = `blogimagedmh/${fileName}`;

      const { error: uploadError } = await supabase
        .storage
        .from('blogimagedmh')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('blogimagedmh')
        .getPublicUrl(filePath);

      // Update form with image URL
      setFormData(prev => ({ ...prev, featured_image_url: publicUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Image upload failed: ' + error.message);
    } finally {
      setImageUploading(false);
    }
  };

  // Calculate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // Save blog
  const saveBlog = async () => {
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Generate slug if empty (with validation)
      const slug = formData.slug || generateSlug(formData.title);
      if (!slug) {
        throw new Error('Could not generate a valid slug from the title');
      }

      // Prepare tags and keywords
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
      const seo_keywords = formData.seo_keywords ? formData.seo_keywords.split(',').map(kw => kw.trim()) : [];

      const blogData = {
        ...formData,
        slug,
        tags,
        seo_keywords,
        updated_at: new Date().toISOString(),
        reading_time: calculateReadingTime(formData.content)
      };

      if (formData.is_published && !blogData.published_at) {
        blogData.published_at = new Date().toISOString();
      }

      let result;
      if (currentBlog) {
        // Update existing blog
        const { data, error } = await supabase
          .from('blogdmh')
          .update(blogData)
          .eq('id', currentBlog.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
        toast.success('Blog updated successfully!');
      } else {
        // Create new blog
        const { data, error } = await supabase
          .from('blogdmh')
          .insert([blogData])
          .select()
          .single();

        if (error) throw error;
        result = data;
        toast.success('Blog created successfully!');
      }

      // Refresh list
      fetchBlogs();
      resetForm();
      setIsEditing(false);
      setCurrentBlog(null);
    } catch (error) {
      toast.error('Error saving blog: ' + error.message);
    }
  };

  // Edit blog
  const editBlog = (blog) => {
    setCurrentBlog(blog);
    setIsEditing(true);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      meta_description: blog.meta_description,
      content: blog.content,
      author: blog.author,
      featured_image_url: blog.featured_image_url,
      is_published: blog.is_published,
      tags: blog.tags?.join(', ') || '',
      seo_keywords: blog.seo_keywords?.join(', ') || '',
      category: blog.category || '',
      reading_time: blog.reading_time || '',
      canonical_url: blog.canonical_url || ''
    });
  };

  // Delete blog
  const deleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      // First delete images from storage
      const { data: images, error: listError } = await supabase
        .storage
        .from('blogimagedmh')
        .list(`${id}/`);

      if (listError) throw listError;

      if (images.length > 0) {
        const filesToRemove = images.map(img => `${id}/${img.name}`);
        const { error: deleteError } = await supabase
          .storage
          .from('blogimagedmh')
          .remove(filesToRemove);

        if (deleteError) throw deleteError;
      }

      // Then delete the blog
      const { error } = await supabase
        .from('blogdmh')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Blog deleted successfully!');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog: ' + error.message);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      meta_description: '',
      content: '',
      author: '',
      featured_image_url: '',
      is_published: false,
      tags: '',
      seo_keywords: '',
      category: '',
      reading_time: '',
      canonical_url: ''
    });
    setFormErrors({
      title: false,
      slug: false,
      meta_description: false,
      content: false
    });
  };

  // Toggle publish status
  const togglePublish = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('blogdmh')
        .update({ 
          is_published: !currentStatus,
          published_at: !currentStatus ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Blog ${!currentStatus ? 'published' : 'unpublished'} successfully!`);
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to update status: ' + error.message);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Vertical Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen ? (
            <h1 className="text-xl font-bold">Blog Admin</h1>
          ) : (
            <FiMenu className="text-xl" />
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>
        
        <nav className="mt-4">
          <ul>
            <li>
              <button 
                onClick={() => {
                  setIsEditing(true);
                  setCurrentBlog(null);
                  resetForm();
                }}
                className="flex items-center w-full p-3 hover:bg-gray-700 transition-colors"
              >
                <FiPlus className="mr-3" />
                {sidebarOpen && 'New Blog'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setIsEditing(false);
                  setCurrentBlog(null);
                }}
                className="flex items-center w-full p-3 hover:bg-gray-700 transition-colors"
              >
                <FiEye className="mr-3" />
                {sidebarOpen && 'View All Blogs'}
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate("/admin")}
                className="flex items-center w-full p-3 hover:bg-gray-700 transition-colors"
              >
                <MdAdminPanelSettings className="mr-3" />
                {sidebarOpen && 'Admin'}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Horizontal Navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-3 flex justify-between items-center border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              {isEditing ? (currentBlog ? 'Edit Blog' : 'Create New Blog') : 'Blog Management'}
            </h2>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                <FiHome className="text-xl" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {isEditing ? (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Form Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button
                      className={`px-4 py-3 font-medium ${!previewMode ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                      onClick={() => setPreviewMode(false)}
                    >
                      Editor
                    </button>
                    <button
                      className={`px-4 py-3 font-medium ${previewMode ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                      onClick={() => setPreviewMode(true)}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                {/* Blog Form */}
                <div className="p-6">
                  {previewMode ? (
                    <div className="prose max-w-none">
                      <h1>{formData.title}</h1>
                      {formData.featured_image_url && (
                        <img 
                          src={formData.featured_image_url} 
                          alt="Featured" 
                          className="w-full h-auto rounded-lg mb-6"
                        />
                      )}
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked.parse(formData.content || '')) }} />
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${formErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            placeholder="Blog post title"
                          />
                          {formErrors.title && <p className="mt-1 text-sm text-red-600">Title is required</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Slug*</label>
                          <div className="flex">
                            <input
                              type="text"
                              name="slug"
                              value={formData.slug}
                              onChange={handleInputChange}
                              className={`w-full px-3 py-2 border ${formErrors.slug ? 'border-red-500' : 'border-gray-300'} rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                              placeholder="URL-friendly slug"
                            />
                            <button
                              onClick={() => {
                                if (!formData.title) {
                                  toast.error('Please enter a title first');
                                  return;
                                }
                                setFormData(prev => ({ ...prev, slug: generateSlug(formData.title) }));
                              }}
                              className="px-3 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 transition-colors"
                            >
                              Generate
                            </button>
                          </div>
                          {formErrors.slug && <p className="mt-1 text-sm text-red-600">Slug is required</p>}
                        </div>
                      </div>

                      {/* Meta Description */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description*</label>
                        <textarea
                          name="meta_description"
                          value={formData.meta_description}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${formErrors.meta_description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          rows="3"
                          placeholder="Brief description for SEO (160 characters max)"
                          maxLength="160"
                        />
                        {formErrors.meta_description && <p className="mt-1 text-sm text-red-600">Meta description is required</p>}
                        <small className="text-gray-500">{formData.meta_description.length}/160 characters</small>
                      </div>

                      {/* Featured Image */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                        <div className="flex items-center">
                          {formData.featured_image_url ? (
                            <>
                              <img 
                                src={formData.featured_image_url} 
                                alt="Featured" 
                                className="w-32 h-32 object-cover rounded-md mr-4"
                              />
                              <button
                                onClick={() => setFormData(prev => ({ ...prev, featured_image_url: '' }))}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FiTrash2 className="inline mr-1" /> Remove
                              </button>
                            </>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center w-full">
                              <label className="cursor-pointer">
                                <FiUpload className="mx-auto text-gray-400 text-2xl" />
                                <p className="mt-1 text-sm text-gray-600">Click to upload image</p>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  onChange={handleImageUpload} 
                                  accept="image/*"
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        {imageUploading && <p className="mt-2 text-sm text-blue-600">Uploading image...</p>}
                      </div>

                      {/* Content */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content*</label>
                        <textarea
                          name="content"
                          value={formData.content}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border ${formErrors.content ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          rows="10"
                          placeholder="Write your blog content here (Markdown supported)"
                        />
                        {formErrors.content && <p className="mt-1 text-sm text-red-600">Content is required</p>}
                      </div>

                      {/* Additional Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                          <input
                            type="text"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Author name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select a category</option>
                            <option value="Technology">Technology</option>
                            <option value="Business">Business</option>
                            <option value="Health">Health</option>
                            <option value="Lifestyle">Lifestyle</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                          <input
                            type="text"
                            name="tags"
                            value={formData.tags}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="comma,separated,tags"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords</label>
                          <input
                            type="text"
                            name="seo_keywords"
                            value={formData.seo_keywords}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="keyword1,keyword2,keyword3"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reading Time (minutes)</label>
                          <input
                            type="number"
                            name="reading_time"
                            value={formData.reading_time}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Estimated reading time"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
                          <input
                            type="url"
                            name="canonical_url"
                            value={formData.canonical_url}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/original-post"
                          />
                        </div>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="is_published"
                            id="is_published"
                            checked={formData.is_published}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
                            Publish this post
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setCurrentBlog(null);
                            resetForm();
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveBlog}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <FiSave className="mr-2" />
                          {currentBlog ? 'Update Blog' : 'Save Blog'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    All Blog Posts
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Author
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loading ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center">
                            <Loader />
                          </td>
                        </tr>
                      ) : blogs.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No blogs found. Create your first blog!
                          </td>
                        </tr>
                      ) : (
                        blogs.map((blog) => (
                          <tr key={blog.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {blog.featured_image_url && (
                                  <div className="flex-shrink-0 h-10 w-10 mr-3">
                                    <img className="h-10 w-10 rounded-md object-cover" src={blog.featured_image_url} alt="" />
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                                  <div className="text-sm text-gray-500">{blog.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {blog.author || 'N/A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span 
                                onClick={() => togglePublish(blog.id, blog.is_published)}
                                className={`px-2 py-1 text-xs font-medium rounded-full cursor-pointer ${blog.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                              >
                                {blog.is_published ? 'Published' : 'Draft'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(blog.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => editBlog(blog)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                <FiEdit className="inline mr-1" /> Edit
                              </button>
                              <button
                                onClick={() => deleteBlog(blog.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <FiTrash2 className="inline mr-1" /> Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BlogAdmin;