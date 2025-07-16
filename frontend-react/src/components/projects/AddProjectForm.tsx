import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { createProject } from "../../api/projects";
import type { ProjectCreateRequest } from "../../types/research";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AddProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
}

export function AddProjectForm({ isOpen, onClose, onProjectAdded }: AddProjectFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<ProjectCreateRequest>({
    title: "",
    description: "",
    year: new Date().getFullYear(),
    topic: "",
    status: "ongoing",
    abstract: "",
    team: [],
    demoUrl: "",
  });
  
  const [teamMember, setTeamMember] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.topic || !formData.abstract) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    try {
      await createProject(formData);
      toast.success("Project created successfully");
      onProjectAdded();
      onClose();
      // Reset form
      setFormData({
        title: "",
        description: "",
        year: new Date().getFullYear(),
        topic: "",
        status: "ongoing",
        abstract: "",
        team: [],
        demoUrl: "",
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTeamMember = () => {
    if (teamMember.trim() && !formData.team.includes(teamMember.trim())) {
      setFormData({
        ...formData,
        team: [...formData.team, teamMember.trim()],
      });
      setTeamMember("");
    }
  };

  const handleRemoveTeamMember = (member: string) => {
    setFormData({
      ...formData,
      team: formData.team.filter((m) => m !== member),
    });
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Research Project</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter project title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the project"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Select
                value={formData.year.toString()}
                onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}
              >
                <SelectTrigger id="year">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Research Topic *</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              placeholder="e.g., Machine Learning, Web Development, etc."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract *</Label>
            <Textarea
              id="abstract"
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              placeholder="Detailed abstract of the research project"
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demoUrl">Demo URL (Optional)</Label>
            <Input
              id="demoUrl"
              type="url"
              value={formData.demoUrl}
              onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
              placeholder="https://example.com/demo"
            />
          </div>

          <div className="space-y-2">
            <Label>Team Members</Label>
            <div className="flex gap-2">
              <Input
                value={teamMember}
                onChange={(e) => setTeamMember(e.target.value)}
                placeholder="Enter team member name"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTeamMember();
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddTeamMember}
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.team.map((member, index) => (
                <div
                  key={index}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md flex items-center gap-2"
                >
                  <span className="text-sm">{member}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTeamMember(member)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}