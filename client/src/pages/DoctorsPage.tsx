import React from 'react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import FilterSidebar from '@/components/FilterSidebar';
import DoctorsList from '@/components/DoctorsList';
import ConsultBanner from '@/components/ConsultBanner';
import SEOHead from '@/components/SEOHead';
import { useDoctors } from '@/hooks/useDoctors';
import { FaChevronRight } from 'react-icons/fa';

const DoctorsPage: React.FC = () => {
  const {
    doctors,
    totalDoctors,
    isLoading,
    filters,
    updateFilters,
    resetFilters,
    toggleFilter,
  } = useDoctors({
    modes: ['online', 'hospital'], // Default to both modes selected
  });

  return (
    <>
      <SEOHead />
      <Header />
      
      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm mb-4">
          <Link href="/" className="text-[#00b38e] hover:underline">Home</Link>
          <FaChevronRight className="text-gray-400 mx-2 text-xs" />
          <Link href="/" className="text-[#00b38e] hover:underline">Doctors</Link>
          <FaChevronRight className="text-gray-400 mx-2 text-xs" />
          <span className="text-[#767676]">General Physicians</span>
        </div>

        {/* Main Grid Layout */}
        <div className="flex flex-col md:flex-row">
          {/* Filter Sidebar */}
          <FilterSidebar 
            filters={filters} 
            toggleFilter={toggleFilter} 
            resetFilters={resetFilters} 
          />

          {/* Doctor Listing */}
          <DoctorsList
            doctors={doctors}
            totalDoctors={totalDoctors}
            isLoading={isLoading}
            filters={filters}
            updateFilters={updateFilters}
          />

          {/* Consult Banner */}
          <ConsultBanner />
        </div>
      </div>
    </>
  );
};

export default DoctorsPage;
