import React from 'react';
import { Link } from 'react-router-dom';
import themeClasses, { themeValues } from '../../lib/theme-utils';

// Types for user data from API
type UserResponse = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  image?: string;
  bio?: string;
  address?: string;
  date_of_birth?: string;
};

type FacultyResponse = {
  id: string;
  user_id: string;
  specialization?: string;
  research_interests?: string;
  publications?: string;
  courses_taught?: string;
  office_hours?: string;
  office_location?: string;
  chairman: boolean;
  user: UserResponse;
};

type StudentResponse = {
  id: string;
  user_id: string;
  student_id?: string;
  major?: string;
  admission_date?: string;
  graduation_date?: string;
  year_of_study?: number;
  student_type?: string;
  cgpa?: number;
  extracurricular_activities?: string;
  user: UserResponse;
};

interface DirectoryCardProps {
  item: FacultyResponse | StudentResponse;
  type: 'Faculty' | 'Student';
}

// Note: The major is already BSc/MSc/PhD in the mock data

const DirectoryCard: React.FC<DirectoryCardProps> = ({ item, type }) => {
  // Common user data
  const user = item.user;
  
  // Render faculty card
  if (type === 'Faculty') {
    const faculty = item as FacultyResponse;
    return (
      <Link
        to={`/directory/${faculty.id}`}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow hover:border-[${themeValues.colors.accentYellow}]`}
      >
        <div className="flex items-center p-4">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 bg-gray-100 flex items-center justify-center">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-gray-400">👤</span>
            )}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${themeClasses.textPrimary}`}>{user.name}</h3>
            <div className="flex items-center space-x-2 mb-1">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${themeClasses.bgPrimary} text-white`}
              >
                Faculty
              </span>
              {/* Department is hidden for faculty as requested */}
            </div>
            {faculty.specialization && (
              <p className="text-sm text-gray-600">{faculty.specialization}</p>
            )}
            {faculty.research_interests && (
              <div className="mt-2 flex flex-wrap gap-1">
                {faculty.research_interests.split(',').slice(0, 2).map((interest, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs ${themeClasses.textPrimary}`}
                  >
                    {interest.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }
  
  // Render student card
  else {
    const student = item as StudentResponse;
    
    return (
      <Link
        to={`/directory/${student.id}`}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow hover:border-[${themeValues.colors.accentYellow}]`}
      >
        <div className="flex items-center p-4">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 bg-gray-100 flex items-center justify-center border-amber-300">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-gray-400">👤</span>
            )}
          </div>
          <div>
            <h3 className={`text-lg font-semibold ${themeClasses.textPrimary}`}>{user.name}</h3>
            <div className="flex items-center space-x-2 mb-1">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${themeClasses.bgAccentYellow} ${themeClasses.textPrimary}`}
              >
                Student
              </span>
              {/* Department is hidden for students as requested */}
            </div>
            {student.student_id && (
              <p className="text-sm text-gray-600">ID: {student.student_id}</p>
            )}
            {student.major && (
              <p className="text-sm text-gray-600">{student.major}</p>
            )}
            {student.year_of_study && (
              <div className="mt-1">
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-800">
                  Year {student.year_of_study}
                </span>
                {/* CGPA is hidden as requested */}
              </div>
            )}
          </div>
        </div>
      </Link>
    );
  }
};

export default DirectoryCard;
