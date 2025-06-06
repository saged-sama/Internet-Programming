import React from 'react';
import themeClasses from '../../lib/theme-utils';

const ContactMap: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className={`text-xl font-semibold mb-4 ${themeClasses.textPrimary}`}>Find Us</h2>
    <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
      {/* In a real application, you would use a proper map component like Google Maps or Leaflet */}
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className={`${themeClasses.textPrimary}`}>Map Placeholder</p>
          <p className="text-sm text-gray-400">In a production environment, this would be an embedded Google Map or OpenStreetMap</p>
        </div>
      </div>
    </div>
  </div>
);

export default ContactMap;
