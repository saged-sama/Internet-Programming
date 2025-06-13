import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Download,
  FileText,
  FileType,
  FileCode,
  FileImage,
} from "lucide-react";
import type { CourseMaterial } from "../../types/financials";

interface CourseMaterialsProps {
  materials: CourseMaterial[];
}

export function CourseMaterials({ materials }: CourseMaterialsProps) {
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "doc":
      case "docx":
        return <FileType className="h-4 w-4" />;
      case "code":
        return <FileCode className="h-4 w-4" />;
      default:
        return <FileImage className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => (
          <Card key={material.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-2">{material.title}</CardTitle>
              <CardDescription>
                {material.courseCode} - {material.courseName}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {material.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{material.type}</Badge>
                <span className="text-sm text-muted-foreground">
                  {material.fileSize}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  <p>Uploaded by: {material.uploadedBy}</p>
                  <p>
                    Date: {new Date(material.uploadDate).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {getFileIcon(material.fileType)}
                    <span className="ml-2">Download</span>
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
