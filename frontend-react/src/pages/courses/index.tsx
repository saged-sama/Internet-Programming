import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { CourseDetails } from './components/CourseDetails';
import type { Course } from '../../types/course';

// Static course data
const courses: Course[] = [
  {
    id: '1',
    code: 'CSE101',
    name: 'Introduction to Computer Science',
    description: 'An introductory course to computer science concepts and principles.',
    credits: 3,
    instructor: 'Dr. Smith',
    degreeLevel: 'undergraduate',
    semester: '1st',
    prerequisites: [],
    topics: [
      'Computing basics',
      'Problem-solving approaches',
      'Introduction to programming concepts',
      'Basic data structures',
      'Algorithm development'
    ],
    objectives: [
      'Understand fundamental computing concepts',
      'Develop logical thinking skills',
      'Learn the basics of programming'
    ],
    outcomes: [
      'Ability to solve basic computational problems',
      'Understanding of fundamental programming principles',
      'Foundation for further study in computer science'
    ]
  },
  {
    id: '2',
    code: 'CSE201',
    name: 'Data Structures',
    description: 'Study of common data structures and their algorithms.',
    credits: 4,
    instructor: 'Dr. Johnson',
    degreeLevel: 'undergraduate',
    semester: '2nd',
    prerequisites: ['CSE101'],
    topics: [
      'Arrays and linked lists',
      'Stacks and queues',
      'Trees and graphs',
      'Hashing',
      'Algorithm analysis'
    ],
    objectives: [
      'Understand various data structures',
      'Learn to implement efficient algorithms',
      'Analyze algorithm complexity'
    ],
    outcomes: [
      'Ability to select appropriate data structures for problems',
      'Skills to implement and use common data structures',
      'Understanding of algorithm efficiency'
    ]
  },
  {
    id: '3',
    code: 'CSE301',
    name: 'Database Systems',
    description: 'Introduction to database management systems and SQL.',
    credits: 4,
    instructor: 'Dr. Williams',
    degreeLevel: 'undergraduate',
    semester: '3rd',
    prerequisites: ['CSE201'],
    topics: [
      'Database design',
      'SQL programming',
      'Normalization',
      'Transaction management',
      'Database security'
    ],
    objectives: [
      'Understand database design principles',
      'Learn SQL for data manipulation',
      'Study database administration concepts'
    ],
    outcomes: [
      'Ability to design efficient databases',
      'Skills in writing complex SQL queries',
      'Knowledge of database security principles'
    ]
  },
  {
    id: '4',
    code: 'CSE401',
    name: 'Operating Systems',
    description: 'Fundamentals of operating system design and implementation.',
    credits: 4,
    instructor: 'Dr. Brown',
    degreeLevel: 'undergraduate',
    semester: '4th',
    prerequisites: ['CSE201'],
    topics: [
      'Process management',
      'Memory management',
      'File systems',
      'I/O systems',
      'Virtualization'
    ],
    objectives: [
      'Understand OS architecture',
      'Learn resource management techniques',
      'Study concurrency and synchronization'
    ],
    outcomes: [
      'Understanding of OS internals',
      'Knowledge of resource allocation algorithms',
      'Skills in system programming'
    ]
  },
  {
    id: '5',
    code: 'CSE501',
    name: 'Machine Learning',
    description: 'Fundamentals of machine learning algorithms and applications.',
    credits: 3,
    instructor: 'Dr. Davis',
    degreeLevel: 'graduate',
    semester: '1st',
    prerequisites: ['Statistics', 'Linear Algebra'],
    topics: [
      'Supervised learning',
      'Unsupervised learning',
      'Neural networks',
      'Reinforcement learning',
      'Model evaluation'
    ],
    objectives: [
      'Understand ML principles',
      'Learn to implement ML algorithms',
      'Apply ML to real-world problems'
    ],
    outcomes: [
      'Ability to select appropriate ML algorithms',
      'Skills in implementing and evaluating ML models',
      'Understanding of ML limitations and ethics'
    ]
  },
  {
    id: '6',
    code: 'CSE601',
    name: 'Advanced Algorithms',
    description: 'In-depth study of complex algorithmic techniques and analysis.',
    credits: 3,
    instructor: 'Dr. Wilson',
    degreeLevel: 'graduate',
    semester: '2nd',
    prerequisites: ['CSE201', 'Discrete Mathematics'],
    topics: [
      'Dynamic programming',
      'Graph algorithms',
      'Approximation algorithms',
      'Randomized algorithms',
      'Computational complexity'
    ],
    objectives: [
      'Understand advanced algorithm design techniques',
      'Learn to analyze complex algorithms',
      'Study NP-completeness and approximation'
    ],
    outcomes: [
      'Ability to design algorithms for complex problems',
      'Skills in algorithm analysis and proof',
      'Understanding of computational complexity theory'
    ]
  }
];

// Degree program data
const degreePrograms = [
  { id: 'bsc-cse', title: 'BSc in Computer Science and Engineering' },
  { id: 'msc-cse', title: 'MSc in Computer Science and Engineering' },
  { id: 'pmics', title: 'Professional Masters in Information and Cyber Security (PMICS)' },
  { id: 'mphil-cse', title: 'MPhil in Computer Science and Engineering' },
  { id: 'phd-cse', title: 'PhD in Computer Science and Engineering' }
];

export default function CoursesPage() {
  const { degreeId } = useParams();
  const [filteredCourses, setFilteredCourses] = useState<Course[]>(courses);
  const [selectedSemester, setSelectedSemester] = useState<string>('');
  const [selectedDegreeLevel, setSelectedDegreeLevel] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [degreeTitle, setDegreeTitle] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(courses.length);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Set degree title when degree ID changes
  useEffect(() => {
    if (degreeId) {
      const degree = degreePrograms.find(d => d.id === degreeId);
      setDegreeTitle(degree?.title || null);
      
      // Auto-select the degree level based on the degree ID
      if (degreeId === 'bsc-cse') {
        setSelectedDegreeLevel('undergraduate');
      } else if (['msc-cse', 'pmics', 'mphil-cse'].includes(degreeId)) {
        setSelectedDegreeLevel('graduate');
      } else if (degreeId === 'phd-cse') {
        setSelectedDegreeLevel('doctorate');
      }
    } else {
      setDegreeTitle(null);
    }
  }, [degreeId]);
  
  // Filter courses when filters change
  useEffect(() => {
    setIsLoading(true);
    
    try {
      // Start with all courses
      let filtered = [...courses];
      
      // Filter by degree level
      if (selectedDegreeLevel) {
        filtered = filtered.filter(course => course.degreeLevel === selectedDegreeLevel);
      } else if (degreeId) {
        // If no degree level selected but we have a degree ID, apply that filter
        if (degreeId === 'bsc-cse') {
          filtered = filtered.filter(course => course.degreeLevel === 'undergraduate');
        } else if (['msc-cse', 'pmics', 'mphil-cse'].includes(degreeId)) {
          filtered = filtered.filter(course => course.degreeLevel === 'graduate');
        } else if (degreeId === 'phd-cse') {
          filtered = filtered.filter(course => course.degreeLevel === 'doctorate');
        }
      }
      
      // Filter by semester
      if (selectedSemester) {
        filtered = filtered.filter(course => course.semester === selectedSemester);
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(course => 
          course.name.toLowerCase().includes(query) || 
          course.code.toLowerCase().includes(query) || 
          course.description.toLowerCase().includes(query)
        );
      }
      
      setFilteredCourses(filtered);
      setTotalCount(filtered.length);
    } catch (err) {
      console.error('Error filtering courses:', err);
      setError('Failed to filter courses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedDegreeLevel, selectedSemester, searchQuery, degreeId]);
  
  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(e.target.value);
  };
  
  const handleDegreeLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDegreeLevel(e.target.value);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleResetFilters = () => {
    setSelectedSemester('');
    setSelectedDegreeLevel('');
    setSearchQuery('');
  };
  
  const handleCourseClick = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourse(course);
    }
  };
  
  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 px-4">
        {selectedCourse ? (
          <>
            <h1 className="mb-6">
              {degreeTitle ? `Course Details - ${degreeTitle}` : 'Course Details'}
            </h1>
            <CourseDetails 
              course={selectedCourse} 
              onBack={handleBackToCourses} 
            />
          </>
        ) : (
          <>
            <h1 className="mb-6">
              {degreeTitle ? `Courses for ${degreeTitle}` : 'Course Catalog'}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Filter sidebar */}
              <div className="md:col-span-1">
                <div className="bg-card p-4 rounded-lg border border-border">
                  <h2 className="mb-4">Filters</h2>
                  
                  <div className="space-y-4">
                    {/* Search input */}
                    <div>
                      <label htmlFor="search" className="block mb-2 text-muted-foreground">
                        Search
                      </label>
                      <input
                        type="text"
                        id="search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search courses..."
                        className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    
                    {/* Degree Level filter */}
                    <div>
                      <label htmlFor="degreeLevel" className="block mb-2 text-muted-foreground">
                        Degree Level
                      </label>
                      <select
                        id="degreeLevel"
                        value={selectedDegreeLevel}
                        onChange={handleDegreeLevelChange}
                        className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">All Levels</option>
                        <option value="undergraduate">Undergraduate (BSc)</option>
                        <option value="graduate">Graduate (MSc/MPhil)</option>
                        <option value="doctorate">Doctorate (PhD)</option>
                      </select>
                    </div>
                    
                    {/* Semester filter */}
                    <div>
                      <label htmlFor="semester" className="block mb-2 text-muted-foreground">
                        Semester
                      </label>
                      <select
                        id="semester"
                        value={selectedSemester}
                        onChange={handleSemesterChange}
                        className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">All Semesters</option>
                        <option value="1st">1st Semester</option>
                        <option value="2nd">2nd Semester</option>
                        <option value="3rd">3rd Semester</option>
                        <option value="4th">4th Semester</option>
                        <option value="5th">5th Semester</option>
                        <option value="6th">6th Semester</option>
                        <option value="7th">7th Semester</option>
                        <option value="8th">8th Semester</option>
                      </select>
                    </div>
                    
                    {/* Reset button */}
                    <button
                      onClick={handleResetFilters}
                      className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Main content area */}
              <div className="md:col-span-3">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-muted-foreground">Loading courses...</p>
                  </div>
                ) : error ? (
                  <div className="bg-card p-6 rounded-lg border border-border flex flex-col items-center justify-center">
                    <h3 className="mb-2">Error</h3>
                    <p className="text-muted-foreground text-center">{error}</p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                    >
                      Try Again
                    </button>
                  </div>
                ) : filteredCourses.length === 0 ? (
                  <div className="bg-card p-6 rounded-lg border border-border flex flex-col items-center justify-center">
                    <h3 className="mb-2">No courses found</h3>
                    <p className="text-muted-foreground text-center">
                      Try adjusting your filters or search query to find what you're looking for.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <>
                    {totalCount > 0 && (
                      <p className="mb-4 text-muted-foreground">
                        Showing {filteredCourses.length} of {totalCount} courses
                      </p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCourses.map(course => (
                        <div 
                          key={course.id}
                          onClick={() => handleCourseClick(course.id)}
                          className="bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-card-foreground">{course.name}</h3>
                              <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                                {course.code}
                              </span>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="px-2 py-1 text-xs bg-secondary/20 text-secondary-foreground rounded">
                                {course.degreeLevel === 'undergraduate' ? 'BSc' : 
                                 course.degreeLevel === 'graduate' ? 'MSc/MPhil' : 'PhD'}
                              </span>
                              <span className="px-2 py-1 text-xs bg-accent/20 text-accent-foreground rounded">
                                {course.semester} Semester
                              </span>
                              <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                                {course.credits} Credits
                              </span>
                            </div>
                            
                            <p className="text-muted-foreground mb-4 line-clamp-3">
                              {course.description}
                            </p>
                            
                            {course.prerequisites.length > 0 && (
                              <div className="mb-3 text-sm text-muted-foreground">
                                <span className="font-medium">Prerequisites:</span> {course.prerequisites.join(', ')}
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCourseClick(course.id);
                                }}
                                className="text-primary hover:text-primary/80 text-sm"
                              >
                                View Details →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
} 