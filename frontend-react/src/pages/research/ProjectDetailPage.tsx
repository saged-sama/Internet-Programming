import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getProject, 
  updateProject, 
  deleteProject 
} from "../../api/projects";
import type { Project, ProjectCreateRequest } from "../../types/research";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "../../components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { toast } from "sonner";
import { Pencil, Trash2, ArrowLeft, ExternalLink, Users, Calendar } from "lucide-react";
import { EditProjectForm } from "../../components/projects/EditProjectForm";
import { Skeleton } from "../../components/ui/skeleton";
import ResearchDetailImage from "../../assets/photos/ResearchDetail.jpg";


export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;
      
      setLoading(true);
      try {
        const data = await getProject(projectId);
        setProject(data);
      } catch (error) {
        toast.error("Failed to fetch project details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleEditProject = async (updatedProject: Partial<ProjectCreateRequest>) => {
    if (!projectId || !project) return;
    
    try {
      const updated = await updateProject(projectId, updatedProject);
      setProject(updated);
      setIsEditDialogOpen(false);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
      console.error(error);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectId) return;
    
    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      toast.success("Project deleted successfully");
      navigate("/research");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error(error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

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

  // Check if user is faculty (for showing edit/delete buttons)
  const getUserRole = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role;
    }
    return null;
  };

  const isAllowedToEdit = getUserRole() === 'faculty' || getUserRole() === 'admin';
  const isSupervisor = project?.supervisor === getUserRole();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F0F0] via-[#F0F0F0] to-[#D3D3D3]">
        {/* Hero Section with Skeleton */}
        <div
          className="relative h-[60vh] bg-cover bg-center bg-no-repeat overflow-hidden"
          style={{
            backgroundImage: `url(${ResearchDetailImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/70 to-primary-dark/80"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
          
          <div className="relative z-10 h-full flex items-center justify-center text-center">
            <div className="max-w-4xl mx-auto px-4">
              <div className="animate-fade-in-up">
                <Skeleton className="h-16 w-3/4 mx-auto mb-4" />
                <Skeleton className="h-6 w-1/2 mx-auto mb-6" />
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Skeleton className="h-12 w-40 rounded-full" />
                  <Skeleton className="h-12 w-40 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto py-12">
          <div className="flex items-center mb-10">
            <Skeleton className="h-10 w-40" />
          </div>
          
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="absolute -inset-4 bg-accent/30 rounded-full blur-xl animate-pulse"></div>
              <div className="relative px-8 py-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-xl">
                <p className="text-primary font-semibold">Loading project details...</p>
              </div>
              <Skeleton className="h-4 w-full mt-1" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F0F0F0] via-[#F0F0F0] to-[#D3D3D3]">
        <div className="container mx-auto py-20">
          <div className="text-center max-w-xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">Project Not Found</h2>
            <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or has been removed.</p>
            <Button 
              onClick={() => navigate("/research")}
              className="group hover:bg-primary/10 transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent font-semibold">
                Back to Research Projects
              </span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F0F0] via-[#F0F0F0] to-[#D3D3D3]">
      {/* Hero Section with Parallax Effect */}
      <div
        className="relative h-[60vh] bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `url(${ResearchDetailImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/70 to-primary-dark/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-accent rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 left-20 w-6 h-6 bg-primary rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-40 right-40 w-5 h-5 bg-accent rounded-full animate-bounce delay-1000"></div>

        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                  {project.title}
                </span>
              </h1>
              <nav className="flex items-center justify-center space-x-2 text-sm text-white/80 mb-6">
                <span className="hover:text-white cursor-pointer">🏠 Home</span>
                <span>•</span>
                <span onClick={() => navigate("/research")} className="cursor-pointer hover:text-white">Research</span>
                <span>•</span>
                <span className="text-accent">Project Details</span>
              </nav>
              {project.demoUrl && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => window.open(project.demoUrl, "_blank")}
                    className="group bg-gradient-to-r from-accent to-accent-light text-primary px-6 py-3 rounded-full font-bold text-base hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-accent/50"
                  >
                    <span className="flex items-center space-x-2">
                      <span>View Demo</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-12">
        <div className="flex items-center mb-10">
          <Button
            variant="ghost"
            onClick={() => navigate("/research")}
            className="group hover:bg-primary/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent font-semibold">
              Back to Research Projects
            </span>
          </Button>
          
          {isAllowedToEdit && (
            <div className="ml-auto flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(true)}
                disabled={!isSupervisor && getUserRole() === 'student'}
                className="group hover:bg-primary/10 transition-all duration-300"
              >
                <Pencil className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Edit Project
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={!isSupervisor && getUserRole() === 'student'}
                className="hover:bg-red-700 transition-colors"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Project
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader className="border-b border-[#A8A8A8]/20 pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-3">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Badge className="mr-3 bg-gradient-to-r from-accent to-accent-light text-primary font-semibold px-3 py-1">
                        {project.status}
                      </Badge>
                      <span className="text-muted-foreground">{project.topic}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                {project.description && (
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-accent" />
                      Description
                    </h3>
                    <div className="bg-white/50 rounded-xl p-4 border border-[#A8A8A8]/20">
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-accent" />
                      Project Details
                    </h3>
                    <div className="bg-white/50 rounded-xl p-4 border border-[#A8A8A8]/20 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Year:</span>
                        <span className="font-medium text-primary">{project.year}</span>
                      </div>
                      
                      {project.supervisorName && (
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Supervisor:</span>
                          <span className="font-medium text-primary">{project.supervisorName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {project.team.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-accent" />
                        Team Members
                      </h3>
                      <div className="bg-white/50 rounded-xl p-4 border border-[#A8A8A8]/20">
                        <div className="flex flex-wrap gap-2">
                          {project.team.map((member, index) => (
                            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-3 py-1">
                              {member}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-accent" />
                    Abstract
                  </h3>
                  <div className="bg-white/50 rounded-xl p-4 border border-[#A8A8A8]/20">
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {project.abstract}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-accent" />
                  <span className="text-sm text-muted-foreground">Year: <span className="font-medium text-primary">{project.year}</span></span>
                </div>
                
                {project.supervisorName && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-accent" />
                    <span className="text-sm text-muted-foreground">Supervisor: <span className="font-medium text-primary">{project.supervisorName}</span></span>
                  </div>
                )}
                
                <div className="pt-4">
                  {project.demoUrl && (
                    <Button
                      variant="default"
                      onClick={() => window.open(project.demoUrl, "_blank")}
                      className="w-full bg-gradient-to-r from-accent to-accent-light text-primary hover:from-accent-light hover:to-accent transition-all duration-300 font-medium"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Demo
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {project && (
            <EditProjectForm
              project={project}
              onSubmit={handleEditProject}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
