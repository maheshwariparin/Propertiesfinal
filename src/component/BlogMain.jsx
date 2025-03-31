// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { supabase } from '../supabaseClient';
// import Navbar from '../component/MainPages/Navbar';
// import { FiCalendar, FiUser, FiClock, FiSearch } from 'react-icons/fi';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {  
//     FaPhone,
//     FaEnvelope,
//     FaKey,
//   } from "react-icons/fa";
//   import { FaFacebook, FaInstagram } from "react-icons/fa";
//   import { 
//     FaMapMarkerAlt, 
//   } from 'react-icons/fa';
//   import { FaHome, FaBuilding } from 'react-icons/fa';
// import { FaLocationDot } from "react-icons/fa6";
// import logo from "../assets/dmhlogo.svg";
// const BlogMainPage = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredBlogs, setFilteredBlogs] = useState([]);

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from('blogdmh')
//           .select('*')
//           .order('created_at', { ascending: false });

//         if (error) throw error;
//         setBlogs(data);
//         setFilteredBlogs(data);
//       } catch (error) {
//         toast.error('Failed to load blogs: ' + error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, []);

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredBlogs(blogs);
//     } else {
//       const filtered = blogs.filter(blog => 
//         blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (blog.meta_description && blog.meta_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
//       );
//       setFilteredBlogs(filtered);
//     }
//   }, [searchQuery, blogs]);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const estimateReadTime = (content) => {
//     const wordsPerMinute = 200;
//     const wordCount = content.split(/\s+/).length;
//     return Math.ceil(wordCount / wordsPerMinute);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <Navbar />
      
//       {/* Hero Section */}
//       <div className="bg-blue-500 text-white py-5 sm:py-24">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
//             DMH Blog
//           </h1>
//           <p className="mt-6 max-w-3xl mx-auto text-xl">
//             Insights, stories, and expert advice on real estate and property management
//           </p>
          
//           {/* Search Bar */}
//           <div className="mt-8 max-w-md mx-auto">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <FiSearch className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search blogs..."
//                 className="block w-full pl-10 pr-3 py-3  border border-white rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Blog List */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {loading ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[...Array(6)].map((_, i) => (
//               <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="animate-pulse h-48 bg-gray-200"></div>
//                 <div className="p-6">
//                   <div className="animate-pulse h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
//                   <div className="animate-pulse h-4 w-full bg-gray-200 rounded mb-2"></div>
//                   <div className="animate-pulse h-4 w-5/6 bg-gray-200 rounded mb-6"></div>
//                   <div className="animate-pulse h-4 w-1/2 bg-gray-200 rounded"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : filteredBlogs.length === 0 ? (
//           <div className="text-center py-12">
//             <h3 className="text-xl font-medium text-gray-900 mb-2">
//               {searchQuery ? 'No matching blogs found' : 'No blogs published yet'}
//             </h3>
//             <p className="text-gray-500">
//               {searchQuery ? 'Try a different search term' : 'Check back later for new content'}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {filteredBlogs.map(blog => (
//               <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
//                 <Link to={`/blog/${blog.slug}`}>
//                   {blog.featured_image_url && (
//                     <img 
//                       src={blog.featured_image_url} 
//                       alt={blog.title}
//                       className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
//                     />
//                   )}
//                   <div className="p-6">
//                     <div className="flex items-center text-sm text-gray-500 mb-3">
//                       <span className="flex items-center mr-4">
//                         <FiUser className="mr-1" /> {blog.author || 'Admin'}
//                       </span>
//                       <span className="flex items-center">
//                         <FiCalendar className="mr-1" /> {formatDate(blog.published_at || blog.created_at)}
//                       </span>
//                     </div>
//                     <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
//                       {blog.title}
//                     </h2>
//                     <p className="text-gray-600 mb-4 line-clamp-2">
//                       {blog.meta_description}
//                     </p>
//                     <div className="flex justify-between items-center">
//                       <div className="flex items-center text-sm text-gray-500">
//                         <FiClock className="mr-1" />
//                         {estimateReadTime(blog.content)} min read
//                       </div>
//                       {blog.tags && blog.tags.length > 0 && (
//                         <div className="flex flex-wrap gap-1">
//                           {blog.tags.slice(0, 2).map(tag => (
//                             <span key={tag} className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
//                               {tag}
//                             </span>
//                           ))}
//                           {blog.tags.length > 2 && (
//                             <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
//                               +{blog.tags.length - 2}
//                             </span>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         )}



//       </div>

      
// <div className='w-full bg-gradient-to-b from-blue-50 to-white mt-5'>
//     <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
//         <div className="container mx-auto px-4 lg:px-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//                 {/* Contact Card */}
//                 <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] duration-300">
//                     <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
//                         Contact Us
//                     </h3>
//                     <div className="space-y-3 text-gray-600">
//                         <div className="flex items-center">
//                             <FaPhone className="mr-2 text-blue-500" />
//                             <a href="tel:+919925001226" className="hover:text-blue-700">+91 9925001226</a>
//                         </div>
//                         <div className="flex items-center">
//                             <FaEnvelope className="mr-2 text-blue-500" />
//                             <a href="mailto:dmproperties@gmail.com" className="hover:text-blue-700">dmproperties@gmail.com</a>
//                         </div>
//                         <div className="flex items-start">
//                             <FaMapMarkerAlt className="mr-2 mt-1 text-blue-500" />
//                             <p>B/302, Sun South Street,<br/>South Bopal, Bopal,<br/>Ahmedabad, Gujarat 380058</p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Quick Links */}
//                 <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] duration-300">
//                     <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
//                         Quick Links
//                     </h3>
//                     <ul className="space-y-3 text-gray-600">
//                         <li>
//                             <Link to="/sellproperty" className="flex items-center hover:text-blue-700 group">
//                                 <FaHome className="mr-2 text-blue-500 group-hover:animate-bounce"/>
//                                 View Selling Property
//                             </Link>
//                         </li>
//                         <li>
//                             <Link to="/rent_leaseproperty" className="flex items-center hover:text-blue-700 group">
//                                 <FaKey className="mr-2 text-blue-500 group-hover:animate-bounce"/>
//                                 View Rent Property
//                             </Link>
//                         </li>
//                         <li>
//                             <Link to="/Pg" className="flex items-center hover:text-blue-700 group">
//                                 <FaBuilding className="mr-2 text-blue-500 group-hover:animate-bounce"/>
//                                 View Available PG
//                             </Link>
//                         </li>
//                     </ul>

//                     {/* Social Links */}
//                     <div className="flex justify-center space-x-6 mt-6">
//                         <a href="https://www.instagram.com/dmhproperties" 
//                            target="_blank" 
//                            rel="noopener noreferrer" 
//                            className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transform transition hover:scale-110 hover:bg-pink-50">
//                             <FaInstagram className="text-2xl text-pink-600"/>
//                         </a>
//                         <a href="https://www.facebook.com/dmhproperties" 
//                            target="_blank" 
//                            rel="noopener noreferrer" 
//                            className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transform transition hover:scale-110 hover:bg-blue-50">
//                             <FaFacebook className="text-2xl text-blue-600"/>
//                         </a>
//                         <a href="https://maps.app.goo.gl/m4mPE7jMbh9fi7Sz6" 
//                            target="_blank" 
//                            rel="noopener noreferrer" 
//                            className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transform transition hover:scale-110 hover:bg-red-50">
//                             <FaLocationDot className="text-2xl text-red-600"/>
//                         </a>
//                     </div>
//                 </div>

//                 {/* Logo Section */}
//                 <div className="flex flex-col items-center justify-center">
//                     <div className="w-40 h-40 transform hover:rotate-3 transition-transform duration-300">
//                         <img 
//                             src={logo} 
//                             alt="DMH Properties Logo" 
//                             className="w-full h-full object-contain rounded-lg shadow-lg"
//                         />
//                     </div>
//                     <div className="mt-4 flex space-x-3 font-bold text-gray-700">
//                         <span className="bg-blue-100 px-3 py-1 rounded-full">BUY</span>
//                         <span className="bg-green-100 px-3 py-1 rounded-full">SELL</span>
//                         <span className="bg-yellow-100 px-3 py-1 rounded-full">RENT</span>
//                         <span className="bg-purple-100 px-3 py-1 rounded-full">LEASE</span>
//                     </div>
//                 </div>
//             </div>

//             {/* Disclaimer */}
//             <div className="mt-8 pt-6 border-t border-gray-600">
//                 <p className="text-sm text-gray-400 leading-relaxed  mx-auto ">
//                 Disclaimer: DMH Properties is only an intermediary offering its platform to advertise properties of Seller for a Customer/Buyer/User coming on its Website and is not and cannot be a party to or privy to or control in any manner any transactions between the Seller and the Customer/Buyer/User. All the prices or rates on this Website have been extended by various Builder(s)/Developer(s) who have advertised their products. Company shall neither be responsible nor liable to mediate or resolve any disputes or disagreements between the Customer/Buyer/User and the Seller and both Seller and Customer/Buyer/User shall settle all such disputes without involving Company in any manner.
//                 </p>
//                 <div className="mt-4 text-center text-gray-500 text-sm">
//                     © {new Date().getFullYear()} DMH Properties. All rights reserved.
//                 </div>
//             </div>
//         </div>
//     </footer>
// </div>


//     </div>
//   );
// };

// export default BlogMainPage;
















import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import Navbar from '../component/MainPages/Navbar';
import { FiCalendar, FiUser, FiClock, FiSearch } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {  
  FaPhone,
  FaEnvelope,
  FaKey,
} from "react-icons/fa";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { 
  FaMapMarkerAlt, 
} from 'react-icons/fa';
import { FaHome, FaBuilding } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import logo from "../assets/dmhlogo.svg";

const BlogMainPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        // Fetch published blogs only
        const { data, error } = await supabase
          .from('blogdmh')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setBlogs(data);
        setFilteredBlogs(data);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(data.map(blog => blog.category).filter(Boolean))];
        setCategories(uniqueCategories);
        
        // Get popular posts (most viewed or most commented - adjust as needed)
        const popular = [...data]
          .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
          .slice(0, 3);
        setPopularPosts(popular);
        
      } catch (error) {
        toast.error('Failed to load blogs: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    let filtered = [...blogs];
    
    // Apply category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(blog => blog.category === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.meta_description && blog.meta_description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.content && blog.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      );
    }
    
    setFilteredBlogs(filtered);
  }, [searchQuery, selectedCategory, blogs]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const estimateReadTime = (content) => {
    if (!content) return 0;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            DMH Blog
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl">
            Insights, stories, and expert advice on real estate and property management
          </p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search blogs by title, content, or tags..."
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:border-white shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Blog List - 2/3 width */}
          <div className="lg:w-2/3">
            {/* Category Filter */}
            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Blog Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="animate-pulse h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="animate-pulse h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
                      <div className="animate-pulse h-4 w-full bg-gray-200 rounded mb-2"></div>
                      <div className="animate-pulse h-4 w-5/6 bg-gray-200 rounded mb-6"></div>
                      <div className="animate-pulse h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchQuery || selectedCategory !== 'All' 
                    ? 'No matching blogs found' 
                    : 'No blogs published yet'}
                </h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? 'Try a different search term' 
                    : selectedCategory !== 'All'
                      ? 'No blogs in this category yet'
                      : 'Check back later for new content'}
                </p>
                {(searchQuery || selectedCategory !== 'All') && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredBlogs.map(blog => (
                  <div key={blog.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <Link to={`/blog/${blog.slug}`} className="block">
                      {blog.featured_image_url && (
                        <img 
                          src={blog.featured_image_url} 
                          alt={blog.title}
                          className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
                          loading="lazy"
                        />
                      )}
                      <div className="p-6">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span className="flex items-center mr-4">
                            <FiUser className="mr-1" /> {blog.author || 'DMH Admin'}
                          </span>
                          <span className="flex items-center">
                            <FiCalendar className="mr-1" /> {formatDate(blog.published_at || blog.created_at)}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                          {blog.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {blog.meta_description || blog.content.substring(0, 150) + '...'}
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-gray-500">
                            <FiClock className="mr-1" />
                            {estimateReadTime(blog.content)} min read
                          </div>
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {blog.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                  {tag}
                                </span>
                              ))}
                              {blog.tags.length > 2 && (
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                                  +{blog.tags.length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="lg:w-1/3 space-y-8">
            {/* About Widget */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">About DMH Blog</h3>
              <p className="text-gray-600">
                Welcome to the DMH Properties blog where we share insights, tips, and news about real estate, property management, and living in our communities.
              </p>
            </div>

            {/* Popular Posts */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Popular Posts</h3>
              <div className="space-y-4">
                {popularPosts.map(post => (
                  <Link 
                    to={`/blog/${post.slug}`} 
                    key={post.id}
                    className="flex items-center gap-3 group"
                  >
                    {post.featured_image_url && (
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded"
                        loading="lazy"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(post.published_at || post.created_at)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Categories</h3>
              <div className="space-y-2">
                {categories.filter(cat => cat !== 'All').map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-800'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

          
          
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='w-full bg-gradient-to-b from-blue-50 to-white mt-5'>
        <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Contact Card */}
              <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] duration-300">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Contact Us
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center">
                    <FaPhone className="mr-2 text-blue-500" />
                    <a href="tel:+919925001226" className="hover:text-blue-700">+91 9925001226</a>
                  </div>
                  <div className="flex items-center">
                    <FaEnvelope className="mr-2 text-blue-500" />
                    <a href="mailto:dmproperties@gmail.com" className="hover:text-blue-700">dmproperties@gmail.com</a>
                  </div>
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mr-2 mt-1 text-blue-500" />
                    <p>B/302, Sun South Street,<br/>South Bopal, Bopal,<br/>Ahmedabad, Gujarat 380058</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white p-6 rounded-xl shadow-lg transform transition-all hover:scale-[1.02] duration-300">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Quick Links
                </h3>
                <ul className="space-y-3 text-gray-600">
                  <li>
                    <Link to="/sellproperty" className="flex items-center hover:text-blue-700 group">
                      <FaHome className="mr-2 text-blue-500 group-hover:animate-bounce"/>
                      View Selling Property
                    </Link>
                  </li>
                  <li>
                    <Link to="/rent_leaseproperty" className="flex items-center hover:text-blue-700 group">
                      <FaKey className="mr-2 text-blue-500 group-hover:animate-bounce"/>
                      View Rent Property
                    </Link>
                  </li>
                  <li>
                    <Link to="/Pg" className="flex items-center hover:text-blue-700 group">
                      <FaBuilding className="mr-2 text-blue-500 group-hover:animate-bounce"/>
                      View Available PG
                    </Link>
                  </li>
                </ul>

                {/* Social Links */}
                <div className="flex justify-center space-x-6 mt-6">
                  <a href="https://www.instagram.com/dmhproperties" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transform transition hover:scale-110 hover:bg-pink-50">
                      <FaInstagram className="text-2xl text-pink-600"/>
                  </a>
                  <a href="https://www.facebook.com/dmhproperties" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transform transition hover:scale-110 hover:bg-blue-50">
                      <FaFacebook className="text-2xl text-blue-600"/>
                  </a>
                  <a href="https://maps.app.goo.gl/m4mPE7jMbh9fi7Sz6" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transform transition hover:scale-110 hover:bg-red-50">
                      <FaLocationDot className="text-2xl text-red-600"/>
                  </a>
                </div>
              </div>

              {/* Logo Section */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-40 h-40 transform hover:rotate-3 transition-transform duration-300">
                  <img 
                      src={logo} 
                      alt="DMH Properties Logo" 
                      className="w-full h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
                <div className="mt-4 flex space-x-3 font-bold text-gray-700">
                  <span className="bg-blue-100 px-3 py-1 rounded-full">BUY</span>
                  <span className="bg-green-100 px-3 py-1 rounded-full">SELL</span>
                  <span className="bg-yellow-100 px-3 py-1 rounded-full">RENT</span>
                  <span className="bg-purple-100 px-3 py-1 rounded-full">LEASE</span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 pt-6 border-t border-gray-600">
              <p className="text-sm text-gray-400 leading-relaxed mx-auto">
              Disclaimer: DMH Properties is only an intermediary offering its platform to advertise properties of Seller for a Customer/Buyer/User coming on its Website and is not and cannot be a party to or privy to or control in any manner any transactions between the Seller and the Customer/Buyer/User. All the prices or rates on this Website have been extended by various Builder(s)/Developer(s) who have advertised their products. Company shall neither be responsible nor liable to mediate or resolve any disputes or disagreements between the Customer/Buyer/User and the Seller and both Seller and Customer/Buyer/User shall settle all such disputes without involving Company in any manner.
              </p>
              <div className="mt-4 text-center text-gray-500 text-sm">
                  © {new Date().getFullYear()} DMH Properties. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default BlogMainPage;