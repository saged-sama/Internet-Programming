import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ExternalLink, Users, Calendar, BookOpen } from "lucide-react";
import { getProjects } from "../../api/projects";
import type { Project } from "../../types/research";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

interface ProjectsShowcaseProps {
  refreshTrigger?: number;
}

export function ProjectsShowcase({ refreshTrigger }: ProjectsShowcaseProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await getProjects({
          searchQuery: searchQuery || undefined,
          year: selectedYear !== "all" ? parseInt(selectedYear) : undefined,
          topic: selectedTopic !== "all" ? selectedTopic : undefined,
          supervisor: selectedSupervisor !== "all" ? selectedSupervisor : undefined,
        });
        setProjects(response.data);
      } catch (error) {
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [searchQuery, selectedYear, selectedTopic, selectedSupervisor, refreshTrigger]);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(projects.map((p) => p.year))].sort(
      (a, b) => b - a
    );
    return uniqueYears;
  }, [projects]);

  const topics = useMemo(() => {
    const uniqueTopics = [...new Set(projects.map((p) => p.topic))];
    return uniqueTopics.sort();
  }, [projects]);

  const supervisors = useMemo(() => {
    const uniqueSupervisors = [...new Set(projects.map((p) => p.supervisorName).filter(Boolean))];
    return uniqueSupervisors.sort();
  }, [projects]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "ongoing":
        return "bg-blue-500";
      case "planning":
        return "bg-yellow-500";
      case "paused":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedTopic} onValueChange={setSelectedTopic}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Topic" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Topics</SelectItem>
            {topics.map((topic) => (
              <SelectItem key={topic} value={topic}>
                {topic}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedSupervisor}
          onValueChange={setSelectedSupervisor}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Supervisor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Supervisors</SelectItem>
            {supervisors.map((supervisor) => (
              <SelectItem key={supervisor} value={supervisor || ""}>
                {supervisor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No projects found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <span className="line-clamp-2">{project.title}</span>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Year: {project.year}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>Topic: {project.topic}</span>
                  </div>
                  
                  {project.supervisorName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Supervisor: {project.supervisorName}</span>
                    </div>
                  )}
                  
                  {project.team.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4" />
                        <span>Team:</span>
                      </div>
                      <div className="ml-6 line-clamp-2">
                        {project.team.join(", ")}
                      </div>
                    </div>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedProject(project)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Year</h3>
                  <p className="text-muted-foreground">{selectedProject.year}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Status</h3>
                  <Badge className={getStatusColor(selectedProject.status)}>
                    {selectedProject.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Topic</h3>
                  <p className="text-muted-foreground">{selectedProject.topic}</p>
                </div>
                {selectedProject.supervisorName && (
                  <div>
                    <h3 className="font-semibold mb-1">Supervisor</h3>
                    <p className="text-muted-foreground">{selectedProject.supervisorName}</p>
                  </div>
                )}
              </div>

              {selectedProject.team.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Team Members</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.team.map((member, index) => (
                      <Badge key={index} variant="secondary">
                        {member}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedProject.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {selectedProject.description}
                  </p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Abstract</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedProject.abstract}
                </p>
              </div>

              {selectedProject.demoUrl && (
                <div className="pt-4 border-t">
                  <Button
                    variant="default"
                    onClick={() => window.open(selectedProject.demoUrl, "_blank")}
                    className="w-full sm:w-auto"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Demo
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}