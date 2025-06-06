import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import themeClasses from '../../lib/theme-utils';
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
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!person) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className={themeClasses.textPrimary}>Person Not Found</h1>
            <p className={`${themeClasses.textPrimaryLight} mb-4`}>The person you're looking for doesn't exist or has been removed.</p>
            <Button asChild className={themeClasses.primaryButton}>
              <Link to="/directory">Back to Directory</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-background py-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
              </li>
              <li className="text-gray-500">/</li>
              <li>
                <Link to="/directory" className="text-muted-foreground hover:text-primary">Directory</Link>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-primary font-medium">{person.name}</li>
            </ol>
          </nav>

          {/* Profile Header */}
          <ProfileHeader person={person} />

          {/* Tabs */}
          <div className="mb-6 border-b border-border">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium ${
                  activeTab === 'overview' 
                    ? `border-accent text-primary` 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                Overview
              </button>
              {person.publications && (
                <button
                  onClick={() => setActiveTab('publications')}
                  className={`py-4 px-1 border-b-2 font-medium ${
                    activeTab === 'publications' 
                      ? `border-accent text-primary` 
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  }`}
                >
                  Publications
                </button>
              )}
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-4 px-1 border-b-2 font-medium ${
                  activeTab === 'schedule' 
                    ? `border-accent text-primary` 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
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
    </Layout>
  );
}