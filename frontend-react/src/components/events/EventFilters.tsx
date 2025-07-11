import { Button } from '../ui/button';

interface EventFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearch?: () => void; // Optional callback to trigger search explicitly
}

export default function EventFilters({
  categories,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  onSearch
}: EventFiltersProps) {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category || (!selectedCategory && category === 'All') ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category === 'All' ? null : category)}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  // Trigger search on Enter key
                  if (onSearch) {
                    onSearch();
                  }
                }
              }}
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <Button 
            size="sm"
            onClick={() => onSearch ? onSearch() : null} // Use the explicit search callback
            className="px-4 py-2"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
