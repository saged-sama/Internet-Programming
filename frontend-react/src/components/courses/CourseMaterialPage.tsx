import type { CourseSemester } from "@/types/course";
import SemesterCourseMaterials from "./SemesterCourseMaterials";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function CourseMaterialPage() {
    const semesterTitles = {
        '1st': '1st Year, 1st Semester',
        '2nd': '1st Year, 2nd Semester',
        '3rd': '2nd Year, 1st Semester',
        '4th': '2nd Year, 2nd Semester',
        '5th': '3rd Year, 1st Semester',
        '6th': '3rd Year, 2nd Semester',
        '7th': '4th Year, 1st Semester',
        '8th': '4th Year, 2nd Semester',
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Materials</h1>
                <p className="text-gray-600">Browse course materials organized by semester</p>
            </div>

            <Accordion type="multiple" className="w-full space-y-4">
                {Object.entries(semesterTitles).map(([semester, title]) => (
                    <AccordionItem
                        key={semester}
                        value={semester}
                        className="border border-gray-200 rounded-lg bg-white shadow-sm"
                    >
                        <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 rounded-t-lg">
                            <div className="flex items-center justify-between w-full">
                                <span className="text-lg font-semibold text-gray-900">{title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                            <div className="overflow-x-auto">
                                <div className="min-w-full">
                                    <SemesterCourseMaterials semester={semester as CourseSemester} />
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}