// import React, { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';
// import { useNavigate,Link } from "react-router-dom";
// import { Menu, X } from "lucide-react";
// import Loader from "./Loader";

// function ShowAllProperties() {
//     const [properties, setProperties] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');
   
//     useEffect(() => {
//         fetchProperties();
//     }, []);

//     const fetchProperties = async () => {
//         setLoading(true);
//         const { data, error } = await supabase
//             .from('dmhproperties')
//             .select('*');

//         if (error) {
//             console.error('Error fetching properties:', error.message);
//         } else {
//             const propertiesWithImages = await Promise.all(
//                 data.map(async (property) => {
//                     const imageUrl = await getFirstImageUrl(property.id);
//                     return { ...property, imageUrl };
//                 })
//             );
//             setProperties(propertiesWithImages);
//         }
//         setLoading(false);
//     };
//     const handleDelete = async (propertyId) => {
//       const confirmed = window.confirm("Are you sure you want to delete this property?");
//       if (!confirmed) return;
    
//       try {
//         // List all files in the folder
//         const { data: files, error: listError } = await supabase.storage
//           .from('property-images')
//           .list(`${propertyId}/images`);
    
//         if (listError) {
//           console.error('Error listing property images:', listError.message);
//           return;
//         }
    
//         if (files && files.length > 0) {
//           // Collect full file paths for deletion
//           const filePaths = files.map((file) => `${propertyId}/images/${file.name}`);
    
//           // Delete the files
//           const { error: storageError } = await supabase.storage
//             .from('property-images')
//             .remove(filePaths);
    
//           if (storageError) {
//             console.error('Error deleting property images:', storageError.message);
//             return;
//           }
    
//           console.log('Property images deleted successfully!');
//         } else {
//           console.log('No images found for this property.');
//         }
    
//         // Delete property from database
//         const { error: dbError } = await supabase
//           .from('dmhproperties')
//           .delete()
//           .eq('id', propertyId);
    
//         if (dbError) {
//           console.error('Error deleting property:', dbError.message);
//         } else {
//           setProperties((prevProperties) => prevProperties.filter((property) => property.id !== propertyId));
//           console.log('Property deleted successfully!');
//         }
//       } catch (err) {
//         console.error('Unexpected error:', err.message);
//       }
//     }
    
//     // Let me know if you want me to tweak anything else! 🚀
    
    

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

//     const getFirstImageUrl = async (propertyId) => {
//         const { data, error } = await supabase.storage
//             .from('property-images')
//             .list(`${propertyId}/images`, { limit: 1, sortBy: { column: 'name', order: 'asc' } });

//         if (error) {
//             console.error('Error fetching image:', error.message);
//             return null;
//         }

//         if (data && data.length > 0) {
//             const filePath = `${propertyId}/images/${data[0].name}`;
//             const { data: urlData } = supabase.storage
//                 .from('property-images')
//                 .getPublicUrl(filePath);
//             return urlData.publicUrl;
//         }
//         return null;
//     };

//     const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
  

//   useEffect(() => {
//     if (!sessionStorage.getItem("isLoggedIn")) {
//       navigate("/login");
//     } else {
//       setTimeout(() => setLoading(false), 2000);
//     }
//   }, [navigate]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-blue-100">
//         <Loader />
//       </div>
//     );
//   }

// const filteredProperties = properties.filter((property) =>
//           property.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           property.location?.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           property.location?.society?.toLowerCase().includes(searchQuery.toLowerCase())
//       );

//     return (
//         <div className="space-y-6 bg-blue-50 h-full">
          
//           <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-lg">
//         <div className="text-2xl font-bold">DMH Properties</div>
//         <div className="flex gap-4">
         
//         <div className="flex justify-between items-center">
//                 <input
//                     type="text"
//                     placeholder="Search by city, locality, or society..."
//                     className="p-2 w-full border border-blue-300 rounded-lg shadow"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//             </div>

//           <button className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg shadow">
//             Logout
//           </button>
//           <button className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg shadow" 
//             onClick={()=>{navigate("/dmhpropertiesformsubmitonlyforadmin")}}
//           >
//             Add Property
//           </button>
//           <button className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg shadow"
//           onClick={()=>{navigate("/")}}
//           >
//             Home
//           </button>
//         </div>
//       </nav>

//       <div className="flex">
//         <div
//           className={`$ {
//             sidebarOpen ? "w-80" : "w-16"
//           } h-auto border-r border-blue-300 transition-all duration-300 ${
//             sidebarOpen ? 'bg-blue-200' : 'bg-blue-50 border-none'
//           } shadow-lg`}
//         >
//           <button
//             className="p-4 text-blue-700 hover:text-blue-900"
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//           >
//             {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>

//           {sidebarOpen && (
//             <ul className="mt-4 flex flex-col space-y-2 p-4">
//               <Link to="/admin" className="hover:bg-blue-300 p-2 rounded cursor-pointer">Admin</Link>
//               <Link to="/maincorosole" className="hover:bg-blue-300 p-2 rounded cursor-pointer">Set Corosole</Link>
//             </ul>
//           )}
//         </div>
          

//         <div className="h-auto ml-[15px] w-[1350px] bg-blue-50">
//         {filteredProperties.length === 0 ? (
//                 <p className="text-center text-blue-700">No properties found.</p>
//             ) : ( 
//                 filteredProperties.map((property, index) => (
//                   <div key={property.id || index} className="flex w-full mt-2 border h-auto border-blue-200 rounded-2xl shadow-lg bg-white overflow-hidden">
//                                            {property.imageUrl ? (
//                                               <img 
//                                                   src={property.imageUrl} 
//                                                   alt="Property banner" 
//                                                   className="w-1/3 mt-5 ml-3 h-64 object-cover rounded-2xl"
//                                               />
//                                           ) : (
//                                               <div className="w-1/3 h-64 bg-gray-300 flex items-center justify-center rounded-l-2xl">
//                                                   <span className="text-gray-500">No Image Available</span>
//                                               </div>
//                                           )}
//                                           <div className="w-2/3 p-3">
//                                               <div className='flex justify-between items-center mb-2'>
//                                                   <h2 className="text-2xl font-bold text-black">{property.location?.society}</h2>
//                                                   <div>
//                                                       <button 
//                                                           className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full mr-2 hover:bg-red-200"
//                                                           onClick={() => handleDelete(property.id)}
//                                                       >
//                                                           Delete
//                                                       </button>
//                                                       <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">{property.listing_type}</span>
//                                                   </div>
//                                               </div>
//                                               <div className='flex'>
//                                                   <h3 className="text-lg text-black">{property.location?.city}, {property.location?.locality}</h3>
//                                                   <h2 className="text-lg text-black ml-20">{property.property_category} - {property.property_type}</h2>
//                                               </div>
//                                               <p className="text-gray-500 mb-2">Property ID: {property.id}</p>
//                                               {property.property_category === 'residential' && property.property_type === 'Flat/Apartment' && (
//                                                   <p className="text-lg text-black">{property.bedrooms} BHK - {property.bathrooms} Baths</p>
//                                               )}
//                                               <div className="flex items-center mt-4">
//                                                   <div className="text-black">
//                                                       {/* <p className="text-xl font-bold">₹{formatPrice(property.expected_price)}</p>
//                                                       <p className="text-md text-gray-500">₹{calculatePricePerSqFt(property.expected_price, property.carpet_area)}/sqft</p> */}
//                                                        <p className="text-xl font-bold">
//                                                       ₹{property.rent_price ? formatPrice(property.rent_price) + " / month" : formatPrice(property.expected_price)}
//                                                       </p>
//                                                      <p className="text-md text-gray-500">
//                                                      {property.rent_price ? "" : "₹"+calculatePricePerSqFt(property.expected_price, property.carpet_area) + "/sqft"}
//                                                     </p>
//                                                   </div>
//                                                   <div className="h-[45px] w-[2px] bg-gray-500 mx-12"></div>
//                                                   <div>
//                                                       <p className="text-black font-bold">{property.carpet_area} {property.area_unit}</p>
//                                                   </div>
//                                               </div>
//                                               <p className="mt-4 text-sm text-gray-600">{property.summary}</p>
//                                           </div>
//                                       </div>
//                 ))
//             )}
          
//         </div>
//       </div>
//         </div>
//     );
// }

// export default ShowAllProperties;




























// import React, { useEffect, useState } from 'react';
// import { supabase } from '../supabaseClient';
// import { useNavigate, Link } from "react-router-dom";
// import { Menu, X } from "lucide-react";
// import Loader from "./Loader";

// function ShowAllProperties() {
//     const [properties, setProperties] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [selectedProperties, setSelectedProperties] = useState([]);
//     const [showSelectionModal, setShowSelectionModal] = useState(false);
//     const [selectionError, setSelectionError] = useState('');
//     const navigate = useNavigate();
//     const [sidebarOpen, setSidebarOpen] = useState(true);

//     useEffect(() => {
//         fetchProperties();
        
//         if (!sessionStorage.getItem("isLoggedIn")) {
//             navigate("/login");
//         }
//     }, [navigate]);

//     const fetchProperties = async () => {
//         setLoading(true);
//         const { data, error } = await supabase
//             .from('dmhproperties')
//             .select('*');

//         if (error) {
//             console.error('Error fetching properties:', error.message);
//         } else {
//             const propertiesWithImages = await Promise.all(
//                 data.map(async (property) => {
//                     const imageUrl = await getFirstImageUrl(property.id);
//                     return { ...property, imageUrl };
//                 })
//             );
//             setProperties(propertiesWithImages);
//             fetchSelectedProperties();
//         }
//         setLoading(false);
//     };

//     const fetchSelectedProperties = async () => {
//         const { data, error } = await supabase
//             .from('dmhpropertiescorosole')
//             .select('code')
//             .order('id', { ascending: true });

//         if (!error && data) {
//             const selectedIds = data.map(item => item.code).filter(Boolean);
//             setSelectedProperties(selectedIds);
//         }
//     };

//     const handleDelete = async (propertyId) => {
//         const confirmed = window.confirm("Are you sure you want to delete this property?");
//         if (!confirmed) return;

//         try {
//             // List all files in the folder
//             const { data: files, error: listError } = await supabase.storage
//                 .from('property-images')
//                 .list(`${propertyId}/images`);

//             if (listError) {
//                 console.error('Error listing property images:', listError.message);
//                 return;
//             }

//             if (files && files.length > 0) {
//                 const filePaths = files.map((file) => `${propertyId}/images/${file.name}`);
//                 const { error: storageError } = await supabase.storage
//                     .from('property-images')
//                     .remove(filePaths);

//                 if (storageError) {
//                     console.error('Error deleting property images:', storageError.message);
//                     return;
//                 }
//             }

//             // Delete property from database
//             const { error: dbError } = await supabase
//                 .from('dmhproperties')
//                 .delete()
//                 .eq('id', propertyId);

//             if (!dbError) {
//                 setProperties(prev => prev.filter(p => p.id !== propertyId));
//                 setSelectedProperties(prev => prev.filter(id => id !== propertyId));
//             }
//         } catch (err) {
//             console.error('Unexpected error:', err.message);
//         }
//     };

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

//     const getFirstImageUrl = async (propertyId) => {
//         const { data, error } = await supabase.storage
//             .from('property-images')
//             .list(`${propertyId}/images`, { limit: 1, sortBy: { column: 'name', order: 'asc' } });

//         if (error) {
//             console.error('Error fetching image:', error.message);
//             return null;
//         }

//         if (data && data.length > 0) {
//             const filePath = `${propertyId}/images/${data[0].name}`;
//             const { data: urlData } = supabase.storage
//                 .from('property-images')
//                 .getPublicUrl(filePath);
//             return urlData.publicUrl;
//         }
//         return null;
//     };

//     const togglePropertySelection = (propertyId) => {
//         setSelectionError('');
//         if (selectedProperties.includes(propertyId)) {
//             setSelectedProperties(prev => prev.filter(id => id !== propertyId));
//         } else {
//             if (selectedProperties.length >= 5) {
//                 setSelectionError('You can select maximum 5 properties for carousel');
//                 return;
//             }
//             setSelectedProperties(prev => [...prev, propertyId]);
//         }
//     };

//     const saveSelectedProperties = async () => {
//         try {
//             // Prepare payload with selected properties
//             const payload = selectedProperties.map((id, index) => ({
//                 id: index,
//                 code: id
//             }));

//             // Fill remaining slots with empty strings if less than 5 selected
//             while (payload.length < 5) {
//                 payload.push({ id: payload.length, code: '' });
//             }

//             const { error } = await supabase
//                 .from('dmhpropertiescorosole')
//                 .upsert(payload, { onConflict: ['id'] });

//             if (error) {
//                 console.error('Error saving carousel properties:', error.message);
//                 alert('Failed to save selection');
//             } else {
//                 setShowSelectionModal(false);
//                 alert('Carousel properties saved successfully!');
//             }
//         } catch (error) {
//             console.error('Unexpected error:', error.message);
//             alert('Failed to save selection');
//         }
//     };

//     const handleLogout = () => {
//         sessionStorage.removeItem("isLoggedIn");
//         navigate("/login");
//     };

//     const filteredProperties = properties.filter((property) =>
//         property.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         property.location?.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         property.location?.society?.toLowerCase().includes(searchQuery.toLowerCase())
//     );

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-screen bg-blue-100">
//                 <Loader />
//             </div>
//         );
//     }

//     return (
//         <div className="space-y-6 bg-blue-50 min-h-screen">
//             <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-lg">
//                 <div className="text-2xl font-bold">DMH Properties</div>
//                 <div className="flex gap-4 items-center">
//                     <div className="relative">
//                         <input
//                             type="text"
//                             placeholder="Search by city, locality, or society..."
//                             className="p-2 w-64 border border-blue-300 rounded-lg shadow"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                         />
//                     </div>

//                     <button 
//                         className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow flex items-center gap-2"
//                         onClick={() => setShowSelectionModal(true)}
//                     >
//                         <span>Set Carousel</span>
//                         <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
//                             {selectedProperties.length}
//                         </span>
//                     </button>
//                     <button 
//                         className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
//                         onClick={handleLogout}
//                     >
//                         Logout
//                     </button>
//                     <button 
//                         className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow" 
//                         onClick={() => navigate("/dmhpropertiesformsubmitonlyforadmin")}
//                     >
//                         Add Property
//                     </button>
//                     <button 
//                         className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
//                         onClick={() => navigate("/")}
//                     >
//                         Home
//                     </button>
//                 </div>
//             </nav>

//             <div className="flex">
//                 <div className={`${sidebarOpen ? "w-64" : "w-16"} bg-blue-200 transition-all duration-300 flex-shrink-0`}>
//                     <button
//                         className="p-4 text-blue-700 hover:text-blue-900 w-full flex justify-end"
//                         onClick={() => setSidebarOpen(!sidebarOpen)}
//                     >
//                         {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
//                     </button>

//                     {sidebarOpen && (
//                         <ul className="mt-4 flex flex-col space-y-2 p-4">
//                             <Link to="/admin" className="hover:bg-blue-300 p-2 rounded cursor-pointer">Admin</Link>
//                             <Link to="/maincorosole" className="hover:bg-blue-300 p-2 rounded cursor-pointer">Set Corosole</Link>
//                         </ul>
//                     )}
//                 </div>

//                 <div className="flex-1 p-4">
//                     {filteredProperties.length === 0 ? (
//                         <div className="text-center py-10">
//                             <p className="text-blue-700 text-lg">No properties found matching your search.</p>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 gap-4">
//                             {filteredProperties.map((property) => (
//                                 <div key={property.id} className="flex border border-blue-200 rounded-2xl shadow-lg bg-white overflow-hidden relative">
//                                     <div className="absolute top-4 left-4 z-10">
//                                         <input
//                                             type="checkbox"
//                                             checked={selectedProperties.includes(property.id)}
//                                             onChange={() => togglePropertySelection(property.id)}
//                                             className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
//                                         />
//                                     </div>
                                    
//                                     {property.imageUrl ? (
//                                         <img 
//                                             src={property.imageUrl} 
//                                             alt="Property" 
//                                             className="w-1/3 h-64 object-cover"
//                                         />
//                                     ) : (
//                                         <div className="w-1/3 h-64 bg-gray-300 flex items-center justify-center">
//                                             <span className="text-gray-500">No Image Available</span>
//                                         </div>
//                                     )}
//                                     <div className="w-2/3 p-4">
//                                         <div className='flex justify-between items-center mb-2'>
//                                             <h2 className="text-2xl font-bold text-black">{property.location?.society}</h2>
//                                             <div>
//                                                 <button 
//                                                     className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full mr-2 hover:bg-red-200"
//                                                     onClick={() => handleDelete(property.id)}
//                                                 >
//                                                     Delete
//                                                 </button>
//                                                 <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
//                                                     {property.listing_type}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                         <div className='flex flex-wrap gap-4 mb-2'>
//                                             <h3 className="text-lg text-black">{property.location?.city}, {property.location?.locality}</h3>
//                                             <h2 className="text-lg text-black">{property.property_category} - {property.property_type}</h2>
//                                         </div>
//                                         <p className="text-gray-500 mb-2">Property ID: {property.id}</p>
//                                         {property.property_category === 'residential' && property.property_type === 'Flat/Apartment' && (
//                                             <p className="text-lg text-black">{property.bedrooms} BHK - {property.bathrooms} Baths</p>
//                                         )}
//                                         <div className="flex items-center mt-4">
//                                             <div className="text-black">
//                                                 <p className="text-xl font-bold">
//                                                     ₹{property.rent_price ? formatPrice(property.rent_price) + " / month" : formatPrice(property.expected_price)}
//                                                 </p>
//                                                 <p className="text-md text-gray-500">
//                                                     {property.rent_price ? "" : "₹"+calculatePricePerSqFt(property.expected_price, property.carpet_area) + "/sqft"}
//                                                 </p>
//                                             </div>
//                                             <div className="h-[45px] w-[2px] bg-gray-500 mx-12"></div>
//                                             <div>
//                                                 <p className="text-black font-bold">{property.carpet_area} {property.area_unit}</p>
//                                             </div>
//                                         </div>
                                        
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Selection Modal */}
//             {showSelectionModal && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
//                         <h2 className="text-xl font-bold mb-4">Select Properties for Carousel</h2>
//                         <p className="mb-4">
//                             <span className="font-semibold">{selectedProperties.length} of 5</span> properties selected
//                         </p>
                        
//                         {selectionError && (
//                             <div className="text-red-500 mb-4 p-2 bg-red-50 rounded">{selectionError}</div>
//                         )}

//                         <div className="flex-1 overflow-y-auto mb-4 border rounded-lg">
//                             {selectedProperties.length === 0 ? (
//                                 <div className="p-4 text-center text-gray-500">
//                                     No properties selected yet. Select properties from the list.
//                                 </div>
//                             ) : (
//                                 selectedProperties.map((id, index) => {
//                                     const property = properties.find(p => p.id === id);
//                                     return property ? (
//                                         <div key={id} className="flex items-center p-3 border-b hover:bg-gray-50">
//                                             <span className="text-gray-500 w-8 text-center">{index + 1}</span>
//                                             <img 
//                                                 src={property.imageUrl || 'https://via.placeholder.com/80'} 
//                                                 alt="Property" 
//                                                 className="w-16 h-16 object-cover rounded mr-3"
//                                             />
//                                             <div className="flex-1 min-w-0">
//                                                 <h3 className="font-medium truncate">{property.location?.society || 'Untitled Property'}</h3>
//                                                 <p className="text-sm text-gray-600 truncate">
//                                                     {property.location?.locality}, {property.location?.city}
//                                                 </p>
//                                             </div>
//                                             <button 
//                                                 onClick={() => togglePropertySelection(id)}
//                                                 className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
//                                             >
//                                                 <X size={18} />
//                                             </button>
//                                         </div>
//                                     ) : null;
//                                 })
//                             )}
//                         </div>

//                         <div className="flex justify-end gap-3 pt-4 border-t">
//                             <button
//                                 onClick={() => setShowSelectionModal(false)}
//                                 className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={saveSelectedProperties}
//                                 disabled={selectedProperties.length === 0}
//                                 className={`px-4 py-2 rounded-md text-white ${selectedProperties.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
//                             >
//                                 Save Selection
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ShowAllProperties;
















































import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Loader from "./Loader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ShowAllProperties() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProperties, setSelectedProperties] = useState([]);
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Toast notification configuration
    const notifyError = (message) => toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    const notifySuccess = (message) => toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });

    useEffect(() => {
        fetchProperties();
        
        if (!sessionStorage.getItem("isLoggedIn")) {
            navigate("/login");
        }
    }, [navigate]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('dmhproperties')
                .select('*');

            if (error) throw error;

            const propertiesWithImages = await Promise.all(
                data.map(async (property) => {
                    const imageUrl = await getFirstImageUrl(property.id);
                    return { ...property, imageUrl };
                })
            );
            setProperties(propertiesWithImages);
            await fetchSelectedProperties();
        } catch (error) {
            console.error('Error fetching properties:', error.message);
            notifyError('Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    const fetchSelectedProperties = async () => {
        try {
            const { data, error } = await supabase
                .from('dmhpropertiescorosole')
                .select('code')
                .order('id', { ascending: true });

            if (error) throw error;

            if (data) {
                const selectedIds = data.map(item => item.code).filter(Boolean);
                setSelectedProperties(selectedIds);
            }
        } catch (error) {
            console.error('Error fetching selected properties:', error.message);
            notifyError('Failed to load carousel selections');
        }
    };

    const handleDelete = async (propertyId) => {
        const confirmed = window.confirm("Are you sure you want to delete this property?");
        if (!confirmed) return;

        try {
            // List all files in the folder
            const { data: files, error: listError } = await supabase.storage
                .from('property-images')
                .list(`${propertyId}/images`);

            if (listError) throw listError;

            if (files && files.length > 0) {
                const filePaths = files.map((file) => `${propertyId}/images/${file.name}`);
                const { error: storageError } = await supabase.storage
                    .from('property-images')
                    .remove(filePaths);

                if (storageError) throw storageError;
            }

            // Delete property from database
            const { error: dbError } = await supabase
                .from('dmhproperties')
                .delete()
                .eq('id', propertyId);

            if (dbError) throw dbError;

            setProperties(prev => prev.filter(p => p.id !== propertyId));
            setSelectedProperties(prev => prev.filter(id => id !== propertyId));
            notifySuccess('Property deleted successfully');
        } catch (err) {
            console.error('Unexpected error:', err.message);
            notifyError('Failed to delete property');
        }
    };

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

    const getFirstImageUrl = async (propertyId) => {
        try {
            const { data, error } = await supabase.storage
                .from('property-images')
                .list(`${propertyId}/images`, { limit: 1, sortBy: { column: 'name', order: 'asc' } });

            if (error) throw error;

            if (data && data.length > 0) {
                const filePath = `${propertyId}/images/${data[0].name}`;
                const { data: urlData } = supabase.storage
                    .from('property-images')
                    .getPublicUrl(filePath);
                return urlData.publicUrl;
            }
            return null;
        } catch (error) {
            console.error('Error fetching image:', error.message);
            return null;
        }
    };

    const togglePropertySelection = (propertyId) => {
        setSelectedProperties(prev => {
            // If property is already selected, remove it
            if (prev.includes(propertyId)) {
                return prev.filter(id => id !== propertyId);
            }
            
            // If trying to select more than 5, show notification and return current state
            if (prev.length >= 5) {
                notifyError('Maximum 5 properties can be selected for carousel');
                return prev;
            }
            
            // Add the new property
            return [...prev, propertyId];
        });
    };

    const saveSelectedProperties = async () => {
        try {
            // Prepare payload with selected properties
            const payload = selectedProperties.map((id, index) => ({
                id: index,
                code: id
            }));

            // Fill remaining slots with empty strings if less than 5 selected
            while (payload.length < 5) {
                payload.push({ id: payload.length, code: '' });
            }

            const { error } = await supabase
                .from('dmhpropertiescorosole')
                .upsert(payload, { onConflict: ['id'] });

            if (error) throw error;

            setShowSelectionModal(false);
            notifySuccess('Carousel properties saved successfully!');
        } catch (error) {
            console.error('Error saving carousel properties:', error.message);
            notifyError('Failed to save selection');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("isLoggedIn");
        navigate("/login");
    };

    const filteredProperties = properties.filter((property) =>
        property.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location?.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location?.society?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-blue-100">
                <Loader />
            </div>
        );
    }

    return (
        <div className="bg-blue-50 min-h-screen">
            <ToastContainer />
            <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-lg">
                <div className="text-2xl font-bold">DMH Properties</div>
                <div className="flex gap-4 items-center">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by city, locality, or society..."
                            className="p-2 w-64 border border-blue-300 rounded-lg shadow"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button 
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow flex items-center gap-2"
                        onClick={() => setShowSelectionModal(true)}
                    >
                        <span>Set Carousel</span>
                        <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                            {selectedProperties.length}
                        </span>
                    </button>
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow" 
                        onClick={() => navigate("/dmhpropertiesformsubmitonlyforadmin")}
                    >
                        Add Property
                    </button>
                    <button 
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
                        onClick={() => navigate("/")}
                    >
                        Home
                    </button>
                </div>
            </nav>

            <div className="flex">
                <div className={`${sidebarOpen ? "w-64" : "w-16"} bg-blue-200 transition-all duration-300 flex-shrink-0`}>
                    <button
                        className="p-4 text-blue-700 hover:text-blue-900 w-full flex justify-end"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {sidebarOpen && (
                        <ul className="mt-4 flex flex-col space-y-2 p-4">
                            <Link to="/admin" className="hover:bg-blue-300 p-2 rounded cursor-pointer">Admin</Link>
                            <Link to="/blogadmin" className="hover:bg-blue-300 p-2 rounded cursor-pointer">Set Blog</Link>
                        </ul>
                    )}
                </div>

                <div className="flex-1 p-4">
                    {filteredProperties.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-blue-700 text-lg">No properties found matching your search.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredProperties.map((property) => (
                                <div key={property.id} className="flex border border-blue-200 rounded-2xl shadow-lg bg-white overflow-hidden relative group">
                                    <div className="absolute top-4 left-4 z-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedProperties.includes(property.id)}
                                            onChange={() => togglePropertySelection(property.id)}
                                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity"
                                        />
                                    </div>
                                    
                                    {property.imageUrl ? (
                                        <img 
                                            src={property.imageUrl} 
                                            alt="Property" 
                                            className="w-1/3 h-64 object-cover"
                                        />
                                    ) : (
                                        <div className="w-1/3 h-64 bg-gray-300 flex items-center justify-center">
                                            <span className="text-gray-500">No Image Available</span>
                                        </div>
                                    )}
                                    <div className="w-2/3 p-4">
                                        <div className='flex justify-between items-center mb-2'>
                                            <h2 className="text-2xl font-bold text-black">{property.location?.society}</h2>
                                            <div>
                                                <button 
                                                    className="px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full mr-2 hover:bg-red-200 transition-colors"
                                                    onClick={() => handleDelete(property.id)}
                                                >
                                                    Delete
                                                </button>
                                                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                                                    property.listing_type === 'sell' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                                                }`}>
                                                    {property.listing_type}
                                                </span>
                                            </div>
                                        </div>
                                        <div className='flex flex-wrap gap-4 mb-2'>
                                            <h3 className="text-lg text-black">{property.location?.city}, {property.location?.locality}</h3>
                                            <h2 className="text-lg text-black">{property.property_category} - {property.property_type}</h2>
                                        </div>
                                        <p className="text-gray-500 mb-2">Property ID: {property.id}</p>
                                        {property.property_category === 'residential' && property.property_type === 'Flat/Apartment' && (
                                            <p className="text-lg text-black">{property.bedrooms} BHK - {property.bathrooms} Baths</p>
                                        )}
                                        <div className="flex items-center mt-4">
                                            <div className="text-black">
                                                <p className="text-xl font-bold">
                                                    ₹{property.rent_price ? formatPrice(property.rent_price) + " / month" : formatPrice(property.expected_price)}
                                                </p>
                                                <p className="text-md text-gray-500">
                                                    {property.rent_price ? "" : "₹"+calculatePricePerSqFt(property.expected_price, property.carpet_area) + "/sqft"}
                                                </p>
                                            </div>
                                            <div className="h-[45px] w-[2px] bg-gray-500 mx-12"></div>
                                            <div>
                                                <p className="text-black font-bold">{property.carpet_area} {property.area_unit}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Selection Modal */}
            {showSelectionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Select Properties for Carousel</h2>
                        <p className="mb-4">
                            <span className="font-semibold">{selectedProperties.length} of 5</span> properties selected
                        </p>
                        
                        <div className="flex-1 overflow-y-auto mb-4 border rounded-lg">
                            {selectedProperties.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">
                                    No properties selected yet. Select properties from the list.
                                </div>
                            ) : (
                                selectedProperties.map((id, index) => {
                                    const property = properties.find(p => p.id === id);
                                    return property ? (
                                        <div key={id} className="flex items-center p-3 border-b hover:bg-gray-50">
                                            <span className="text-gray-500 w-8 text-center">{index + 1}</span>
                                            <img 
                                                src={property.imageUrl || 'https://via.placeholder.com/80'} 
                                                alt="Property" 
                                                className="w-16 h-16 object-cover rounded mr-3"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium truncate">{property.location?.society || 'Untitled Property'}</h3>
                                                <p className="text-sm text-gray-600 truncate">
                                                    {property.location?.locality}, {property.location?.city}
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => togglePropertySelection(id)}
                                                className="ml-2 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ) : null;
                                })
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                onClick={() => setShowSelectionModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveSelectedProperties}
                                disabled={selectedProperties.length === 0}
                                className={`px-4 py-2 rounded-md text-white transition-colors ${
                                    selectedProperties.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                Save Selection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ShowAllProperties;