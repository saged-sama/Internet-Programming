import { getCourseMaterials, type CourseMaterial } from "@/api/courseMaterials";
import { getCourses } from "@/lib/api";
import type { CourseApiResponse, CourseSemester, Course } from "@/types/course";
import { useEffect, useState } from "react"

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
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-lg">Loading courses...</div>
            </div>
        );
    }

    if (!courses?.data || courses.data.length === 0) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="text-lg text-gray-600">No courses found for this semester.</div>
            </div>
        );
    }

    // Show course materials view
    if (selectedCourse) {
        return (
            <div className="p-4">
                <div className="flex items-center mb-6">
                    <button 
                        onClick={handleBackToCourses}
                        className="mr-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                    >
                        ← Back to Courses
                    </button>
                    <h2 className="text-2xl font-bold">Materials in {selectedCourse.name}</h2>
                </div>
                
                {materialsLoading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="text-lg">Loading materials...</div>
                    </div>
                ) : materials.length === 0 ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="text-lg text-gray-600">No materials found for this course.</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {materials.map(material => (
                            <div key={material.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                <h3 className="font-semibold mb-2">{material.title || 'Untitled Material'}</h3>
                                <p className="text-sm text-gray-600 mb-2">{material.description || 'No description available'}</p>
                                <p className="text-xs text-gray-500">Type: {material.file_type || material.type || 'Unknown'}</p>
                                {material.file_size && (
                                    <p className="text-xs text-gray-500">Size: {material.file_size}</p>
                                )}
                                {material.upload_date && (
                                    <p className="text-xs text-gray-500">Uploaded: {new Date(material.upload_date).toLocaleDateString()}</p>
                                )}
                                {material.uploaded_by && (
                                    <p className="text-xs text-gray-500">By: {material.uploaded_by}</p>
                                )}
                                {material.file_url && (
                                    <a 
                                        href={material.file_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-2 inline-block px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                                    >
                                        Download
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Show courses list view
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-6">List of Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {courses.data.map(course => (
                    <div 
                        key={course.id} 
                        className="p-4 rounded border cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleCourseSelect(course)}
                    >
                        <h3 className="text-lg font-semibold">{course.name}</h3>
                        <p className="text-sm text-gray-600">{course.description}</p>
                        <p className="text-sm">Credits: {course.credits}</p>
                        <p className="text-sm">Instructor: {course.instructor || 'N/A'}</p>
                        <p className="text-sm">Prerequisites: {course.prerequisites.join(', ') || 'None'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}