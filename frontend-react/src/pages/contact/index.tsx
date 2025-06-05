import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import themeClasses, { themeValues } from '../../lib/theme-utils';
// @ts-ignore
import departments from '../../assets/contactDepartments.json';
// @ts-ignore
import contactInfo from '../../assets/contactInfo.json';
// @ts-ignore
import contactSubjects from '../../assets/contactSubjects.json';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      // In a real application, this would be an API call
      console.log('Form submitted:', formData);
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  // Import departments from assets
  // @ts-ignore
  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-3xl font-bold ${themeClasses.textPrimary} mb-4`}>Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Have questions or need assistance? Reach out to us using the form below or contact the appropriate department directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Information */}
            <div>
              <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                <h2 className={`text-xl font-semibold mb-4 ${themeClasses.textPrimary}`}>University Address</h2>
                <address className="not-italic">
                  {/* Import address from assets */}
                  {/* @ts-ignore */}
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

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className={`text-xl font-semibold mb-4 ${themeClasses.textPrimary}`}>Department Contacts</h2>
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className={`font-medium ${themeClasses.textPrimary}`}>{dept.name}</h3>
                      <div className="flex items-center mb-1">
                        <svg className={`w-4 h-4 mr-2 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{dept.email}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className={`w-4 h-4 mr-2 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{dept.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className={`text-xl font-semibold mb-4 ${themeClasses.textPrimary}`}>Get In Touch</h2>
              {formStatus === 'success' ? (
                <div className={`bg-green-50 border-l-4 border-[${themeValues.colors.accentYellow}] p-4 mb-6`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className={`h-5 w-5 ${themeClasses.textAccentYellow}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Message Sent</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
                      </div>
                      <div className="mt-4">
                        <Button size="sm" onClick={() => setFormStatus('idle')}>
                          Send Another Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ECB31D]"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ECB31D]"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ECB31D]"
                      >
                        <option value="">Select a subject</option>
                        {/* Import subjects from assets */}
                        {/* @ts-ignore */}
                        {contactSubjects.map(subject => (
                          <option value={subject} key={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ECB31D]"
                      ></textarea>
                    </div>
                    <Button 
                      type="submit" 
                      disabled={formStatus === 'submitting'}
                      className={`w-full ${themeClasses.primaryButton}`}
                    >
                      {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Map */}
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
        </div>
      </div>
    </Layout>
  );
}
