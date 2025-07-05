import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';

export default function ProjectsShowcase() {
  const researchProjects = [
    {
      id: 1,
      title: "Intelligent Academic Advisory System",
      description: "Advanced machine learning platform providing personalized academic guidance and course recommendations for students across multiple disciplines.",
      category: "Artificial Intelligence & Machine Learning",
      status: "Active Research",
      impact: "Serving 8,000+ Students",
      publications: "12 Papers Published",
      funding: "HEQEP Funded",
      icon: "🤖",
      technologies: ["Deep Learning", "NLP", "Python", "TensorFlow"]
    },
    {
      id: 2,
      title: "Smart University Infrastructure",
      description: "IoT-enabled campus management system integrating environmental monitoring, energy optimization, and security protocols for sustainable operations.",
      category: "Internet of Things & Systems",
      status: "Implementation Phase",
      impact: "Campus-wide Deployment",
      publications: "8 Conference Papers",
      funding: "Industry Partnership",
      icon: "🏛️",
      technologies: ["IoT", "Edge Computing", "React", "Node.js"]
    },
    {
      id: 3,
      title: "Blockchain Credential Verification",
      description: "Decentralized platform for secure academic credential verification, ensuring authenticity and preventing fraud in educational certifications.",
      category: "Blockchain & Security",
      status: "Pilot Testing",
      impact: "3 Universities Participating",
      publications: "Patent Application Filed",
      funding: "Research Grant",
      icon: "🔗",
      technologies: ["Blockchain", "Smart Contracts", "Ethereum", "Web3"]
    }
  ];

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-secondary rounded-full"></span>
            <span className="text-sm font-medium text-primary">Research & Innovation</span>
          </div>
          <h2 className="text-primary mb-6">
            Cutting-Edge Research Projects
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            Advancing the frontiers of computer science through interdisciplinary research that addresses real-world challenges and creates innovative solutions.
          </p>
        </div>

        {/* Research Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {researchProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-background border border-secondary/20 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/15 transition-colors">
                  <span className="text-2xl">{project.icon}</span>
                </div>
                <div className="text-right">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-primary mb-3 group-hover:text-secondary transition-colors leading-tight">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="text-xs font-medium text-secondary mb-4 bg-secondary/5 px-3 py-2 rounded-lg">
                  {project.category}
                </div>
              </div>

              {/* Technologies */}
              <div className="mb-6">
                <div className="text-xs text-muted-foreground mb-2">Key Technologies:</div>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-chart-1/10 text-chart-1 px-2 py-1 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Research Metrics */}
              <div className="space-y-3 pt-4 border-t border-secondary/10">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Impact:</span>
                  <span className="text-xs font-medium text-primary">{project.impact}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Research Output:</span>
                  <span className="text-xs font-medium text-primary">{project.publications}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Funding:</span>
                  <span className="text-xs font-medium text-secondary">{project.funding}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Research Impact Section */}
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <div className="text-2xl font-bold text-primary mb-2">150+</div>
              <div className="text-sm text-muted-foreground">Active Research Projects</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔬</span>
              </div>
              <div className="text-2xl font-bold text-secondary mb-2">25+</div>
              <div className="text-sm text-muted-foreground">Research Labs & Centers</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-chart-1/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <div className="text-2xl font-bold text-chart-1 mb-2">40+</div>
              <div className="text-sm text-muted-foreground">Industry Collaborations</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="inline-flex items-center gap-4">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/research">
                Explore All Research Projects
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
              <Link to="/publications">
                View Publications
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 