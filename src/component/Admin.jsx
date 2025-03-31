// import { useEffect, useState } from "react";
// import { useNavigate,Link } from "react-router-dom";
// import { Menu, X } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// const Admin = () => {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const { properties, loading, error,localities } = useSelector((state) => state.properties);
  
//   useEffect(() => {
//     if (!sessionStorage.getItem("isLoggedIn")) {
//       navigate("/login");
//     } else {
//     }
//   }, [navigate]);

//   const handlelogout = ()=>{
//     sessionStorage.removeItem("isLoggedIn");
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-blue-100">
//         <Loader />
//       </div>
//     );
//   }

//   return (
//     <>
//       <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-lg">
//         <div className="text-2xl font-bold">DMH Properties</div>
//         <div className="flex gap-4">
//           <button className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg shadow"
//            onClick={handlelogout}
//           >
//             Logout
//           </button>
//           <button className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg shadow" 
//             onClick={()=>{navigate("/dmhpropertiesformsubmitonlyforadmin")}}
//           >
//             Add Property
//           </button>
//           <button className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg shadow"
//             onClick={()=>{navigate("/")}}
//           >
//             Home
//           </button>
//         </div>
//       </nav>

//       <div className="flex">
//         <div
//           className={`$ {
//             sidebarOpen ? "w-80" : "w-16"
//           } h-screen border-r border-blue-300 transition-all duration-300 ${
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
//               <Link to="/alldetail" className="hover:bg-blue-300 p-2 rounded cursor-pointer">Show All Properties</Link>

//               <Link to="/maincorosole" className="hover:bg-blue-300 p-2 rounded cursor-pointer">Set Corosole</Link>
              
//             </ul>
//           )}
//         </div>

//         <div className="flex-1 flex flex-col items-center justify-center h-screen bg-blue-50">
         
          
//         </div>
//       </div>
//     </>
//   );
// };

// export default Admin;





















import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector, useDispatch } from "react-redux";
import Loader from "./Loader";
import { fetchProperties } from "../Redux/propertySlice";

// Static data arrays
const facingOptions = [
  "North", "South", "East", "West",
  "North-East", "North-West", "South-East", "South-West"
];

const HouseStatus = [
  "Ready To Move", "Under Construction"
];

const ageOptions = ["0-1 years", "1-3 years", "3-10 years", "10+ years"];

const Admin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const { properties = [] } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  useEffect(() => {
    if (!sessionStorage.getItem("isLoggedIn")) {
      navigate("/login");
    } else {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [navigate]);

  // Data processing
  const residentialProperties = properties.filter(p => p.property_category === 'residential');
  const commercialProperties = properties.filter(p => p.property_category === 'commercial');

  // BHK Distribution (Residential only)
  const bhkData = [1, 2, 3, 4].map(bhk => ({
    name: `${bhk} BHK`,
    value: residentialProperties.filter(p => p.bedrooms === bhk).length
  }));

  // Carpet Area Ranges (Residential)
  const carpetAreaData = [
    { range: '0-1000', min: 0, max: 1000 },
    { range: '1001-1500', min: 1001, max: 1500 },
    { range: '1501-2000', min: 1501, max: 2000 },
    { range: '2000+', min: 2001, max: Infinity }
  ].map(range => ({
    ...range,
    count: residentialProperties.filter(p => 
      p.carpet_area >= range.min && p.carpet_area <= range.max
    ).length
  }));

  // Age Options Distribution
  const processAgeData = (category) => {
    return ageOptions.map(age => ({
      name: age,
      value: properties.filter(p => 
        p.property_category === category && p.selected_age === age
      ).length
    }));
  };

  // Facing Directions
  const facingData = facingOptions.map(direction => ({
    name: direction,
    value: properties.filter(p => p.facing === direction).length
  }));

  // Possession Status
  const possessionData = HouseStatus.map(status => ({
    name: status,
    value: properties.filter(p => p.house_status === status).length
  }));

  // Furnishing Type
  const furnishingData = [
    { name: 'Furnished', value: properties.filter(p => p.furnishing === 'Furnished').length },
    { name: 'Semi-Furnished', value: properties.filter(p => p.furnishing === 'Semi-Furnished').length },
    { name: 'Unfurnished', value: properties.filter(p => !p.furnishing || p.furnishing === 'Unfurnished').length }
  ];

  // Locality Distribution
  const localityDistribution = properties.reduce((acc, p) => {
    const locality = p.location?.locality?.toString().toUpperCase().trim().replace(/\s+/g, '') || '';
    acc[locality] = (acc[locality] || 0) + 1;
    return acc;
  }, {});

  const localityData = Object.entries(localityDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Average Prices
  const avgResidentialPrice = residentialProperties.reduce(
    (sum, p) => sum + (p.expected_price || p.rent_price || 0), 0
  ) / (residentialProperties.length || 1);

  const avgCommercialPrice = commercialProperties.reduce(
    (sum, p) => sum + (p.expected_price || p.rent_price || 0), 0
  ) / (commercialProperties.length || 1);

  const handleLogout = () => {
    sessionStorage.removeItem("isLoggedIn");
  };

  const colors = ['#3B82F6', '#60A5FA', '#93C5FD', '#2563EB', '#1D4ED8'];

  if (loading) return <div className="flex items-center justify-center h-screen bg-blue-100"><Loader /></div>;

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-blue-500 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="text-2xl font-bold">DMH Properties</div>
        <div className="flex gap-4">
          <button className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg shadow" onClick={handleLogout}>
            Logout
          </button>
          <button className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg shadow" 
            onClick={() => navigate("/dmhpropertiesformsubmitonlyforadmin")}>
            Add Property
          </button>
          <button className="bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg shadow"
            onClick={() => navigate("/")}>
            Home
          </button>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "w-50" : "w-16"} h-screen border-r border-blue-300 transition-all duration-300 ${sidebarOpen ? 'bg-blue-200' : 'bg-blue-50 border-none'} shadow-lg`}>
          <button className="p-4 text-blue-700 hover:text-blue-900" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {sidebarOpen && (
            <ul className="mt-4 flex flex-col space-y-2 p-4">
              <Link to="/alldetail" className="hover:bg-blue-300 p-2 rounded cursor-pointer">Show All Properties</Link>
              <Link to="/blogadmin" className="hover:bg-blue-300 p-2 rounded cursor-pointer">Set Blog</Link>
            </ul>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Summary Section - First Row */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
            {/* Average Prices */}

            {/* Property Count Summary */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Property Count</h3>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span>Total Properties:</span>
                  <span className="font-bold">{properties.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Residential:</span>
                  <span className="font-bold">{residentialProperties.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Commercial:</span>
                  <span className="font-bold">{commercialProperties.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Property Type Distribution */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Property Type Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Residential', value: residentialProperties.length },
                      { name: 'Commercial', value: commercialProperties.length }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                    dataKey="value"
                  >
                    <Cell fill={colors[0]} />
                    <Cell fill={colors[1]} />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* BHK Distribution */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">BHK Distribution (Residential)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bhkData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {bhkData.map((_, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Carpet Area Ranges */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Carpet Area Distribution (Residential)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={carpetAreaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Age Distribution - Residential */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Property Age (Residential)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={processAgeData('residential')}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {ageOptions.map((_, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Age Distribution - Commercial */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Property Age (Commercial)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={processAgeData('commercial')}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {ageOptions.map((_, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Facing Directions */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Facing Directions</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={facingData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {facingOptions.map((_, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Possession Status */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Possession Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={possessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Furnishing Type */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Furnishing Types</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={furnishingData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {furnishingData.map((_, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Localities */}
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Top Localities</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={localityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;