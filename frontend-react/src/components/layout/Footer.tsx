import { Link } from 'react-router-dom';
import themeClasses from '../../lib/theme-utils';

export default function Footer() {
  return (
    <footer className={`${themeClasses.bgPrimary} text-white`}>
      <div className="max-w-7xl mx-auto py-8 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="https://placehold.co/40x40?text=LOGO" 
                alt="University Logo" 
                className="h-10 w-10 mr-2" 
              />
              <a href="#" className={`${themeClasses.textAccentYellow} hover:text-accent`}>University Portal</a>
            </div>
            <p className="text-muted">
              Providing quality education and research opportunities since 1992.
              Our mission is to educate, inspire, and transform lives through
              excellence in teaching, research, and service.
            </p>
          </div>

          <div>
            <h2 className={`font-semibold mb-4 ${themeClasses.textAccentYellow}`}>Quick Links</h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="/" className="hover:text-accent">Home</Link></li>
              <li><Link to="/notices" className="hover:text-accent">Notices</Link></li>
              <li><Link to="/events" className="hover:text-accent">Events</Link></li>
              <li><Link to="/directory" className="hover:text-accent">Directory</Link></li>
              <li><Link to="/meetings" className="hover:text-accent">Meetings</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h2 className={`font-semibold mb-4 ${themeClasses.textAccentYellow}`}>Resources</h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link to="#" className="hover:text-accent">Library</Link></li>
              <li><Link to="#" className="hover:text-accent">Research</Link></li>
              <li><Link to="#" className="hover:text-accent">Academic Calendar</Link></li>
              <li><Link to="#" className="hover:text-accent">Student Portal</Link></li>
              <li><Link to="#" className="hover:text-accent">Faculty Resources</Link></li>
            </ul>
          </div>

          <div>
            <h2 className={`font-semibold mb-4 ${themeClasses.textAccentYellow}`}>Contact Us</h2>
            <address className="not-italic text-muted">
              <p>123 University Avenue</p>
              <p>Dhaka, Bangladesh</p>
              <p className="mt-2">Email: info@university.edu</p>
              <p>Phone: +880 1234 567890</p>
            </address>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-[#ECB31D] hover:text-[#F5C940]">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-[#ECB31D] hover:text-[#F5C940]">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-primary-light pt-4 text-center">
          <p className="text-muted">&copy; {new Date().getFullYear()} University Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}