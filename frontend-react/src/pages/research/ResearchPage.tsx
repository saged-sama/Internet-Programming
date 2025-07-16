import { useState, useEffect } from "react";
import { ProjectsShowcase } from "../../components/projects/ProjectsShowcase";
import { ResearchPapers } from "../../components/research/ResearchPapers";
import { AddProjectForm } from "../../components/projects/AddProjectForm";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Button } from "../../components/ui/button";
import { Plus } from "lucide-react";
import type { ResearchPaper } from "../../types/research";

import financialsData from "../../assets/financials.json";

export function ResearchPage() {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    // Load research papers from local data
    setPapers(financialsData.projects as ResearchPaper[]);
  }, []);

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
          <h1 className="text-3xl font-bold text-primary mb-4">Research & Innovation</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Explore our cutting-edge research projects and publications that are advancing the frontiers of computer science and technology
          </p>
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="overflow-x-auto pb-2">
                <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                  <TabsTrigger value="projects" className="whitespace-nowrap">
                    Research Projects
                  </TabsTrigger>
                  <TabsTrigger value="papers" className="whitespace-nowrap">
                    Publications
                  </TabsTrigger>
                </TabsList>
              </div>
              
              {/* Add button - only show for faculty/admin and when on projects tab */}
              {isAllowedToAdd && activeTab === "projects" && (
                <Button 
                  onClick={() => setIsAddProjectOpen(true)}
                  className="ml-4"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Project
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="projects">
            <ProjectsShowcase refreshTrigger={refreshTrigger} />
          </TabsContent>

          <TabsContent value="papers">
            <ResearchPapers papers={papers} />
          </TabsContent>
        </Tabs>
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