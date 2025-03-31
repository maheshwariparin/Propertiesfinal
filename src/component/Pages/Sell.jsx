import { useState, useEffect, useMemo } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { supabase } from '../../supabaseClient';
import logo from "../../assets/dmhlogo.svg";
import { FaPhoneAlt, FaBars, FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import { FaLocationDot } from "react-icons/fa6";
import Loader from "../Loader";
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../../Redux/propertySlice";
import { 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRulerCombined,
  FaTag, 
  FaEye, 
  FaRupeeSign,
  FaHome,
  FaBuilding,
  FaSearch,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Navbar from "../MainPages/Navbar"
import {  
    FaPhone,
    FaEnvelope,
    FaKey,
  } from "react-icons/fa";
const Sell = () => {
  const dispatch = useDispatch();
  const { properties, loading, error, localities } = useSelector((state) => state.properties);
  const [images, setImages] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const phoneNumber = "9925001226";
  
  // Filter only sell properties
  const sellProperties = useMemo(() => {
    return properties.filter(property => property.listing_type === "sell");
  }, [properties]);

  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocality, setSelectedLocality] = useState('');
  const [sellRange, setSellRange] = useState([0, 100000000]);
  const [propertyCategory, setPropertyCategory] = useState('');
  const [selectedBHK, setSelectedBHK] = useState([]);

  const handleWhatsAppMessage = (property) => {
    const message = `Hello, I'm interested in the property at ${property.location?.society || "Unnamed Property"}, ${property.location?.city}, ${property.location?.locality}. 
    It is a ${property.property_category}, ${property.property_type} with ${property.bedrooms || 0} BHK and ${property.bathrooms || 0} Baths.
    Price: ₹${formatPrice(property.expected_price)}
    Area: ${property.carpet_area} ${property.area_unit}.
    
    Can you please provide me with more details?`;
  
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
  };

  const handleContactUS = () => {
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  const capitalizeFirstLetter = (string) => string ? string.charAt(0).toUpperCase() + string.slice(1) : '';

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return (price / 10000000).toFixed(1) + ' Cr';
    } else if (price >= 100000) {
      return (price / 100000).toFixed(0) + ' Lakh';
    }
    return price?.toLocaleString();
  };

  const calculatePricePerSqFt = (expectedPrice, carpetArea) => {
    return expectedPrice && carpetArea ? (expectedPrice / carpetArea).toFixed(2) : null;
  };

  const generateSlug = (property) => {
    return `${property.bedrooms}-bhk-${property.location.society}-${property.location.locality}-${property.location.city}`
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")  
      .replace(/\s+/g, "-")     
      .replace(/-+/g, "-");      
  };

  const handleViewDetails = async (id) => {
    const data = sellProperties.find((d) => d.id === id);
    if (!data) {
      console.error("Error fetching properties: Property not found");
    } else {
      const slug = generateSlug(data);
      navigate(`/property/${data.id}/${slug}`);
    }
  };

  const NextArrow = (props) => (
    <button
      {...props}
      className="slick-next absolute right-[-25px] top-1/2 -translate-y-1/2 bg-blue-400 p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
      aria-label="Next"
    >
      <FaChevronRight className="text-blue-500" />
    </button>
  );
  
  const PrevArrow = (props) => (
    <button
      {...props}
      className="slick-prev absolute left-[-25px] top-1/2 -translate-y-1/2 bg-blue-400 p-2 rounded-full shadow-lg hover:bg-gray-100 z-10"
      aria-label="Previous"
    >
      <FaChevronLeft className="text-blue-500" />
    </button>
  );

  const handleBHKToggle = (bhk) => {
    if (bhk === 'all') {
      setSelectedBHK(prev => prev.includes('all') ? [] : ['all']);
    } else {
      setSelectedBHK(prev => {
        if (prev.includes('all')) return [bhk];
        return prev.includes(bhk) 
          ? prev.filter(item => item !== bhk)
          : [...prev, bhk];
      });
    }
  };

  const runFilter = () => {
    const filtered = sellProperties.filter((property) => {
      const searchMatch = searchQuery
        ? (
            property.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location?.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location?.society?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;
    
      const formatLocality = (locality) => {
        return locality?.toString().toUpperCase().trim().replace(/\s+/g, '') || '';
      };
  
      const localityMatch = !selectedLocality 
        ? true 
        : formatLocality(property?.location?.locality) === formatLocality(selectedLocality);
      
      const sellMatch = property.expected_price
        ? (property.expected_price >= sellRange[0] && property.expected_price <= sellRange[1])
        : true;
    
      const categoryMatch = !propertyCategory || property.property_category === propertyCategory;
    
      const bhkMatch = selectedBHK.includes("all") || selectedBHK.length === 0 ||
        selectedBHK.some(bhk => {
          if (bhk === "3+") return property.bedrooms >= 3;
          const num = parseInt(bhk, 10);
          return property.bedrooms === num;
        });
    
      return (
        searchMatch &&
        localityMatch &&
        sellMatch &&
        categoryMatch &&
        bhkMatch
      );
    });
  
    setFilteredProperties(filtered);
  };

  useEffect(() => {
    dispatch(fetchProperties());
    runFilter();

  }, [dispatch]);



  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-100">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-white h-full  border-1 border-gray-100">
      {/* Header */}
       <Navbar/>
      {/* Hero Section */}
      <div className='w-full h-auto md:h-25 bg-white flex flex-col md:flex-row justify-center items-center py-4 md:py-0'>
        <div className="md:w-[40%] w-full text-center md:text-left mb-4 md:mb-0">
          <h1 className='text-blue-400 text-2xl sm:text-3xl font-bold md:ml-10 px-4 md:px-0 md:mt-3'>
            Find Properties for Sale
          </h1>
        </div>
        <div className="hidden md:flex md:w-[60%] w-full h-full bg-blue-50 md:rounded-tl-3xl flex-col md:flex-row items-center justify-center py-3 md:py-0 px-4 md:px-0">
          <div className='text-center md:text-left mb-2 md:mb-0 md:mr-4'>
            <h1 className='text-black text-lg sm:text-xl md:text-2xl font-bold opacity-60'>
              Need help finding your perfect property?
            </h1>
            <h1 className='text-black text-base sm:text-lg md:text-xl font-bold mt-1 opacity-60'>
              Contact Us Now
            </h1>
          </div>
          <div className='flex space-x-3 md:space-x-2 mt-2 md:mt-0'>
            <button 
              onClick={() => handleContactUS()}
              className="text-green-500 text-xl border border-transparent hover:border-green-500 p-1 w-12 md:w-15 bg-green-100 rounded-full h-8 hover:bg-green-50 shadow-lg flex items-center justify-center"
            >
              <FaWhatsapp className='md:ml-1'/>
            </button>
            <a 
              className="flex items-center justify-center text-white bg-blue-400 rounded-full border border-transparent hover:bg-blue-100 h-8 p-2 w-12 md:w-15 hover:border-blue-500 hover:text-blue-500 transition-colors"
              href={`tel:${phoneNumber}`}
            >
              <FaPhoneAlt className="text-sm md:text-base" /> 
            </a>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="relative w-full md:w-[50%] mx-auto mt-10 md:mt-5 transform z-10">
        <div className="bg-white rounded-2xl shadow-2xl mx-2 md:mx-0">
          <div className="p-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search by city, locality, or society..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
              <FaSearch className="absolute left-2 top-3 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Locality</label>
                <select
                  value={selectedLocality}
                  onChange={(e) => setSelectedLocality(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">All Areas</option>
                  {localities.map((locality) => (
                    <option key={locality} value={locality}>
                      {locality}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Property Category</label>
                <select
                  value={propertyCategory}
                  onChange={(e) => setPropertyCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">All Categories</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Price Range</label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">₹{formatPrice(sellRange[0])}</span>
                  <input
                    type="range"
                    min="0"
                    max="100000000"
                    value={sellRange[1]}
                    onChange={(e) => setSellRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <span className="text-sm">₹{formatPrice(sellRange[1])}</span>
                </div>
              </div>
            </div>

            {propertyCategory === 'residential' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">BHK Configuration</label>
                <div className="flex flex-wrap gap-2">
                  {['all', 2, 3, '3+'].map((bhk) => (
                    <button
                      key={bhk}
                      onClick={() => handleBHKToggle(bhk)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        selectedBHK.includes(bhk)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                      }`}
                    >
                      {bhk === 'all' ? 'All' : bhk === '3+' ? '3+ BHK' : `${bhk} BHK`}
                    </button>
                  ))}
                </div>
              </div>
            )}

<div className="mt-4 flex justify-center">
  <button 
    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 md:py-2 rounded-md text-sm font-medium transition-colors"
    onClick={(e) => {
      const button = e.currentTarget;
      const originalText = button.textContent;
      
      // Show loader
      button.innerHTML = `
        <span class="flex items-center justify-center">
          <svg class="animate-spin mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      `;
      button.disabled = true;
      
      // Remove loader after 1 second
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        runFilter()
      }, 1000);
    }}
  >
    Show Properties
  </button>
</div>
          </div>
        </div>
      </div>

      {/* Property Listings */}
      <div className="mt-32 md:mt-10">
        <h1 className="text-4xl font-serif md:ml-10 text-center animate-blue-wave">
          Properties for Sale
        </h1>
        <style jsx global>{`
          @keyframes blue-wave {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-blue-wave {
            background: linear-gradient(
              90deg,
              #2563eb,
              #3b82f6,
              #60a5fa,
              #3b82f6,
              #2563eb
            );
            background-size: 300% 300%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: blue-wave 6s ease-in-out infinite;
            padding: 0.25rem 0.5rem;
            display: inline-block;
            opacity: 0.9;
            font-stretch: semi-expanded;
          }
        `}</style>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[90%] mx-auto mt-10">
        {filteredProperties.length === 0 ? (
          <div className="col-span-3 text-center py-10">
            <p className="text-lg text-gray-600">No properties found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSelectedLocality('');
                setSellRange([0, 100000000]);
                setPropertyCategory('');
                setSelectedBHK([]);
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredProperties.map((property, index) => (
            <div 
              key={property.id || index} 
              className="flex flex-col w-full border border-blue-200 rounded-2xl shadow-lg bg-white overflow-hidden hover:shadow-xl transition-shadow"
            >
              <button 
                className="relative w-full h-64 rounded-t-2xl overflow-hidden group"
                onClick={() => handleViewDetails(property.id)}
              >
                <div className="absolute top-2 z-10">
                  <span className="px-3 py-0.5 text-xs font-bold bg-pink-500 text-white">
                    <FaTag className="inline-block mr-1" />
                    For Sale
                  </span>
                </div>

                <div className="absolute top-2 right-2 z-10">
                  <button 
                    className="px-2 py-1 text-xs font-medium bg-white text-blue-500 rounded-full shadow-md hover:bg-blue-100 flex items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(property.id);
                    }}
                  >
                    <FaEye className="mr-1" />
                    View
                  </button>
                </div>

                {property.imageUrl ? (
                  <img 
                    src={property.imageUrl} 
                    alt={`${property.location.society} in ${property.location.locality}, ${property.location.city}`} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}

                <div className="absolute bottom-2 right-2 bg-white rounded-full shadow-lg">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWhatsAppMessage(property);
                    }}
                    className="text-green-500 text-2xl p-1 bg-green-100 rounded-full hover:bg-green-200 shadow-lg"
                  >
                    <FaWhatsapp />
                  </button>
                </div>
              </button>

              <div className="p-4">
                <div className="flex flex-col mb-2">
                  <h2 className="text-lg font-bold text-blue-500 hover:text-blue-600 truncate">
                    <FaBuilding className="inline-block mr-2" />
                    {property.location?.society || "Unnamed Property"}
                  </h2>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center mb-2">
                  <p className="text-sm text-gray-600">
                    <FaMapMarkerAlt className="inline-block mr-1" />
                    {capitalizeFirstLetter(property.location?.city)}, {capitalizeFirstLetter(property.location?.locality)}
                  </p>
                  <p className="text-sm text-gray-600 md:ml-4">
                    <FaHome className="inline-block mr-1" />
                    {capitalizeFirstLetter(property.property_type)}
                  </p>
                </div>

                {property.property_category === 'residential' && (
                  <div className="flex gap-4 mt-2 mb-3">
                    <div className="flex items-center">
                      <FaBed className="text-teal-600 mr-1" />
                      <span className="text-sm text-gray-700">{property.bedrooms} Beds</span>
                    </div>
                    <div className="flex items-center">
                      <FaBath className="text-teal-600 mr-1" />
                      <span className="text-sm text-gray-700">{property.bathrooms} Baths</span>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between mt-4">
                  <div className="text-gray-800">
                    <p className="text-xl font-bold text-blue-500">
                      <FaRupeeSign className="inline-block mr-1" />
                      {formatPrice(property.expected_price)}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{calculatePricePerSqFt(property.expected_price, property.carpet_area)}/sqft
                    </p>
                  </div>

                  <div className="h-[35px] w-[1px] bg-gray-300 hidden md:block"></div>

                  <div className="flex items-center">
                    <FaRulerCombined className="text-gray-500 mr-1" />
                    <p className="text-gray-700">
                      {property.carpet_area} {property.area_unit}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Residential Properties Carousel */}
      {sellProperties.filter(p => p.property_category === 'residential').length > 0 && (
        <div className="w-[90%] mt-16 mx-auto">
          <h1 className="text-4xl font-serif text-center animate-blue-wave">
            Residential Properties for Sale
          </h1>
          <Slider
            dots={false}
            infinite={true}
            speed={1000}
            autoplay={true}
            autoplaySpeed={2000}
            slidesToShow={3}
            slidesToScroll={1}
            nextArrow={<NextArrow />}
            prevArrow={<PrevArrow />}
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  arrows: false
                }
              }
            ]}
          >
            {sellProperties
              .filter(property => property.property_category === 'residential')
              .reverse()
              .map((property, index) => (
                <div key={property.id || index} className="px-2 py-4">
                  <div className="border border-blue-200 rounded-2xl shadow-lg bg-white overflow-hidden h-full">
                  <div 
                key={property.id || index} 
                className="flex flex-col w-full border border-blue-200 rounded-2xl shadow-lg bg-white overflow-hidden"
            >
                {property.imageUrl ? (
                    <button 
                        className="relative w-full h-64 rounded-t-2xl overflow-hidden group"
                        onClick={() => handleViewDetails(property.id)}
                    >
                       <div className="absolute top-2  z-10">
                         
                            <span className={`px-3 py-0.5 text-xs font-bold  ${
                                property.listing_type.toLowerCase() === 'sell' 
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-lime-500 text-white'
                            }`}>
                               <FaTag className="inline-block mr-1" />
                                {property.listing_type === 'sell' ? 'sell' : 'rent/lease'}
                            </span>
                        </div>

                        <div className="absolute top-2 right-2 z-10">
        <button 
            className="px-2 py-1 text-xs font-medium bg-white text-blue-500 rounded-full shadow-md hover:bg-blue-100 flex items-center"
            onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(property.id);
            }}
        >
            <FaEye className="mr-1" />
            View
        </button>
    </div>
                        <img 
                            src={property.imageUrl} 
                            alt={`${property.location.society} in ${property.location.locality}, ${property.location.city}`} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-2 right-2 bg-white  rounded-full shadow-lg">
                        <button 
                                onClick={() => handleWhatsAppMessage(property)}
                                className="text-green-500 text-2xl p-1 bg-green-100 rounded-full hover:bg-green-200 shadow-lg"
                            >
                                <FaWhatsapp />
                            </button>
                        </div>
                    </button>
                ) : (
                    <button 
                        className="relative w-full h-64 bg-gray-300 flex items-center justify-center rounded-t-2xl"
                        onClick={() => handleViewDetails(property.id)}
                    >
                        <span className="text-gray-500">No Image Available</span>
                        <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg">
                            <FaMapMarkerAlt className="text-blue-500" />
                        </div>
                    </button>
                )}

                <div className="p-2   ">
                    <div className="flex flex-col mb-2">
                        <div className="mb-4">
                            <h2 className="text-md font-bold text-blue-500  hover:text-blue-500 truncate">
                                <FaBuilding className="inline-block mr-2" />
                                {property.location?.society || "Unnamed Property"}
                            </h2>
                        </div>
                       
                    </div>

                    <div className="flex flex-col md:flex-row items-center">
                        <h3 className="text-sm text-black">
                            <FaMapMarkerAlt className="inline-block mr-1 text-gray-500" />
                            {capitalizeFirstLetter(property.location?.city)}{capitalizeFirstLetter(property.location?.locality)}
                        </h3>
                        <h2 className="text-sm text-black md:ml-4">
                            <FaHome className="inline-block mr-1 text-md text-green-500" />
                             {capitalizeFirstLetter(property.property_type)}
                        </h2>
                    </div>

                    {property.property_category === 'residential' && property.property_type === 'Flat/Apartment' && (
                        <div className="flex gap-4 mt-3">
                            <div className="flex items-center">
                                <FaBed className="text-teal-600 mr-1" />
                                <span className="text-black text-sm">{property.bedrooms} Beds</span>
                            </div>
                            <div className="flex items-center">
                                <FaBath className="text-teal-600 mr-1" />
                                <span className="text-sm text-black">{property.bathrooms} Baths</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between mt-4">
                        <div className="text-black">
                            <p className="text-xl font-bold text-blue-500">
                                <FaRupeeSign className="inline-block mr-1" />
                                {property.rent_price ? formatPrice(property.rent_price) + "/month" : formatPrice(property.expected_price)}
                            </p>
                            <p className="text-sm text-gray-500">
                                {property.rent_price ? "" : "₹" + calculatePricePerSqFt(property.expected_price, property.carpet_area) + "/sqft"}
                            </p>
                        </div>

                        <div className="h-[35px] w-[1px] bg-gray-400 hidden md:block"></div>

                        <div className="flex items-center">
                            <FaRulerCombined className="text-gray-500 mr-1" />
                            <p className="text-black">
                                {property.carpet_area} {property.area_unit}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      )}

      {/* Commercial Properties Carousel */}
      {sellProperties.filter(p => p.property_category === 'commercial').length > 0 && (
        <div className="w-[90%] mt-16 mx-auto">
          <h1 className="text-4xl font-serif text-center animate-blue-wave">
            Commercial Properties for Sale
          </h1>
          <Slider
            dots={false}
            infinite={true}
            speed={1000}
            autoplay={true}
            autoplaySpeed={2000}
            slidesToShow={3}
            slidesToScroll={1}
            nextArrow={<NextArrow />}
            prevArrow={<PrevArrow />}
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                  arrows: false
                }
              }
            ]}
          >
            {sellProperties
              .filter(property => property.property_category === 'commercial')
              .reverse()
              .map((property, index) => (
                <div key={property.id || index} className="px-2 py-4">
                  <div className="border border-blue-200 rounded-2xl shadow-lg bg-white overflow-hidden h-full">
                  <div 
                key={property.id || index} 
                className="flex flex-col w-full border border-blue-200 rounded-2xl shadow-lg bg-white overflow-hidden"
            >
                {property.imageUrl ? (
                    <button 
                        className="relative w-full h-64 rounded-t-2xl overflow-hidden group"
                        onClick={() => handleViewDetails(property.id)}
                    >
                       <div className="absolute top-2  z-10">
                         
                            <span className={`px-3 py-0.5 text-xs font-bold  ${
                                property.listing_type.toLowerCase() === 'sell' 
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-lime-500 text-white'
                            }`}>
                               <FaTag className="inline-block mr-1" />
                                {property.listing_type === 'sell' ? 'sell' : 'rent/lease'}
                            </span>
                        </div>

                        <div className="absolute top-2 right-2 z-10">
        <button 
            className="px-2 py-1 text-xs font-medium bg-white text-blue-500 rounded-full shadow-md hover:bg-blue-100 flex items-center"
            onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(property.id);
            }}
        >
            <FaEye className="mr-1" />
            View
        </button>
    </div>
                        <img 
                            src={property.imageUrl} 
                            alt={`${property.location.society} in ${property.location.locality}, ${property.location.city}`} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute bottom-2 right-2 bg-white  rounded-full shadow-lg">
                        <button 
                                onClick={() => handleWhatsAppMessage(property)}
                                className="text-green-500 text-2xl p-1 bg-green-100 rounded-full hover:bg-green-200 shadow-lg"
                            >
                                <FaWhatsapp />
                            </button>
                        </div>
                    </button>
                ) : (
                    <button 
                        className="relative w-full h-64 bg-gray-300 flex items-center justify-center rounded-t-2xl"
                        onClick={() => handleViewDetails(property.id)}
                    >
                        <span className="text-gray-500">No Image Available</span>
                        <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg">
                            <FaMapMarkerAlt className="text-blue-500" />
                        </div>
                    </button>
                )}

                <div className="p-2   ">
                    <div className="flex flex-col mb-2">
                        <div className="mb-4">
                            <h2 className="text-md font-bold text-blue-500  hover:text-blue-500 truncate">
                                <FaBuilding className="inline-block mr-2" />
                                {property.location?.society || "Unnamed Property"}
                            </h2>
                        </div>
                       
                    </div>

                    <div className="flex flex-col md:flex-row items-center">
                        <h3 className="text-sm text-black">
                            <FaMapMarkerAlt className="inline-block mr-1 text-gray-500" />
                            {capitalizeFirstLetter(property.location?.city)}{capitalizeFirstLetter(property.location?.locality)}
                        </h3>
                        <h2 className="text-sm text-black md:ml-4">
                            <FaHome className="inline-block mr-1 text-md text-green-500" />
                             {capitalizeFirstLetter(property.property_type)}
                        </h2>
                    </div>

                    {property.property_category === 'residential' && property.property_type === 'Flat/Apartment' && (
                        <div className="flex gap-4 mt-3">
                            <div className="flex items-center">
                                <FaBed className="text-teal-600 mr-1" />
                                <span className="text-black text-sm">{property.bedrooms} Beds</span>
                            </div>
                            <div className="flex items-center">
                                <FaBath className="text-teal-600 mr-1" />
                                <span className="text-sm text-black">{property.bathrooms} Baths</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between mt-4">
                        <div className="text-black">
                            <p className="text-xl font-bold text-blue-500">
                                <FaRupeeSign className="inline-block mr-1" />
                                {property.rent_price ? formatPrice(property.rent_price) + "/month" : formatPrice(property.expected_price)}
                            </p>
                            <p className="text-sm text-gray-500">
                                {property.rent_price ? "" : "₹" + calculatePricePerSqFt(property.expected_price, property.carpet_area) + "/sqft"}
                            </p>
                        </div>

                        <div className="h-[35px] w-[1px] bg-gray-400 hidden md:block"></div>

                        <div className="flex items-center">
                            <FaRulerCombined className="text-gray-500 mr-1" />
                            <p className="text-black">
                                {property.carpet_area} {property.area_unit}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      )}

      {/* Footer */}
      <div className='w-full bg-gradient-to-b from-blue-50 to-white mt-16'>
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
                            <FaPhoneAlt className="mr-2 text-blue-500" />
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
                <p className="text-sm text-gray-400 leading-relaxed  mx-auto ">
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

export default Sell;