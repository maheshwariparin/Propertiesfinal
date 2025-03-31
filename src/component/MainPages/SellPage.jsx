import React, { useState } from 'react';
import { FaSearch, FaHome, FaBuilding } from 'react-icons/fa';

const SellPage = () => {
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [selectedBHK, setSelectedBHK] = useState([]);
  const [localities] = useState(['Downtown', 'Suburb', 'Business District', 'Residential Area']);
  const [sellRange, setSellRange] = useState([0, 100000000]);
  const [rentRange, setRentRange] = useState([0, 500000]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryToggle = (category) => {
    if (category === 'all') {
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

  const formatPrice = (price) => 
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(price);


  const runFilter = () => {
    const filteredProperties = properties.filter((property) => {
      // Search match
      const searchMatch = searchQuery
        ? (
            property.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location?.locality?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.location?.society?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;
  
      // Locality match (multiple selection)
      const localityMatch = localities.length === 0 || 
        localities.includes(property.location?.locality);
  
      // Price range matches
      const rentMatch = property.rent_price
        ? (property.rent_price >= rentRange[0] && property.rent_price <= rentRange[1])
        : true;
        
      const sellMatch = property.expected_price
        ? (property.expected_price >= sellRange[0] && property.expected_price <= sellRange[1])
        : true;
  
      // Category match with 'all' option
      const categoryMatch = selectedCategories.includes('all') || 
        selectedCategories.includes(property.property_category);
  
      // BHK configuration match
      const bhkMatch = selectedBHK.length === 0 || 
        selectedBHK.some(bhk => {
          if (bhk === '3+') return property.bedrooms >= 3;
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

  return (
    <div className="bg-white rounded-4xl shadow-md p-10 max-w-3xl mx-auto my-4">
    <div className="relative mb-4">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-xs"
      />
      <FaSearch className="absolute left-2 top-2 text-gray-400 text-xs" />
    </div>

    {/* Category Selectors */}
    <div className="flex flex-wrap gap-2 mb-4">
      {['all', 'residential', 'commercial'].map((category) => (
        <button
          key={category}
          onClick={() => handleCategoryToggle(category)}
          className={`flex items-center px-3 py-1 rounded-md text-xs transition-colors ${
            selectedCategories.includes(category)
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
          }`}
        >
          {category === 'all' && <FaHome className="mr-1 text-[0.6rem]" />}
          {category === 'residential' && <FaHome className="mr-1 text-[0.6rem]" />}
          {category === 'commercial' && <FaBuilding className="mr-1 text-[0.6rem]" />}
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>

    {/* BHK Selectors */}
    {selectedCategories.includes('residential') && (
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleBHKToggle('all')}
          className={`px-3 py-1 rounded-md text-xs ${
            selectedBHK.includes('all')
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
          }`}
        >
          All
        </button>
        {[2, 3, 4].map((bhk) => (
          <button
            key={bhk}
            onClick={() => handleBHKToggle(bhk)}
            className={`px-2.5 py-0.5 rounded-md text-xs ${
              selectedBHK.includes(bhk)
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
            }`}
          >
            {bhk}BHK
          </button>
        ))}
      </div>
    )}

    {/* Filters Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Locality Dropdown */}
      <div className="space-y-1">
        <label className="block text-[0.7rem] font-medium text-gray-600 mb-0.5">Locality</label>
        <select className="w-full px-2 py-1 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-blue-400">
          <option value="">All Areas</option>
          {localities.map((locality) => (
            <option key={locality} value={locality}>{locality}</option>
          ))}
        </select>
      </div>

      {/* Price Ranges - Side by Side */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Sell', value: sellRange[1], max: 100000000, setter: setSellRange },
          { label: 'Rent', value: rentRange[1], max: 500000, setter: setRentRange }
        ].map((range, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-[0.7rem] text-gray-600 font-medium">
              <span>{range.label}:</span>
              <span>₹{formatPrice(range.value)}</span>
            </div>
            <input
              type="range"
              min="0"
              max={range.max}
              value={range.value}
              onChange={(e) => range.setter([0, parseInt(e.target.value)])}
              className="w-full h-1 bg-gray-200 rounded-full accent-blue-500"
              style={{
                background: `linear-gradient(to right, #3b82f6 ${(range.value / range.max) * 100}%, #e5e7eb ${(range.value / range.max) * 100}%)`
              }}
            />
          </div>
        ))}
      </div>
    </div>

  
    <div className="mt-4 flex justify-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-md text-xs font-medium transition-colors"
      onClick={runFilter}>
      
        Show Properties
      </button>
    </div>
  </div>
  );
};

export default SellPage;




























// <div
//     className="w-full h-auto border-gray-100 flex  mt-2 justify-center relative md:h-[450px] md:bg-cover md:bg-center">
//     {images.length > 0 ? (
//         <Carousel
//             autoPlay
//             infiniteLoop
//             interval={1500}
//             showThumbs={false}
//             showIndicators={true}
//             showStatus={false}
//             className="w-[80%] h-[150px] sm:h-[300px]   max-w-screen-xl shadow-2xl"
//         >
//             {images.map((image, index) => {
//                 const property = propertyDetails.find(p => p.id === image.id);
//                 return (
//                     <div key={index} className="relative">
//     <img
//     src={image.url}
//     alt="crosole image property ahmedabad south bopal shela jodhpur satellite anandnagar" 
//     className="w-full h-full aspect-[16/9] md:aspect-[22/9] object-cover  opacity-90"
// />

//                         {property && (
//                             <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-800 to-transparent p-3 flex items-center">
//                           <CiLocationOn className="h-6 w-6 text-white" />
//                           <div className="ml-2">
//                             <h1 className="text-lg font-bold text-white truncate">
//                               {property.location?.society || "Unknown Society"}
//                             </h1>
//                             <h1 className="text-base text-gray-200 truncate">
//                               {property.location?.locality || "Unknown Locality"}
//                             </h1>
//                           </div>
//                         </div>
//                         )}
//                     </div>
//                 );
//             })}
//         </Carousel>
//     ) : (
//         <p className="text-gray-600 text-lg">No images found. Add valid property IDs!</p>
//     )}
// </div>


























