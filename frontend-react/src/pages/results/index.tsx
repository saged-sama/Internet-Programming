import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import ResultsList from './resultsList';
import ResultUpload from './resultUpload';

export default function ResultsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-foreground">Results Management</h1>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                                    <Plus size={16} />
                                    Publish Results
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <Upload size={20} />
                                        Upload New Results
                                    </DialogTitle>
                                </DialogHeader>
                                <ResultUpload />
                            </DialogContent>
                        </Dialog>
                    </div>
                    <p className="text-muted-foreground">Manage and publish academic results</p>
                </div>

                {/* Results List */}
                <div className="bg-card rounded-lg shadow-sm border border-border">
                    <ResultsList />
                </div>
            </div>
        </div>
    );
}