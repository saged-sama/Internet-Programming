import { Link } from 'react-router-dom';
import themeClasses from '../../../lib/theme-utils';

interface Resource {
  title: string;
  icon: string;
  description: string;
  link: string;
}


import { useEffect, useState } from 'react';

export default function AcademicResourcesSection() {
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    import('../../../assets/academicResources.json')
      .then((data) => {
        setResources(data.default || data);
      })
      .catch((err) => {
        console.error('Failed to load academic resources:', err);
      });
  }, []);

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="mb-8 text-center">
          Academic Resources
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <ResourceCard key={index} resource={resource} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link 
      to={resource.link} 
      className={`bg-card p-6 rounded-lg shadow-sm border hover:shadow-md ${themeClasses.hoverBorderAccentYellow} transition-all text-center`}
    >
      <div className={`mb-4 text-2xl ${themeClasses.textAccentYellow}`}>
        {resource.icon}
      </div>
      <h3 className={`mb-2 ${themeClasses.textPrimary}`}>
        {resource.title}
      </h3>
      <p className="text-muted-foreground">
        {resource.description}
      </p>
    </Link>
  );
}
