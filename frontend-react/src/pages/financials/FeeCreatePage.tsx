import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { financialApi } from "../../lib/financialApi";
import { requireAdmin } from "../../lib/auth";

interface FeeFormData {
  title: string;
  description: string;
  amount: number;
  type: string;
  deadline: string;
  semester: string;
  academic_year: string;
}

export default function FeeCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FeeFormData>({
    title: '',
    description: '',
    amount: 0,
    type: 'lab',
    deadline: '',
    semester: '',
    academic_year: ''
  });

  // Check if user is admin
  try {
    requireAdmin();
  } catch (error) {
    navigate('/auth/login');
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await financialApi.createFee(formData);
      navigate('/financials');
    } catch (err) {
      console.error('Error creating fee:', err);
      setError(err instanceof Error ? err.message : 'Failed to create fee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Create New Fee</h1>
        <p className="text-muted-foreground">Create a new fee structure for students</p>
        
        <div className="mt-4">
          <Button 
            onClick={() => navigate('/financials')} 
            variant="outline"
          >
            ← Back to Financial Management
          </Button>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Fee Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                  Fee Title *
                </label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Tuition Fee Spring 2024"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-foreground mb-2">
                  Fee Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="lab">Lab Fee</option>
                  <option value="library">Library Fee</option>
                  <option value="sports">Sports Fee</option>
                  <option value="development">Development Fee</option>
                  <option value="admission">Admission Fee</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-input rounded-md bg-background"
                placeholder="Optional description of the fee..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
                  Amount (BDT) *
                </label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-foreground mb-2">
                  Deadline *
                </label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-foreground mb-2">
                  Semester
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select Semester</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>

              <div>
                <label htmlFor="academic_year" className="block text-sm font-medium text-foreground mb-2">
                  Academic Year
                </label>
                <Input
                  id="academic_year"
                  name="academic_year"
                  value={formData.academic_year}
                  onChange={handleInputChange}
                  placeholder="e.g., 2024-2025"
                />
              </div>
            </div>



            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/financials')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? 'Creating...' : 'Create Fee'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 