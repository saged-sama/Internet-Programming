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

  // Find the chairman (looking for specific titles that indicate chairman role)
  const chairman = people.find(person => 
    person.role?.toLowerCase().includes('chairman') || 
    person.role?.toLowerCase().includes('chair') ||
    person.role?.toLowerCase().includes('head of department') ||
    person.role?.toLowerCase().includes('dept head')
  );

  // Filter out chairman from regular directory list
  const regularPeople = people.filter(person => person.id !== chairman?.id);
  const filteredPeople = filterPeople(regularPeople, searchQuery, selectedRole, selectedDepartment);

  return (
   
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-3xl font-bold ${themeClasses.textPrimary} mb-4`}>University Directory</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find faculty members, staff, and students across different departments.
            </p>
          </div>

          {/* Chairman Highlight Section */}
          {chairman && (
            <div className="mb-12">
              <div className={`${themeClasses.bgPrimary} rounded-xl p-6 shadow-xl border-l-4 ${themeClasses.borderAccentYellow}`}>
                <div className="flex items-center justify-center mb-4">
                  <div className={`${themeClasses.bgAccentYellow} rounded-full p-2 mr-3`}>
                    <span className="text-2xl">👑</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Department Chairman</h2>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="flex flex-col md:flex-row items-center text-center md:text-left">
                    <div className={`w-20 h-20 rounded-full bg-white/20 border-3 ${themeClasses.borderAccentYellow} overflow-hidden mb-4 md:mb-0 md:mr-6 flex items-center justify-center shadow-lg`}>
                      {chairman.image ? (
                        <img 
                          src={chairman.image} 
                          alt={chairman.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-white">👤</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{chairman.name}</h3>
                      <p className={`${themeClasses.textAccentYellow} font-medium mb-2`}>{chairman.title}</p>
                      <p className="text-white/80 text-sm mb-3">{chairman.department}</p>
                      
                      <div className="flex flex-col md:flex-row gap-2 text-sm text-white/90">
                        {chairman.email && (
                          <div className="flex items-center justify-center md:justify-start gap-1">
                            <span>📧</span>
                            <a href={`mailto:${chairman.email}`} className="hover:text-[#ECB31D] underline transition-colors">
                              {chairman.email}
                            </a>
                          </div>
                        )}
                        {chairman.officeLocation && (
                          <div className="flex items-center justify-center md:justify-start gap-1">
                            <span>🏢</span>
                            <span>{chairman.officeLocation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <div className={`inline-block ${themeClasses.bgAccentYellow} text-[#13274D] px-4 py-2 rounded-lg shadow-sm`}>
                      <p className="text-sm font-medium italic">
                        "Leading our department towards excellence in computer science education and research"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
  
  );
}
