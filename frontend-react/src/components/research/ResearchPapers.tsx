import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Download, FileText } from "lucide-react";
import type { ResearchPaper } from "../../types/financials";

interface ResearchPapersProps {
  papers: ResearchPaper[];
}

export function ResearchPapers({ papers }: ResearchPapersProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {papers.map((paper) => (
          <Card key={paper.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="line-clamp-2">{paper.title}</CardTitle>
              <CardDescription>{paper.authors.join(", ")}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {paper.abstract}
              </p>
              <div className="flex flex-wrap gap-2">
                {paper.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  <p>Journal: {paper.journal}</p>
                  <p>
                    Published:{" "}
                    {new Date(paper.publicationDate).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={paper.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
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
