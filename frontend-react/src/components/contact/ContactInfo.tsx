import React from 'react';
import themeClasses from '../../lib/theme-utils';
// @ts-ignore
import contactInfo from '../../assets/contactInfo.json';

const ContactInfo: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
    <h2 className={`text-xl font-semibold mb-4 ${themeClasses.textPrimary}`}>University Address</h2>
    <address className="not-italic">
      {contactInfo.address.map((line: string, idx: number) => (
        <p className={idx === 3 ? "mb-4" : "mb-2"} key={idx}>{line}</p>
      ))}
      <div className="flex items-center mb-2">
        <svg className={`w-5 h-5 mr-2 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>{contactInfo.email}</span>
      </div>
      <div className="flex items-center">
        <svg className={`w-5 h-5 mr-2 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span>{contactInfo.phone}</span>
      </div>
    </address>
  </div>
);

export default ContactInfo;
