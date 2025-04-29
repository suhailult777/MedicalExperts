import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FilterState, DoctorsResponse } from '@/types/doctor';

const DEFAULT_FILTERS: FilterState = {
  modes: [],
  experienceRange: [],
  priceRange: [],
  languages: [],
  facilities: [],
  search: '',
  page: 1,
  limit: 10,
  sort: 'relevance',
};

export function useDoctors(initialFilters: Partial<FilterState> = {}) {
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  // Build query string from filters
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    
    if (filters.modes.length > 0) {
      params.append('modes', filters.modes.join(','));
    }
    
    if (filters.experienceRange.length > 0) {
      params.append('experienceRange', JSON.stringify(filters.experienceRange));
    }
    
    if (filters.priceRange.length > 0) {
      params.append('priceRange', JSON.stringify(filters.priceRange));
    }
    
    if (filters.languages.length > 0) {
      params.append('languages', filters.languages.join(','));
    }
    
    if (filters.facilities.length > 0) {
      params.append('facilities', filters.facilities.join(','));
    }
    
    params.append('page', filters.page.toString());
    params.append('limit', filters.limit.toString());
    params.append('sort', filters.sort);
    
    return params.toString();
  }, [filters]);

  // Create the query string
  const queryString = buildQueryString();
  
  // Fetch doctors with current filters
  const { data, isLoading, error, refetch } = useQuery<DoctorsResponse>({
    queryKey: [`/api/doctors?${queryString}`],
  });

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => {
      // If changing anything other than page, reset to page 1
      if (Object.keys(newFilters).some(key => key !== 'page')) {
        return { ...prev, ...newFilters, page: 1 };
      }
      return { ...prev, ...newFilters };
    });
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Toggle filter values (for checkboxes)
  const toggleFilter = useCallback((filterType: keyof FilterState, value: any) => {
    setFilters(prev => {
      // Handle arrays (modes, languages, facilities)
      if (Array.isArray(prev[filterType])) {
        const currentArray = prev[filterType] as any[];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        
        return { 
          ...prev, 
          [filterType]: newArray,
          page: 1 // Reset to page 1 when filter changes
        };
      }
      
      // Handle range arrays (experienceRange, priceRange)
      if (filterType === 'experienceRange' || filterType === 'priceRange') {
        const ranges = prev[filterType] as [number, number][];
        const valueRange = value as [number, number];
        
        // Check if range exists
        const rangeIndex = ranges.findIndex(
          range => range[0] === valueRange[0] && range[1] === valueRange[1]
        );
        
        // Toggle range
        const newRanges = rangeIndex >= 0
          ? ranges.filter((_, index) => index !== rangeIndex)
          : [...ranges, valueRange];
        
        return { 
          ...prev, 
          [filterType]: newRanges,
          page: 1 // Reset to page 1 when filter changes
        };
      }
      
      // Default fallback
      return { ...prev, [filterType]: value, page: 1 };
    });
  }, []);

  return {
    doctors: data?.doctors || [],
    totalDoctors: data?.total || 0,
    isLoading,
    error,
    filters,
    updateFilters,
    resetFilters,
    toggleFilter,
    refetch,
  };
}
