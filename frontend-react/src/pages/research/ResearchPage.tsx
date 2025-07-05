import { useState, useEffect } from "react";
import { ProjectsShowcase } from "../../components/projects/ProjectsShowcase";
import { ResearchPapers } from "../../components/research/ResearchPapers";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import type {
  Project,
  ResearchPaper,
} from "../../types/financials";

import financialsData from "../../assets/financials.json";

export function ResearchPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [papers, setPapers] = useState<ResearchPaper[]>([]);

  useEffect(() => {
    // Load mock data with proper type casting
    setProjects(financialsData.projects as Project[]);
    setPapers(financialsData.researchPapers as ResearchPaper[]);
  }, []);

  return (
    
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">Research & Innovation</h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Explore our cutting-edge research projects and publications that are advancing the frontiers of computer science and technology
          </p>
        </div>

        <Tabs defaultValue="projects" className="w-full">
          <div className="relative">
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
          </div>

          <TabsContent value="projects">
            <ProjectsShowcase projects={projects} />
          </TabsContent>

          <TabsContent value="papers">
            <ResearchPapers papers={papers} />
          </TabsContent>
        </Tabs>
      </div>
    
  );
} 