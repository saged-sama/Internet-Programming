import React from 'react';
import themeClasses from '../../lib/theme-utils';
import type { Person } from '../../lib/types';

interface ProfileHeaderProps {
  person: Person;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ person }) => (
  <div className={`bg-card rounded-lg shadow-sm overflow-hidden border-t-4 ${themeClasses.borderPrimary} mb-4`}>
    <div className="md:flex">
      <div className="md:w-1/3 p-4 flex justify-center">
        <img
          src={person.image}
          alt={person.name}
          className={`w-48 h-48 object-cover rounded-full border-4 ${themeClasses.borderAccentYellow}`}
        />
      </div>
      <div className="md:w-2/3 p-4">
        <div className="flex items-center mb-2">
          <h1 className={`font-bold ${themeClasses.textPrimary} mr-3`}>{person.name}</h1>
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 font-medium ${
              person.role === 'Faculty'
                ? `${themeClasses.bgPrimary} text-white`
                : person.role === 'Staff'
                ? `${themeClasses.bgPrimaryLight} text-white`
                : `${themeClasses.bgAccentYellow} ${themeClasses.textPrimary}`
            }`}
          >
            {person.role}
          </span>
        </div>
        <div className="mb-2 text-foreground">{person.title}</div>
        <div className="mb-2 text-muted-foreground">{person.department}</div>
        <div className="flex flex-wrap gap-4 text-muted-foreground">
          <div>
            <span className={`font-medium ${themeClasses.textPrimary}`}>Email:</span> {person.email}
          </div>
          {person.phone && (
            <div>
              <span className={`font-medium ${themeClasses.textPrimary}`}>Phone:</span> {person.phone}
            </div>
          )}
          {person.officeLocation && (
            <div>
              <span className={`font-medium ${themeClasses.textPrimary}`}>Office:</span> {person.officeLocation}
            </div>
          )}
          {person.officeHours && (
            <div>
              <span className={`font-medium ${themeClasses.textPrimary}`}>Office Hours:</span> {person.officeHours}
            </div>
          )}
        </div>
        {person.expertise && person.expertise.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {person.expertise.map((exp: string, i: number) => (
              <span
                key={i}
                className={`inline-flex items-center rounded-full ${themeClasses.bgAccentYellowLight} px-2 py-1 ${themeClasses.textPrimary}`}
              >
                {exp}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default ProfileHeader;
