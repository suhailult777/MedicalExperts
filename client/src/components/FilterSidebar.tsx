import React, { useState } from 'react';
import { FilterState } from '@/types/doctor';
import { FaChevronDown, FaFilter, FaTimes } from 'react-icons/fa';

interface FilterSidebarProps {
  filters: FilterState;
  toggleFilter: (filterType: keyof FilterState, value: any) => void;
  resetFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, toggleFilter, resetFilters }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };
  
  // Experience ranges
  const experienceRanges = [
    { label: '0-5', range: [0, 5] as [number, number] },
    { label: '6-10', range: [6, 10] as [number, number] },
    { label: '11-15', range: [11, 15] as [number, number] },
    { label: '16+', range: [16, 100] as [number, number] },
  ];

  // Fee ranges
  const feeRanges = [
    { label: '100-500', range: [100, 500] as [number, number] },
    { label: '500-1000', range: [500, 1000] as [number, number] },
    { label: '1000+', range: [1000, 10000] as [number, number] },
  ];

  // Languages
  const languageOptions = [
    'English',
    'Hindi',
    'Telugu',
    'Tamil',
    'Kannada',
    'Malayalam',
    'Bengali',
    'Marathi',
    'Gujarati',
    'Punjabi',
    'Urdu',
    'Oriya',
    'Assamese',
    'Kashmiri',
    'Sindhi',
    'Konkani',
    'Nepali',
    'Manipuri',
  ];

  // Facilities
  const facilityOptions = [
    'Apollo Hospital',
    'Other Clinics',
  ];

  // Check if a range filter is active - using direct number comparison
  const isRangeActive = (filterType: 'experienceRange' | 'priceRange', range: [number, number]) => {
    return filters[filterType].some(r => r[0] === range[0] && r[1] === range[1]);
  };

  return (
    <div className="md:w-64 md:pr-6 mb-4 md:mb-0">
      {/* Mobile filter button - shown only on small screens */}
      <div className="md:hidden mb-4">
        <button 
          onClick={toggleMobileFilters}
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md text-[#00b38e] bg-white"
        >
          <FaFilter className="mr-2" />
          <span>Filters</span>
        </button>
      </div>
      
      {/* Filters - either shown in sidebar on desktop or in modal on mobile */}
      <div 
        className={`${
          mobileFiltersOpen 
            ? 'fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center' 
            : 'hidden md:block'
        }`}
      >
        <div 
          className={`bg-white rounded-lg shadow-sm p-4 mb-4 ${
            mobileFiltersOpen ? 'max-w-sm mx-auto w-full max-h-[90vh] overflow-y-auto' : ''
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-[#333333]">Filters</h2>
            <div className="flex items-center">
              <button 
                onClick={resetFilters}
                className="text-sm text-[#00b38e] mr-4"
              >
                Clear All
              </button>
              {mobileFiltersOpen && (
                <button onClick={toggleMobileFilters} className="text-gray-500">
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Location Filter */}
          <div className="mb-4">
            <button className="w-full py-2 px-3 border border-gray-300 rounded-md text-left mb-3 text-sm flex items-center justify-between hover:border-[#00b38e] focus:outline-none focus:ring-1 focus:ring-[#00b38e]">
              <span>Show Doctors Near Me</span>
            </button>
          </div>

          {/* Mode of Consult */}
          <div className="mb-6">
            <h3 className="font-medium text-[#333333] mb-3 text-sm">Mode of Consult</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox text-[#00b38e] h-4 w-4 rounded"
                  checked={filters.modes.includes('hospital')}
                  onChange={() => toggleFilter('modes', 'hospital')}
                />
                <span className="ml-2 text-sm text-[#333333]">Hospital Visit</span>
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  className="form-checkbox text-[#00b38e] h-4 w-4 rounded"
                  checked={filters.modes.includes('online')}
                  onChange={() => toggleFilter('modes', 'online')}
                />
                <span className="ml-2 text-sm text-[#333333]">Online Consult</span>
              </label>
            </div>
          </div>

          {/* Experience Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-[#333333] mb-3 text-sm">Experience (In Years)</h3>
            <div className="space-y-2">
              {experienceRanges.slice(0, 3).map((item) => (
                <label key={item.label} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-[#00b38e] h-4 w-4 rounded"
                    checked={isRangeActive('experienceRange', item.range)}
                    onChange={() => toggleFilter('experienceRange', item.range)}
                  />
                  <span className="ml-2 text-sm text-[#333333]">{item.label}</span>
                </label>
              ))}
            </div>
            <button className="text-sm text-[#00b38e] mt-2 flex items-center">
              +3 More
              <FaChevronDown className="ml-1 text-xs" />
            </button>
          </div>

          {/* Fees Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-[#333333] mb-3 text-sm">Fees (In Rupees)</h3>
            <div className="space-y-2">
              {feeRanges.map((item) => (
                <label key={item.label} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-[#00b38e] h-4 w-4 rounded"
                    checked={isRangeActive('priceRange', item.range)}
                    onChange={() => toggleFilter('priceRange', item.range)}
                  />
                  <span className="ml-2 text-sm text-[#333333]">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Language Filter */}
          <div className="mb-6">
            <h3 className="font-medium text-[#333333] mb-3 text-sm">Language</h3>
            <div className="space-y-2">
              {languageOptions.slice(0, 3).map((language) => (
                <label key={language} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-[#00b38e] h-4 w-4 rounded"
                    checked={filters.languages.includes(language)}
                    onChange={() => toggleFilter('languages', language)}
                  />
                  <span className="ml-2 text-sm text-[#333333]">{language}</span>
                </label>
              ))}
            </div>
            <button className="text-sm text-[#00b38e] mt-2 flex items-center">
              +15 More
              <FaChevronDown className="ml-1 text-xs" />
            </button>
          </div>

          {/* Facility Filter */}
          <div className="mb-4">
            <h3 className="font-medium text-[#333333] mb-3 text-sm">Facility</h3>
            <div className="space-y-2">
              {facilityOptions.map((facility) => (
                <label key={facility} className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox text-[#00b38e] h-4 w-4 rounded"
                    checked={filters.facilities.includes(facility)}
                    onChange={() => toggleFilter('facilities', facility)}
                  />
                  <span className="ml-2 text-sm text-[#333333]">{facility}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;