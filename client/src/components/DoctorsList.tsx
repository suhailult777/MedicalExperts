import React from 'react';
import { Doctor, FilterState } from '@/types/doctor';
import DoctorCard from './DoctorCard';
import { FaChevronDown } from 'react-icons/fa';
import { Select } from '@/components/ui/select';

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

  return (
    <div className="flex-1">
      {/* List Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[#333333] mb-1">
          Consult General Physicians Online - Internal Medicine Specialists
        </h1>
        <p className="text-sm text-[#767676]">({totalDoctors} doctors)</p>
      </div>

      {/* Sort and Filter Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1"></div>
        <div className="flex items-center text-sm">
          <span className="text-[#767676] mr-2">Sort by:</span>
          <div className="relative">
            <select 
              className="appearance-none border border-gray-300 rounded-md py-1.5 pl-3 pr-8 bg-white text-[#333333] focus:outline-none focus:ring-1 focus:ring-[#00b38e]"
              value={filters.sort}
              onChange={handleSortChange}
            >
              <option value="relevance">Relevance</option>
              <option value="experience">Experience</option>
              <option value="price_low_to_high">Fees: Low to High</option>
              <option value="price_high_to_low">Fees: High to Low</option>
              <option value="rating">Rating</option>
            </select>
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
          
          {/* Pagination controls */}
          {totalDoctors > filters.limit && (
            <div className="flex justify-center mt-8">
              <nav className="flex space-x-2">
                <button 
                  onClick={() => updateFilters({ page: Math.max(1, filters.page - 1) })}
                  disabled={filters.page === 1}
                  className={`px-3 py-1 rounded ${
                    filters.page === 1 
                      ? 'bg-gray-100 text-gray-400' 
                      : 'bg-white border border-gray-300 text-[#333333] hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                
                {[...Array(Math.min(5, Math.ceil(totalDoctors / filters.limit)))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => updateFilters({ page: pageNum })}
                      className={`px-3 py-1 rounded ${
                        filters.page === pageNum
                          ? 'bg-[#00b38e] text-white'
                          : 'bg-white border border-gray-300 text-[#333333] hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  onClick={() => updateFilters({ page: filters.page + 1 })}
                  disabled={filters.page >= Math.ceil(totalDoctors / filters.limit)}
                  className={`px-3 py-1 rounded ${
                    filters.page >= Math.ceil(totalDoctors / filters.limit)
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-white border border-gray-300 text-[#333333] hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-3xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-[#333333] mb-2">No doctors found</h3>
          <p className="text-[#767676]">Try adjusting your filters or search criteria</p>
        </div>
      )}
    </div>
  );
};

export default DoctorsList;
