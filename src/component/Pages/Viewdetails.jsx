// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { FaBath, FaBed, FaRulerCombined, FaCar, FaHome, FaToilet, FaBuilding, FaCompass } from "react-icons/fa";
// import { IoLocationSharp } from "react-icons/io5";
// import { MdBalcony } from "react-icons/md";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faStairs } from "@fortawesome/free-solid-svg-icons";
// import { FaCouch, FaCheckCircle, FaDoorOpen } from "react-icons/fa";
// import {FaParking } from "react-icons/fa";
// import { supabase } from '../../supabaseClient';
// import { useNavigate } from "react-router-dom";
// import Loader from "../Loader"
// import { FaStairs } from "react-icons/fa6";
// import { Helmet } from 'react-helmet';
// import { CiStopwatch } from "react-icons/ci";
// const Viewdetails = () => {
//     const [properties, setProperties] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [images, setImages] = useState([]);
//     const [currentImage, setCurrentImage] = useState(null);
// const [seoData, setSeoData] = useState({ title: '', description: '', schema: {} });
//     const { id , slug} = useParams();
//     const navigate = useNavigate();
//     const handleNavigate = () => {
//       navigate("/");
//     };
  
//     const expectedPrice = properties.expected_price || 0;
//     const carpetArea = properties.carpet_area || 0;
//     const coverImage = currentImage || images[0]?.preview;

//     const formatPrice = (price) => {
//         if (price >= 10000000) {
//             return (price / 10000000).toFixed(1) + ' Cr';
//         } else if (price >= 100000) {
//             return (price / 100000).toFixed(0) + ' Lakh';
//         }
//         return price?.toLocaleString();
//     };

//     const pricePerSqFt = expectedPrice && carpetArea ? (expectedPrice / carpetArea).toFixed(2) : null;

//     useEffect(() => {
//         fetchProperties();
//     }, []);

//     const fetchProperties = async () => {
//         setLoading(true);
//         const { data, error } = await supabase
//             .from('dmhproperties')
//             .select('*')
//             .eq('id', id)
//             .single();

//         if (error) {
//             console.error('Error fetching properties:', error.message);
//         } else {
//             setProperties(data);
//             const imageUrls = await getImageUrls(data.id);
//             setImages(imageUrls);
//             setCurrentImage(imageUrls[0]?.preview || null);
//             generateSeoData(data, imageUrls[0]?.preview || null);
//         }
//         setLoading(false);
//     };






//     const generateSeoData = (property, image) => {
//       const {
//           property_type, bedrooms, bathrooms, carpet_area, area_unit, location,
//           expected_price, rent_price, selected_amenities, summary, imageUrl
//       } = property;

//       const title = `${bedrooms} BHK ${property_type} in ${location?.society}, ${location?.city}`;
//       const description = summary || `Find a spacious ${bedrooms} BHK ${property_type} with ${bathrooms} bathrooms, spread across ${carpet_area} ${area_unit}.`;
//       const price = expected_price ? `₹${expected_price}` : rent_price ? `₹${rent_price}/month` : "Price on request";

//       const schemaForHelmet = {
//           "@context": "https://schema.org",
//           "@type": "RealEstateListing",
//           "name": title,
//           "description": description,
//           "image": imageUrl || image,
//           "address": {
//               "@type": "PostalAddress",
//               "streetAddress": location?.society,
//               "addressLocality": location?.locality,
//               "addressRegion": location?.city,
//               "addressCountry": "IN",
//           },
//           "numberOfRooms": bedrooms,
//           "numberOfBathroomsTotal": bathrooms,
//           "floorSize": {
//               "@type": "QuantitativeValue",
//               "value": carpet_area,
//               "unitCode": area_unit,
//           },
//           "price": expected_price || rent_price,
//           "priceCurrency": "INR",
//           "amenities": selected_amenities,
//       };

//       setSeoData({ title, description, schema: schemaForHelmet });
//   };

//     const getImageUrls = async (propertyId) => {
//         const { data, error } = await supabase.storage
//             .from('property-images')
//             .list(`${propertyId}/images`);

//         if (error) return [];
//         return data.map((file) => ({
//             preview: supabase.storage.from('property-images').getPublicUrl(`${propertyId}/images/${file.name}`).data.publicUrl
//         }));
//     };

//     const handlePrevImage = () => {
//         const currentIndex = images.findIndex((img) => img.preview === currentImage);
//         const prevIndex = (currentIndex - 1 + images.length) % images.length;
//         setCurrentImage(images[prevIndex]?.preview);
//     };

//     const handleNextImage = () => {
//         const currentIndex = images.findIndex((img) => img.preview === currentImage);
//         const nextIndex = (currentIndex + 1) % images.length;
//         setCurrentImage(images[nextIndex]?.preview);
//     };

//     if (loading) {
//       return (
//         <div className="flex items-center justify-center h-screen bg-blue-100">
//           <Loader />
//         </div>
//       );
//     }
//   if (properties.property_type === "Commercial Land" || properties.property_type === "Plot / Land") {
//      return (
//        <div className="p-6 w-full bg-white rounded-xl mt-0">

//               <Helmet>
//                 <title>{seoData.title}</title>
//                 <meta name="description" content={seoData.description} />
//                 <meta name="keywords" content={properties?.selected_amenities?.join(", ") || ''} />
//                 <meta property="og:title" content={seoData.title} />
//                 <meta property="og:description" content={seoData.description} />
//                 <meta property="og:image" content={properties?.imageUrl || currentImage} />
//                 <meta property="og:type" content="product" />
//                 <meta property="og:locale" content="en_IN" />
//                 <script type="application/ld+json">
//                     {JSON.stringify(seoData.schema, null, 2)}
//                 </script>
//             </Helmet>


//        <div className="w-full h-[100px] bg-white p-4 flex items-center border-b border-gray-500">
//          <div className="flex-1">
//            <div className="ml-25 w-[300px] text-3xl font-bold text-gray-500">
//              {properties.listing_type?.toLowerCase() === "sell" ? (
//                <>
//                  ₹{formatPrice(expectedPrice)}
//                  {pricePerSqFt && (
//                    <span className="text-sm text-gray-400 ml-2">
//                      @ ₹{pricePerSqFt} per sq.ft.
//                    </span>
//                  )}
//                </>
//              ) : (
//                <>
//                  ₹{formatPrice(properties.rent_price)} / month
//                </>
//              )}
//            </div>
//          </div>
     
//          <div className="flex-1 border-l pl-4 ml-0 mr-80 text-gray-500">
//            <div className="text-sm text-gray-400 mt-1">
//              {`${properties.property_type} for ${properties.listing_type}`}
//            </div>
//            <div className="text-xs text-gray-400 mt-1">
//              in {properties.location?.locality}, {properties.location?.society}
//            </div>
//          </div>

    
//          <div>
//           <button  className="px-6 py-2 bg-gray-500 text-white rounded-2xl hover:bg-gray-600 transition" onClick={handleNavigate} >Home</button>
//          </div>
  
            
//        </div>
     
//        <div className="flex gap-6 p-6 w-full bg-gray-100 rounded-xl">
//          <div className="w-1/2">
//            <div className="relative w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden">
//              <img
//                src={currentImage || coverImage || images[0]?.preview}
//                alt="Property Preview"
//                className="w-full h-full object-cover"
//              />
//              {images.length > 1 && (
//                <>
//                  <button
//                    onClick={handlePrevImage}
//                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
//                  >
//                    &lt;
//                  </button>
//                  <button
//                    onClick={handleNextImage}
//                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
//                  >
//                    &gt;
//                  </button>
//                </>
//              )}
//            </div>
//          </div>
     
//          <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
//            <h3 className="mt-6 text-lg font-semibold text-gray-700">Summary</h3>
//            <p className="text-sm text-gray-500 mt-2">
//              {properties.summary || "No summary provided"}
//            </p>
//          </div>
//        </div>
//      </div>
     
//      );
//    }
 
//    return (
//     <div className="p-6 w-full bg-white rounded-xl mt-0">
//     <div className="w-full h-auto bg-white p-4 flex flex-col md:flex-row items-start md:items-center border-b border-gray-500">
//       <div className="flex-1 w-full md:w-auto mb-4 md:mb-0">
//         <div className="text-3xl font-bold text-gray-500">
//           {properties.listing_type?.toLowerCase() === "sell" ? (
//             <>
//               ₹{formatPrice(expectedPrice)}
//               {pricePerSqFt && (
//                 <span className="text-sm text-gray-400 ml-2">
//                   @ ₹{pricePerSqFt} per sq.ft.
//                 </span>
//               )}
//             </>
//           ) : (
//             <>₹{formatPrice(properties.rent_price)} / month</>
//           )}
//         </div>
//       </div>
  
//       <div className="flex-1 w-full md:w-auto border-l md:pl-4 md:ml-0 text-gray-500 mr-2 md:mr-0">
//   <div className="text-2xl ml-2 font-semibold">
//     {properties.property_category === "commercial" ? (
//       <>
//         {properties.bedrooms > 1 ? `${properties.bedrooms} Working Space Rooms` : `Full Space Office`}
//       </>
//     ) : (
//       <>{properties.bedrooms}BHK {properties.bathrooms} Baths</>
//     )}
//   </div>
//   <div className="text-sm text-gray-400 ml-2 mt-1">
//     {`${properties.property_type} for ${properties.listing_type}`}
//   </div>
//   <div className="text-xs text-gray-400 ml-2 mt-1">
//     in {properties.location?.locality}, {properties.location?.society}
//   </div>
// </div>

  
//       <div className='mt-4 md:mt-0'>
//         <button className="px-6 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-700 transition" onClick={handleNavigate}>Home</button>
//       </div>
//     </div>
  
//     <div className="flex flex-col lg:flex-row gap-6 p-6 w-full bg-white  rounded-xl">
//       <div className="w-full lg:w-1/2">
//        <div className="relative w-full h-[400px] bg-gray-200 rounded-lg overflow-hidden">
//     <img
//         src={currentImage || coverImage || images[0]?.preview}
//         alt="Property Preview"
//         className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
//     />
//     {images.length > 1 && (
//         <>
//             <button
//                 onClick={handlePrevImage}
//                 className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
//             >
//                 &lt;
//             </button>
//             <button
//                 onClick={handleNextImage}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
//             >
//                 &gt;
//             </button>
//         </>
//     )}
// </div>
//       </div>
  
//       <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-2xl">
//         <h2 className="text-xl font-bold text-blue-600 mb-4">Property Details</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600">
//           <div className="flex items-center gap-2">
//             {properties.property_category === "commercial" ? <FaBuilding /> : <FaBed />} {properties.bedrooms} {properties.property_category === "commercial" ? "Working Space Rooms" : "Bedrooms"}
//           </div>
//           <div className="flex items-center gap-2">
//             {properties.property_category === "commercial" ? <FaToilet /> : <FaBath />} {properties.bathrooms} {properties.property_category === "commercial" ? "Washrooms" : "Bathrooms"}
//           </div>
//           <div className="flex items-center gap-2"><MdBalcony /> {properties.balconies} Balconies</div>
//           <div className="flex items-center gap-2"><FaRulerCombined /> {properties.carpet_area} {properties.area_unit}</div>
//            <div className="flex items-center gap-2">
//                           <CiStopwatch />
//             <span className="">
//               {properties.possessiondate ? `Possession in ${properties.possessiondate}` : "Ready to Move"}
//             </span>
//           </div>
//           <div className="flex items-center gap-2"><FaHome /> {properties.property_type}</div>
//           <div className="flex items-center gap-2"><IoLocationSharp /> {properties.location?.locality}, {properties.location?.society}</div>
//           <div className="flex items-center gap-2"><FaCompass /> Facing: {properties.facing || "Not Specified"}</div>
//           <div className="flex items-center gap-2">
//       {(properties.property_type === "Flat/Apartment" || properties.property_type === "Office Space") && (
//         <>
//           <FaStairs />
//           Floor : {properties.selected_floor}
//           <sup className="ml-[-7px]">
//             {properties.selectedFloor === 1
//               ? "st"
//               : properties.selectedFloor === 2
//               ? "nd"
//               : properties.selectedFloor === 3
//               ? "rd"
//               : "th"}
//           </sup>{" "}
//           of {properties.total_floors}
//         </>
//       )}
        
//     </div>
//           {/* <div className="flex items-center gap-2"><FaDoorOpen /> Facing: {properties.house_status || "Not Specified"}</div> */}
//         </div>
  
//         <h3 className="mt-6 text-lg font-semibold text-blue-500">Summary</h3>
//         <p className="text-sm text-gray-500 mt-2">{properties.summary || 'No summary provided'}</p>
//       </div>
//     </div>
  
//     <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
//   <h2 className="text-xl font-bold text-blue-500 mb-4">Additional Details</h2>
  
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//     {/* Furnishing + Details of Furnishing */}
//     <div>
//       <h3 className="text-lg font-semibold text-gray-600 mb-2">Furnishing</h3>
//       <div className="text-gray-500 flex items-center gap-2 mb-4">
//         <FaCouch /> {properties.furnishing || "Not furnished"}
//       </div>

//       {properties.selected_amenities?.length>0&& (
//   <h3 className="text-lg font-semibold text-gray-600 mb-2">Details Of Furnishing</h3>
// )}
//       <div className="grid grid-cols-2 gap-2">
//         {properties.selected_amenities?.length > 0 ? (
//           properties.selected_amenities.map((amenity, index) => (
//             <div key={index} className="flex items-center gap-2 text-gray-500">
//               <FaCheckCircle className="text-blue-500" /> <span className='truncate'>{amenity}</span>
//             </div>
//           ))
//         ) : (
//          <></>
//         )}
//       </div>
//     </div>

//     {/* Additional Rooms with Parking Info */}
//     <div>
//     {properties.selected_rooms?.length>0&& (
//   <h3 className="text-lg font-semibold text-gray-600 mb-2">Addiotional Rooms</h3>
// )}
//       <div className="grid grid-cols-2 gap-2">
//         {properties.selected_rooms?.length > 0 ? (
//           properties.selected_rooms.map((room, index) => (
//             <div key={index} className="flex items-center gap-2 text-gray-500">
//               <FaDoorOpen /> {room}
//             </div>
//           ))
//         ) : (
//           <></>
//         )}
//       </div>

     
//       <div className="mt-4">
//       {(properties.covered_parking > 0 || properties.open_parking > 0) && (
//   <h2 className="text-lg font-semibold mb-4">Parking Info</h2>
// )}
//         <div className="space-y-2">
//           {properties.open_parking > 0 ? (
//             <div className="flex items-center space-x-2">
//               <FaParking className="text-gray-500" size={20} />
//               <span className=' text-gray-500'>Open Parking: {properties.open_parking}</span>
//             </div>
//           ) : (
//             <></>
//           )}

//           {properties.covered_parking > 0 ? (
//             <div className="flex items-center space-x-2">
//               <FaCar className="text-gray-500" size={20} />
//               <span className='text-gray-500'>Covered Parking: {properties.covered_parking}</span>
//             </div>
//           ) : (
//            <></>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// </div>

//   </div>
  
//    );
// };

// export default Viewdetails;

























// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { supabase } from '../../supabaseClient';
// import Loader from "../Loader";
// import { Helmet } from 'react-helmet';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   FaBath, FaBed, FaRulerCombined, FaCar, FaHome, FaToilet, FaBuilding,
//   FaCompass, FaCouch, FaCheckCircle, FaDoorOpen, FaParking,
//   FaChevronLeft, FaChevronRight, FaTimes, FaMapMarkerAlt, FaExpand
// } from "react-icons/fa";
// import { IoLocationSharp } from "react-icons/io5";
// import { MdBalcony } from "react-icons/md";
// import { CiStopwatch } from "react-icons/ci";
// import { GiFloorPolisher } from "react-icons/gi";
// import { BsHouseDoor, BsBuilding } from "react-icons/bs";
// import { faStairs } from "@fortawesome/free-solid-svg-icons";
// import Navbar from '../MainPages/Navbar';
// const Viewdetails = () => {
//     const [property, setProperty] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [images, setImages] = useState([]);
//     const [currentImageIndex, setCurrentImageIndex] = useState(0);
//     const [isFullscreen, setIsFullscreen] = useState(false);
//     const [seoData, setSeoData] = useState({ title: '', description: '', schema: {} });
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const expectedPrice = property.expected_price || 0;
//     const carpetArea = property.carpet_area || 0;
//     const pricePerSqFt = expectedPrice && carpetArea ? (expectedPrice / carpetArea).toFixed(2) : null;

//     const formatPrice = (price) => {
//         if (!price) return "Price on request";
//         if (price >= 10000000) {
//             return (price / 10000000).toFixed(1) + ' Cr';
//         } else if (price >= 100000) {
//             return (price / 100000).toFixed(0) + ' Lakh';
//         }
//         return price?.toLocaleString();
//     };

//     const fetchProperty = useCallback(async () => {
//         setLoading(true);
//         try {
//             const { data, error } = await supabase
//                 .from('dmhproperties')
//                 .select('*')
//                 .eq('id', id)
//                 .single();

//             if (error) throw error;

//             setProperty(data);
//             const imageUrls = await getImageUrls(data.id);
//             setImages(imageUrls);
//             generateSeoData(data, imageUrls[0]?.preview || null);
//         } catch (error) {
//             console.error('Error fetching property:', error.message);
//         } finally {
//             setLoading(false);
//         }
//     }, [id]);

//     const getImageUrls = async (propertyId) => {
//         const { data, error } = await supabase.storage
//             .from('property-images')
//             .list(`${propertyId}/images`);

//         if (error) return [];
//         return data.map((file) => ({
//             preview: supabase.storage.from('property-images').getPublicUrl(`${propertyId}/images/${file.name}`).data.publicUrl
//         }));
//     };

//     const generateSeoData = (property, image) => {
//         const {
//             property_type, bedrooms, bathrooms, carpet_area, area_unit, location,
//             expected_price, rent_price, selected_amenities, summary
//         } = property;

//         const title = `${bedrooms} ${property.property_category === "commercial" ? "Space" : "BHK"} ${property_type} in ${location?.society}, ${location?.city}`;
//         const description = summary || `Find this ${property_type} with ${bedrooms} ${property.property_category === "commercial" ? "working spaces" : "bedrooms"} and ${bathrooms} bathrooms, spread across ${carpet_area} ${area_unit}.`;
//         const price = expected_price ? `₹${expected_price}` : rent_price ? `₹${rent_price}/month` : "Price on request";

//         const schema = {
//             "@context": "https://schema.org",
//             "@type": "RealEstateListing",
//             "name": title,
//             "description": description,
//             "image": property.imageUrl || image,
//             "address": {
//                 "@type": "PostalAddress",
//                 "streetAddress": location?.society,
//                 "addressLocality": location?.locality,
//                 "addressRegion": location?.city,
//                 "addressCountry": "IN",
//             },
//             "numberOfRooms": bedrooms,
//             "numberOfBathroomsTotal": bathrooms,
//             "floorSize": {
//                 "@type": "QuantitativeValue",
//                 "value": carpet_area,
//                 "unitCode": area_unit,
//             },
//             "price": expected_price || rent_price,
//             "priceCurrency": "INR",
//             "amenities": selected_amenities,
//         };

//         setSeoData({ title, description, schema });
//     };

//     const handlePrevImage = () => {
//         setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
//     };

//     const handleNextImage = () => {
//         setCurrentImageIndex(prev => (prev + 1) % images.length);
//     };

//     const handleThumbnailClick = (index) => {
//         setCurrentImageIndex(index);
//     };

//     const toggleFullscreen = () => {
//         setIsFullscreen(!isFullscreen);
//     };

//     const handleKeyDown = useCallback((e) => {
//         if (isFullscreen) {
//             if (e.key === 'Escape') {
//                 setIsFullscreen(false);
//             } else if (e.key === 'ArrowLeft') {
//                 handlePrevImage();
//             } else if (e.key === 'ArrowRight') {
//                 handleNextImage();
//             }
//         }
//     }, [isFullscreen]);

//     useEffect(() => {
//         fetchProperty();
//     }, [fetchProperty]);

//     useEffect(() => {
//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [handleKeyDown]);

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-screen bg-blue-50">
//                 <Loader />
//             </div>
//         );
//     }

//     if (!property.id) {
//         return (
//             <div className="flex flex-col items-center justify-center h-screen bg-blue-50 p-4">
//                 <h2 className="text-2xl font-bold text-gray-700 mb-4">Property Not Found</h2>
//                 <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or may have been removed.</p>
//                 <button
//                     onClick={() => navigate("/")}
//                     className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
//                 >
//                     Browse Properties
//                 </button>
//             </div>
//         );
//     }

//     const renderLandProperty = () => (
      
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
//             <Helmet>
//                 <title>{seoData.title}</title>
//                 <meta name="description" content={seoData.description} />
//                 <meta name="keywords" content={property?.selected_amenities?.join(", ") || ''} />
//                 <meta property="og:title" content={seoData.title} />
//                 <meta property="og:description" content={seoData.description} />
//                 <meta property="og:image" content={property?.imageUrl || images[0]?.preview} />
//                 <meta property="og:type" content="product" />
//                 <meta property="og:locale" content="en_IN" />
//                 <script type="application/ld+json">
//                     {JSON.stringify(seoData.schema, null, 2)}
//                 </script>
//             </Helmet>

//             <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
              
//                 <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
//                     <div className="mb-4 md:mb-0">
//                         <h1 className="text-3xl font-bold text-gray-800">
//                             {property.listing_type?.toLowerCase() === "sell" ? (
//                                 <>
//                                     ₹{formatPrice(expectedPrice)}
//                                     {pricePerSqFt && (
//                                         <span className="text-lg text-gray-500 ml-2">
//                                             (₹{pricePerSqFt}/sq.ft)
//                                         </span>
//                                     )}
//                                 </>
//                             ) : (
//                                 <>₹{formatPrice(property.rent_price)} <span className="text-lg">/ month</span></>
//                             )}
//                         </h1>
//                         <div className="text-sm text-gray-500 mt-1">
//                             {`${property.property_type} for ${property.listing_type}`}
//                         </div>
//                         <div className="flex items-center text-gray-600 mt-1">
//                             <IoLocationSharp className="mr-1" />
//                             {property.location?.locality}, {property.location?.society}
//                         </div>
//                     </div>
//                     <button
//                         onClick={() => navigate("/")}
//                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
//                     >
//                         Browse Properties
//                     </button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-6 p-6">
//                     <div className="w-full lg:w-1/2">
//                         <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
//                             <AnimatePresence initial={false} custom={currentImageIndex}>
//                                 <motion.img
//                                     key={currentImageIndex}
//                                     src={images[currentImageIndex]?.preview}
//                                     alt="Property"
//                                     className="w-full h-full object-cover cursor-pointer"
//                                     onClick={toggleFullscreen}
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     exit={{ opacity: 0 }}
//                                     transition={{ duration: 0.3 }}
//                                 />
//                             </AnimatePresence>
                            
//                             {images.length > 1 && (
//                                 <>
//                                     <button
//                                         onClick={handlePrevImage}
//                                         className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
//                                         aria-label="Previous image"
//                                     >
//                                         <FaChevronLeft />
//                                     </button>
//                                     <button
//                                         onClick={handleNextImage}
//                                         className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
//                                         aria-label="Next image"
//                                     >
//                                         <FaChevronRight />
//                                     </button>
//                                     <button
//                                         onClick={toggleFullscreen}
//                                         className="absolute bottom-4 right-4 bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
//                                         aria-label="Expand image"
//                                     >
//                                         <FaExpand />
//                                     </button>
//                                 </>
//                             )}
//                         </div>

//                         {images.length > 1 && (
//                             <div className="flex gap-2 mt-4 overflow-x-auto py-2">
//                                 {images.map((img, index) => (
//                                     <motion.div
//                                         key={index}
//                                         className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
//                                         onClick={() => handleThumbnailClick(index)}
//                                         whileHover={{ scale: 1.05 }}
//                                     >
//                                         <img
//                                             src={img.preview}
//                                             alt={`Thumbnail ${index + 1}`}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </motion.div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     <div className="w-full lg:w-1/2">
//                         <div className="bg-white p-6 rounded-xl shadow-lg h-full">
//                             <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Summary</h2>
//                             <p className="text-gray-600 mb-6">
//                                 {property.summary || "No detailed summary available for this property."}
//                             </p>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <div className="text-gray-500 text-sm">Property Type</div>
//                                     <div className="font-medium text-gray-800">{property.property_type}</div>
//                                 </div>
//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <div className="text-gray-500 text-sm">Area</div>
//                                     <div className="font-medium text-gray-800">{property.carpet_area} {property.area_unit}</div>
//                                 </div>
//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <div className="text-gray-500 text-sm">Facing</div>
//                                     <div className="font-medium text-gray-800">{property.facing || "Not specified"}</div>
//                                 </div>
//                                 <div className="bg-gray-50 p-4 rounded-lg">
//                                     <div className="text-gray-500 text-sm">Possession</div>
//                                     <div className="font-medium text-gray-800">
//                                         {property.possessiondate ? property.possessiondate : "Ready to Move"}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     const renderResidentialCommercialProperty = () => (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <Helmet>
//                 <title>{seoData.title}</title>
//                 <meta name="description" content={seoData.description} />
//                 <meta name="keywords" content={property?.selected_amenities?.join(", ") || ''} />
//                 <meta property="og:title" content={seoData.title} />
//                 <meta property="og:description" content={seoData.description} />
//                 <meta property="og:image" content={property?.imageUrl || images[0]?.preview} />
//                 <meta property="og:type" content="product" />
//                 <meta property="og:locale" content="en_IN" />
//                 <script type="application/ld+json">
//                     {JSON.stringify(seoData.schema, null, 2)}
//                 </script>
//             </Helmet>

//             <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
//                 <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center">
//                     <div className="mb-4 md:mb-0">
//                         <h1 className="text-3xl font-bold text-gray-800">
//                             {property.listing_type?.toLowerCase() === "sell" ? (
//                                 <>
//                                     ₹{formatPrice(expectedPrice)}
//                                     {pricePerSqFt && (
//                                         <span className="text-lg text-gray-500 ml-2">
//                                             (₹{pricePerSqFt}/sq.ft)
//                                         </span>
//                                     )}
//                                 </>
//                             ) : (
//                                 <>₹{formatPrice(property.rent_price)} <span className="text-lg">/ month</span></>
//                             )}
//                         </h1>
//                         <div className="text-lg font-semibold text-gray-700 mt-1">
//                             {property.bedrooms} {property.property_category === "commercial" ? "Space" : "BHK"} {property.property_type}
//                         </div>
//                         <div className="flex items-center text-gray-600 mt-1">
//                             <IoLocationSharp className="mr-1" />
//                             {property.location?.locality}, {property.location?.society}, {property.location?.city}
//                         </div>
//                     </div>
//                     <button
//                         onClick={() => navigate("/")}
//                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
//                     >
//                         Browse Properties
//                     </button>
//                 </div>

//                 <div className="flex flex-col lg:flex-row gap-6 p-6">
//                     <div className="w-full lg:w-1/2">
//                         <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
//                             <AnimatePresence initial={false} custom={currentImageIndex}>
//                                 <motion.img
//                                     key={currentImageIndex}
//                                     src={images[currentImageIndex]?.preview}
//                                     alt="Property"
//                                     className="w-full h-full object-cover cursor-pointer"
//                                     onClick={toggleFullscreen}
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     exit={{ opacity: 0 }}
//                                     transition={{ duration: 0.3 }}
//                                 />
//                             </AnimatePresence>
                            
//                             {images.length > 1 && (
//                                 <>
//                                     <button
//                                         onClick={handlePrevImage}
//                                         className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
//                                         aria-label="Previous image"
//                                     >
//                                         <FaChevronLeft />
//                                     </button>
//                                     <button
//                                         onClick={handleNextImage}
//                                         className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
//                                         aria-label="Next image"
//                                     >
//                                         <FaChevronRight />
//                                     </button>
//                                     <button
//                                         onClick={toggleFullscreen}
//                                         className="absolute bottom-4 right-4 bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
//                                         aria-label="Expand image"
//                                     >
//                                         <FaExpand />
//                                     </button>
//                                 </>
//                             )}
//                         </div>

//                         {images.length > 1 && (
//                             <div className="flex gap-2 mt-4 overflow-x-auto py-2">
//                                 {images.map((img, index) => (
//                                     <motion.div
//                                         key={index}
//                                         className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
//                                         onClick={() => handleThumbnailClick(index)}
//                                         whileHover={{ scale: 1.05 }}
//                                     >
//                                         <img
//                                             src={img.preview}
//                                             alt={`Thumbnail ${index + 1}`}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </motion.div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     <div className="w-full lg:w-1/2">
//                         <div className="bg-white p-6 rounded-xl shadow-lg h-full">
//                             <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Highlights</h2>
                            
//                             <div className="grid grid-cols-2 gap-4 mb-6">
//                                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
//                                     {property.property_category === "commercial" ? (
//                                         <BsBuilding className="text-blue-600 text-xl" />
//                                     ) : (
//                                         <BsHouseDoor className="text-blue-600 text-xl" />
//                                     )}
//                                     <div>
//                                         <div className="text-xs text-gray-500">Property Type</div>
//                                         <div className="font-medium">{property.property_type}</div>
//                                     </div>
//                                 </div>
                                
//                                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
//                                     {property.property_category === "commercial" ? (
//                                         <FaDoorOpen className="text-blue-600 text-xl" />
//                                     ) : (
//                                         <FaBed className="text-blue-600 text-xl" />
//                                     )}
//                                     <div>
//                                         <div className="text-xs text-gray-500">{property.property_category === "commercial" ? "Spaces" : "Bedrooms"}</div>
//                                         <div className="font-medium">{property.bedrooms}</div>
//                                     </div>
//                                 </div>
                                
//                                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
//                                     <FaBath className="text-blue-600 text-xl" />
//                                     <div>
//                                         <div className="text-xs text-gray-500">Bathrooms</div>
//                                         <div className="font-medium">{property.bathrooms}</div>
//                                     </div>
//                                 </div>
                                
//                                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
//                                     <FaRulerCombined className="text-blue-600 text-xl" />
//                                     <div>
//                                         <div className="text-xs text-gray-500">Area</div>
//                                         <div className="font-medium">{property.carpet_area} {property.area_unit}</div>
//                                     </div>
//                                 </div>
                                
//                                 {property.balconies > 0 && (
//                                     <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
//                                         <MdBalcony className="text-blue-600 text-xl" />
//                                         <div>
//                                             <div className="text-xs text-gray-500">Balconies</div>
//                                             <div className="font-medium">{property.balconies}</div>
//                                         </div>
//                                     </div>
//                                 )}
                                
//                                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
//                                     <FaCompass className="text-blue-600 text-xl" />
//                                     <div>
//                                         <div className="text-xs text-gray-500">Facing</div>
//                                         <div className="font-medium">{property.facing || "Not specified"}</div>
//                                     </div>
//                                 </div>
                                
//                                 {(property.property_type === "Flat/Apartment" || property.property_type === "Office Space") && (
//                                     <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
//                                         <GiFloorPolisher className="text-blue-600 text-xl" />
//                                         <div>
//                                             <div className="text-xs text-gray-500">Floor</div>
//                                             <div className="font-medium">
//                                                 {property.selected_floor}
//                                                 <sup>
//                                                     {property.selected_floor === 1
//                                                         ? "st"
//                                                         : property.selected_floor === 2
//                                                         ? "nd"
//                                                         : property.selected_floor === 3
//                                                         ? "rd"
//                                                         : "th"}
//                                                 </sup>{" "}
//                                                 of {property.total_floors}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
                                
//                                 <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
//                                     <CiStopwatch className="text-blue-600 text-xl" />
//                                     <div>
//                                         <div className="text-xs text-gray-500">Possession</div>
//                                         <div className="font-medium">
//                                             {property.possessiondate ? property.possessiondate : "Ready to Move"}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
                            
//                             <h3 className="text-lg font-semibold text-gray-800 mb-3">About This Property</h3>
//                             <p className="text-gray-600 mb-6">
//                                 {property.summary || "No detailed description available for this property."}
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         <div className="bg-white p-6 rounded-xl shadow-sm">
//                             <h3 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h3>
//                             {property.selected_amenities?.length > 0 ? (
//                                 <div className="grid grid-cols-2 gap-3">
//                                     {property.selected_amenities.map((amenity, index) => (
//                                         <div key={index} className="flex items-center gap-2 text-gray-700">
//                                             <FaCheckCircle className="text-green-500" />
//                                             <span>{amenity}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <p className="text-gray-500">No amenities listed</p>
//                             )}
//                         </div>

//                         <div className="bg-white p-6 rounded-xl shadow-sm">
//                             <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Features</h3>
//                             <div className="space-y-4">
//                                 {property.selected_rooms?.length > 0 && (
//                                     <div>
//                                         <h4 className="font-medium text-gray-700 mb-2">Additional Rooms</h4>
//                                         <div className="grid grid-cols-2 gap-2">
//                                             {property.selected_rooms.map((room, index) => (
//                                                 <div key={index} className="flex items-center gap-2 text-gray-600">
//                                                     <FaDoorOpen className="text-blue-500" />
//                                                     <span>{room}</span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}

//                                 {(property.covered_parking > 0 || property.open_parking > 0) && (
//                                     <div>
//                                         <h4 className="font-medium text-gray-700 mb-2">Parking</h4>
//                                         <div className="flex gap-4">
//                                             {property.covered_parking > 0 && (
//                                                 <div className="flex items-center gap-2 text-gray-600">
//                                                     <FaCar className="text-blue-500" />
//                                                     <span>Covered: {property.covered_parking}</span>
//                                                 </div>
//                                             )}
//                                             {property.open_parking > 0 && (
//                                                 <div className="flex items-center gap-2 text-gray-600">
//                                                     <FaParking className="text-blue-500" />
//                                                     <span>Open: {property.open_parking}</span>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 )}

//                                 <div>
//                                     <h4 className="font-medium text-gray-700 mb-2">Furnishing</h4>
//                                     <div className="flex items-center gap-2 text-gray-600">
//                                         <FaCouch className="text-blue-500" />
//                                         <span>{property.furnishing || "Not furnished"}</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="p-6 border-t border-gray-200">
//                     <h3 className="text-xl font-semibold text-gray-800 mb-4">Location Details</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         <div>
//                             <h4 className="font-medium text-gray-700 mb-2">Address</h4>
//                             <div className="flex items-start gap-2 text-gray-600">
//                                 <FaMapMarkerAlt className="text-red-500 mt-1" />
//                                 <div>
//                                     <p>{property.location?.society}</p>
//                                     <p>{property.location?.locality}</p>
//                                     <p>{property.location?.city}, {property.location?.state}</p>
//                                     <p>{property.location?.pincode}</p>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* <div>
//                             <h4 className="font-medium text-gray-700 mb-2">Landmarks</h4>
//                             {property.location?.landmarks?.length > 0 ? (
//                                 <ul className="text-gray-600 space-y-1">
//                                     {property.location.landmarks.map((landmark, index) => (
//                                         <li key={index} className="flex items-center gap-2">
//                                             <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
//                                             {landmark}
//                                         </li>
//                                     ))}
//                                 </ul>
//                             ) : (
//                                 <p className="text-gray-500">No landmarks specified</p>
//                             )}
//                         </div> */}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <>
//             {isFullscreen && (
//                 <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
//                     <button
//                         onClick={() => setIsFullscreen(false)}
//                         className="absolute top-4 right-4 text-white text-2xl p-2"
//                         aria-label="Close fullscreen"
//                     >
//                         <FaTimes />
//                     </button>
                    
//                     <div className="relative w-full h-full max-w-6xl max-h-screen flex items-center">
//                         <button
//                             onClick={handlePrevImage}
//                             className="absolute left-4 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
//                             aria-label="Previous image"
//                         >
//                             <FaChevronLeft size={24} />
//                         </button>
                        
//                         <div className="w-full h-full flex items-center justify-center">
//                             <motion.img
//                                 key={currentImageIndex}
//                                 src={images[currentImageIndex]?.preview}
//                                 alt="Property fullscreen"
//                                 className="max-w-full max-h-full object-contain"
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 transition={{ duration: 0.3 }}
//                             />
//                         </div>
                        
//                         <button
//                             onClick={handleNextImage}
//                             className="absolute right-4 bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
//                             aria-label="Next image"
//                         >
//                             <FaChevronRight size={24} />
//                         </button>
//                     </div>
                    
//                     <div className="absolute bottom-4 left-0 right-0 flex justify-center">
//                         <div className="flex gap-2 overflow-x-auto py-2 px-4">
//                             {images.map((img, index) => (
//                                 <motion.div
//                                     key={index}
//                                     className={`w-16 h-16 rounded-md overflow-hidden cursor-pointer border-2 ${currentImageIndex === index ? 'border-white' : 'border-transparent'}`}
//                                     onClick={() => handleThumbnailClick(index)}
//                                     whileHover={{ scale: 1.05 }}
//                                 >
//                                     <img
//                                         src={img.preview}
//                                         alt={`Thumbnail ${index + 1}`}
//                                         className="w-full h-full object-cover"
//                                     />
//                                 </motion.div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {property.property_type === "Commercial Land" || property.property_type === "Plot / Land" 
//                 ? renderLandProperty() 
//                 : renderResidentialCommercialProperty()}
//         </>
//     );
// };

// export default Viewdetails;


















































import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import Loader from "../Loader";
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBath, FaBed, FaRulerCombined, FaCar, FaHome, FaToilet, FaBuilding,
  FaCompass, FaCouch, FaCheckCircle, FaDoorOpen, FaParking,
  FaChevronLeft, FaChevronRight, FaTimes, FaMapMarkerAlt, FaExpand
} from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { MdBalcony } from "react-icons/md";
import { CiStopwatch } from "react-icons/ci";
import { GiFloorPolisher } from "react-icons/gi";
import { BsHouseDoor, BsBuilding } from "react-icons/bs";

const Viewdetails = () => {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [touchStartX, setTouchStartX] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    // Memoized property data calculations
    const { formattedPrice, pricePerSqFt } = useMemo(() => {
        if (!property) return { formattedPrice: "Price on request", pricePerSqFt: null };
        
        const expectedPrice = property.expected_price || 0;
        const carpetArea = property.carpet_area || 0;
        
        const formatPrice = (price) => {
            if (!price) return "Price on request";
            if (price >= 10000000) {
                return (price / 10000000).toFixed(1) + ' Cr';
            } else if (price >= 100000) {
                return (price / 100000).toFixed(0) + ' Lakh';
            }
            return price?.toLocaleString();
        };
        
        const pricePerSqFt = expectedPrice && carpetArea ? (expectedPrice / carpetArea).toFixed(2) : null;
        
        return {
            formattedPrice: property.listing_type?.toLowerCase() === "sell" 
                ? `₹${formatPrice(expectedPrice)}` 
                : `₹${formatPrice(property.rent_price)} / month`,
            pricePerSqFt
        };
    }, [property]);

    // SEO data generation
    const seoData = useMemo(() => {
        if (!property) return { title: '', description: '', schema: {} };
        
        const {
            property_type, bedrooms, bathrooms, carpet_area, area_unit, location,
            expected_price, rent_price, selected_amenities, summary, property_category
        } = property;

        const title = `${bedrooms} ${property_category === "commercial" ? "Space" : "BHK"} ${property_type} in ${location?.society}, ${location?.city}`;
        const description = summary || `Find this ${property_type} with ${bedrooms} ${property_category === "commercial" ? "working spaces" : "bedrooms"} and ${bathrooms} bathrooms, spread across ${carpet_area} ${area_unit}.`;
        const price = expected_price ? `₹${expected_price}` : rent_price ? `₹${rent_price}/month` : "Price on request";

        return {
            title,
            description,
            schema: {
                "@context": "https://schema.org",
                "@type": "RealEstateListing",
                "name": title,
                "description": description,
                "image": images[0]?.preview || '',
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": location?.society,
                    "addressLocality": location?.locality,
                    "addressRegion": location?.city,
                    "addressCountry": "IN",
                },
                "numberOfRooms": bedrooms,
                "numberOfBathroomsTotal": bathrooms,
                "floorSize": {
                    "@type": "QuantitativeValue",
                    "value": carpet_area,
                    "unitCode": area_unit,
                },
                "price": expected_price || rent_price,
                "priceCurrency": "INR",
                "amenities": selected_amenities,
            }
        };
    }, [property, images]);

    const fetchProperty = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('dmhproperties')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            setProperty(data);
            
            // Fetch images in parallel with property data
            const imageUrls = await getImageUrls(data.id);
            setImages(imageUrls);
        } catch (error) {
            console.error('Error fetching property:', error.message);
            setProperty(null);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const getImageUrls = async (propertyId) => {
        try {
            const { data, error } = await supabase.storage
                .from('property-images')
                .list(`${propertyId}/images`);

            if (error) return [];
            
            // Pre-generate URLs for all images
            return data.map((file) => ({
                preview: supabase.storage.from('property-images').getPublicUrl(`${propertyId}/images/${file.name}`).data.publicUrl,
                thumbnail: supabase.storage.from('property-images').getPublicUrl(`${propertyId}/images/${file.name}`, {
                    transform: {
                        width: 200,
                        height: 200,
                        resize: 'cover'
                    }
                }).data.publicUrl
            }));
        } catch (error) {
            console.error('Error fetching images:', error);
            return [];
        }
    };

    // Image navigation handlers
    const handlePrevImage = useCallback(() => {
        setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const handleNextImage = useCallback(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, [images.length]);

    const handleThumbnailClick = useCallback((index) => {
        setCurrentImageIndex(index);
    }, []);

    // Touch event handlers for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (diff > 50) {
            handleNextImage();
        } else if (diff < -50) {
            handlePrevImage();
        }
        
        setTouchStartX(null);
    };

    // Fullscreen toggle
    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => !prev);
    }, []);

    // Keyboard navigation in fullscreen
    const handleKeyDown = useCallback((e) => {
        if (!isFullscreen) return;
        
        switch (e.key) {
            case 'Escape':
                setIsFullscreen(false);
                break;
            case 'ArrowLeft':
                handlePrevImage();
                break;
            case 'ArrowRight':
                handleNextImage();
                break;
            default:
                break;
        }
    }, [isFullscreen, handlePrevImage, handleNextImage]);

    useEffect(() => {
        fetchProperty();
    }, [fetchProperty]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-blue-50">
                <Loader />
            </div>
        );
    }

    if (!property) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-blue-50 p-4">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Property Not Found</h2>
                <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or may have been removed.</p>
                <button
                    onClick={() => navigate("/")}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                    Browse Properties
                </button>
            </div>
        );
    }

    const renderMainImage = () => (
        <div 
            className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-100 rounded-xl overflow-hidden shadow-lg"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <AnimatePresence initial={false} custom={currentImageIndex}>
                <motion.div
                    key={currentImageIndex}
                    className="w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <img
                        src={images[currentImageIndex]?.preview}
                        alt="Property"
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={toggleFullscreen}
                        loading="lazy"
                        decoding="async"
                    />
                </motion.div>
            </AnimatePresence>
            
            {images.length > 1 && (
                <>
                    <button
                        onClick={handlePrevImage}
                        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                        aria-label="Previous image"
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        onClick={handleNextImage}
                        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                        aria-label="Next image"
                    >
                        <FaChevronRight />
                    </button>
                    <button
                        onClick={toggleFullscreen}
                        className="absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-white/80 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                        aria-label="Expand image"
                    >
                        <FaExpand />
                    </button>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                        <div className="flex gap-1">
                            {images.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full ${currentImageIndex === index ? 'bg-blue-600' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    // const renderThumbnails = () => (
    //     images.length > 1 && (
    //         <div className="flex gap-2 mt-4 overflow-x-auto py-2 px-1 hide-scrollbar">
    //             {images.map((img, index) => (
    //                 <motion.div
    //                     key={index}
    //                     className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${currentImageIndex === index ? 'border-blue-500' : 'border-transparent'}`}
    //                     onClick={() => handleThumbnailClick(index)}
    //                     whileHover={{ scale: 1.05 }}
    //                 >
    //                     <img
    //                         src={img.thumbnail || img.preview}
    //                         alt={`Thumbnail ${index + 1}`}
    //                         className="w-full h-full object-cover"
    //                         loading="lazy"
    //                     />
    //                 </motion.div>
    //             ))}
    //         </div>
    //     )
    // );

    const renderPriceSection = () => (
        <div className="mb-4 md:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {formattedPrice}
                {pricePerSqFt && property.listing_type?.toLowerCase() === "sell" && (
                    <span className="text-sm sm:text-lg text-gray-500 ml-2">
                        (₹{pricePerSqFt}/sq.ft)
                    </span>
                )}
            </h1>
            <div className="text-lg font-semibold text-gray-700 mt-1">
                {property.bedrooms} {property.property_category === "commercial" ? "Space" : "BHK"} {property.property_type}
            </div>
            <div className="flex items-center text-gray-600 mt-1">
                <IoLocationSharp className="mr-1 flex-shrink-0" />
                <span className="truncate">
                    {property.location?.locality}, {property.location?.society}, {property.location?.city}
                </span>
            </div>
        </div>
    );

    const renderBasicDetails = () => (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                {property.property_category === "commercial" ? (
                    <BsBuilding className="text-blue-600 text-lg sm:text-xl" />
                ) : (
                    <BsHouseDoor className="text-blue-600 text-lg sm:text-xl" />
                )}
                <div>
                    <div className="text-xs text-gray-500">Type</div>
                    <div className="font-medium text-sm sm:text-base">{property.property_type}</div>
                </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                {property.property_category === "commercial" ? (
                    <FaDoorOpen className="text-blue-600 text-lg sm:text-xl" />
                ) : (
                    <FaBed className="text-blue-600 text-lg sm:text-xl" />
                )}
                <div>
                    <div className="text-xs text-gray-500">{property.property_category === "commercial" ? "Spaces" : "Beds"}</div>
                    <div className="font-medium text-sm sm:text-base">{property.bedrooms}</div>
                </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                <FaBath className="text-blue-600 text-lg sm:text-xl" />
                <div>
                    <div className="text-xs text-gray-500">Baths</div>
                    <div className="font-medium text-sm sm:text-base">{property.bathrooms}</div>
                </div>
            </div>
            
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                <FaRulerCombined className="text-blue-600 text-lg sm:text-xl" />
                <div>
                    <div className="text-xs text-gray-500">Area</div>
                    <div className="font-medium text-sm sm:text-base">{property.carpet_area} {property.area_unit}</div>
                </div>
            </div>
            
            {property.balconies > 0 && (
                <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <MdBalcony className="text-blue-600 text-lg sm:text-xl" />
                    <div>
                        <div className="text-xs text-gray-500">Balconies</div>
                        <div className="font-medium text-sm sm:text-base">{property.balconies}</div>
                    </div>
                </div>
            )}
            
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                <FaCompass className="text-blue-600 text-lg sm:text-xl" />
                <div>
                    <div className="text-xs text-gray-500">Facing</div>
                    <div className="font-medium text-sm sm:text-base">{property.facing || "Not specified"}</div>
                </div>
            </div>
            
            {(property.property_type === "Flat/Apartment" || property.property_type === "Office Space") && (
                <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <GiFloorPolisher className="text-blue-600 text-lg sm:text-xl" />
                    <div>
                        <div className="text-xs text-gray-500">Floor</div>
                        <div className="font-medium text-sm sm:text-base">
                            {property.selected_floor}
                            <sup>
                                {property.selected_floor === 1
                                    ? "st"
                                    : property.selected_floor === 2
                                    ? "nd"
                                    : property.selected_floor === 3
                                    ? "rd"
                                    : "th"}
                            </sup>{" "}
                            of {property.total_floors}
                        </div>
                    </div>
                </div>
            )}
            
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-blue-50 rounded-lg">
                <CiStopwatch className="text-blue-600 text-lg sm:text-xl" />
                <div>
                    <div className="text-xs text-gray-500">Possession</div>
                    <div className="font-medium text-sm sm:text-base">
                        {property.possessiondate ? property.possessiondate : "Ready to Move"}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAmenities = () => (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Amenities</h3>
            {property.selected_amenities?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {property.selected_amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
                            <FaCheckCircle className="text-green-500 flex-shrink-0" />
                            <span className="truncate">{amenity}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No amenities listed</p>
            )}
        </div>
    );

    const renderAdditionalFeatures = () => (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Additional Features</h3>
            <div className="space-y-3 sm:space-y-4">
                {property.selected_rooms?.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-700 mb-1 sm:mb-2">Additional Rooms</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {property.selected_rooms.map((room, index) => (
                                <div key={index} className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                                    <FaDoorOpen className="text-blue-500 flex-shrink-0" />
                                    <span className="truncate">{room}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {(property.covered_parking > 0 || property.open_parking > 0) && (
                    <div>
                        <h4 className="font-medium text-gray-700 mb-1 sm:mb-2">Parking</h4>
                        <div className="flex flex-wrap gap-2 sm:gap-4">
                            {property.covered_parking > 0 && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                                    <FaCar className="text-blue-500 flex-shrink-0" />
                                    <span>Covered: {property.covered_parking}</span>
                                </div>
                            )}
                            {property.open_parking > 0 && (
                                <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                                    <FaParking className="text-blue-500 flex-shrink-0" />
                                    <span>Open: {property.open_parking}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div>
                    <h4 className="font-medium text-gray-700 mb-1 sm:mb-2">Furnishing</h4>
                    <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                        <FaCouch className="text-blue-500 flex-shrink-0" />
                        <span>{property.furnishing || "Not furnished"}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderLocationDetails = () => (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm mt-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Location Details</h3>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div>
                    <h4 className="font-medium text-gray-700 mb-1 sm:mb-2">Address</h4>
                    <div className="flex items-start gap-2 text-gray-600 text-sm sm:text-base">
                        <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                        <div>
                            <p>{property.location?.society}</p>
                            <p>{property.location?.locality}</p>
                            <p>{property.location?.city}, {property.location?.state}</p>
                            <p>{property.location?.pincode}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderFullscreenGallery = () => (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-2 sm:p-4">
            <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white text-xl sm:text-2xl p-1 sm:p-2"
                aria-label="Close fullscreen"
            >
                <FaTimes />
            </button>
            
            <div className="relative w-full h-full max-w-6xl max-h-screen flex items-center">
                <button
                    onClick={handlePrevImage}
                    className="absolute left-2 sm:left-4 bg-white/20 text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-colors"
                    aria-label="Previous image"
                >
                    <FaChevronLeft size={20} />
                </button>
                
                <div className="w-full h-full flex items-center justify-center">
                    <motion.img
                        key={currentImageIndex}
                        src={images[currentImageIndex]?.preview}
                        alt="Property fullscreen"
                        className="max-w-full max-h-full object-contain"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
                
                <button
                    onClick={handleNextImage}
                    className="absolute right-2 sm:right-4 bg-white/20 text-white p-2 sm:p-3 rounded-full hover:bg-white/30 transition-colors"
                    aria-label="Next image"
                >
                    <FaChevronRight size={20} />
                </button>
            </div>
            
            {/* <div className="absolute bottom-2 sm:bottom-4 left-0 right-0 flex justify-center">
                <div className="flex gap-1 sm:gap-2 overflow-x-auto py-2 px-2 sm:px-4">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            className={`flex-shrink-0 w-12 sm:w-16 h-12 sm:h-16 rounded-md overflow-hidden cursor-pointer border-2 ${currentImageIndex === index ? 'border-white' : 'border-transparent'}`}
                            onClick={() => handleThumbnailClick(index)}
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src={img.thumbnail || img.preview}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </motion.div>
                    ))}
                </div>
            </div> */}
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <Helmet>
                <title>{seoData.title}</title>
                <meta name="description" content={seoData.description} />
                <meta name="keywords" content={property?.selected_amenities?.join(", ") || ''} />
                <meta property="og:title" content={seoData.title} />
                <meta property="og:description" content={seoData.description} />
                <meta property="og:image" content={images[0]?.preview || ''} />
                <meta property="og:type" content="product" />
                <meta property="og:locale" content="en_IN" />
                <script type="application/ld+json">
                    {JSON.stringify(seoData.schema, null, 2)}
                </script>
            </Helmet>

            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Header Section */}
                    <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        {renderPriceSection()}
                        <button
                            onClick={() => navigate("/")}
                            className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md w-full sm:w-auto text-center"
                        >
                            Browse Properties
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                            {/* Image Gallery */}
                            <div className="w-full lg:w-1/2">
                                {renderMainImage()}
                                {/* {renderThumbnails()} */}
                            </div>

                            {/* Property Details */}
                            <div className="w-full lg:w-1/2">
                                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">Property Highlights</h2>
                                    
                                    {renderBasicDetails()}
                                    
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-3">About This Property</h3>
                                    <p className="text-gray-600 text-sm sm:text-base">
                                        {property.summary || "No detailed description available for this property."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Amenities and Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                            {renderAmenities()}
                            {renderAdditionalFeatures()}
                        </div>

                        {/* Location */}
                        {renderLocationDetails()}
                    </div>
                </div>
            </div>

            {isFullscreen && renderFullscreenGallery()}

            <style jsx>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default Viewdetails;