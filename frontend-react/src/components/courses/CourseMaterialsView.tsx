import type { CourseMaterial } from "@/api/courseMaterials";
import type { Course } from "@/types/course";
import MaterialCard from "./MaterialCard";
import LoadingSpinner from "../layout/LoadingSpinner";
import EmptyState from "../layout/EmptyState";
import { getCurrentUserRole } from "@/lib/auth";
import CreateCourseMaterial from "./CreateCourseMaterial";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function CourseMaterialsView({
    course,
    materials,
    loading,
    onBack
}: {
    course: Course;
    materials: CourseMaterial[];
    loading: boolean;
    onBack: () => void;
}) {
    return (
        <div className="p-4">
            <div className="flex items-center gap-4 justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="mr-4 px-4 py-2 bg-muted hover:bg-muted/80 rounded transition-colors"
                    >
                        ← Back to Courses
                    </button>
                    <h2 className="text-2xl font-bold">Materials in {course.name}</h2>
                </div>
                {getCurrentUserRole() === "faculty" && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline"> <Plus /> Add New Material</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <CreateCourseMaterial courseCode={course.code} />
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {loading ? (
                <LoadingSpinner message="Loading materials..." />
            ) : materials.length === 0 ? (
                <EmptyState message="No materials found for this course." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {materials.map(material => (
                        <MaterialCard key={material.id} material={material} />
                    ))}
                </div>
            )}
        </div>
    );
}
