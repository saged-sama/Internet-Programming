import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';

export default function AwardsSection() {
  const academicAwards = [
    {
      id: 1,
      title: "Excellence in Computer Science Education",
      organization: "University Grants Commission of Bangladesh",
      year: "2024",
      description: "Recognized for outstanding contributions to undergraduate and graduate computer science education, innovative curriculum development, and student success outcomes.",
      icon: "🏆",
      category: "Educational Excellence",
      scope: "National"
    },
    {
      id: 2,
      title: "Best Research Department Award",
      organization: "Bangladesh Association of Software and Information Services",
      year: "2023",
      description: "Honored for pioneering research in artificial intelligence, machine learning, and software engineering with significant contributions to the tech industry.",
      icon: "🔬",
      category: "Research Achievement",
      scope: "Industry"
    },
    {
      id: 3,
      title: "UNESCO Chair in ICT for Development",
      organization: "United Nations Educational, Scientific and Cultural Organization",
      year: "2023",
      description: "Designated as UNESCO Chair in Information and Communication Technologies for Development, focusing on capacity building and sustainable technology solutions.",
      icon: "🌍",
      category: "International Recognition",
      scope: "Global"
    }
  ];

  const recognitionMetrics = [
    { 
      value: "500+", 
      label: "Peer-Reviewed Publications", 
      description: "In top-tier international journals and conferences",
      icon: "📚" 
    },
    { 
      value: "$2.5M+", 
      label: "Research Funding", 
      description: "Secured from national and international sources",
      icon: "💰" 
    },
    { 
      value: "30+", 
      label: "Patent Applications", 
      description: "Filed for innovative technological solutions",
      icon: "⚡" 
    },
    { 
      value: "60+", 
      label: "Industry Partnerships", 
      description: "Active collaborations with leading organizations",
      icon: "🤝" 
    }
  ];

  const institutionalRankings = [
    { metric: "Computer Science Ranking", position: "#1 in Bangladesh", year: "2024" },
    { metric: "Research Output", position: "Top 3 in South Asia", year: "2023" },
    { metric: "Graduate Employment", position: "95% Placement Rate", year: "2024" },
    { metric: "International Collaboration", position: "50+ Countries", year: "2024" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-card border border-secondary/20 px-6 py-3 rounded-full shadow-sm mb-8">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span className="text-sm font-medium text-primary">Recognition & Excellence</span>
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
          </div>
          <h2 className="text-primary mb-6">
            Academic Distinction & Recognition
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
            Our commitment to excellence has earned recognition from leading academic institutions, government bodies, and international organizations worldwide.
          </p>
        </div>

        {/* Recognition Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {recognitionMetrics.map((metric, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="bg-card border border-secondary/20 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary/15 transition-colors">
                  <span className="text-2xl">{metric.icon}</span>
                </div>
                <div className="text-2xl font-bold text-primary mb-2">{metric.value}</div>
                <div className="text-sm font-medium text-primary mb-2">{metric.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{metric.description}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Academic Awards */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-primary mb-4">Distinguished Awards & Honors</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Recognition from prestigious institutions highlighting our contributions to computer science education and research.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {academicAwards.map((award) => (
              <div
                key={award.id}
                className="group bg-card border border-secondary/20 rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Award Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/15 transition-colors">
                    <span className="text-3xl">{award.icon}</span>
                  </div>
                  <div className="text-right">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-2">
                      {award.year}
                    </div>
                    <div className="text-xs text-muted-foreground">{award.scope}</div>
                  </div>
                </div>

                {/* Award Content */}
                <div className="mb-6">
                  <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-xs font-medium mb-4 inline-block">
                    {award.category}
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-3 leading-tight">
                    {award.title}
                  </h4>
                  <p className="text-sm font-medium text-secondary mb-4">{award.organization}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">{award.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Rankings */}
        <div className="bg-card border border-secondary/20 rounded-2xl p-8 shadow-sm mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-primary mb-4">Institutional Rankings & Achievements</h3>
            <p className="text-muted-foreground">
              Performance metrics and rankings that demonstrate our position as a leading computer science institution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {institutionalRankings.map((ranking, index) => (
              <div key={index} className="text-center p-6 bg-secondary/5 rounded-xl">
                <div className="text-lg font-bold text-primary mb-2">{ranking.position}</div>
                <div className="text-sm font-medium text-secondary mb-2">{ranking.metric}</div>
                <div className="text-xs text-muted-foreground">{ranking.year}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Recognition */}
        <div className="bg-gradient-to-r from-primary to-chart-2 rounded-2xl p-8 text-center text-white shadow-lg">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🏆</span>
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Leading Computer Science Department in Bangladesh
            </h3>
            <p className="text-lg opacity-90 mb-6">
              Consistently ranked as the premier institution for computer science education and research, 
              with a track record of excellence spanning over three decades.
            </p>
            <div className="flex justify-center items-center gap-8 text-sm">
              <div>
                <div className="text-2xl font-bold">32</div>
                <div className="opacity-90">Years of Excellence</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div>
                <div className="text-2xl font-bold">5000+</div>
                <div className="opacity-90">Graduates Worldwide</div>
              </div>
              <div className="w-px h-12 bg-white/30"></div>
              <div>
                <div className="text-2xl font-bold">95%</div>
                <div className="opacity-90">Employment Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4">
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/about">
                Learn About Our History
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">
              <Link to="/achievements">
                View All Achievements
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
} 