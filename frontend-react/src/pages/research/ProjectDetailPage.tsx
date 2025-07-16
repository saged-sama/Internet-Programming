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
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Skeleton className="h-10 w-40" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-1" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-1" />
              <Skeleton className="h-4 w-full mt-1" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/research")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Research Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={() => navigate("/research")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        
        {isAllowedToEdit && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(true)}
              disabled={!isSupervisor && getUserRole() !== 'admin'}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={!isSupervisor && getUserRole() !== 'admin'}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Project
            </Button>
          </div>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{project.title}</CardTitle>
              <CardDescription className="text-lg">
                <Badge className={`${getStatusColor(project.status)} mr-2`}>
                  {project.status}
                </Badge>
                <span className="text-muted-foreground">{project.topic}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Project Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Year: {project.year}</span>
                </div>
                
                {project.supervisorName && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Supervisor: {project.supervisorName}</span>
                  </div>
                )}
              </div>
            </div>

            {project.team.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Team Members</h3>
                <div className="flex flex-wrap gap-2">
                  {project.team.map((member, index) => (
                    <Badge key={index} variant="secondary">
                      {member}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {project.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-2">Abstract</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {project.abstract}
            </p>
          </div>
        </CardContent>

        {project.demoUrl && (
          <CardFooter>
            <Button
              variant="default"
              onClick={() => window.open(project.demoUrl, "_blank")}
              className="w-full sm:w-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Demo
            </Button>
          </CardFooter>
        )}
      </Card>

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
