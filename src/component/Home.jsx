// import { useState, useEffect} from 'react';
// import { Carousel } from 'react-responsive-carousel';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
// import { supabase } from '../supabaseClient';
// import logo from "../assets/dmhlogo.svg";
// import { CiLocationOn } from "react-icons/ci";
// import { GoDotFill } from "react-icons/go";
// import { FaPhoneAlt } from "react-icons/fa";
// import { FaBars } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';
// import { FaWhatsapp } from "react-icons/fa";
// import { Link } from 'react-router-dom';
// import { FaFacebook, FaInstagram } from "react-icons/fa";
// import { FaLocationDot } from "react-icons/fa6";
// import Loader from "./Loader"
// import { useDispatch, useSelector } from "react-redux";
// import { fetchProperties } from "../Redux/propertySlice";
// import Navbar from './MainPages/Navbar';
// import { FaSearch, FaHome, FaBuilding } from 'react-icons/fa';
// export default function Home() {
//     const dispatch = useDispatch();
//     const { properties, loading, error,localities } = useSelector((state) => state.properties);
//     const [images, setImages] = useState([]);
//     const [propertyDetails, setPropertyDetails] = useState([]);
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const navigate=useNavigate()
//     const phoneNumber = "9925001226";
//     const handleWhatsAppMessage = (property) => {
//         const message = `Hello, I'm interested in the property at ${property.location?.society || "Unnamed Property"}, ${property.location?.city}, ${property.location?.locality}. 
//         It is a ${property.property_category}, ${property.property_type} with ${property.bedrooms || 0} BHK and ${property.bathrooms || 0} Baths.
//         Price: ₹${property.rent_price ? formatPrice(property.rent_price) + " / month" : formatPrice(property.expected_price)}
//         Area: ${property.carpet_area} ${property.area_unit}.
        
//         Can you please provide me with more details?`;
      
//         const encodedMessage = encodeURIComponent(message);
//         window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
//       };
   
//       const [filteredProperties, setFilteredProperties] = useState([]);

//       const fetchCarouselData = async () => {
//         try {
//             const { data, error } = await supabase
//                 .from('dmhpropertiescorosole')
//                 .select('code');
    
//             if (error) {
//                 console.error('Error fetching carousel data:', error.message);
//                 return;
//             }
    
//             const ids = data.map(item => item.code);
    
//             // Get image URLs (keep this part the same)
//             const imageUrls = await Promise.all(
//                 ids.map(async (id) => {
//                     if (!id) return null;
//                     const { data, error } = await supabase.storage
//                         .from('property-images')
//                         .list(`${id}/images`, { limit: 1, sortBy: { column: 'name', order: 'asc' } });
    
//                     if (error || !data || data.length === 0) return null;
    
//                     const filePath = `${id}/images/${data[0].name}`;
//                     const { data: urlData } = supabase.storage
//                         .from('property-images')
//                         .getPublicUrl(filePath);
    
//                     return { id, url: urlData.publicUrl };
//                 })
//             );
    
//             setImages(imageUrls.filter(Boolean));
    
//             // Use properties from Redux store instead of Supabase query
//             const carouselProperties = properties.filter(property => 
//                 ids.includes(property.id)
//             );
            
//             setPropertyDetails(carouselProperties);
    
//         } catch (error) {
//             console.error('Unexpected error fetching carousel data:', error.message);
//         }
//     };
//     useEffect(() => {
//         dispatch(fetchProperties()); // Ensure properties are loaded
//         fetchCarouselData();
//     }, [dispatch]);
   

//     const capitalizeFirstLetter = (string) => string ? string.charAt(0).toUpperCase() + string.slice(1) : '';

//     const formatPrice = (price) => {
//         if (price >= 10000000) {
//             return (price / 10000000).toFixed(1) + ' Cr';
//         } else if (price >= 100000) {
//             return (price / 100000).toFixed(0) + ' Lakh';
//         }
//         return price?.toLocaleString();
//     };

//     const calculatePricePerSqFt = (expectedPrice, carpetArea) => {
//         return expectedPrice && carpetArea ? (expectedPrice / carpetArea).toFixed(2) : null;
//     };

   
//   useEffect(() => {
//     dispatch(fetchProperties());
//   }, [dispatch]);


//     const generateSlug = (property) => {
//         return `${property.bedrooms}-bhk-${property.location.society}-${property.location.locality}-${property.location.city}`
//             .toLowerCase()
//             .replace(/[^\w\s-]/g, "")  
//             .replace(/\s+/g, "-")     
//             .replace(/-+/g, "-");      
//     };
    

//     const handleViewDetails = async (id) => {
//       const data = properties.find((d) => d.id === id);
  
//       if (!data) {
//           console.error("Error fetching properties: Property not found");
//       } else {
//           const slug = generateSlug(data);
//           navigate(`/property/${data.id}/${slug}`);
//       }
//   };
  

//     useEffect(() => {
//       if (properties.length > 0) {
//         runFilter();
//       }
//     }, [properties])

//    const [selectedCategories, setSelectedCategories] = useState(['all']);
//      const [selectedBHK, setSelectedBHK] = useState([]);
//      const [sellRange, setSellRange] = useState([0, 100000000]);
//      const [rentRange, setRentRange] = useState([0, 500000]);
//      const [searchQuery, setSearchQuery] = useState('');
   
//      const handleCategoryToggle = (category) => {
//        if (category === 'all' ) {
       
//          setSelectedCategories(['all']);
//          setSelectedBHK([]);
//        } else {
//          const newCategories = selectedCategories.includes(category)
//            ? selectedCategories.filter(c => c !== category)
//            : [...selectedCategories.filter(c => c !== 'all'), category];
         
//          setSelectedCategories(newCategories.length > 0 ? newCategories : ['all']);
//        }
//      };
   
//      const handleBHKToggle = (bhk) => {
//        if (bhk === 'all') {
//          setSelectedBHK(prev => prev.includes('all') ? [] : ['all']);
//        } else {
//          setSelectedBHK(prev => {
//            if (prev.includes('all')) return [bhk];
//            return prev.includes(bhk) 
//              ? prev.filter(item => item !== bhk)
//              : [...prev, bhk];
//          });
//        }
//      };
   
//     //  const formatPrice = (price) => {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(price)}
   
   
//     const runFilter = () => {
//       const filteredProperties = properties.filter((property) => {
        
//         // Search Match (City, Locality, Society)
//         const searchMatch = searchQuery
//           ? (
//               property.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//               property.location?.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//               property.location?.society?.toLowerCase().includes(searchQuery.toLowerCase())
//             )
//           : true;
    
//         // Locality Match (Multiple Selection)
//         const localityMatch = localities.length === 0 || 
//           localities.includes(property.location?.locality);
    
//         // Price Range Matches
//         const rentMatch = property.rent_price
//           ? (property.rent_price >= rentRange[0] && property.rent_price <= rentRange[1])
//           : true;
    
//         const sellMatch = property.expected_price
//           ? (property.expected_price >= sellRange[0] && property.expected_price <= sellRange[1])
//           : true;
    
//         // Category Match with 'all' Option
//         const categoryMatch = selectedCategories.includes('all') || 
//           selectedCategories.includes(property.property_category);
    
//         // BHK Match with 'all' Option
//         const bhkMatch = selectedBHK.includes("all") || selectedBHK.length === 0 ||
//           selectedBHK.some(bhk => {
//             if (bhk === "3+") return property.bedrooms >= 3;
//             const num = parseInt(bhk, 10);
//             return property.bedrooms === num;
//           });
    
//         return (
//           searchMatch &&
//           localityMatch &&
//           rentMatch &&
//           sellMatch &&
//           categoryMatch &&
//           bhkMatch
//         );
//       });
    
//       setFilteredProperties(filteredProperties);
//     };
    
   

//       if (loading) {
//         return (
//           <div className="flex items-center justify-center h-screen bg-blue-100">
//             <Loader />
//           </div>
//         );
//       }

//     return (
//         <div className="min-h-screen border-1 w-[100%] border-gray-100 bg-[#F3F4F6]">
      
//         <Navbar/>
            
//         <div className="w-[100%]  h-auto flex justify-center relative md:h-[450px]">
//   {images.length > 0 ? (
//     <Carousel
//       autoPlay
//       infiniteLoop
//       interval={1500}
//       showThumbs={false}
//       showIndicators={true}
//       showStatus={false}
//       className="w-[100%] "
//     >
//       {images.map((image, index) => {
//         const property = propertyDetails.find(p => p.id === image.id);
//         return (
//           <div 
//             key={index} 
//             className="relative h-[150px] sm:h-[300px] md:h-[450px]" 
//           >
//             {/* Image with fixed parent height */}
//             <img
 
//   src={image.url}
//   alt="Property showcase"
//   className="w-full h-full object-cover"
// />

            
           
//             {property && (
//   <div className="absolute bottom-0 left-0 w-full flex justify-center items-end pb-15 bg-gradient-to-t from-gray-800 to-transparent">
//     <div className="flex items-center max-w-[90%] mx-auto">
//       <CiLocationOn className="h-6 w-6 text-blue-100 shrink-0" />
//       <div className="ml-2 text-center">
//         <h1 className="text-lg font-bold text-white truncate">
//           {property.location?.society || "Unknown Society"}
//         </h1>
//         <h1 className="text-base text-gray-200 truncate">
//           {property.location?.locality || "Unknown Locality"}
//         </h1>
//       </div>
//     </div>
//   </div>      
// )}
//           </div>
//         );
//       })}
//     </Carousel>
//   ) : (
//     <p className="text-gray-600 text-lg">No images found. Add valid property IDs!</p>
//   )}
// </div>
//           <div>
//           <div className="space-y-6 mt[-20px] h-full">
//           <div className="p-4 w-[50%] mx-auto bg-white rounded-lg shadow-md">
//               <div className="relative mb-4">
//                   <input
//                     type="text"
//                     placeholder="Search..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
//                   />
//                   <FaSearch className="absolute left-2 top-2 text-gray-400 text-xs" />
//                 </div>
            
//                 {/* Category Selectors */}
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {['all', 'residential', 'commercial'].map((category) => (
//                     <button
//                       key={category}
//                       onClick={() => handleCategoryToggle(category)}
//                       className={`flex items-center px-3 py-1 rounded-md text-xs transition-colors ${
//                         selectedCategories.includes(category)
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
//                       }`}
//                     >
//                       {category === 'all' && <FaHome className="mr-1 text-[0.6rem]" />}
//                       {category === 'residential' && <FaHome className="mr-1 text-[0.6rem]" />}
//                       {category === 'commercial' && <FaBuilding className="mr-1 text-[0.6rem]" />}
//                       {category.charAt(0).toUpperCase() + category.slice(1)}
//                     </button>
//                   ))}
//                 </div>
            
//                 {/* BHK Selectors */}
//                 {selectedCategories.includes('residential') && (
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     <button
//                       onClick={() => handleBHKToggle('all')}
//                       className={`px-3 py-1 rounded-md text-xs ${
//                         selectedBHK.includes('all')
//                           ? 'bg-blue-600 text-white'
//                           : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
//                       }`}
//                     >
//                       All
//                     </button>
//                     {[2, 3, 4].map((bhk) => (
//                       <button
//                         key={bhk}
//                         onClick={() => handleBHKToggle(bhk)}
//                         className={`px-2.5 py-0.5 rounded-md text-xs ${
//                           selectedBHK.includes(bhk)
//                             ? 'bg-blue-600 text-white'
//                             : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
//                         }`}
//                       >
//                         {bhk}BHK
//                       </button>
//                     ))}
//                   </div>
//                 )}
            
//                 {/* Filters Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   {/* Locality Dropdown */}
//                   <div className="space-y-1">
//                     <label className="block text-[0.7rem] font-medium text-gray-600 mb-0.5">Locality</label>
//                     <select className="w-full px-2 py-1 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-blue-400">
//                       <option value="">All Areas</option>
//                       {localities.map((locality) => (
//                         <option key={locality} value={locality}>{locality}</option>
//                       ))}
//                     </select>
//                   </div>
            
//                   {/* Price Ranges - Side by Side */}
//                   <div className="grid grid-cols-2 gap-3">
//                     {[
//                       { label: 'Sell', value: sellRange[1], max: 100000000, setter: setSellRange },
//                       { label: 'Rent', value: rentRange[1], max: 500000, setter: setRentRange }
//                     ].map((range, idx) => (
//                       <div key={idx} className="space-y-1">
//                         <div className="flex justify-between text-[0.7rem] text-gray-600 font-medium">
//                           <span>{range.label}:</span>
//                           <span>₹{formatPrice(range.value)}</span>
//                         </div>
//                         <input
//                           type="range"
//                           min="0"
//                           max={range.max}
//                           value={range.value}
//                           onChange={(e) => range.setter([0, parseInt(e.target.value)])}
//                           className="w-full h-1 bg-gray-200 rounded-full accent-blue-500"
//                           style={{
//                             background: `linear-gradient(to right, #3b82f6 ${(range.value / range.max) * 100}%, #e5e7eb ${(range.value / range.max) * 100}%)`
//                           }}
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
            
              
//                 <div className="mt-4 flex justify-center">
//                   <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-md text-xs font-medium transition-colors"
//                   onClick={runFilter}>
                  
//                     Show Properties
//                   </button>
//                 </div>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[90%] mx-auto">
//     {filteredProperties.length === 0 ? (
//         <p>No properties found.</p>
//     ) : (
//         filteredProperties.map((property, index) => (
//             <div 
//                 key={property.id || index} 
//                 className="flex flex-col w-full border border-blue-200 rounded-2xl shadow-lg bg-white overflow-hidden"
//             >
//                 {property.imageUrl ? (
//                     <img 
//                         src={property.imageUrl} 
//                         alt={`${property.location.society} in ${property.location.locality}, ${property.location.city}`} 
//                         className="w-full h-64 object-cover rounded-t-2xl"
//                     />
//                 ) : (
//                     <div className="w-full h-64 bg-gray-300 flex items-center justify-center rounded-t-2xl">
//                         <span className="text-gray-500">No Image Available</span>
//                     </div>
//                 )}

//                 <div className="p-3">
//                 <div className="flex flex-col mb-2">
//     <div className="mb-4">
//         <h2 className="text-xl font-bold text-blue-500 truncate">
//             {property.location?.society || "Unnamed Property"}
//         </h2>
//     </div>
//     <div className="flex items-center space-x-2">
//         <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
//             {property.listing_type}
//         </span>
//         <button 
//             className="px-3 py-1 text-sm font-medium bg-blue-100 text-green-800 rounded-full truncate"
//             onClick={() => handleViewDetails(property.id)}
//         >
//             View Details
//         </button>
//         <button 
//             onClick={() => handleWhatsAppMessage(property)}
//             className="text-green-500 text-2xl p-1 bg-green-100 rounded-full hover:bg-green-200 shadow-lg"
//         >
//             <FaWhatsapp />
//         </button>
//     </div>
// </div>

//                     <div className="flex flex-col md:flex-row">
//                         <h3 className="text-md text-black">
//                             {capitalizeFirstLetter(property.location?.city)}, {capitalizeFirstLetter(property.location?.locality)}
//                         </h3>
//                         <h2 className="text-md text-black md:ml-20">
//                             {capitalizeFirstLetter(property.property_category)}, {capitalizeFirstLetter(property.property_type)}
//                         </h2>
//                     </div>

//                     {property.property_category === 'residential' && property.property_type === 'Flat/Apartment' && (
//                         <p className="text-lg text-black font-medium mt-2">{property.bedrooms} BHK {property.bathrooms} Baths</p>
//                     )}

//                     <div className="flex flex-wrap items-center justify-between mt-4">
//                         <div className="text-black">
//                             <p className="text-xl font-bold text-blue-500">
//                                 ₹{property.rent_price ? formatPrice(property.rent_price) + " / month" : formatPrice(property.expected_price)}
//                             </p>
//                             <p className="text-md text-gray-500">
//                                 {property.rent_price ? "" : "₹" + calculatePricePerSqFt(property.expected_price, property.carpet_area) + "/sqft"}
//                             </p>
//                         </div>

//                         <div className="h-[35px] w-[1px] bg-gray-400 hidden md:block"></div>

//                         <div>
//                             <p className="text-black font-bold">
//                                 {property.carpet_area} {property.area_unit}
//                             </p>
//                         </div>
//                     </div>
//                     <p className="hidden md:block mt-4 text-sm text-gray-600 desktop-line-clamp">
//   {property.summary}
// </p>



//                 </div>
//             </div>
//         ))
//     )}
// </div>

        
//         </div>
//           </div>

//           <div className='w-full bg-blue-100 mt-5'>
//     <footer className="bg-gray-700 text-white py-6">
//         <div className="container mx-auto px-4">
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                
           
//                 <div className="bg-white p-4 rounded-lg shadow">
//                     <h3 className="text-xl font-semibold mb-4 text-blue-500">Contact Us</h3>
//                     <div className="space-y-2 text-gray-500 text-sm">
//                         <p><strong>Phone:</strong> +91 9925001226</p>
//                         <p><strong>Email:</strong> dmproperties@gmail.com</p>
//                         <p>
//                             <strong>Address:</strong> B/302, Sun South Street,
//                              South Bopal, Bopal, Ahmedabad, 
//                              Gujarat 380058
//                         </p>
//                     </div>
//                 </div>

               
//                 <div className="bg-white p-4 rounded-lg shadow">
//                     <h3 className="text-xl font-semibold mb-3 text-blue-500">Quick Links</h3>
//                     <ul className="text-sm text-gray-500 space-y-2">
//                         <li>
//                             <Link to="/sellproperty" className="hover:text-blue-700">
//                                 View Selling Property
//                             </Link>
//                         </li>
//                         <li>
//                             <Link to="/rent_leaseproperty" className="hover:text-blue-700">
//                                 View Rent Property
//                             </Link>
//                         </li>
//                         <li>
//                             <Link to="/Pg" className="hover:text-blue-700">
//                                 View Any Available PG
//                             </Link>
//                         </li>
//                     </ul>

//                     <div className="flex justify-center sm:justify-start space-x-4 mt-4">
//                         <a 
//                             href="https://www.instagram.com/dmhproperties?igsh=YWp5ZDA1ZnZqdWNo" 
//                             target="_blank" 
//                             rel="noopener noreferrer" 
//                             className="text-pink-500 hover:text-pink-600 text-2xl transition-transform transform hover:scale-110 hover:shadow-lg"
//                         >
//                             <FaInstagram />
//                         </a>
//                         <a 
//                             href="https://www.facebook.com/dmhproperties?mibextid=ZbWKwL" 
//                             target="_blank" 
//                             rel="noopener noreferrer" 
//                             className="text-blue-500 hover:text-blue-600 text-2xl transition-transform transform hover:scale-110 hover:shadow-lg"
//                         >
//                             <FaFacebook />
//                         </a>
//                         <a 
//                             href="https://maps.app.goo.gl/m4mPE7jMbh9fi7Sz6" 
//                             target="_blank" 
//                             rel="noopener noreferrer" 
//                             className="text-blue-500 hover:text-blue-600 text-2xl transition-transform transform hover:scale-110 hover:shadow-lg"
//                         >
//                              <FaLocationDot className=""/>
//                         </a>
//                     </div>
//                 </div>

//                 <div className="flex flex-col items-center">
//                     <div className="w-32 h-32 mt-7">
//                         <img src={logo} alt="Logo" className="w-full h-full object-contain rounded-lg" />
//                     </div>
//                     <p className="text-sm text-center font-medium mt-2 ">BUY | SELL | RENT | LEASE</p>
//                 </div>
//             </div>

//             <div className="mt-6 border-t border-gray-700 pt-3 text-center">
//                 <p className="text-xs  text-gray-400">
//                     Disclaimer: DMH Properties is only an intermediary offering its platform to advertise properties of Seller for a Customer/Buyer/User coming on its Website and is not and cannot be a party to or privy to or control in any manner any transactions between the Seller and the Customer/Buyer/User. All the prices or rates on this Website have been extended by various Builder(s)/Developer(s) who have advertised their products. Company shall neither be responsible nor liable to mediate or resolve any disputes or disagreements between the Customer/Buyer/User and the Seller and both Seller and Customer/Buyer/User shall settle all such disputes without involving Company in any manner.
//                 </p>
//             </div>
//         </div>     
//     </footer>
// </div>
//         </div>
//     );
// }
















import { useState, useEffect} from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { supabase } from '../supabaseClient';
import logo from "../assets/dmhlogo.svg";
import { CiLocationOn } from "react-icons/ci";
import { GoDotFill } from "react-icons/go";
import { FaPhoneAlt } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FaWhatsapp } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import Loader from "./Loader"
import { useDispatch, useSelector } from "react-redux";
import { fetchProperties } from "../Redux/propertySlice";
import Navbar from './MainPages/Navbar';
import { FaSearch, FaHome, FaBuilding } from 'react-icons/fa';
import { 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRulerCombined,
  FaTag, 
  FaEye, 
  FaRupeeSign
} from 'react-icons/fa';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {  
    FaPhone,
    FaEnvelope,
    FaKey,
  } from "react-icons/fa";
// Add this CSS for proper spacing
<style>
{`
  .slick-list {
    margin: 0 -12px;
  }
  .slick-slide > div {
    padding: 0 12px;
  }
`}
</style>
export default function Home() {
  const dispatch = useDispatch();
      const { properties, loading, error,localities } = useSelector((state) => state.properties);
      const [images, setImages] = useState([]);
      const [propertyDetails, setPropertyDetails] = useState([]);
      const [isMenuOpen, setIsMenuOpen] = useState(false);
      const navigate=useNavigate()
      const phoneNumber = "9925001226";
      const handleWhatsAppMessage = (property) => {
          const message = `Hello, I'm interested in the property at ${property.location?.society || "Unnamed Property"}, ${property.location?.city}, ${property.location?.locality}. 
          It is a ${property.property_category}, ${property.property_type} with ${property.bedrooms || 0} BHK and ${property.bathrooms || 0} Baths.
          Price: ₹${property.rent_price ? formatPrice(property.rent_price) + " / month" : formatPrice(property.expected_price)}
          Area: ${property.carpet_area} ${property.area_unit}.
          
          Can you please provide me with more details?`;
        
          const encodedMessage = encodeURIComponent(message);
          window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
        };


        const handleContactUS = ()=>{
          window.open(`https://wa.me/${phoneNumber}`, "_blank");
        }
     
        const [filteredProperties, setFilteredProperties] = useState([]);
  
        const fetchCarouselData = async () => {
          try {
              const { data, error } = await supabase
                  .from('dmhpropertiescorosole')
                  .select('code');
      
              if (error) {
                  console.error('Error fetching carousel data:', error.message);
                  return;
              }
      
              const ids = data.map(item => item.code);
      
              // Get image URLs (keep this part the same)
              const imageUrls = await Promise.all(
                  ids.map(async (id) => {
                      if (!id) return null;
                      const { data, error } = await supabase.storage
                          .from('property-images')
                          .list(`${id}/images`, { limit: 1, sortBy: { column: 'name', order: 'asc' } });
      
                      if (error || !data || data.length === 0) return null;
      
                      const filePath = `${id}/images/${data[0].name}`;
                      const { data: urlData } = supabase.storage
                          .from('property-images')
                          .getPublicUrl(filePath);
      
                      return { id, url: urlData.publicUrl };
                  })
              );
      
              setImages(imageUrls.filter(Boolean));
      
              // Use properties from Redux store instead of Supabase query
              const carouselProperties = properties.filter(property => 
                  ids.includes(property.id)
              );
              
              setPropertyDetails(carouselProperties);
      
          } catch (error) {
              console.error('Unexpected error fetching carousel data:', error.message);
          }
      };
      useEffect(() => {
          dispatch(fetchProperties()); // Ensure properties are loaded
          fetchCarouselData();
      }, [dispatch]);
     
  
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
  
     
    useEffect(() => {
      dispatch(fetchProperties());
    }, [dispatch]);
  
  
      const generateSlug = (property) => {
          return `${property.bedrooms}-bhk-${property.location.society}-${property.location.locality}-${property.location.city}`
              .toLowerCase()
              .replace(/[^\w\s-]/g, "")  
              .replace(/\s+/g, "-")     
              .replace(/-+/g, "-");      
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
      
  
      const handleViewDetails = async (id) => {
        const data = properties.find((d) => d.id === id);
    
        if (!data) {
            console.error("Error fetching properties: Property not found");
        } else {
            const slug = generateSlug(data);
            navigate(`/property/${data.id}/${slug}`);
        }
    };
    
  
      useEffect(() => {
        if (properties.length > 0) {
          runFilter();
        }
      }, [properties])
  
     const [selectedCategories, setSelectedCategories] = useState(['all']);
       const [selectedBHK, setSelectedBHK] = useState([]);
       const [sellRange, setSellRange] = useState([0, 100000000]);
       const [rentRange, setRentRange] = useState([0, 1000000]);
       const [searchQuery, setSearchQuery] = useState('');
       const [selectedLocality, setSelectedLocality] = useState('');

       const handleCategoryToggle = (category) => {
         if (category === 'all' ) {
         
           setSelectedCategories(['all']);
           setSelectedBHK([]);
         } else {
           const newCategories = selectedCategories.includes(category)
             ? selectedCategories.filter(c => c !== category)
             : [...selectedCategories.filter(c => c !== 'all'), category];
           
           setSelectedCategories(newCategories.length > 0 ? newCategories : ['all']);
         }
       };
     
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
     
      //  const formatPrice = (price) => {new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(price)}
     
     
      const runFilter = () => {
        const filteredProperties = properties.filter((property) => {
          
          
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
            
          
          const rentMatch = property.rent_price
            ? (property.rent_price >= rentRange[0] && property.rent_price <= rentRange[1])
            : true;
      
          const sellMatch = property.expected_price
            ? (property.expected_price >= sellRange[0] && property.expected_price <= sellRange[1])
            : true;
      
          
          const categoryMatch = selectedCategories.includes('all') || 
            selectedCategories.includes(property.property_category);
      
          
          const bhkMatch = selectedBHK.includes("all") || selectedBHK.length === 0 ||
            selectedBHK.some(bhk => {
              if (bhk === "3+") return property.bedrooms >= 3;
              const num = parseInt(bhk, 10);
              return property.bedrooms === num;
            });
      
          return (
            searchMatch &&
            localityMatch &&
            rentMatch &&
            sellMatch &&
            categoryMatch &&
            bhkMatch
          );
        });
      
        setFilteredProperties(filteredProperties);
      };
      
     
  
        if (loading) {
          return (
            <div className="flex items-center justify-center h-screen bg-blue-100">
              <Loader />
            </div>
          );
        }
  

    return (
        <div className="min-h-screen border-1 w-[100%] border-gray-100 bg-white">
            <Navbar/>
            
            <div className='w-full h-auto md:h-25 bg-white flex flex-col md:flex-row justify-center items-center py-4 md:py-0'>
    {/* Left Section */}
    <div className="md:w-[40%] w-full text-center md:text-left mb-4 md:mb-0">
        <h1 className='text-blue-400 text-2xl sm:text-3xl font-bold md:ml-10 px-4 md:px-0 md:mt-3'>
            Find Your Perfect Property
        </h1>
    </div>

    {/* Right Section */}
    <div className="hidden md:flex md:w-[60%] w-full h-full bg-blue-50 md:rounded-tl-3xl flex-col md:flex-row items-center justify-center py-3 md:py-0 px-4 md:px-0">
    <div className='text-center md:text-left mb-2 md:mb-0 md:mr-4'>
        <h1 className='text-black text-lg sm:text-xl md:text-2xl font-bold opacity-60'>
            Need help To Choose Your Property
        </h1>
        <h1 className='text-black text-base sm:text-lg md:text-xl font-bold mt-1 opacity-60'>
            Contact Us Now
        </h1>
    </div>
    
    {/* Buttons Container */}
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

<div className="w-full h-[300px] md:h-[550px] relative">
    <div className="w-full h-full">
        {images.length > 0 ? (
            <Carousel
                autoPlay
                infiniteLoop
                interval={1500}
                showThumbs={false}
                showIndicators={false}
                showStatus={false}
                className="w-full h-full"
                emulateTouch={true}
                swipeable={true}
            >
                {images.map((image, index) => {
                    const property = propertyDetails.find(p => p.id === image.id);
                    return (
                        <div 
                            key={index} 
                            className="relative h-[300px] md:h-[550px]"
                        >
                            <img
                                src={image.url}
                                alt="Property showcase"
                                className="w-full h-full object-cover"
                            />
                            {property && (
                                <div className="absolute bottom-0 left-0 w-full flex justify-center items-end pb-20 md:pb-40 bg-gradient-to-t from-gray-800/90 to-transparent">
                                    <div className="flex items-center mb-4 mx-4 max-w-[90%]">
                                        <CiLocationOn className="h-5 w-5 md:h-6 md:w-6 text-white flex-shrink-0" />
                                        <div className="ml-2 overflow-hidden">
                                            <h1 className="text-base md:text-lg font-bold text-white truncate">
                                                {property.location?.society || "Unknown Society"}
                                            </h1>
                                            <h1 className="text-sm md:text-base text-gray-200 truncate">
                                                {property.location?.locality || "Unknown Locality"}
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </Carousel>
        ) : (
            <p className="text-gray-600 text-sm md:text-lg p-4">No images found. Add valid property IDs!</p>
        )}
    </div>

          
    <div className="relative md:absolute md:bottom-[-220px]  md:ml-[27%] w-full md:w-[600px] max-w-[95%] mx-auto md:max-w-none mt-10 md:mt-0 transform md:-translate-y-1/2 z-10">
    <div className="bg-white rounded-2xl md:rounded-4xl shadow-2xl mx-2 md:mx-0">
        <div className="space-y-4 md:space-y-6 rounded-2xl md:rounded-4xl">
            <div className="p-4 bg-white rounded-2xl md:rounded-4xl">
           
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-2 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                    />
                    <FaSearch className="absolute left-2 top-3 text-gray-400" />
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                    {['all', 'residential', 'commercial'].map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryToggle(category)}
                            className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
                                selectedCategories.includes(category)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 md:hover:bg-blue-50'
                            }`}
                        >
                            {category === 'all' && <FaHome className="mr-1" />}
                            {category === 'residential' && <FaHome className="mr-1" />}
                            {category === 'commercial' && <FaBuilding className="mr-1" />}
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                    ))}
                </div>

                {/* BHK Filters */}
                {selectedCategories.includes('residential') && (
                    <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                        <button
                            onClick={() => handleBHKToggle('all')}
                            className={`px-3 py-1.5 rounded-md text-sm ${
                                selectedBHK.includes('all')
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 md:hover:bg-blue-50'
                            }`}
                        >
                            All
                        </button>
                        {[2, 3, 4].map((bhk) => (
                            <button
                                key={bhk}
                                onClick={() => handleBHKToggle(bhk)}
                                className={`px-3 py-1.5 rounded-md text-sm ${
                                    selectedBHK.includes(bhk)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 md:hover:bg-blue-50'
                                }`}
                            >
                                {bhk}BHK
                            </button>
                        ))}
                    </div>
                )}

                {/* Location and Price Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            { label: 'Sell', value: sellRange[1], max: 100000000, setter: setSellRange },
                            { label: 'Rent', value: rentRange[1], max: 1000000, setter: setRentRange }
                        ].map((range, idx) => (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between text-sm text-gray-600 font-medium">
                                    <span>{range.label}:</span>
                                    <span>₹{formatPrice(range.value)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max={range.max}
                                    value={range.value}
                                    onChange={(e) => range.setter([0, parseInt(e.target.value)])}
                                    className="w-full h-2 bg-gray-200 rounded-full accent-blue-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-4 flex justify-center">
                    <button 
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 md:py-2 rounded-md text-sm font-medium transition-colors"
                        onClick={runFilter}
                    >
                        Show Properties
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
            
<div className="mt-120 items-center md:mt-40 justify-center md:ml-105">
   <h1 className="text-4xl font-serif text-center animate-blue-wave">
        Discover Our Feature Listings
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
        
 <div className="grid grid-cols-1 md:grid-cols-2 mt-10 lg:grid-cols-3 gap-6 w-[90%]  md:mt-5     mx-auto pt-4 md:pt-0">
    {filteredProperties.length === 0 ? (
          <div className="col-span-3 text-center py-10">
          <p className="text-lg text-gray-600">No properties found matching your criteria.</p>
          <button 
            onClick={() => {
              setSearchQuery('');
              setSelectedLocality('');
              setRentRange([0, 100000]);
              setSellRange([0,100000000])
              setPropertyCategory('');
              setSelectedBHK([]);
              {runFilter}
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

                    <div className="flex md:flex-row items-center">
                        <h3 className="text-sm text-black">
                            <FaMapMarkerAlt className="inline-block mr-1 mb-1 text-gray-500" />
                            {capitalizeFirstLetter(property.location?.city)}{capitalizeFirstLetter(property.location?.locality)}
                        </h3>
                        <h2 className="text-sm text-black md:ml-4">
                            <FaHome className="inline-block mr-1 mb-1 ml-2 text-md text-green-500" />
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
        ))
    )}
</div>



<div className="w-[90%] mt-10 mx-auto">
<h1 className="text-4xl font-serif text-center animate-blue-wave">
        Residential Listings
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
{properties
    .filter(property => property.property_category === 'residential')
    .length === 0 ? (
    <p className="font-mono text-md text-black">No residential properties found. !!</p>
    
  ) : (
  
    <Slider
    {...{
      dots: false,
      infinite: true,
      speed: 1000,
      autoplay: true,
      autoplaySpeed: 2000,
      slidesToShow: 3,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      responsive: [
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
      ]
    }}
  >
    
       {[...properties]
        .filter(property => property.property_category === 'residential')
        .reverse()
        .map((property, index) => (
        <div key={property.id || index}>
          <div className="flex flex-col w-full border border-blue-200 mt-5 rounded-2xl shadow-lg bg-white overflow-hidden">
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
  )}
</div>





<div className="w-[90%] mt-10 mx-auto">
<h1 className="text-4xl font-serif text-center animate-blue-wave">
        Commercial Listings
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
{properties
    .filter(property => property.property_category === 'commercial')
    .length === 0 ? (
    <p className="text-lg p-2 text-black font-mono">No commercial properties found. !!</p>
  
  ) : (
    <Slider
    {...{
      dots: false,
      infinite: true,
      speed: 1000,
      autoplay: true,
      autoplaySpeed: 2000,
      slidesToShow: 3,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />,
      responsive: [
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
      ]
    }}
  >
        {[...properties]
        .filter(property => property.property_category === 'commercial')
        .reverse()
        .map((property, index) => (
        <div key={property.id || index}>
          <div className="flex flex-col w-full border border-blue-200 mt-5 rounded-2xl shadow-lg bg-white overflow-hidden">
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
                                {property.listing_type === 'sell' ? 'sell' : '/lease'}
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
  )}
</div>





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
}


