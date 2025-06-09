import { useState, useEffect, useRef } from 'react';
import type { DegreeFilterOptions, DegreeLevel } from '../../../types/degree';

interface DegreeFilterProps {
  filter: DegreeFilterOptions;
  onFilterChange: (filter: DegreeFilterOptions) => void;
}

export function DegreeFilter({ filter, onFilterChange }: DegreeFilterProps) {
  // Local state for the search input to enable debouncing
  const [searchInput, setSearchInput] = useState(filter.searchQuery || '');
  const searchDebounceRef = useRef<number | null>(null);

  // Handle level change
  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as DegreeLevel | '';
    onFilterChange({ 
      ...filter, 
      level: value === '' ? undefined : value as DegreeLevel 
    });
  };

  // Handle search input change with debounce
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchInput(value);
    
    // Clear any existing timeout
    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
    }
    
    // Set a new timeout for debouncing
    searchDebounceRef.current = window.setTimeout(() => {
      onFilterChange({
        ...filter,
        searchQuery: value.trim() === '' ? undefined : value.trim()
      });
    }, 300); // 300ms debounce
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    // Immediately apply the current search input
    if (searchDebounceRef.current) {
      window.clearTimeout(searchDebounceRef.current);
      searchDebounceRef.current = null;
    }
    
    onFilterChange({
      ...filter,
      searchQuery: searchInput.trim() === '' ? undefined : searchInput.trim()
    });
  };

  // Reset all filters
  const handleReset = () => {
    setSearchInput('');
    onFilterChange({});
  };
  
  // Sync local state with props when filter changes externally
  useEffect(() => {
    setSearchInput(filter.searchQuery || '');
  }, [filter.searchQuery]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        window.clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-card p-4 rounded-lg border border-border">
      <h2 className="mb-4">Filter Programs</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="search" className="block mb-2 text-muted-foreground">
            Search Programs
          </label>
          <div className="flex">
            <input
              id="search"
              type="text"
              placeholder="Search by keyword..."
              value={searchInput}
              onChange={handleSearchInputChange}
              className="p-2 rounded-md border border-input bg-background text-foreground flex-grow"
              aria-label="Search for degree programs"
            />
            <button 
              type="submit"
              className="ml-2 px-3 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
              aria-label="Search"
            >
              Search
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <label htmlFor="level" className="block mb-2 text-muted-foreground">
            Degree Level
          </label>
          <select
            id="level"
            value={filter.level || ''}
            onChange={handleLevelChange}
            className="p-2 rounded-md border border-input bg-background text-foreground"
            aria-label="Filter by degree level"
          >
            <option value="">All Levels</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate</option>
            <option value="doctorate">Doctorate</option>
          </select>
        </div>
        
        <button
          type="button"
          onClick={handleReset}
          className="w-full mt-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90"
          aria-label="Reset all filters"
        >
          Reset Filters
        </button>
      </form>
    </div>
  );
} 