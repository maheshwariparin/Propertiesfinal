import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from "../component/MainPages/Navbar"
import { FiCalendar, FiUser, FiTag, FiArrowLeft } from 'react-icons/fi';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BlogPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        // Fetch the main blog post
        const { data, error } = await supabase
          .from('blogdmh')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Blog not found');

        setBlog(data);

        // Fetch related blogs (by tags)
        if (data.tags && data.tags.length > 0) {
          const { data: relatedData } = await supabase
            .from('blogdmh')
            .select('id, title, slug, featured_image_url, created_at')
            .contains('tags', data.tags)
            .neq('id', data.id)
            .limit(3);

          setRelatedBlogs(relatedData || []);
        }
      } catch (error) {
        toast.error('Failed to load blog: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse h-8 w-3/4 bg-gray-200 rounded mx-auto mb-6"></div>
            <div className="animate-pulse h-4 w-1/2 bg-gray-200 rounded mx-auto mb-12"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-4 w-full bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      
      {/* Blog Header */}
      <div className="relative bg-gray-900">
        {blog.featured_image_url && (
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <img 
              src={blog.featured_image_url} 
              alt="" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            {blog.title}
          </h1>
          <div className="mt-6 max-w-3xl mx-auto flex flex-wrap justify-center gap-4 text-lg text-gray-300">
            <div className="flex items-center">
              <FiUser className="mr-2" />
              <span>{blog.author || 'Admin'}</span>
            </div>
            <div className="flex items-center">
              <FiCalendar className="mr-2" />
              <span>{formatDate(blog.published_at || blog.created_at)}</span>
            </div>
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex items-center">
                <FiTag className="mr-2" />
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <article className="prose prose-indigo prose-lg mx-auto">
          <div 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(marked.parse(blog.content || '')) 
            }} 
          />
        </article>
      </div>

      {/* Related Blogs */}
      {relatedBlogs.length > 0 && (
        <div className="bg-gray-100 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedBlogs.map(blog => (
                <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {blog.featured_image_url && (
                    <img 
                      src={blog.featured_image_url} 
                      alt={blog.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      {formatDate(blog.created_at)}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      <a href={`/blog/${blog.slug}`} className="hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </a>
                    </h3>
                    <a 
                      href={`/blog/${blog.slug}`}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      Read more
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;