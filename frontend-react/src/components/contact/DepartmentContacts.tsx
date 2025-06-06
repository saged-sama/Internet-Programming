import React from 'react';
import themeClasses from '../../lib/theme-utils';
// @ts-ignore
import departments from '../../assets/contactDepartments.json';

const DepartmentContacts: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className={`text-xl font-semibold mb-4 ${themeClasses.textPrimary}`}>Department Contacts</h2>
    <div className="space-y-4">
      {departments.map((dept: any, index: number) => (
        <div key={index} className="flex items-start">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${themeClasses.bgAccentYellow}`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-gray-900">{dept.name}</p>
            <p className="text-gray-600 text-sm">{dept.email}</p>
            <p className="text-gray-600 text-sm">{dept.phone}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DepartmentContacts;
