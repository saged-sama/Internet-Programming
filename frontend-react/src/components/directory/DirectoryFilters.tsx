import React from 'react';
import themeClasses from '../../lib/theme-utils';
import type { PersonRole, Department } from '../../lib/types';

interface DirectoryFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedRole: PersonRole | 'All';
  setSelectedRole: (role: PersonRole | 'All') => void;
  selectedDepartment: Department | 'All';
  setSelectedDepartment: (dept: Department | 'All') => void;
  roles: (PersonRole | 'All')[];
  departments: (Department | 'All')[];
}

const DirectoryFilters: React.FC<DirectoryFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedRole,
  setSelectedRole,
  selectedDepartment,
  setSelectedDepartment,
  roles,
  departments,
}) => (
  <div className={`bg-card p-4 rounded-lg shadow-sm mb-4 border-t-4 ${themeClasses.borderPrimary}`}>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name, email, or expertise..."
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <svg
          className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <div>
        <label htmlFor="role" className="block font-medium text-primary mb-1">
          Filter by Role
        </label>
        <select
          id="role"
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as PersonRole | 'All')}
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="department" className="block font-medium text-primary mb-1">
          Filter by Department
        </label>
        <select
          id="department"
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value as Department | 'All')}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);


export default DirectoryFilters;
