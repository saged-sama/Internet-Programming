import React from 'react';
import themeClasses from '../../lib/theme-utils';

const ContactMap: React.FC = () => (
  <div className="bg-card p-4 rounded-lg shadow-sm">
    <h2 className={`font-semibold mb-4 ${themeClasses.textPrimary}`}>Find Us</h2>
    <div className="h-96 bg-muted rounded-lg overflow-hidden">
      {/* In a real application, you would use a proper map component like Google Maps or Leaflet */}
      <div className="w-full h-full flex items-center justify-center bg-muted-foreground/10">
        <div className="text-center">
          <p className={`${themeClasses.textPrimary}`}>Map Placeholder</p>
          <p className="text-muted-foreground">In a production environment, this would be an embedded Google Map or OpenStreetMap</p>
        </div>
      </div>
    </div>
  </div>
);

export default ContactMap;
