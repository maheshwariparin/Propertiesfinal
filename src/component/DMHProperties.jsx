import { useEffect, useState } from 'react';
import Navbar from './MainPages/Navbar';
const DMHProperties = () => {
  const [animationState, setAnimationState] = useState({
    dAnimated: false,
    mAnimated: false,
    hAnimated: false,
    logoAnimated: false,
    taglineAnimated: false
  });

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationState(prev => ({...prev, dAnimated: true})), 300);
    const timer2 = setTimeout(() => setAnimationState(prev => ({...prev, mAnimated: true})), 600);
    const timer3 = setTimeout(() => setAnimationState(prev => ({...prev, hAnimated: true})), 900);
    const timer4 = setTimeout(() => setAnimationState(prev => ({...prev, logoAnimated: true})), 1500);
    const timer5 = setTimeout(() => setAnimationState(prev => ({...prev, taglineAnimated: true})), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar/>
      {/* Header with animation */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto">
          {/* Animated letters that will form the logo */}
          <div className="flex justify-center items-end h-24 mb-8">
            <div 
              className={`text-7xl font-bold transition-all duration-500 ${
                animationState.dAnimated ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'
              }`}
            >
              D
            </div>
            <div 
              className={`text-7xl font-bold transition-all duration-500 ${
                animationState.mAnimated ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}
            >
              M
            </div>
            <div 
              className={`text-7xl font-bold transition-all duration-500 ${
                animationState.hAnimated ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'
              }`}
            >
              H
            </div>
          </div>
          
          {/* Final logo */}
          <div 
            className={`text-5xl font-bold mb-4 transition-all duration-500 ${
              animationState.logoAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            DMH Properties
          </div>
          
          {/* Tagline */}
          <div 
            className={`text-xl transition-opacity duration-500 ${
              animationState.taglineAnimated ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Serving 100+ happy clients with trust and excellence
          </div>
        </div>
      </header>

      {/* Stats card */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto -mt-12 relative z-10 text-center">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">Our Success</h3>
          <p className="text-gray-600">100+ satisfied clients</p>
          <p className="text-gray-600">50+ properties brokered</p>
          <p className="text-gray-600">5-star service rating</p>
        </div>
      </div>

      {/* Team cards */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Meet The Founders</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Deep's card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="bg-blue-600 h-2"></div>
            <div className="p-6">
              <div className="text-center">
                <div className="h-24 w-24 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-blue-600">D</div>
                <h3 className="text-xl font-bold text-gray-800">Deep Brahmbhatt</h3>
               
              </div>
              <div className="mt-4 text-gray-600">
                <p className="font-medium mt-4">Contact: +91 99250-01226</p>
              </div>
            </div>
          </div>

          {/* Meet's card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="bg-green-600 h-2"></div>
            <div className="p-6">
              <div className="text-center">
                <div className="h-24 w-24 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-green-600">M</div>
                <h3 className="text-xl font-bold text-gray-800">Meet Soni</h3>
     
              </div>
              <div className="mt-4 text-gray-600">
        
                <p className="font-medium mt-4">Contact: +91 82001-22701</p>
              </div>
            </div>
          </div>

          {/* Harsh's card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105">
            <div className="bg-purple-600 h-2"></div>
            <div className="p-6">
              <div className="text-center">
                <div className="h-24 w-24 rounded-full bg-purple-100 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-purple-600">H</div>
                <h3 className="text-xl font-bold text-gray-800">Harsh Maheshwari</h3>
                
              </div>
              <div className="mt-4 text-gray-600">
   
                <p className="font-medium mt-4">Contact: +91 74908-09592</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Story section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Deep, Meet, and Harsh came together with a shared vision to revolutionize property broking and rentals in their city. 
              Combining their unique expertise, they founded DMH Properties to provide a seamless, trustworthy experience for both buyers and renters.
            </p>
            <p className="text-gray-600">
              Today, DMH Properties stands as a testament to their dedication, having served over 100 happy clients with personalized service and 
              unmatched market knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">DMH Properties</h3>
          <p className="mb-2">Your trusted property partners</p>
          <p>Email:dmproperties@gmail.com</p>
          <p className="mt-4 text-gray-400">© {new Date().getFullYear()} DMH Properties. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DMHProperties;


