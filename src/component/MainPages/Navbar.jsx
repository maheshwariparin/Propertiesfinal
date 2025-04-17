import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from "../../assets/dmhlogo.svg";
import { FaPhoneAlt, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const dropdownPaths = ['/sell', '/rent-lease', '/pg', '/residential', '/commercial', '/plot'];
  const isDropdownActive = dropdownPaths.includes(location.pathname);
  const phoneNumber = "9925001226";

  return (
    <nav className="sticky top-0 z-50 bg-white  ">
      <div className="container mx-auto px-4 hidden md:flex justify-between items-center py-1">
        <div className="flex items-center gap-2.5">
          <img 
            src={logo} 
            alt="DMH Properties Logo" 
            className="h-18 lg:h-18 w-auto object-contain" 
          />
          <div className='flex flex-col'>
            <span className="text-lg lg:text-xl font-bold text-gray-800">DMH</span>
            <span className="text-lg lg:text-xl font-bold text-gray-800 mt-[-6px]">Properties</span>
          </div>
        </div>

        <ul className="flex items-center gap-2 lg:gap-4 list-none m-0 p-0">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => 
                `inline-flex items-center justify-center h-10 px-4 text-sm lg:text-base transition-all duration-300 ${
                  isActive 
                    ? 'text-blue-500 bg-blue-100 rounded-2xl' 
                    : 'text-gray-600 hover:text-blue-500 hover:bg-blue-100 rounded-2xl'
                }`
              }
            >
              Home
            </NavLink>
          </li>
          
          <li className="group relative">
            <div
              className={`inline-flex items-center justify-center h-10 px-4 text-sm lg:text-base transition-all duration-300 cursor-pointer ${
                isDropdownActive
                  ? 'text-blue-500 bg-blue-100 rounded-2xl'
                  : 'text-gray-600 hover:text-blue-500 hover:bg-blue-100 rounded-2xl'
              }`}
            >
              Real Estate
            </div>
            
            <ul className="absolute top-full left-0 min-w-[180px] lg:min-w-[200px] bg-white shadow-lg rounded-lg p-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 space-y-2">
              <li>
                <NavLink
                  to="/sellproperty"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md transition-colors duration-300 ${
                      isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                    }`
                  }
                >
                  Sell
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/rent_leaseproperty"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md transition-colors duration-300 ${
                      isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                    }`
                  }
                >
                  Rent / Lease
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pg"
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md transition-colors duration-300 ${
                      isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                    }`
                  }
                >
                  PG
                </NavLink>
              </li>
               </ul>
          </li>

          <li>
            <NavLink
              to="/blog"
              className={({ isActive }) => 
                `inline-flex items-center justify-center h-10 px-4 text-sm lg:text-base transition-all duration-300 ${
                  isActive 
                    ? 'text-blue-500 bg-blue-100 rounded-2xl' 
                    : 'text-gray-600 hover:text-blue-500 hover:bg-blue-100 rounded-2xl'
                }`
              }
            >
              Blog
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contactus"
              className={({ isActive }) => 
                `inline-flex items-center justify-center h-10 px-4 text-sm lg:text-base transition-all duration-300 ${
                  isActive 
                    ? 'text-blue-500 bg-blue-100 rounded-2xl' 
                    : 'text-gray-600 hover:text-blue-500 hover:bg-blue-100 rounded-2xl'
                }`
              }
            >
              Contact
            </NavLink>
          </li>
          <li>
              <NavLink
                to="/ourstory"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => 
                  `inline-flex items-center justify-center h-10 px-4 text-sm lg:text-base transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-500 bg-blue-100 rounded-2xl' 
                      : 'text-gray-600 hover:text-blue-500 hover:bg-blue-100 rounded-2xl'
                  }`
                }
              >
               OurStory
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/rentclaculator"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => 
                  `inline-flex items-center justify-center h-10 px-4 text-sm lg:text-base transition-all duration-300 ${
                    isActive 
                      ? 'text-blue-500 bg-blue-100 rounded-2xl' 
                      : 'text-gray-600 hover:text-blue-500 hover:bg-blue-100 rounded-2xl'
                  }`
                }
              >
               Rent Calculator
              </NavLink>
            </li>
          <li>
            <a 
              className="flex items-center text-gray-600 rounded-lg hover:bg-blue-100 px-3 py-2 hover:text-blue-500 transition-colors text-sm lg:text-base"
              href={`tel:${phoneNumber}`}
            >
              <FaPhoneAlt className="mr-1 lg:mr-2" /> 
              <span className="hidden lg:inline">+91 99250-01226</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-2.5">
          <img 
            src={logo} 
            alt="DMH Properties Logo" 
            className="h-16 w-auto object-contain" 
          />
          <div className='flex flex-col'>
            <span className="text-base font-bold text-gray-800">DMH</span>
            <span className="text-base font-bold text-gray-800 mt-[-5px]">Properties</span>
          </div>
        </div>

        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="py-4 px-4 space-y-2">
            <li>
              <NavLink
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-4 py-3 rounded-lg ${
                    isActive 
                      ? 'text-blue-500 bg-blue-100' 
                      : 'text-gray-600 hover:bg-blue-100'
                  }`
                }
              >
                Home
              </NavLink>
            </li>

            <li className="space-y-2">
              <div className={`px-4 py-3 rounded-lg ${isDropdownActive ? 'bg-blue-100 text-blue-500' : 'text-gray-600'}`}>
                Real Estate
              </div>
              
              <ul className="pl-6 space-y-2">
                <li>
                  <NavLink
                    to="/sellproperty"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg ${
                        isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:bg-blue-50'
                      }`
                    }
                  >
                    Sell
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/rent_leaseproperty"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg ${
                        isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:bg-blue-50'
                      }`
                    }
                  >
                    Rent / Lease
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/pg"
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-2 rounded-lg ${
                        isActive ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:bg-blue-50'
                      }`
                    }
                  >
                    PG
                  </NavLink>
                </li>
               
                
              </ul>
            </li>

            <li>
              <NavLink
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-4 py-3 rounded-lg ${
                    isActive 
                      ? 'text-blue-500 bg-blue-100' 
                      : 'text-gray-600 hover:bg-blue-100'
                  }`
                }
              >
                Blog
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/contactus"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-4 py-3 rounded-lg ${
                    isActive 
                      ? 'text-blue-500 bg-blue-100' 
                      : 'text-gray-600 hover:bg-blue-100'
                  }`
                }
              >
                Contact Us
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/ourstory"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-4 py-3 rounded-lg ${
                    isActive 
                      ? 'text-blue-500 bg-blue-100' 
                      : 'text-gray-600 hover:bg-blue-100'
                  }`
                }
              >
               OurStory
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/rentclaculator"
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-4 py-3 rounded-lg ${
                    isActive 
                      ? 'text-blue-500 bg-blue-100' 
                      : 'text-gray-600 hover:bg-blue-100'
                  }`
                }
              >
                Rent Calculator
              </NavLink>
            </li>
          </ul>
        </div>
      )}

      {/* Mobile Floating Call Button */}
      <a
        className="md:hidden fixed bottom-6 right-6 z-50 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        href={`tel:${phoneNumber}`}
      >
        <FaPhoneAlt size={24} />
      </a>
    </nav>
  );
};

export default Navbar;










