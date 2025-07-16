import React, { useState, useEffect } from 'react';
import { getAllResults, type Result, type ResultsReadQuery } from '../../api/results';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User, ExternalLink, FileText } from "lucide-react";

const ResultsList: React.FC = () => {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ResultsReadQuery>({});

    const fetchResults = async () => {
        try {
            setLoading(true);
            const data = await getAllResults();
            setResults(data);
        } catch (err) {
            console.error('Failed to fetch results:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: keyof ResultsReadQuery, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        fetchResults();
    };

    useEffect(() => {
        fetchResults();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold tracking-tight mb-6">Results</h2>
            
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            placeholder="Filter by year"
                            value={filters.year || ''}
                            onChange={(e) => handleFilterChange('year', e.target.value)}
                        />
                        <Input
                            placeholder="Filter by semester"
                            value={filters.semester || ''}
                            onChange={(e) => handleFilterChange('semester', e.target.value)}
                        />
                        <Input
                            placeholder="Filter by student ID"
                            value={filters.student_id || ''}
                            onChange={(e) => handleFilterChange('student_id', e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {loading ? (
                    <Card>
                        <CardContent className="flex items-center justify-center py-8">
                            <p className="text-muted-foreground">Loading results...</p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {results.map((result) => (
                            <Card key={result.id} className="hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-xl">{result.title}</CardTitle>
                                        <Badge variant="outline" className="ml-2">
                                            <FileText className="w-4 h-4 mr-1" />
                                            Result
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <CalendarDays className="w-4 h-4 mr-2" />
                                            <span className="font-medium">Year:</span>
                                            <span className="ml-1">{result.year}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Badge variant="secondary">{result.semester}</Badge>
                                        </div>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <User className="w-4 h-4 mr-2" />
                                            <span className="font-medium">Published by:</span>
                                            <span className="ml-1">{result.published_by}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Created: {new Date(result.created_at).toLocaleDateString()}
                                        </span>
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={`${import.meta.env.VITE_BACKEND_URL}/api/files/${result.file}`} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                View File
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {results.length === 0 && (
                            <Card>
                                <CardContent className="flex items-center justify-center py-8">
                                    <p className="text-muted-foreground">No results found.</p>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ResultsList;
