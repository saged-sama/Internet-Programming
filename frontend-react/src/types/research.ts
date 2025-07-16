// types/research.ts

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  conference?: string;
  journal?: string;
  abstract: string;
  keywords: string[];
  doi?: string;
  url?: string;
  pdfUrl?: string;
  citations?: number;
  status: "published" | "accepted" | "submitted" | "in-review";
  publicationType: "conference" | "journal" | "workshop" | "poster";
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  supervisor?: string;
  supervisorName?: string;
  year: number;
  topic: string;
  status: string;
  abstract: string;
  team: string[];
  demoUrl?: string;
}

export interface ProjectCreateRequest {
  title: string;
  description?: string;
  year: number;
  topic: string;
  status: string;
  abstract: string;
  team: string[];
  demoUrl?: string;
}

export interface ProjectsApiResponse {
  data: Project[];
  total: number;
  page?: number;
  limit?: number;
}