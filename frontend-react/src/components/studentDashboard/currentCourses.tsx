import type { Course, CourseSemester } from "@/types/course";
import CourseCard from "../courses/CourseCard";
import type { UserProfile } from "@/api/users";
import { useEffect, useState } from "react";
import { getCourses } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { studentProfileApi } from "@/api/studentProfile";
import { BookOpen } from "lucide-react";

// Current Semester Courses Component
export default function CurrentSemesterCoursesCard({ user }: { user: UserProfile | null}) {
    const [currentSemester, setCurrentSemester] = useState<CourseSemester>();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSelect = (course: Course) => {
        console.log("Selected course:", course);
    }

    useEffect(() => {
        async function fetchCourses() {
            if (user?.role === "student") {
                setLoading(true);
                try {
                    const studentProfile = await studentProfileApi.getStudent(user.id);
    
                    const currentCourses = await getCourses({
                        semester: studentProfile.current_semester
                    });
                    setCurrentSemester(studentProfile.current_semester);
                    setCourses(currentCourses.data);
                } finally {
                    setLoading(false);
                }
            }
        }
        if(user?.role === "student") {
            fetchCourses();
        }
    }, [user]);

    if (!user || user.role !== "student") {
        return <SkeletonCourses />;
    }

    return (
        <div className="bg-card rounded-xl shadow border">
            <div className="flex items-center justify-between mb-4 p-6 pb-0">
                <div className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold text-foreground">
                        Current Semester Courses
                    </h2>
                </div>
                {currentSemester && (
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        Your are currently in {currentSemester} semester
                    </span>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 pt-0">
                {loading ? (
                    Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="space-y-3">
                            <Skeleton className="h-32 w-full rounded-lg" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))
                ) : (
                    courses.map((course, idx) => (
                        <CourseCard key={idx} course={course} onSelect={handleSelect} />
                    ))
                )}
            </div>
        </div>
    );
}

function SkeletonCourses() {
    return (
        <div className="bg-card rounded-xl shadow border">
            <h2 className="text-2xl font-bold text-foreground mb-4 p-6 pb-0">
                Current Semester Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 pt-0">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="space-y-3">
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    )
}
