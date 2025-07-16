import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getAuthToken } from '@/lib/auth';

interface CreateCourseMaterialProps {
    courseCode: string;
}

const CreateCourseMaterial: React.FC<CreateCourseMaterialProps> = ({ courseCode }) => {
    const [formData, setFormData] = useState({
        title: '',
        type: '',
        description: ''
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            type: value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('type', formData.type);
            if (formData.description) {
                formDataToSend.append('description', formData.description);
            }
            if (file) {
                formDataToSend.append('file', file);
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/courses/${courseCode}/materials`, {
                method: 'POST',
                body: formDataToSend,
                headers:{
                    "Authorization": `Bearer ${getAuthToken()}`,
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create material');
            }

            // const material = await response.json();
            setFormData({ title: '', type: '', description: '' });
            setFile(null);
            setSuccess('Material created successfully!');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add Course Material</CardTitle>
                <CardDescription>
                    Upload and organize materials for course {courseCode}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                
                {success && (
                    <Alert className="mb-4 border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">{success}</AlertDescription>
                    </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter material title"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Type</Label>
                        <Select value={formData.type} onValueChange={handleSelectChange} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select material type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="lecture">Lecture</SelectItem>
                                <SelectItem value="assignment">Assignment</SelectItem>
                                <SelectItem value="reading">Reading</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter material description (optional)"
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">File</Label>
                        <div className="flex items-center space-x-2">
                            <Input
                                id="file"
                                type="file"
                                onChange={handleFileChange}
                                className="flex-1"
                            />
                            <Upload className="h-4 w-4 text-gray-500" />
                        </div>
                        {file && (
                            <p className="text-sm text-gray-600">
                                Selected: {file.name}
                            </p>
                        )}
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create Material'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default CreateCourseMaterial;