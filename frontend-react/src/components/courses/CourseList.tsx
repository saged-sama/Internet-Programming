import type { Course } from "@/types/course";
import CourseCard from "./CourseCard";

export default function CourseList({ courses, onCourseSelect }: { courses: Course[]; onCourseSelect: (course: Course) => void }) {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">List of Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {courses.map(course => (
                    <CourseCard 
                        key={course.id} 
                        course={course} 
                        onSelect={onCourseSelect}
                    />
                ))}
            </div>
        </div>
    );
}