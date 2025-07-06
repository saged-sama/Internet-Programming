import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const courses = [
  {
    code: "CSE 2101",
    name: "Data Structure and Algorithms",
    badge: "Easy",
    credits: 3,
    semester: "3rd Year 2nd Semester",
    instructor: "Dr. Ahmed Khan",
  },
  // Repeat for demo
  {
    code: "CSE 2101",
    name: "Data Structure and Algorithms",
    badge: "Easy",
    credits: 3,
    semester: "3rd Year 2nd Semester",
    instructor: "Dr. Ahmed Khan",
  },
  {
    code: "CSE 2101",
    name: "Data Structure and Algorithms",
    badge: "Easy",
    credits: 3,
    semester: "3rd Year 2nd Semester",
    instructor: "Dr. Ahmed Khan",
  },
  {
    code: "CSE 2101",
    name: "Data Structure and Algorithms",
    badge: "Easy",
    credits: 3,
    semester: "3rd Year 2nd Semester",
    instructor: "Dr. Ahmed Khan",
  },
  {
    code: "CSE 2101",
    name: "Data Structure and Algorithms",
    badge: "Easy",
    credits: 3,
    semester: "3rd Year 2nd Semester",
    instructor: "Dr. Ahmed Khan",
  },
  {
    code: "CSE 2101",
    name: "Data Structure and Algorithms",
    badge: "Easy",
    credits: 3,
    semester: "3rd Year 2nd Semester",
    instructor: "Dr. Ahmed Khan",
  },
  {
    code: "CSE 2101",
    name: "Data Structure and Algorithms",
    badge: "Easy",
    credits: 3,
    semester: "3rd Year 2nd Semester",
    instructor: "Dr. Ahmed Khan",
  },
  {
    code: "CSE 2101",
    name: "Data Structure and Algorithms",
    badge: "Easy",
    credits: 3,
    semester: "3rd Year 2nd Semester",
    instructor: "Dr. Ahmed Khan",
  },
];

const grades = [
  {
    sem: "1-2",
    code: "EEE 1202",
    name: "Circuit Theory",
    credits: 3,
    grade: "A+",
    gpa: 4.0,
  },
  {
    sem: "2-1",
    code: "CSE2101",
    name: "Data Structures and Algorithms",
    credits: 3,
    grade: "B+",
    gpa: 3.3,
  },
  {
    sem: "2-2",
    code: "EEE 2211",
    name: "Electrical Machines",
    credits: 3,
    grade: "A-",
    gpa: 3.7,
  },
  {
    sem: "2-2",
    code: "CSE 2203",
    name: "Computer Organization and Architecture",
    credits: 2,
    grade: "F",
    gpa: 2.0,
  },
  {
    sem: "3-1",
    code: "CSE 3107",
    name: "Operating Systems",
    credits: 4,
    grade: "B",
    gpa: 3.0,
  },
];

function gradeColor(grade: string) {
  if (grade === "A+" || grade === "A-") return "bg-green-100 text-green-800";
  if (grade === "B+" || grade === "B") return "bg-blue-100 text-blue-800";
  if (grade === "F") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
}

const scheduleOptions = [
  { label: "Class schedule", to: "/scheduling/class-schedule" },
  { label: "Room availability", to: "/scheduling/room-availability" },
  { label: "Exam Timetables", to: "/exams/timetables" },
  { label: "Assignments", to: "/assignments" },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F8F9FB] px-4 py-8">
      <div className="flex flex-col gap-8 w-full max-w-7xl">
        {/* Row 1: Profile (col1) + Weekly Activities (col2) */}
        <div className="flex flex-row gap-8 w-full">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center w-80 min-w-[320px]">
            <div className="flex flex-col items-center mb-6">
              <div className="w-40 h-40 rounded-full border-4 border-[#EAB308] flex items-center justify-center text-gray-400 text-xl font-semibold mb-4 bg-gray-100">
                Profile Photo
              </div>
              <div className="text-2xl font-bold text-[#25345D] mb-1">
                Mahiya Rahman
              </div>
              <div className="text-sm text-[#25345D] font-semibold">
                Undergraduate Student
              </div>
              <div className="text-sm text-[#25345D] mb-2">
                3rd Year 2nd Semester
              </div>
              {/* Step indicator */}
              <div className="flex items-center w-full justify-center mb-4">
                <div className="h-1 w-8 bg-gray-300 rounded-l-full" />
                <div className="h-2 w-2 bg-[#25345D] rounded-full mx-1" />
                <div className="h-1 w-8 bg-gray-300 rounded-r-full" />
              </div>
            </div>
            {/* Buttons */}
            <button className="w-full bg-[#25345D] text-white font-semibold py-2 rounded mb-3 hover:bg-[#31466F] transition">
              Edit
            </button>
            <button className="w-full bg-[#EAB308] text-[#25345D] font-semibold py-2 rounded mb-3 hover:bg-[#F5C940] transition">
              Settings
            </button>
            <div className="relative w-full mb-3" ref={dropdownRef}>
              <button
                className="w-full bg-[#25345D]  text-white font-semibold py-2 rounded flex justify-center  hover:bg-[#31466F] transition"
                onClick={() => setDropdownOpen((open) => !open)}
                type="button"
              >
                Schedules
                <svg
                  className={`w-4 h-4 ml-2 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow z-20">
                  {scheduleOptions.map((opt) => (
                    <button
                      key={opt.label}
                      className="w-full text-left px-4 py-2 hover:bg-[#F5C940] hover:text-[#25345D] transition"
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate(opt.to);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="w-full bg-[#EAB308] text-[#25345D] font-bold py-2 rounded mt-2 hover:bg-[#F5C940] transition"
            >
              Sign Out
            </button>
          </div>
          {/* Weekly Activities Card */}
          <div className="flex-1 bg-white rounded-xl shadow p-8">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-[#25345D] text-center mb-2">
                Your Dashboard
              </h1>
              <p className="text-center text-[#25345D] text-lg mb-2">
                Welcome mate! View your courses, grades and routine!
              </p>
              <div className="border-b-4 border-[#25345D] w-full mt-2" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#25345D] mb-4">
                Weekly Activities
              </h2>
              {/* Calendar Grid */}
              <div className="overflow-x-auto mb-8">
                <table className="min-w-full border text-sm">
                  <thead>
                    <tr className="bg-[#F8F6F1]">
                      <th className="p-2 border">Mon.</th>
                      <th className="p-2 border">Tue.</th>
                      <th className="p-2 border">Wed.</th>
                      <th className="p-2 border">Thu.</th>
                      <th className="p-2 border">Fri.</th>
                      <th className="p-2 border">Sat.</th>
                      <th className="p-2 border">Sun.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Week 1 */}
                    <tr>
                      <td className="border align-top p-2">
                        <div className="bg-gray-200 rounded p-1 mb-1 text-xs">
                          Academic calendar
                          <br />
                          Semester begins
                          <br />
                          Week 1
                        </div>
                        <div className="text-xs text-gray-500">Jan 13</div>
                      </td>
                      <td className="border align-top p-2"></td>
                      <td className="border align-top p-2">
                        <div className="bg-yellow-200 rounded p-1 mb-1 text-xs font-semibold">
                          CLASS 2<br />
                          Ex: Intro discussion
                        </div>
                        <div className="bg-pink-200 rounded p-1 mb-1 text-xs font-semibold">
                          CLASS 1<br />
                          Ex: Intro discussion
                        </div>
                        <div className="bg-cyan-200 rounded p-1 mb-1 text-xs font-semibold">
                          CLASS 4<br />
                          Ex: Intro discussion
                        </div>
                      </td>
                      <td className="border align-top p-2"></td>
                      <td className="border align-top p-2">
                        <div className="bg-green-200 rounded p-1 mb-1 text-xs font-semibold">
                          CLASS 3<br />
                          Ex: Intro discussion
                        </div>
                      </td>
                      <td className="border align-top p-2"></td>
                      <td className="border align-top p-2">
                        <div className="bg-pink-200 rounded p-1 mb-1 text-xs font-semibold">
                          CLASS 1<br />
                          Draft: Blog post
                        </div>
                        <div className="bg-yellow-200 rounded p-1 mb-1 text-xs font-semibold">
                          CLASS 2<br />
                          Collage project
                        </div>
                      </td>
                    </tr>
                    {/* Week 2 */}
                    <tr>
                      <td className="border align-top p-2">
                        <div className="bg-gray-200 rounded p-1 mb-1 text-xs">
                          Academic calendar
                          <br />
                          Week 2
                        </div>
                        <div className="text-xs text-gray-500">20</div>
                      </td>
                      <td className="border align-top p-2"></td>
                      <td className="border align-top p-2">
                        <div className="bg-yellow-200 rounded p-1 mb-1 text-xs font-semibold">
                          CLASS 2<br />
                          Assign groups
                        </div>
                      </td>
                      <td className="border align-top p-2"></td>
                      <td className="border align-top p-2">
                        <div className="bg-green-200 rounded p-1 mb-1 text-xs font-semibold">
                          CLASS 3<br />
                          Draft: Photo series
                        </div>
                      </td>
                      <td className="border align-top p-2"></td>
                      <td className="border align-top p-2">
                        <div className="bg-yellow-200 rounded p-1 mb-1 text-xs font-semibold">
                          CLASS 2<br />
                          Ex: Brainstorm doc
                        </div>
                        <div className="bg-cyan-200 rounded p-1 mb-1 text-xs font-semibold">
                          CLASS 4<br />
                          Essay draft
                        </div>
                      </td>
                    </tr>
                    {/* Week 3 */}
                    <tr>
                      <td className="border align-top p-2">
                        <div className="bg-gray-200 rounded p-1 mb-1 text-xs">
                          Academic calendar
                          <br />
                          Week 3
                        </div>
                        <div className="text-xs text-gray-500">27</div>
                      </td>
                      <td className="border align-top p-2"></td>
                      <td className="border align-top p-2">
                        <div className="bg-yellow-200 rounded p-1 mb-1 text-xs font-semibold">
                          CLASS 2<br />
                          Ex: Discussion post
                        </div>
                      </td>
                      <td className="border align-top p-2"></td>
                      <td className="border align-top p-2">
                        <div className="bg-green-200 rounded p-1 mb-1 text-xs font-semibold">
                          CLASS 3<br />
                          Revision: Photo series
                        </div>
                      </td>
                      <td className="border align-top p-2 font-bold text-lg text-black">
                        FEB 1
                      </td>
                      <td className="border align-top p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Row 2: Current Semester Courses (full width) */}
        <div className="bg-white rounded-xl shadow p-6 border">
          <h2 className="text-2xl font-bold text-[#25345D] mb-4">
            Current Semester Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {courses.map((course, idx) => (
              <div
                key={idx}
                className="bg-white border rounded-lg p-4 flex flex-col shadow-sm"
              >
                <div className="flex items-center mb-2">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded mr-2">
                    {course.badge}
                  </span>
                  <span className="text-xs text-gray-500">
                    {course.credits} Credits
                  </span>
                </div>
                <div className="font-semibold text-[#25345D] mb-1">
                  {course.code} - {course.name}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {course.semester}
                </div>
                <div className="text-xs text-gray-500">
                  Instructor: {course.instructor}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Row 3: Your Grades (full width) */}
        <div className="bg-white rounded-xl shadow p-6 border">
          <h2 className="text-2xl font-bold text-[#25345D] mb-4">
            Your Grades
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 text-[#25345D]">
                  <th className="px-4 py-2 border">Semester</th>
                  <th className="px-4 py-2 border">Course Code</th>
                  <th className="px-4 py-2 border">Course Name</th>
                  <th className="px-4 py-2 border">Credits</th>
                  <th className="px-4 py-2 border">Grade</th>
                  <th className="px-4 py-2 border">GPA</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g, idx) => (
                  <tr key={idx} className="text-center">
                    <td className="border px-4 py-2">{g.sem}</td>
                    <td className="border px-4 py-2">{g.code}</td>
                    <td className="border px-4 py-2">{g.name}</td>
                    <td className="border px-4 py-2 font-semibold">
                      {g.credits}
                    </td>
                    <td className="border px-4 py-2">
                      <span
                        className={`px-3 py-1 rounded-full font-bold ${gradeColor(
                          g.grade
                        )}`}
                      >
                        {g.grade}
                      </span>
                    </td>
                    <td className="border px-4 py-2 font-semibold">{g.gpa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
