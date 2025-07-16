import { getResults, type StudentsGrades } from "@/api/results";
import { getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap } from "lucide-react";

export default function StudentGrades() {
    const [grades, setGrades] = useState<StudentsGrades[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGrades() {
            try {
                const gradesResponse = await getResults({
                    student_id: getCurrentUser()?.id
                });
                setGrades(gradesResponse as StudentsGrades[]);
            } catch (error) {
                console.error("Failed to fetch grades:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchGrades();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    <h3 className="flex items-center gap-2">
                        <GraduationCap />
                        Your Academic Results
                    </h3>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Semester</TableHead>
                            <TableHead className="text-right">Total GPA</TableHead>
                            <TableHead className="text-right">CGPA</TableHead>
                            <TableHead className="text-right">Result File</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {grades.map((grade, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{grade.title}</TableCell>
                                <TableCell>{grade.year}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{grade.semester}</Badge>
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    {grade.student_data.total_gpa}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    {grade.student_data.cgpa}
                                </TableCell>
                                <TableCell className="text-right">
                                    <a
                                        href={`${import.meta.env.VITE_BACKEND_URL}/api/files/${grade.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View Full Results
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}