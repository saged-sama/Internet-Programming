import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import themeClasses from "../../lib/theme-utils";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div>
      {/* Top section with logo and buttons */}
      <div className="bg-card py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Dhaka_University_logo.svg/800px-Dhaka_University_logo.svg.png"
              alt="University Logo"
              className="h-8 w-8 mr-2"
            />
            <Link to="/" className="font-bold text-foreground">
              CSEDU
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/about"
              className="font-medium text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
            <Link
              to="/events"
              className="font-medium text-muted-foreground hover:text-foreground"
            >
              Events
            </Link>

            <div className="flex items-center space-x-1">
              <span className="font-medium text-muted-foreground">FOR YOU</span>
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <Button
              variant="outline"
              size="sm"
              className={`${themeClasses.outlineButton}`}
            >
              <Link to="/auth/login">Login</Link>
            </Button>
            <Button size="sm" className={`${themeClasses.primaryButton}`}>
              <Link to="/auth/signup">Register</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <nav className="bg-primary shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex space-x-8">
            <Link to="/" className="text-primary-foreground hover:text-accent font-medium">
              Home
            </Link>
            <Link
              to="/notices"
              className="text-primary-foreground hover:text-accent font-medium"
            >
              Notices
            </Link>
            <Link
              to="/events"
              className="text-primary-foreground hover:text-accent font-medium"
            >
              Events
            </Link>
            <Link
              to="/directory"
              className="text-primary-foreground hover:text-accent font-medium"
            >
              Directory
            </Link>
            <Link
              to="/meetings"
              className="text-primary-foreground hover:text-accent font-medium"
            >
              Meetings
            </Link>
            <Link
              to="/resources"
              className="text-primary-foreground hover:text-accent font-medium"
            >
              Resources
            </Link>
            <Link
              to="/contact"
              className="text-primary-foreground hover:text-accent font-medium"
            >
              Contact
            </Link>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              className="block w-64 p-2 pl-10 text-primary-foreground border-border rounded-full bg-primary-dark focus:ring focus:border-accent"
              placeholder="Search..."
            />
          </div>
        </div>
      </nav>

      {/* Mobile menu toggle button for smaller screens */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          className="text-primary-foreground bg-primary rounded-full"
          onClick={toggleMobileMenu}
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-card">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <div className="flex items-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cb/Dhaka_University_logo.svg/800px-Dhaka_University_logo.svg.png"
                  alt="University Logo"
                  className="h-8 w-8 mr-2"
                />
                <span className="font-bold">CSEDU</span>
              </div>
              <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
            <Link
              to="/"
              className="block px-3 py-2 font-medium text-foreground hover:bg-accent/10"
            >
              Home
            </Link>
            <Link
              to="/notices"
              className="block px-3 py-2 font-medium text-foreground hover:bg-accent/10"
            >
              Notices
            </Link>
            <Link
              to="/events"
              className="block px-3 py-2 font-medium text-foreground hover:bg-accent/10"
            >
              Events
            </Link>
            <Link
              to="/directory"
              className="block px-3 py-2 font-medium text-foreground hover:bg-accent/10"
            >
              Directory
            </Link>
            <Link
              to="/meetings"
              className="block px-3 py-2 font-medium text-foreground hover:bg-accent/10"
            >
              Meetings
            </Link>
            <Link
              to="/resources"
              className="block px-3 py-2 font-medium text-foreground hover:bg-accent/10"
            >
              Resources
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 font-medium text-foreground hover:bg-accent/10"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
