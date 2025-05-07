import { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheck, FaWhatsapp } from 'react-icons/fa';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Navbar from "../component/MainPages/Navbar"
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contactMethod, setContactMethod] = useState('email'); // 'email' or 'whatsapp'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (contactMethod === 'whatsapp') {
      // Send via WhatsApp
      const whatsappMessage = `New Contact Inquiry\n\n` +
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Subject: ${formData.subject}\n` +
        `Message: ${formData.message}`;
  
      const encodedMessage = encodeURIComponent(whatsappMessage);
      window.open(`https://wa.me/919925001226?text=${encodedMessage}`, '_blank');
      
      toast.success('Opening WhatsApp to send your message');
    } else {
      // Open Gmail compose window with pre-filled data
      const emailSubject = encodeURIComponent(formData.subject);
      const emailBody = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Message:\n${formData.message}`
      );
      
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=recipient@example.com&su=${emailSubject}&body=${emailBody}`, '_blank');
      
      toast.success('Opening Gmail to send your message');
    }
    
    
    setIsSubmitting(false);
  

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    setIsSubmitting(false);
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <ToastContainer position="top-center" autoClose={3000} />
      <Navbar/>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://assets.website-files.com/5e6c01bb5212506d6c119069/5e6c01bb8abd7761fef3a6e0_pattern-white.svg')] bg-repeat"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto animate-fade-in delay-100">
            We'd love to hear from you! Contact us for inquiries, support, or just to say hello.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-2xl p-8 lg:p-10 transform transition-all hover:shadow-2xl">
            <div className="flex mb-6">
              <button
                onClick={() => setContactMethod('email')}
                className={`px-4 py-2 rounded-l-lg font-medium ${contactMethod === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <FaEnvelope className="inline mr-2" />
                Email
              </button>
              <button
                onClick={() => setContactMethod('whatsapp')}
                className={`px-4 py-2 rounded-r-lg font-medium ${contactMethod === 'whatsapp' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <FaWhatsapp className="inline mr-2" />
                WhatsApp
              </button>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {contactMethod === 'email' ? 'Send Us a Message' : 'Chat on WhatsApp'}
            </h2>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <FaCheck className="text-green-600 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                <p className="text-gray-600 mb-6">
                  Your message has been sent successfully. We'll get back to you soon.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your Name *"
                      required
                    />
                  </div>
                  
                  <div>
                    <input
                      type={contactMethod === 'whatsapp' ? 'tel' : 'email'}
                      id={contactMethod === 'whatsapp' ? 'phone' : 'email'}
                      name={contactMethod === 'whatsapp' ? 'phone' : 'email'}
                      value={contactMethod === 'whatsapp' ? formData.phone : formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={contactMethod === 'whatsapp' ? 'WhatsApp Number *' : 'Email Address *'}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Subject *"
                    required
                  />
                </div>
                
                <div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Message *"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 ${
                    contactMethod === 'whatsapp' 
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  } text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-all ${isSubmitting ? 'opacity-80 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {contactMethod === 'whatsapp' ? 'Opening...' : 'Sending...'}
                    </>
                  ) : (
                    <>
                      {contactMethod === 'whatsapp' ? (
                        <>
                          <FaWhatsapp className="text-lg" />
                          <span>Send via WhatsApp</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="text-lg" />
                          <span>Send Message</span>
                        </>
                      )}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
          
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FaPhoneAlt className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Call Us</h3>
                <p className="text-gray-600 mb-1">
                  <a href="tel:+919925001226" className="hover:text-blue-600 transition-colors">
                    +91 99250-01226
                  </a>
                </p>
                <p className="text-gray-600">
                  <a href="tel:+919925001226" className="hover:text-blue-600 transition-colors">
                    +91 70163-20063
                  </a>
                </p>
                <p className="text-gray-600">
                  <a href="tel:+919925001226" className="hover:text-blue-600 transition-colors">
                    +91 82001-22701
                  </a>
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FaEnvelope className="text-green-600 text-xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-1">
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=dmproperties@gmail.com&su=General Inquiry&body=Hello DMH Team," className="hover:text-blue-600 transition-colors">
                    dmproperties@gmail.com
                  </a>
                </p>
              </div>
            </div>
            
            {/* Office Location */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FaMapMarkerAlt className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Our Office</h3>
              <address className="text-gray-600 not-italic mb-4">
                B/302, Sun South Street,<br />
                South Bopal, Bopal,<br />
                Ahmedabad, Gujarat 380058
              </address>
              <a 
                href="https://maps.app.goo.gl/m4mPE7jMbh9fi7Sz6" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <FaLocationDot className="mr-2" />
                View on Google Maps
              </a>
            </div>
            
            {/* Business Hours */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <FiClock className="text-yellow-600 text-xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Business Hours</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 3:00 PM</span>
                </li>
              </ul>
            </div>
            
            {/* Social Media */}
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com/dmhproperties" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <FaFacebook className="text-xl" />
                </a>
                <a 
                  href="https://instagram.com/dmhproperties" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-colors"
                >
                  <FaInstagram className="text-xl" />
                </a>
                <a 
                  href="https://linkedin.com/company/dmhproperties" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 hover:bg-blue-700 hover:text-white transition-colors"
                >
                  <FaLinkedin className="text-xl" />
                </a>
                <a 
                  href="https://twitter.com/dmhproperties" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-400 hover:bg-blue-400 hover:text-white transition-colors"
                >
                  <FaTwitter className="text-xl" />
                </a>
                <a 
                  href="https://youtube.com/dmhproperties" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                >
                  <FaYoutube className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
   <div className="w-full h-96 bg-gray-200 relative rounded-lg overflow-hidden shadow-xl">
 <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.2977302196555!2d72.47017819999999!3d23.012838000000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e9b7b562c2f8b%3A0x8030d632835a5a6!2sDMH%20Properties!5e0!3m2!1sen!2sin!4v1746618611237!5m2!1sen!2sin" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
    width="100%"
    height="100%"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    title="DMH Properties Location"
  ></iframe>

  <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md flex items-center">
    <div className="text-red-500 mr-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <div>
      <p className="font-bold text-gray-800">DMH Properties</p>
      <p className="text-sm text-gray-600">B/302, Sun South Street</p>
    </div>
  </div>

  <div className="absolute bottom-4 right-4 mr-10 flex space-x-2">
    <a
      href="https://maps.app.goo.gl/m4mPE7jMbh9fi7Sz6"
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white p-3 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
      title="Get Directions"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </a>
    <button
      onClick={() => window.open('https://maps.app.goo.gl/m4mPE7jMbh9fi7Sz6')}
      className="bg-white p-3 rounded-full shadow-lg hover:bg-blue-50 transition-colors"
      title="Open in Google Maps"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 text-blue-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  </div>
</div>
      
      {/* Footer CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
            <p className="text-xl mb-8">
              Our team is here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="tel:+919925001226" 
                target="_blank" 
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <FaPhoneAlt />
                <span>Call Now</span>
              </a>
              <a 
                href="https://wa.me/919925001226" 
                target="_blank" 
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
              >
                <FaWhatsapp />
                <span>Chat on WhatsApp</span>
              </a>
              <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=dmproperties@gmail.com&su=General Inquiry&body=Hello DMH Team," 
                target="_blank" 
                className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
              >
                <FaEnvelope />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
