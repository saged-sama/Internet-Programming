import React, { useState } from 'react';
import { createResult } from '../../api/results';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

const ResultUpload: React.FC = () => {
    const [title, setTitle] = useState('');
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title || !year || !semester || !file) {
            setMessage({ type: 'error', text: 'Please fill in all fields' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await createResult(title, year, semester, file);
            setMessage({ type: 'success', text: 'Result published successfully!' });
            setTitle('');
            setYear('');
            setSemester('');
            setFile(null);
        } catch (error) {
            setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to publish result' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-center">Publish Result</CardTitle>
                    <CardDescription className="text-center">
                        Upload and publish academic results
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {message && (
                        <Alert className={`mb-4 ${message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-destructive bg-destructive/10'}`}>
                            {message.type === 'success' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                                <XCircle className="h-4 w-4 text-destructive" />
                            )}
                            <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-destructive'}>
                                {message.text}
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter result title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input
                                id="year"
                                type="text"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                placeholder="Enter year (e.g., 2024)"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="semester">Semester</Label>
                            <Select value={semester} onValueChange={setSemester}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select semester" />
                                </SelectTrigger>
                                <SelectContent defaultValue={semester}>
                                    <SelectItem value="1st">1st</SelectItem>
                                    <SelectItem value="2nd">2nd</SelectItem>
                                    <SelectItem value="3rd">3rd</SelectItem>
                                    <SelectItem value="4th">4th</SelectItem>
                                    <SelectItem value="5th">5th</SelectItem>
                                    <SelectItem value="6th">6th</SelectItem>
                                    <SelectItem value="7th">7th</SelectItem>
                                    <SelectItem value="8th">8th</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="file">Result File</Label>
                            <Input
                                id="file"
                                type="file"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                accept=".pdf,.csv,.xlsx"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                'Publishing...'
                            ) : (
                                <>
                                    <Upload className="mr-2 h-4 w-4" />
                                    Publish Result
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResultUpload;