import React from 'react';
import type { Person } from '../../lib/types';

interface ProfileHeaderProps {
  person: Person;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ person }) => (
  <div className="bg-white rounded-lg shadow-sm overflow-hidden border-t-4 border-[#13274D] mb-8">
    <div className="md:flex">
      <div className="md:w-1/3 p-6 flex justify-center">
        <img
          src={person.image}
          alt={person.name}
          className="w-48 h-48 object-cover rounded-full border-4 border-[#ECB31D]"
        />
      </div>
      <div className="md:w-2/3 p-6">
        <div className="flex items-center mb-2">
          <h1 className="text-3xl font-bold text-[#13274D] mr-3">{person.name}</h1>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              person.role === 'Faculty'
                ? 'bg-[#13274D] text-white'
                : person.role === 'Staff'
                ? 'bg-[#31466F] text-white'
                : 'bg-[#ECB31D] text-[#13274D]'
            }`}
          >
            {person.role}
          </span>
        </div>
        <div className="mb-2 text-lg text-gray-700">{person.title}</div>
        <div className="mb-2 text-sm text-gray-600">{person.department}</div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium text-[#13274D]">Email:</span> {person.email}
          </div>
          {person.phone && (
            <div>
              <span className="font-medium text-[#13274D]">Phone:</span> {person.phone}
            </div>
          )}
          {person.officeLocation && (
            <div>
              <span className="font-medium text-[#13274D]">Office:</span> {person.officeLocation}
            </div>
          )}
          {person.officeHours && (
            <div>
              <span className="font-medium text-[#13274D]">Office Hours:</span> {person.officeHours}
            </div>
          )}
        </div>
        {person.expertise && person.expertise.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {person.expertise.map((exp: string, i: number) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full bg-[#ECB31D] bg-opacity-20 px-2 py-0.5 text-xs text-[#13274D]"
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
