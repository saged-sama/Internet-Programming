import type { CourseMaterial } from "@/api/courseMaterials";

// Material Card Component
export default function MaterialCard({ material }: { material: CourseMaterial }) {
    return (
        <div className="bg-card border border-border rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-6 group">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {material.title || 'Untitled Material'}
                </h3>
                <span className="px-2 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                    {material.file_type || material.type || 'Unknown'}
                </span>
            </div>
            
            <p className="text-muted-foreground mb-4 line-clamp-2">
                {material.description || 'No description available'}
            </p>
            
            <div className="flex flex-col space-y-2 mb-4">
                {material.file_size && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Size: {material.file_size}
                    </div>
                )}
                {material.upload_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(material.upload_date).toLocaleDateString()}
                    </div>
                )}
                {material.uploaded_by && (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {material.uploaded_by}
                    </div>
                )}
            </div>
            
            {material.file_url && (
                <a 
                    href={`${import.meta.env.VITE_BACKEND_URL}${material.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                </a>
            )}
        </div>
    );
}