import type { Course } from "@/types/course";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, User, Clock } from "lucide-react";

export default function CourseCard({ course, onSelect }: { course: Course; onSelect: (course: Course) => void }) {
    return (
        <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
            onClick={() => onSelect(course)}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className="mb-2">
                        {course.code}
                    </Badge>
                    <Badge variant="secondary">
                        {course.credits} credits
                    </Badge>
                </div>
                <CardTitle className="text-xl">{course.name}</CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                    {course.description}
                </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-0">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{course.instructor || 'TBA'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GraduationCap className="w-4 h-4" />
                        <span>{course.degreeLevel}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{course.semester}</span>
                    </div>
                    
                    {course.prerequisites.length > 0 && (
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <BookOpen className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <span className="font-medium">Prerequisites: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {course.prerequisites.map((prereq, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            {prereq}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}