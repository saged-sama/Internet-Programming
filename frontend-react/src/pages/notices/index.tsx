import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import themeClasses from '../../lib/theme-utils';
import NoticeCard from '../../components/notices/NoticeCard';
import NoticeFilters from '../../components/notices/NoticeFilters';
import noticesData from '../../assets/notices.json';

type NoticeCategory = 'All' | 'Academic' | 'Administrative' | 'General' | 'Research';

interface Notice {
  id: number;
  title: string;
  date: string;
  category: Exclude<NoticeCategory, 'All'>;
  description: string;
  isImportant?: boolean;
}

export default function NoticesPage() {
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const notices: Notice[] = noticesData as Notice[];

  const categories: NoticeCategory[] = ['All', 'Academic', 'Administrative', 'General', 'Research'];

  const filteredNotices = notices.filter(notice => {
    const matchesCategory = selectedCategory === 'All' || notice.category === selectedCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notice.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="bg-background py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className={themeClasses.textPrimary}>University Notices</h1>
            <p className={themeClasses.textPrimaryLight}>Stay updated with the latest announcements, academic updates, and administrative notices.</p>
          </div>

          {/* Filters */}
          <NoticeFilters
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory as (cat: string) => void}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Notices List */}
          <div className="space-y-4">
            {filteredNotices.length > 0 ? (
              filteredNotices.map((notice) => (
                <NoticeCard key={notice.id} {...notice} />
              ))
            ) : (
              <div className="text-center py-8">
                <svg className={`mx-auto h-12 w-12 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className={themeClasses.textPrimary}>No notices found</h3>
                <p>Try changing your search or filter criteria.</p>
                <div className="mt-4">
                  <Button onClick={() => {setSelectedCategory('All'); setSearchQuery('');}} className={themeClasses.primaryButton}>
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Archive Section */}
          <div className="mt-8 text-center">
            <h2 className={themeClasses.textPrimary}>Looking for older notices?</h2>
            <Button variant="outline" className={themeClasses.outlineButton} asChild>
              <Link to="/notices/archive">View Archive</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
