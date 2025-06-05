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
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className={`text-3xl font-bold mb-8 text-center ${themeClasses.textPrimary}`}>
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
      className={`bg-white p-6 rounded-lg shadow-sm border hover:shadow-md ${themeClasses.hoverBorderAccentYellow} transition-all text-center`}
    >
      <div className={`text-4xl mb-4 ${themeClasses.textAccentYellow}`}>
        {resource.icon}
      </div>
      <h3 className={`text-xl font-semibold mb-2 ${themeClasses.textPrimary}`}>
        {resource.title}
      </h3>
      <p className="text-gray-600 text-sm">
        {resource.description}
      </p>
    </Link>
  );
}
