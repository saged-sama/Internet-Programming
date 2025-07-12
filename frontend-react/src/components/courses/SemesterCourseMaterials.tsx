import { getCourseMaterials, type CourseMaterial } from "@/api/courseMaterials";
import { getCourses } from "@/lib/api";
import type { CourseApiResponse, CourseSemester, Course } from "@/types/course";
import { useEffect, useState } from "react"
import LoadingSpinner from "../layout/LoadingSpinner";
import EmptyState from "../layout/EmptyState";
import CourseMaterialsView from "./CourseMaterialsView";
import CourseList from "./CourseList";

export default function SemesterCourseMaterials({ semester }: { semester: CourseSemester }) {
    const [courses, setCourses] = useState<CourseApiResponse>();
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [materials, setMaterials] = useState<CourseMaterial[]>([]);
    const [materialsLoading, setMaterialsLoading] = useState(false);

    useEffect(() => {
        async function fetchData(){
            setLoading(true);
            const coursesList = await getCourses({ semester });
            setCourses(coursesList);
            setLoading(false);
        }
        fetchData();
    }, [semester]);

    const handleCourseSelect = async (course: Course) => {
        setSelectedCourse(course);
        setMaterialsLoading(true);
        try {
            const courseMaterials = await getCourseMaterials(course.code);
            setMaterials(courseMaterials);
        } catch (error) {
            console.error('Failed to fetch course materials:', error);
            setMaterials([]);
        } finally {
            setMaterialsLoading(false);
        }
    };

    const handleBackToCourses = () => {
        setSelectedCourse(null);
        setMaterials([]);
    };

    if (loading) {
        return <LoadingSpinner message="Loading courses..." />;
    }

    if (!courses?.data || courses.data.length === 0) {
        return <EmptyState message="No courses found for this semester." />;
    }

    if (selectedCourse) {
        return (
            <CourseMaterialsView 
                course={selectedCourse}
                materials={materials}
                loading={materialsLoading}
                onBack={handleBackToCourses}
            />
        );
    }

    return <CourseList courses={courses.data} onCourseSelect={handleCourseSelect} />;
}