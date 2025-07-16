import { useState } from "react";
import { ProjectsShowcase } from "../../components/projects/ProjectsShowcase";
import { AddProjectForm } from "../../components/projects/AddProjectForm";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";

export function ResearchPage() {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);



  const handleProjectAdded = () => {
    // Trigger refresh of projects list
    setRefreshTrigger(prev => prev + 1);
  };

  // Check if user is faculty (for showing add button)
  const getUserRole = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role;
    }
    return null;
  };

  const isAllowedToAdd = getUserRole() !== 'student';

  return (
    <>
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Research Projects</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Explore our cutting-edge research projects that are advancing the frontiers of computer science and technology
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Research Projects</h2>
            
            {/* Add button - only show for faculty/admin */}
            {isAllowedToAdd && (
              <Button 
                onClick={() => setIsAddProjectOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            )}
          </div>
        </div>

        <ProjectsShowcase refreshTrigger={refreshTrigger} />
      </div>

      {/* Add Project Dialog */}
      <AddProjectForm 
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onProjectAdded={handleProjectAdded}
      />
    </>
  );
}