import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserProfile, type UserProfile } from "@/api/users";
import { getCurrentUser } from "@/lib/auth";
import StudentProfileCard from "@/components/studentDashboard/studentProfileCard";
import StudentShortcuts from "@/components/studentDashboard/studentShortcuts";
import DashBoardTitle from "@/components/studentDashboard/dashboardTitle";
import WeeklyActivitiesCard from "@/components/studentDashboard/weeklyActivitiesCard";
import CurrentSemesterCoursesCard from "@/components/studentDashboard/currentCourses";

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

// Grades Table Component
function GradesTableCard() {
  return (
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
  );
}

// Main Dashboard Component
export default function StudentDashboard() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const handleSignOut = () => {
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  useEffect(() => {
    async function fetchData() {
      const user = getCurrentUser();
      if (user && user.id) {
        const profile = await getUserProfile(user);
        setUserProfile(profile);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#F8F9FB] px-4 py-8">
      <div className="flex flex-col gap-8 w-full max-w-7xl">
        {/* Row 1: Profile + Weekly Activities */}
        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-col gap-5 w-1/4">  
            <StudentProfileCard userProfile={userProfile} onSignOut={handleSignOut} />
            <StudentShortcuts />
          </div>
          <div className="flex flex-col gap-4 w-3/4">
            <DashBoardTitle />
            <WeeklyActivitiesCard />
            <CurrentSemesterCoursesCard user={userProfile} />
            <GradesTableCard />
          </div>
        </div>
      </div>
    </div>
  );
}
