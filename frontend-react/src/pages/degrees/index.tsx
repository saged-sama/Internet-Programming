import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DegreeFilterOptions, DegreeProgram } from '../../types/degree';
import { DegreeCard } from './components/DegreeCard';
import { DegreeFilter } from './components/DegreeFilter';
import Layout from '../../components/layout/Layout';
import { degreePrograms } from './data/degreePrograms';

export default function DegreesPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<DegreeFilterOptions>({});
  const [degrees, setDegrees] = useState<DegreeProgram[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Filter degrees data when filters change
  useEffect(() => {
    const filterDegrees = () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Filter the degree programs based on the filters
        let filtered = [...degreePrograms];
        
        if (filter.level) {
          filtered = filtered.filter(degree => degree.level === filter.level);
        }
        
        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          filtered = filtered.filter(degree => 
            degree.title.toLowerCase().includes(query) || 
            degree.description.toLowerCase().includes(query) ||
            degree.concentrations?.some(c => c.toLowerCase().includes(query)) ||
            degree.careerOpportunities.some(c => c.toLowerCase().includes(query))
          );
        }
        
        // Mock pagination
        const limit = filter.limit || filtered.length;
        const offset = filter.offset || 0;
        const paginatedData = filtered.slice(offset, offset + limit);
        
        setDegrees(paginatedData);
        setTotalCount(filtered.length);
      } catch (err) {
        console.error('Error filtering degree programs:', err);
        setError('Failed to load degree programs. Please try again later.');
        setDegrees([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    filterDegrees();
  }, [filter]);

  const handleDegreeClick = (degree: DegreeProgram) => {
    // Navigate to a dedicated degree details page instead of showing a dialog
    navigate(`/degrees/${degree.id}`);
  };

  const handleFilterChange = (newFilter: DegreeFilterOptions) => {
    setFilter(newFilter);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        <h1 className="mb-6">Degree Outlines</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <DegreeFilter 
              filter={filter} 
              onFilterChange={handleFilterChange} 
            />
          </div>
          
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">Loading degree programs...</p>
              </div>
            ) : error ? (
              <div className="bg-card p-6 rounded-lg border border-border flex flex-col items-center justify-center">
                <h3 className="mb-2">Error</h3>
                <p className="text-muted-foreground text-center">{error}</p>
                <button
                  onClick={() => setFilter({})}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                >
                  Try Again
                </button>
              </div>
            ) : degrees.length === 0 ? (
              <div className="bg-card p-6 rounded-lg border border-border flex flex-col items-center justify-center">
                <h3 className="mb-2">No programs found</h3>
                <p className="text-muted-foreground text-center">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
                <button
                  onClick={() => setFilter({})}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {totalCount > 0 && (
                  <p className="mb-4 text-muted-foreground">
                    Showing {degrees.length} of {totalCount} programs
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {degrees.map(degree => (
                    <DegreeCard
                      key={degree.id}
                      degree={degree}
                      onClick={() => handleDegreeClick(degree)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}