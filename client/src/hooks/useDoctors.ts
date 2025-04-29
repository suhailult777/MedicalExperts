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

  // Toggle filter values (for checkboxes and range arrays)
  const toggleFilter = useCallback((filterType: keyof FilterState, value: any) => {
    setFilters(prev => {
      // For regular string arrays (modes, languages, facilities)
      if (Array.isArray(prev[filterType]) && filterType !== 'experienceRange' && filterType !== 'priceRange') {
        const currentArray = prev[filterType] as string[];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        
        return { 
          ...prev, 
          [filterType]: newArray,
          page: 1 // Reset to page 1 when filter changes
        };
      }
      
      // Special handling for range arrays (experienceRange, priceRange)
      if (filterType === 'experienceRange' || filterType === 'priceRange') {
        // Get the current ranges array
        const currentRanges = [...prev[filterType] as [number, number][]]; 
        const newRange = value as [number, number];
        
        // Check if the exact range already exists
        let found = false;
        let indexToRemove = -1;
        
        for (let i = 0; i < currentRanges.length; i++) {
          if (currentRanges[i][0] === newRange[0] && currentRanges[i][1] === newRange[1]) {
            found = true;
            indexToRemove = i;
            break;
          }
        }
        
        // If found, remove it; otherwise add it
        if (found) {
          currentRanges.splice(indexToRemove, 1);
        } else {
          currentRanges.push(newRange);
        }
        
        return { 
          ...prev, 
          [filterType]: currentRanges,
          page: 1 // Reset to page 1 when filter changes 
        };
      }
      
      // Default fallback for simple values
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
