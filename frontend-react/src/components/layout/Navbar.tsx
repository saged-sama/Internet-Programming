import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export default function Navbar() {
  return (
    <nav className="bg-[#13274D] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Dhaka_University_logo.svg/800px-Dhaka_University_logo.svg.png" 
                  alt="University Logo" 
                  className="h-10 w-10 mr-2" 
                />
                <Link to="/" className="text-xl font-bold text-[#ECB31D]">CSEDU Portal</Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="border-transparent text-white hover:border-[#ECB31D] hover:text-[#F5C940] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/notices" className="border-transparent text-white hover:border-[#ECB31D] hover:text-[#F5C940] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Notices
              </Link>
              <Link to="/events" className="border-transparent text-white hover:border-[#ECB31D] hover:text-[#F5C940] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Events
              </Link>
              <Link to="/directory" className="border-transparent text-white hover:border-[#ECB31D] hover:text-[#F5C940] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Directory
              </Link>
              <Link to="/meetings" className="border-transparent text-white hover:border-[#ECB31D] hover:text-[#F5C940] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Meetings
              </Link>
              <Link to="/contact" className="border-transparent text-white hover:border-[#ECB31D] hover:text-[#F5C940] inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <Button variant="outline" size="sm" className="text-[#ECB31D] border-[#ECB31D] hover:bg-[#ECB31D] hover:text-[#13274D]" asChild>
              <Link to="/auth/login">Login</Link>
            </Button>
            <Button className="ml-2 bg-[#ECB31D] hover:bg-[#F5C940] text-[#13274D]" size="sm" asChild>
              <Link to="/auth/signup">Register</Link>
            </Button>
          </div>
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" size="sm" className="text-white">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
