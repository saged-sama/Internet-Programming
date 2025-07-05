import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const topNav = [
    { label: "Dashboard", to: "/" },
    { label: "About", to: "/about" },
    { label: "For You", to: "/foryou" },
  ];

  const bottomNav = [
    {
      label: "Scheduling",
      to: "/degrees",
      dropdown: [
        { label: "Class Schedule", to: "/scheduling/class-schedule" },
        { label: "Room Availability", to: "/scheduling/room-availability" },
        { label: "Admin Approval", to: "/scheduling/admin-approval" },
        { label: "Exam Timetables", to: "/exams/timetables" },
        { label: "Assignments", to: "/assignments" },
      ],
    },
    { label: "Notice", to: "/notices" },
    { label: "Resources", to: "/resources" },
    { label: "Meetings", to: "/meetings" },
    { label: "Degrees", to: "/degrees" },
    { label: "Courses", to: "/courses" },
    { label: "Events", to: "/events" },
    { label: "Directory", to: "/directory" },
    { label: "Contact", to: "/contact" },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <div className="max-w-7xl mx-auto px-6 w-full flex flex-row items-center bg-[#3F4864] rounded-2xl mt-4 shadow-lg min-h-[120px]">
      {/* Logo Column */}
      <div
        className="flex flex-col justify-center items-center h-full z-10 mr-6"
        style={{ minWidth: "110px" }}
      >
        <img src="/logo.svg" alt="Logo" className="h-28 w-auto" />
      </div>
      {/* Main Navbar Content */}
      <div className="flex-1 flex flex-col justify-center relative">
        {/* Top Row */}
        <div className="w-full flex items-center px-6  min-h-[96px]">
          {/* Gold Line Behind Logo to Dashboard */}
          <div className="absolute top-[33px] -left-13 right-[43%] h-1 bg-[#ECB31D] rounded-full z-0 -translate-y-1/2" />
          {/* Diamond indicator aligned with Dashboard */}
          <div className="absolute left-[57%] top-[33px] -translate-y-1/2 z-10">
            <div className="w-4 h-4 bg-[#ECB31D] rotate-45" />
          </div>
          {/* Top nav links */}
          <div className="flex flex-1 justify-end items-center space-x-8 z-10 mr-6 mt-4">
            {topNav.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`text-base font-medium transition-colors ${
                  isActive(item.to) ? "text-[#ECB31D]" : "text-gray-200"
                } hover:text-[#ECB31D]`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3 z-10">
            <Button
              variant="outline"
              size="sm"
              className="border-[#ECB31D] bg-transparent text-[#ECB31D] hover:bg-[#ECB31D] hover:text-[#13274D] px-4 py-2 rounded-lg text-sm"
            >
              <Link to="/auth/login">Sign In</Link>
            </Button>
            <Button
              size="sm"
              className="bg-[#ECB31D] hover:bg-[#F5C940] text-[#13274D] px-4 py-2 rounded-lg font-semibold text-sm"
            >
              <Link to="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="w-full flex items-center py-1 px-16 relative min-h-[40px]">
          {/* Bottom Gold Line */}
          <div className="absolute left-[444px] right-[calc(100%-1074px)] -top-[14px] -translate-y-1/2 h-1 bg-[#ECB31D] rounded-full z-0" />

          {/* Circle indicator */}
          <div className="absolute left-[434px] -top-[15px] -translate-y-1/2 z-10 transition-all duration-300">
            <div className="w-4 h-4 bg-[#ECB31D] rounded-full" />
          </div>

          {/* Bottom nav links */}
          <div className="flex space-x-8 -ml-[80px] z-10">
            {bottomNav.map((item) => {
              const isDropdownActive =
                item.dropdown &&
                item.dropdown.some((drop) => isActive(drop.to));
              if (item.dropdown) {
                return (
                  <div key={item.label} className="relative group">
                    <span
                      className={`${
                        isDropdownActive ? "text-white" : "text-[#ECB31D]"
                      } font-medium cursor-pointer flex items-center text-sm hover:text-gray-200 transition-colors`}
                    >
                      {item.label}
                      <svg
                        className="w-3 h-3 ml-1"
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
                    </span>
                    <div className="absolute left-0 mt-2 w-52 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                      <div className="py-2">
                        {item.dropdown.map((drop) => (
                          <Link
                            key={drop.label}
                            to={drop.to}
                            className={`block px-4 py-2 text-sm text-gray-700 hover:bg-[#ECB31D] hover:text-[#13274D] transition-colors ${
                              isActive(drop.to) ? "font-bold" : ""
                            }`}
                          >
                            {drop.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`font-medium transition-colors text-sm ${
                      isActive(item.to) ? "text-white" : "text-[#ECB31D]"
                    } hover:text-gray-200`}
                  >
                    {item.label}
                  </Link>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
