import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import ProfileHeader from '../../components/directory/ProfileHeader';
import ProfileTabs from '../../components/directory/ProfileTabs';
import type { Person } from '../../lib/types';
import peopleData from '../../assets/people.json';

export default function DirectoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'publications' | 'schedule'>('overview');

  useEffect(() => {
    const mockPeople: Person[] = peopleData as Person[];

    const foundPerson = mockPeople.find(p => p.id === Number(id));
    
    setTimeout(() => {
      setPerson(foundPerson || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
    
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13274D]"></div>
          </div>
        </div>
      
    );
  }

  if (!person) {
    return (
    
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#13274D] mb-4">Person Not Found</h1>
            <p className="text-gray-600 mb-6">The person you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="bg-[#13274D] hover:bg-[#31466F]">
              <Link to="/directory">Back to Directory</Link>
            </Button>
          </div>
        </div>
  
    );
  }

  return (
    
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-[#13274D]">Home</Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link to="/directory" className="text-gray-500 hover:text-[#13274D]">Directory</Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-[#13274D] font-medium">{person.name}</li>
            </ol>
          </nav>

          {/* Profile Header */}
          <ProfileHeader person={person} />

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview' 
                    ? 'border-[#ECB31D] text-[#13274D]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              {person.publications && (
                <button
                  onClick={() => setActiveTab('publications')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'publications' 
                      ? 'border-[#ECB31D] text-[#13274D]' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Publications
                </button>
              )}
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schedule' 
                    ? 'border-[#ECB31D] text-[#13274D]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Schedule Meeting
              </button>
            </nav>
          </div>

          {/* Tabbed Content */}
          <ProfileTabs person={person} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>

  );
}