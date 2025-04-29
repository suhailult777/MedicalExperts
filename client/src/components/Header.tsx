import React, { useState } from 'react';
import { Link } from 'wouter';
import { FaMapMarkerAlt, FaSearch, FaUserCircle, FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="bg-[#fc9916] text-white font-bold px-2 py-1 rounded-sm mr-1">
                <span>Apollo</span>
              </div>
              <div className="text-[#02475b] font-bold">
                <span>247</span>
              </div>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
              className="p-2 text-gray-500 mr-2"
            >
              <FaSearch />
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-500"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center flex-1">
            {/* Location Selector */}
            <div className="flex items-center bg-white border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700 mr-4">
              <FaMapMarkerAlt className="text-[#767676] mr-2" />
              <span className="mr-1">Select Location</span>
              <span className="font-medium">Select Address</span>
              <FaChevronDown className="ml-2 text-xs" />
            </div>

            {/* Search Bar */}
            <div className="flex flex-1">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search Doctors, Specialties, Conditions etc." 
                  className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b38e]"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <FaSearch />
                </button>
              </div>
            </div>

            {/* Login Button */}
            <div className="flex items-center ml-4">
              <button className="border border-[#00b38e] text-[#00b38e] font-medium rounded-md px-4 py-1.5 flex items-center">
                Login
                <FaUserCircle className="ml-2" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search - only visible when toggled */}
        {mobileSearchVisible && (
          <div className="md:hidden mt-3 pb-2">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search Doctors, Specialties..." 
                className="w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00b38e]"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                <FaSearch />
              </button>
            </div>
          </div>
        )}
        
        {/* Mobile Menu - only visible when toggled */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 mt-3">
            <div className="py-2 flex justify-center">
              <button className="border border-[#00b38e] text-[#00b38e] font-medium rounded-md px-4 py-1.5 flex items-center">
                Login
                <FaUserCircle className="ml-2" />
              </button>
            </div>
            <div className="py-2">
              <div className="flex items-center bg-white border border-gray-300 rounded-md px-2 py-2 text-sm text-gray-700 mx-auto max-w-xs">
                <FaMapMarkerAlt className="text-[#767676] mr-2" />
                <span className="mr-1">Select Location</span>
                <FaChevronDown className="ml-auto text-xs" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="flex overflow-x-auto whitespace-nowrap py-2 -mx-4 px-4 md:mx-0 md:px-0 mt-2 text-sm scrollbar-hide">
          <Link href="#" className="mr-5 px-1 py-1 font-medium text-[#333333] hover:text-[#00b38e] flex-shrink-0">Buy Medicines</Link>
          <Link href="/" className="mr-5 px-1 py-1 font-medium text-[#02475b] border-b-2 border-[#02475b] flex-shrink-0">Find Doctors</Link>
          <Link href="#" className="mr-5 px-1 py-1 font-medium text-[#333333] hover:text-[#00b38e] flex-shrink-0">Lab Tests</Link>
          <Link href="#" className="mr-5 px-1 py-1 font-medium text-[#333333] hover:text-[#00b38e] flex-shrink-0">Circle Membership</Link>
          <Link href="#" className="mr-5 px-1 py-1 font-medium text-[#333333] hover:text-[#00b38e] flex-shrink-0">Health Records</Link>
          <Link href="#" className="mr-5 px-1 py-1 font-medium text-[#333333] hover:text-[#00b38e] flex-shrink-0">Diabetes Reversal</Link>
          <Link href="#" className="mr-5 px-1 py-1 font-medium text-[#333333] hover:text-[#00b38e] flex items-center flex-shrink-0">
            Buy Insurance
            <span className="ml-1 text-xs bg-[#00b38e] text-white px-1.5 py-0.5 rounded-sm">New</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
