import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';

export default function BigAchievements() {
  const majorAchievements = [
    {
      id: 1,
      title: "Center for AI Research & Innovation",
      subtitle: "Leading AI Research in South Asia",
      year: "2020",
      description: "Established Bangladesh's premier artificial intelligence research center, fostering innovation and international collaboration in machine learning and data science.",
      metrics: ["60+ Publications", "25 PhD Scholars", "12 Industry Collaborations"],
      icon: "🧠",
      category: "Research Excellence"
    },
    {
      id: 2,
      title: "UNESCO Chair Recognition",
      subtitle: "Information & Communication Technologies",
      year: "2023",
      description: "Designated UNESCO Chair for ICT in development, recognizing our contribution to bridging the digital divide and advancing technological education.",
      metrics: ["Global Network", "Policy Influence", "Capacity Building"],
      icon: "🌍",
      category: "International Recognition"
    }
  ];

  const milestones = [
    { year: "1992", event: "Department Established", description: "Founded as part of University of Dhaka", icon: "🏛️" },
    { year: "2000", event: "PhD Program Launch", description: "First doctoral program in computer science", icon: "🎓" },
    { year: "2010", event: "International Accreditation", description: "Achieved global quality standards", icon: "⭐" },
    { year: "2020", event: "AI Research Center", description: "Established cutting-edge research facility", icon: "🧠" },
    { year: "2024", event: "5000+ Alumni Network", description: "Graduates across 50+ countries", icon: "👥" }
  ];

  const impactMetrics = [
    { number: "5,000+", label: "Global Alumni", icon: "🌎", description: "Graduates making impact worldwide" },
    { number: "200+", label: "Faculty & Staff", icon: "👨‍🏫", description: "Dedicated educators and researchers" },
    { number: "50+", label: "Countries", icon: "🌍", description: "International reach and influence" },
    { number: "95%", label: "Placement Rate", icon: "💼", description: "Graduate employment success" }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-card border border-secondary/20 px-6 py-3 rounded-full shadow-sm mb-8">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span className="text-sm font-medium text-primary">Excellence Since 1992</span>
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
          </div>
          <h2 className="text-primary mb-6 max-w-4xl mx-auto">
            Shaping the Future of Technology Education
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Three decades of academic excellence, research innovation, and global impact in computer science and engineering education.
          </p>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {impactMetrics.map((metric, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="bg-card border border-secondary/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/15 transition-colors">
                  <span className="text-2xl">{metric.icon}</span>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{metric.number}</div>
                <div className="text-sm font-medium text-primary mb-2">{metric.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{metric.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Major Achievements */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-2xl font-bold text-primary mb-4">Distinguished Achievements</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Landmark accomplishments that define our commitment to excellence and innovation in computer science education.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {majorAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="group bg-card border border-secondary/20 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-500"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/15 transition-colors">
                    <span className="text-3xl">{achievement.icon}</span>
                  </div>
                  <div className="text-right">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {achievement.year}
                    </div>
                    <div className="text-xs text-muted-foreground">{achievement.category}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                    {achievement.title}
                  </h4>
                  <p className="text-secondary font-medium mb-4">{achievement.subtitle}</p>
                  <p className="text-muted-foreground leading-relaxed">{achievement.description}</p>
                </div>

                {/* Metrics */}
                <div className="flex flex-wrap gap-2">
                  {achievement.metrics.map((metric, index) => (
                    <span
                      key={index}
                      className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historical Timeline */}
        <div className="bg-card border border-secondary/20 rounded-2xl p-12 shadow-sm">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-primary mb-4">Our Academic Journey</h3>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Key milestones that shaped our evolution as a leading computer science institution.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-secondary/20"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="text-center group">
                  {/* Milestone Icon */}
                  <div className="relative z-8 w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                    <span className="text-2xl text-primary">{milestone.icon}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-primary">{milestone.year}</div>
                    <div className="text-sm font-medium text-secondary">{milestone.event}</div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {milestone.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4">
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/about">
                Learn More About Our History
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
              <Link to="/research">
                Explore Our Research
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 