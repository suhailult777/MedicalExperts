import React from 'react';
import { Doctor, FilterState } from '@/types/doctor';
import DoctorCard from './DoctorCard';
import { FaChevronDown, FaFilter, FaSort } from 'react-icons/fa';

interface DoctorsListProps {
  doctors: Doctor[];
  totalDoctors: number;
  isLoading: boolean;
  filters: FilterState;
  updateFilters: (filters: Partial<FilterState>) => void;
}

const DoctorsList: React.FC<DoctorsListProps> = ({ 
  doctors, 
  totalDoctors, 
  isLoading, 
  filters,
  updateFilters
}) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters({ sort: e.target.value as FilterState['sort'] });
  };

  const handlePageChange = (page: number) => {
    // Scroll to top when changing pages on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    updateFilters({ page });
  };
  
  const totalPages = Math.ceil(totalDoctors / filters.limit);

  return (
    <div className="flex-1">
      {/* List Header */}
      <div className="mb-4">
        <h1 className="text-lg sm:text-xl font-bold text-[#333333] mb-1">
          Consult General Physicians Online - Internal Medicine Specialists
        </h1>
        <p className="text-sm text-[#767676]">({totalDoctors} doctors)</p>
      </div>

      {/* Sort and Filter Top Bar */}
      <div className="flex justify-between items-center mb-6">
        {/* Mobile - Filter button (just for UI, no functionality yet) */}
        <div className="flex md:hidden">
          <button className="flex items-center text-sm border border-gray-300 rounded-md px-3 py-1.5 text-[#333333]">
            <FaFilter className="mr-2 text-xs" />
            <span>Filter</span>
          </button>
        </div>
        
        {/* Empty space for desktop */}
        <div className="hidden md:block flex-1"></div>
        
        {/* Sort dropdown - styled differently for mobile and desktop */}
        <div className="flex items-center text-sm">
          <span className="text-[#767676] mr-2 hidden md:inline">Sort by:</span>
          <div className="relative">
            <select 
              className="appearance-none border border-gray-300 rounded-md py-1.5 pl-8 md:pl-3 pr-8 bg-white text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#00b38e]"
              value={filters.sort}
              onChange={handleSortChange}
            >
              <option value="relevance">Relevance</option>
              <option value="experience">Experience</option>
              <option value="price_low_to_high">Fees: Low to High</option>
              <option value="price_high_to_low">Fees: High to Low</option>
              <option value="rating">Rating</option>
            </select>
            {/* Mobile sort icon */}
            <div className="md:hidden absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <FaSort className="text-gray-500 text-xs" />
            </div>
            {/* Dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              <FaChevronDown className="text-gray-400 text-xs" />
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Cards */}
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 animate-pulse">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-44 mb-3 md:mb-0 md:mr-4">
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-200 rounded-full mb-2 mx-auto md:mx-0"></div>
                </div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/5 mb-5"></div>
                  <div className="flex justify-end">
                    <div className="h-10 bg-gray-200 rounded w-36"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : doctors.length > 0 ? (
        <div className="space-y-6">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
          
          {/* Pagination controls - with better mobile support */}
          {totalDoctors > filters.limit && (
            <div className="flex justify-center mt-8 pb-6">
              <nav className="flex flex-wrap gap-2">
                <button 
                  onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  className={`px-3 py-1 rounded text-sm ${
                    filters.page === 1 
                      ? 'bg-gray-100 text-gray-400' 
                      : 'bg-white border border-gray-300 text-[#333333] hover:bg-gray-50'
                  }`}
                  aria-label="Previous page"
                >
                  Prev
                </button>
                
                {/* Dynamic pagination with ellipsis for mobile */}
                {(() => {
                  // Show different number of pages based on screen size
                  const maxVisiblePages = window.innerWidth < 640 ? 3 : 5;
                  const pages = [];
                  
                  // First page
                  if (totalPages > 0) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => handlePageChange(1)}
                        className={`px-3 py-1 rounded text-sm ${
                          filters.page === 1
                            ? 'bg-[#00b38e] text-white'
                            : 'bg-white border border-gray-300 text-[#333333] hover:bg-gray-50'
                        }`}
                      >
                        1
                      </button>
                    );
                  }
                  
                  // For small screen, show current page plus prev/next
                  if (window.innerWidth < 640) {
                    if (filters.page > 2) {
                      pages.push(
                        <span key="ellipsis1" className="px-1 self-end text-gray-400">...</span>
                      );
                    }
                    
                    // Current page (if not first or last)
                    if (filters.page > 1 && filters.page < totalPages) {
                      pages.push(
                        <button
                          key={filters.page}
                          onClick={() => handlePageChange(filters.page)}
                          className="px-3 py-1 rounded text-sm bg-[#00b38e] text-white"
                        >
                          {filters.page}
                        </button>
                      );
                    }
                    
                    if (filters.page < totalPages - 1 && totalPages > 3) {
                      pages.push(
                        <span key="ellipsis2" className="px-1 self-end text-gray-400">...</span>
                      );
                    }
                  } else {
                    // For larger screens, show more pages
                    let startPage = Math.max(2, filters.page - 1);
                    let endPage = Math.min(totalPages - 1, filters.page + 1);
                    
                    // Adjust if we're near the beginning
                    if (filters.page <= 3) {
                      endPage = Math.min(totalPages - 1, 4);
                    }
                    
                    // Adjust if we're near the end
                    if (filters.page >= totalPages - 2) {
                      startPage = Math.max(2, totalPages - 3);
                    }
                    
                    // Show ellipsis before middle pages if needed
                    if (startPage > 2) {
                      pages.push(
                        <span key="ellipsis1" className="px-1 self-end text-gray-400">...</span>
                      );
                    }
                    
                    // Middle pages
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => handlePageChange(i)}
                          className={`px-3 py-1 rounded text-sm ${
                            filters.page === i
                              ? 'bg-[#00b38e] text-white'
                              : 'bg-white border border-gray-300 text-[#333333] hover:bg-gray-50'
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    
                    // Show ellipsis after middle pages if needed
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="ellipsis2" className="px-1 self-end text-gray-400">...</span>
                      );
                    }
                  }
                  
                  // Last page (if not the only page)
                  if (totalPages > 1) {
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-3 py-1 rounded text-sm ${
                          filters.page === totalPages
                            ? 'bg-[#00b38e] text-white'
                            : 'bg-white border border-gray-300 text-[#333333] hover:bg-gray-50'
                        }`}
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  
                  return pages;
                })()}
                
                <button 
                  onClick={() => handlePageChange(Math.min(totalPages, filters.page + 1))}
                  disabled={filters.page >= totalPages}
                  className={`px-3 py-1 rounded text-sm ${
                    filters.page >= totalPages
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-white border border-gray-300 text-[#333333] hover:bg-gray-50'
                  }`}
                  aria-label="Next page"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="text-3xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-[#333333] mb-2">No doctors found</h3>
          <p className="text-[#767676]">Try adjusting your filters or search criteria</p>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
