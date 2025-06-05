import React from 'react';
import { Link } from 'react-router-dom';
import themeClasses, { themeValues } from '../../lib/theme-utils';
import type { Person } from '../../lib/types';

interface DirectoryCardProps {
  person: Person;
}

const DirectoryCard: React.FC<DirectoryCardProps> = ({ person }) => (
  <Link
    to={`/directory/${person.id}`}
    className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow hover:border-[${themeValues.colors.accentYellow}]`}
  >
    <div className="flex items-center p-4">
      <img
        src={person.image}
        alt={person.name}
        className={`w-16 h-16 rounded-full object-cover mr-4 border-2 ${themeClasses.borderAccentYellow}`}
      />
      <div>
        <h3 className={`text-lg font-semibold ${themeClasses.textPrimary}`}>{person.name}</h3>
        <div className="flex items-center space-x-2 mb-1">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              person.role === 'Faculty'
                ? `${themeClasses.bgPrimary} text-white`
                : person.role === 'Staff'
                ? `${themeClasses.bgPrimaryLight} text-white`
                : `${themeClasses.bgAccentYellow} ${themeClasses.textPrimary}`
            }`}
          >
            {person.role}
          </span>
          <span className="text-sm text-gray-500">{person.department}</span>
        </div>
        {person.title && <p className="text-sm text-gray-600">{person.title}</p>}
        {person.expertise && person.expertise.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {person.expertise.slice(0, 2).map((exp: string, i: number) => (
              <span
                key={i}
                className={`inline-flex items-center rounded-full bg-[${themeValues.colors.accentYellowLight}] bg-opacity-20 px-2 py-0.5 text-xs ${themeClasses.textPrimary}`}
              >
                {exp}
              </span>
            ))}
            {person.expertise.length > 2 && (
              <span className={`inline-flex items-center rounded-full bg-[${themeValues.colors.accentYellowLight}] bg-opacity-20 px-2 py-0.5 text-xs ${themeClasses.textPrimary}`}>
                +{person.expertise.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  </Link>
);

export default DirectoryCard;
