import { useState, useMemo } from "react";
import type { Project } from "../../types/financials";
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
  DialogTrigger,
} from "../ui/dialog";

interface ProjectsShowcaseProps {
  projects: Project[];
}

export function ProjectsShowcase({ projects }: ProjectsShowcaseProps) {
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const years = useMemo(() => {
    const uniqueYears = [...new Set(projects.map((p) => p.year))].sort(
      (a, b) => b - a
    );
    return uniqueYears;
  }, [projects]);

  const topics = useMemo(() => {
    const uniqueTopics = [...new Set(projects.map((p) => p.topic))];
    return uniqueTopics;
  }, [projects]);

  const supervisors = useMemo(() => {
    const uniqueSupervisors = [...new Set(projects.map((p) => p.supervisor))];
    return uniqueSupervisors;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesYear =
        selectedYear === "all" || project.year.toString() === selectedYear;
      const matchesTopic =
        selectedTopic === "all" || project.topic === selectedTopic;
      const matchesSupervisor =
        selectedSupervisor === "all" ||
        project.supervisor === selectedSupervisor;
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.abstract.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesYear && matchesTopic && matchesSupervisor && matchesSearch;
    });
  }, [projects, selectedYear, selectedTopic, selectedSupervisor, searchQuery]);

  return (
    <div className="space-y-6">
      <h2>Projects Showcase</h2>

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
              <SelectItem key={supervisor} value={supervisor}>
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{project.title}</span>
                <Badge>{project.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Year: {project.year}
                </p>
                <p className="text-sm text-muted-foreground">
                  Topic: {project.topic}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supervisor: {project.supervisor}
                </p>
                <p className="text-sm text-muted-foreground">
                  Team: {project.team.join(", ")}
                </p>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedProject(project)}
                      >
                        View Abstract
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{project.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>{project.abstract}</p>
                        {project.demoUrl && (
                          <Button
                            variant="secondary"
                            onClick={() =>
                              window.open(project.demoUrl, "_blank")
                            }
                          >
                            View Demo
                          </Button>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
