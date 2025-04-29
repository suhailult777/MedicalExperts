import React from 'react';
import { Link } from 'wouter';
import { FaMapMarkerAlt, FaSearch, FaUserCircle, FaChevronDown } from 'react-icons/fa';

const Header: React.FC = () => {
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

          {/* Location Selector */}
          <div className="hidden md:flex items-center bg-white border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700">
            <FaMapMarkerAlt className="text-[#767676] mr-2" />
            <span className="mr-1">Select Location</span>
            <span className="font-medium">Select Address</span>
            <FaChevronDown className="ml-2 text-xs" />
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-4">
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
          <div className="flex items-center">
            <button className="border border-[#00b38e] text-[#00b38e] font-medium rounded-md px-4 py-1.5 flex items-center">
              Login
              <FaUserCircle className="ml-2" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex overflow-x-auto whitespace-nowrap py-2 -mx-4 px-4 md:mx-0 md:px-0 mt-2 text-sm">
          <Link href="#" className="mr-5 px-1 py-1 font-medium text-[#333333] hover:text-[#00b38e]">Buy Medicines</Link>
          <Link href="/" className="mr-5 px-1 py-1 font-medium text-[#02475b] border-b-2 border-[#02475b]">Find Doctors</Link>
          <Link href="#" className="mr-5 px-1 py-1 font-medium text-[#333333] hover:text-[#00b38e]">Lab Tests</Link>
          <Link href="#" className="mr-5 px-1 py-1 font-medium text-[#333333] hover:text-[#00b38e]">Circle Membership</Link>
          <Link href="#" className="mr-5 px-1 py-1 font-medium text-[#333333] hover:text-[#00b38e]">Health Records</Link>
          <Link href="#" className="mr-5 px-1 py-1 font-medium text-[#333333] hover:text-[#00b38e]">Diabetes Reversal</Link>
          <Link href="#" className="mr-5 px-1 py-1 font-medium text-[#333333] hover:text-[#00b38e] flex items-center">
            Buy Insurance
            <span className="ml-1 text-xs bg-[#00b38e] text-white px-1.5 py-0.5 rounded-sm">New</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
