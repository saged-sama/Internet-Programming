import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
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
import { Users, Calendar, BookOpen, ArrowRight, Search, Filter, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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
    const uniqueYears = [...new Set(projects.map((p) => p.year))].sort((a, b) => b - a);
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
        return "bg-gradient-to-r from-green-500 to-green-600 text-white font-medium";
      case "ongoing":
        return "bg-gradient-to-r from-accent to-accent-light text-primary font-medium";
      case "planning":
        return "bg-gradient-to-r from-amber-400 to-amber-500 text-amber-900 font-medium";
      case "paused":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white font-medium";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white font-medium";
    }
  };

  const LoadingSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="bg-white/80 backdrop-blur-sm border border-[#A8A8A8]/20 shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary/30 to-primary-dark/30 animate-pulse"></div>
          <CardHeader>
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <div className="flex justify-end">
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
              <Skeleton className="h-9 w-full mt-4 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-[#A8A8A8]/20 shadow-lg">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2 text-primary" />
          <h3 className="text-lg font-semibold text-primary">Filter Projects</h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Year</label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-white/50 border-[#A8A8A8]/30 hover:border-primary/50 transition-colors">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
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
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Topic</label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger className="bg-white/50 border-[#A8A8A8]/30 hover:border-primary/50 transition-colors">
                <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
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
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Supervisor</label>
            <Select
              value={selectedSupervisor}
              onValueChange={setSelectedSupervisor}
            >
              <SelectTrigger className="bg-white/50 border-[#A8A8A8]/30 hover:border-primary/50 transition-colors">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
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
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/50 border-[#A8A8A8]/30 hover:border-primary/50 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl border border-[#A8A8A8]/20 shadow-lg">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-8 w-8 text-primary/50" />
            </div>
            <p className="text-lg font-medium text-primary">No projects found</p>
            <p className="text-muted-foreground max-w-md">Try adjusting your filters or search criteria to find what you're looking for.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="group bg-white/80 backdrop-blur-sm border border-[#A8A8A8]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="h-1.5 bg-gradient-to-r from-primary to-primary-dark"></div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl font-bold text-primary group-hover:text-primary-dark transition-colors line-clamp-2">
                    {project.title}
                  </CardTitle>
                  <Badge className={`${getStatusColor(project.status)} shadow-sm px-2.5 py-0.5 rounded-full`}>
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <Calendar className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Year: <span className="font-medium text-primary-dark">{project.year}</span></span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <BookOpen className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Topic: <span className="font-medium text-primary-dark">{project.topic}</span></span>
                  </div>
                  
                  {project.supervisorName && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="bg-primary/10 p-1 rounded-full">
                        <Users className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-muted-foreground">Supervisor: <span className="font-medium text-primary-dark">{project.supervisorName}</span></span>
                    </div>
                  )}
                  
                  {project.team.length > 0 && (
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="bg-primary/10 p-1 rounded-full">
                          <Users className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-muted-foreground">Team:</span>
                      </div>
                      <div className="ml-7 line-clamp-2 text-primary-dark font-medium">
                        {project.team.join(", ")}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  className="w-full group-hover:bg-gradient-to-r from-primary to-primary-dark group-hover:text-white transition-all duration-300"
                  variant="outline"
                  onClick={() => navigate(`/research/project/${project.id}`)}
                >
                  <span className="flex items-center justify-center gap-2">
                    View Details
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Project details are now shown on a dedicated page */}
    </div>
  );
}