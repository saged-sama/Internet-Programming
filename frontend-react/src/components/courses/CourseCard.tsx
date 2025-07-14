import type { Course } from "@/types/course";

export default function CourseCard({ course, onSelect }: { course: Course; onSelect: (course: Course) => void }) {
    return (
        <div 
            className="p-4 rounded border border-border cursor-pointer hover:shadow-md transition-shadow bg-card"
            onClick={() => onSelect(course)}
        >
            <h3 className="text-lg font-semibold text-card-foreground">{course.name}</h3>
            <p className="text-sm text-muted-foreground">{course.description}</p>
            <p className="text-sm text-card-foreground">Credits: {course.credits}</p>
            <p className="text-sm text-card-foreground">Instructor: {course.instructor || 'N/A'}</p>
            <p className="text-sm text-card-foreground">Prerequisites: {course.prerequisites.join(', ') || 'None'}</p>
        </div>
    );
}