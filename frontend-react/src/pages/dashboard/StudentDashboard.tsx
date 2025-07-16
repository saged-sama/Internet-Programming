import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserProfile, type UserProfile } from "@/api/users";
import { getCurrentUser } from "@/lib/auth";
import StudentProfileCard from "@/components/studentDashboard/studentProfileCard";
import StudentShortcuts from "@/components/studentDashboard/studentShortcuts";
import DashBoardTitle from "@/components/studentDashboard/dashboardTitle";
import WeeklyActivitiesCard from "@/components/studentDashboard/weeklyActivitiesCard";
import CurrentSemesterCoursesCard from "@/components/studentDashboard/currentCourses";
import StudentGrades from "@/components/studentDashboard/studentGrades";

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
            <StudentGrades />
          </div>
        </div>
      </div>
    </div>
  );
}
