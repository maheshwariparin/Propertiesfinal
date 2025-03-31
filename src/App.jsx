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
        <Route path="/residential" element={<Home />} />
        <Route path="/commercial" element={<Home />} />
        <Route path="/plot" element={<Home />} />
        <Route path="/ourstory" element={<DMHProperties />} />
       
        </Routes>
    </Router>
  );
}

export default App;