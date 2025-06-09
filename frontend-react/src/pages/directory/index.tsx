import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import themeClasses from '../../lib/theme-utils';
import peopleData from '../../assets/people.json';
import DirectoryCard from '../../components/directory/DirectoryCard';
import DirectoryFilters from '../../components/directory/DirectoryFilters';
import { filterPeople } from '../../lib/filterPeople';

import type { Person, Department, PersonRole } from '../../lib/types';

export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<PersonRole | 'All'>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'All'>('All');
  

  const [people] = useState<Person[]>(peopleData as Person[]);

  const roles: (PersonRole | 'All')[] = ['All', 'Faculty', 'Staff', 'Student'];
  const departments: (Department | 'All')[] = ['All', 'Computer Science', 'Engineering', 'Business', 'Arts', 'Science', 'Medicine'];

  const filteredPeople = filterPeople(people, searchQuery, selectedRole, selectedDepartment);

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-[#13274D] mb-4">University Directory</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find faculty members, staff, and students across different departments.
            </p>
          </div>

          {/* Search and Filters */}
          <DirectoryFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            roles={roles}
            departments={departments}
          />

          {/* Directory Results */}
          {filteredPeople.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPeople.map(person => (
                <DirectoryCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className={`mx-auto h-12 w-12 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className={`mt-2 text-lg font-medium ${themeClasses.textPrimary}`}>No people found</h3>
              <p className="mt-1 text-gray-500">Try changing your search or filter criteria.</p>
              <div className="mt-6">
                <Button 
                  onClick={() => {setSelectedRole('All'); setSelectedDepartment('All'); setSearchQuery('');}} 
                  className={`${themeClasses.bgPrimary} hover:${themeClasses.bgPrimaryLight} text-white`}
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
