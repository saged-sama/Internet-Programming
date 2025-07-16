import { useState } from "react";
import type { Project, ProjectCreateRequest } from "../../types/research";
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

interface EditProjectFormProps {
  project: Project;
  onSubmit: (data: Partial<ProjectCreateRequest>) => void;
  onCancel: () => void;
}

export function EditProjectForm({ project, onSubmit, onCancel }: EditProjectFormProps) {
  const [formData, setFormData] = useState<Partial<ProjectCreateRequest>>({
    title: project.title,
    description: project.description || "",
    year: project.year,
    topic: project.topic,
    status: project.status,
    abstract: project.abstract,
    team: project.team,
    demoUrl: project.demoUrl || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData((prev) => ({ ...prev, year: parseInt(e.target.value) }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Planning">Planning</SelectItem>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="abstract">Abstract</Label>
          <Textarea
            id="abstract"
            name="abstract"
            value={formData.abstract}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>

        <div>
          <Label htmlFor="demoUrl">Demo URL</Label>
          <Input
            id="demoUrl"
            name="demoUrl"
            value={formData.demoUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
