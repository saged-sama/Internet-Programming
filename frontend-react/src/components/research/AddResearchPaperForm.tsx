import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Loader2, Plus, X } from "lucide-react";
import axios from "axios";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface AddResearchPaperFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPaperAdded: () => void;
}

export function AddResearchPaperForm({ isOpen, onClose, onPaperAdded }: AddResearchPaperFormProps) {
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [journal, setJournal] = useState("");
  const [doi, setDoi] = useState("");
  const [status, setStatus] = useState("published");
  const [publicationDate, setPublicationDate] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [newAuthor, setNewAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      setError("Title is required");
      return;
    }

    if (authors.length === 0) {
      setError("At least one author is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      
      const paperData = {
        title,
        abstract,
        journal,
        doi,
        status,
        publication_date: publicationDate || undefined,
        authors
      };
      
      await axios.post("/api/research", paperData);
      
      // Reset form and close dialog
      resetForm();
      onPaperAdded();
      onClose();
    } catch (err) {
      console.error("Error adding research paper:", err);
      setError("Failed to add research paper. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setAbstract("");
    setJournal("");
    setDoi("");
    setStatus("published");
    setPublicationDate("");
    setAuthors([]);
    setNewAuthor("");
    setError("");
  };

  const addAuthor = () => {
    if (newAuthor.trim() && !authors.includes(newAuthor.trim())) {
      setAuthors([...authors, newAuthor.trim()]);
      setNewAuthor("");
    }
  };

  const removeAuthor = (authorToRemove: string) => {
    setAuthors(authors.filter(author => author !== authorToRemove));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Research Paper</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Research paper title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract</Label>
            <Textarea
              id="abstract"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Brief summary of the research paper"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="journal">Journal</Label>
              <Input
                id="journal"
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="Journal name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doi">DOI</Label>
              <Input
                id="doi"
                value={doi}
                onChange={(e) => setDoi(e.target.value)}
                placeholder="Digital Object Identifier"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="publicationDate">Publication Date</Label>
              <Input
                id="publicationDate"
                type="date"
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Authors *</Label>
            <div className="flex gap-2">
              <Input
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Author name"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAuthor();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={addAuthor}
                variant="secondary"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {authors.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {authors.map((author, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {author}
                    <button 
                      type="button" 
                      onClick={() => removeAuthor(author)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Paper
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
