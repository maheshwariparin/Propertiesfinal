import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';
import Admin from './component/Admin';
import Login from './component/Login';
import Home from './component/Home';
import Stage1 from "./component/stage1";
import Stage2 from "./component/stage2";
import Stage3 from "./component/stage3";
import Stage4 from "./component/stage4";
import Stage5 from "./component/stage5";
import Preview from "./component/Preview";
import MultiStepForm from "./component/MultiStepForm";
import PropertyTable from "./component/ShowAllProperties"
import Sell from "./component/Pages/Sell"
import Rent_Lease from "./component/Pages/Rent_Lease";
import PG from "./component/Pages/Pg";
import Viewdetails from "./component/Pages/Viewdetails"
import Navbar from "./component/MainPages/Navbar";
import BlogAdmin from "./component/BlogAdmin"
import BlogPage from "./component/BlogPage";
import BlogMain from "./component/BlogMain"
import ContactUs from "./component/ContactUs";
import DMHProperties from "./component/DMHProperties";
import Calculator from "./component/Calculator";
function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/nav" element={<Navbar/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dmhpropertiesformsubmitonlyforadmin" element={<MultiStepForm />} />
        <Route path="/blog/" element={<BlogMain />} />
        <Route path="/blog/:slug" element={<BlogPage />} />
        <Route path="/contactus" element={<ContactUs />} />

        {/* <Route path="/stage1" element={<Stage1 />} />
        <Route path="/stage2" element={<Stage2 />} />
        <Route path="/stage3" element={<Stage3 />} />
        <Route path="/stage4" element={<Stage4 />} />
        <Route path="/stage5" element={<Stage5 />} />
        <Route path="/Preview" element={<Preview/>}/> */}
        <Route path="/alldetail" element={<PropertyTable/>}/>
        <Route path="/blogadmin" element={<BlogAdmin/>}/>
        <Route path="/sellproperty" element={<Sell/>}/>
        <Route path="/rent_leaseproperty" element={<Rent_Lease/>}/>
        <Route path="/Pg" element={<PG/>}/>
        <Route path="/property/:id/:slug" element={<Viewdetails />} />
        <Route path="/3bhk-flat-Ahmedabad" element={<Home />} />
        <Route path="/2bhk-flat-Ahmedabad" element={<Home />} />
        <Route path="/1bhk-flat-Ahmedabad" element={<Home />} />
        <Route path="/4bhk-bunglow-Ahmedabad" element={<Home />} />
        <Route path="/residential" element={<Home />} />
        <Route path="/commercial" element={<Home />} />
        <Route path="/plot" element={<Home />} />
        <Route path="/ourstory" element={<DMHProperties />} />
        <Route path="/rentclaculator" element={<Calculator />} />

        <Route path="/3bhk-luxury-flat-shela" element={<Home />} />
        <Route path="/2bhk-skyview-apartment-shela" element={<Home />} />
        <Route path="/4bhk-bunglow-shela" element={<Home />} />
        <Route path="/commercial-space-shela" element={<Home />} />
        <Route path="/office-space-shela" element={<Home />} />

        {/* Bopal */}
        <Route path="/3bhk-flat-bopal" element={<Home />} />
        <Route path="/2bhk-apartment-bopal" element={<Home />} />
        <Route path="/4bhk-villa-bopal" element={<Home />} />
        <Route path="/commercial-space-bopal" element={<Home />} />
        <Route path="/office-space-bopal" element={<Home />} />

        {/* South Bopal */}
        <Route path="/3bhk-flat-south-bopal" element={<Home />} />
        <Route path="/2bhk-apartment-south-bopal" element={<Home />} />
        <Route path="/4bhk-bunglow-south-bopal" element={<Home />} />
        <Route path="/commercial-space-south-bopal" element={<Home />} />
        <Route path="/office-space-south-bopal" element={<Home />} />

        {/* Jodhpur */}
        <Route path="/3bhk-flat-jodhpur" element={<Home />} />
        <Route path="/2bhk-apartment-jodhpur" element={<Home />} />
        <Route path="/4bhk-bunglow-jodhpur" element={<Home />} />
        <Route path="/commercial-space-jodhpur" element={<Home />} />
        <Route path="/office-space-jodhpur" element={<Home />} />

        {/* Anandnagar (lowercase + capital) */}
        <Route path="/3bhk-flat-anandnagar" element={<Home />} />
        <Route path="/2bhk-apartment-anandnagar" element={<Home />} />
        <Route path="/4bhk-bunglow-anandnagar" element={<Home />} />
        <Route path="/commercial-space-anandnagar" element={<Home />} />
        <Route path="/office-space-anandnagar" element={<Home />} />
        <Route path="/3bhk-flat-Anandnagar" element={<Home />} />
        <Route path="/2bhk-apartment-Anandnagar" element={<Home />} />
        <Route path="/4bhk-bunglow-Anandnagar" element={<Home />} />
        <Route path="/commercial-space-Anandnagar" element={<Home />} />
        <Route path="/office-space-Anandnagar" element={<Home />} />

        {/* Ambli */}
        <Route path="/3bhk-flat-Ambli" element={<Home />} />
        <Route path="/2bhk-apartment-Ambli" element={<Home />} />
        <Route path="/4bhk-bunglow-Ambli" element={<Home />} />
        <Route path="/commercial-space-Ambli" element={<Home />} />
        <Route path="/office-space-Ambli" element={<Home />} />

        {/* Satellite */}
        <Route path="/3bhk-flat-Satellite" element={<Home />} />
        <Route path="/2bhk-apartment-Satellite" element={<Home />} />
        <Route path="/4bhk-bunglow-Satellite" element={<Home />} />
        <Route path="/commercial-space-Satellite" element={<Home />} />
        <Route path="/office-space-Satellite" element={<Home />} />

        {/* Ramdevnagar */}
        <Route path="/3bhk-flat-Ramdevnagar" element={<Home />} />
        <Route path="/2bhk-apartment-Ramdevnagar" element={<Home />} />
        <Route path="/4bhk-bunglow-Ramdevnagar" element={<Home />} />
        <Route path="/commercial-space-Ramdevnagar" element={<Home />} />
        <Route path="/office-space-Ramdevnagar" element={<Home />} />


        <Route path="/3bhk-flat-Ahmedabad" element={<Home />} />
        <Route path="/2bhk-apartment-Ahmedabad" element={<Home />} />
        <Route path="/4bhk-bunglow-Ahmedabad" element={<Home />} />
        <Route path="/commercial-space-Ahmedabad" element={<Home />} />
        <Route path="/office-space-Ahmedabad" element={<Home />} />

        </Routes>
    </Router>
  );
}

export default App;