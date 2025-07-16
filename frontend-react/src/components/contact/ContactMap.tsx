import React from 'react';
import themeClasses from '../../lib/theme-utils';

const ContactMap: React.FC = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className={`text-xl font-semibold mb-4 ${themeClasses.textPrimary}`}>Find Us</h2>
    <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.5262005251967!2d90.39345517617487!3d23.728621989483363!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8e90a449e4f%3A0xb7092a9c25197fa4!2sDepartment%20of%20Computer%20Science%20and%20Engineering%2C%20University%20of%20Dhaka!5e0!3m2!1sen!2sbd!4v1721168265000!5m2!1sen!2sbd" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen={true} 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="CSEDU Location Map"
        className="rounded-lg"
      />
    </div>
    <div className="mt-3">
      <p className="text-sm text-gray-600">Department of Computer Science and Engineering</p>
      <p className="text-xs text-gray-500">University of Dhaka, Dhaka 1000, Bangladesh</p>
    </div>
  </div>
);

export default ContactMap;
