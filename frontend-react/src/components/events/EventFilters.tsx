// No UI components needed for this implementation

interface EventFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearch?: () => void; // Optional callback to trigger search explicitly
  viewMode?: 'grid' | 'calendar';
  setViewMode?: (mode: 'grid' | 'calendar') => void;
}

export default function EventFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onSearch,
  viewMode,
  setViewMode
}: EventFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 p-4 flex flex-wrap items-center justify-between gap-4">
      {/* Categories with slightly rounded corners */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${selectedCategory === category || (!selectedCategory && category === 'All') 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setSelectedCategory(category === 'All' ? null : category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Search box with button and view toggle */}
      <div className="flex items-center gap-2">
        {/* View toggle buttons */}
        {viewMode !== undefined && setViewMode && (
          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 flex items-center text-sm font-medium ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              aria-label="Switch to grid view"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              </svg>
              Grid View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 flex items-center text-sm font-medium ${viewMode === 'calendar' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              aria-label="Switch to calendar view"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar View
            </button>
          </div>
        )}
        
        <div className="relative ml-2">
          <input
            type="text"
            placeholder="Search events..."
            className="w-52 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && onSearch) {
                e.preventDefault();
                onSearch();
              }
            }}
          />
        </div>
        
        <button 
          onClick={() => onSearch ? onSearch() : null}
          className="bg-primary text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
      </div>
    </div>
  );
}
