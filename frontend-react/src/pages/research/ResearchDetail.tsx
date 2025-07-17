import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ArrowLeft, ArrowRight, Download, Calendar, Users, FileText, ExternalLink, Mail, BookOpen } from "lucide-react";
import ResearchDetailImage from "../../assets/photos/ResearchDetail.jpg";

export function ResearchDetail() {
  const { researchId } = useParams<{ researchId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [research, setResearch] = useState<any>(null);

  useEffect(() => {
    // Mock data for demonstration
    // In a real application, you would fetch data from an API
    setTimeout(() => {
      setResearch({
        id: researchId,
        title: "Advanced Machine Learning Techniques",
        description: "This research focuses on developing novel machine learning algorithms for complex data analysis.",
        department: "Computer Science",
        researchers: ["Dr. John Doe", "Dr. Jane Smith", "Prof. Robert Johnson"],
        publications: [
          "Machine Learning in Practice: A Comprehensive Study",
          "Neural Networks for Data Analysis: New Approaches"
        ],
        fundingSource: "National Science Foundation",
        startDate: "2023-01-15",
        status: "Ongoing"
      });
      setLoading(false);
    }, 1000);
  }, [researchId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F0F0] via-[#F0F0F0] to-[#D3D3D3]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-[#31466F]/20 to-[#13274D]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-[#31466F]/20 to-[#0E183C]/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Hero Section with Parallax Effect */}
      <div
        className="relative h-[60vh] bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `url(${ResearchDetailImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/70 to-primary-dark/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-accent rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 left-20 w-6 h-6 bg-primary rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-40 right-40 w-5 h-5 bg-accent rounded-full animate-bounce delay-1000"></div>

        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                  {research?.title || "Research Details"}
                </span>
              </h1>
              <nav className="flex items-center justify-center space-x-2 text-sm text-white/80 mb-6">
                <span className="hover:text-white cursor-pointer">🏠 Home</span>
                <span>•</span>
                <span onClick={() => navigate("/research")} className="cursor-pointer hover:text-white">Research</span>
                <span>•</span>
                <span className="text-accent">Details</span>
              </nav>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group bg-gradient-to-r from-accent to-accent-light text-primary px-6 py-3 rounded-full font-bold text-base hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-accent/50">
                  <span className="flex items-center space-x-2">
                    <span>Request Collaboration</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="group bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-6 py-3 rounded-full font-bold text-base hover:bg-white/30 transition-all duration-300">
                  <span className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download Paper</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-12">
        <div className="flex items-center mb-10">
          <Button
            variant="ghost"
            onClick={() => navigate("/research")}
            className="group hover:bg-primary/10 transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent font-semibold">
              Back to Research Projects
            </span>
          </Button>
        </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/30 rounded-full blur-xl animate-pulse"></div>
            <div className="relative px-8 py-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-xl">
              <p className="text-primary font-semibold">Loading research details...</p>
            </div>
          </div>
        </div>
      ) : research ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
              <CardHeader className="border-b border-[#A8A8A8]/20 pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-3">
                      {research.title}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Badge className="mr-3 bg-gradient-to-r from-accent to-accent-light text-primary font-semibold px-3 py-1">
                        {research.status}
                      </Badge>
                      <span className="text-muted-foreground flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {research.department}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8 pt-6">
                <div>
                  <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-accent" />
                    Description
                  </h3>
                  <div className="bg-white/50 rounded-xl p-4 border border-[#A8A8A8]/20">
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {research.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
                      <Users className="h-5 w-5 mr-2 text-accent" />
                      Researchers
                    </h3>
                    <div className="bg-white/50 rounded-xl p-4 border border-[#A8A8A8]/20">
                      <div className="flex flex-wrap gap-2">
                        {research.researchers.map((researcher: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors px-3 py-1">
                            {researcher}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-accent" />
                      Timeline
                    </h3>
                    <div className="bg-white/50 rounded-xl p-4 border border-[#A8A8A8]/20 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span className="font-medium text-primary">
                          {new Date(research.startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Funding Source:</span>
                        <span className="font-medium text-primary">{research.fundingSource}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-primary mb-3 flex items-center">
                    <ExternalLink className="h-5 w-5 mr-2 text-accent" />
                    Publications
                  </h3>
                  <div className="bg-white/50 rounded-xl p-4 border border-[#A8A8A8]/20">
                    <ul className="space-y-3">
                      {research.publications.map((publication: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-accent/20 text-accent font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                            {publication}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="border-t border-[#A8A8A8]/20 pt-6 flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-accent to-accent-light text-primary hover:shadow-lg hover:shadow-accent/30 transition-all duration-300">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Research Team
                </Button>
                <Button variant="outline" className="border-primary/20 hover:bg-primary/5 transition-all duration-300">
                  <Download className="h-4 w-4 mr-2" />
                  Download Research Paper
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white shadow-2xl sticky top-4">
              <h3 className="text-xl font-bold mb-4">Research Highlights</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1.5 mr-3 mt-0.5">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Collaborative Team</p>
                    <p className="text-sm text-white/80">{research.researchers.length} researchers working together</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1.5 mr-3 mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Publications</p>
                    <p className="text-sm text-white/80">{research.publications.length} papers published</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-white/20 rounded-full p-1.5 mr-3 mt-0.5">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold">Research Timeline</p>
                    <p className="text-sm text-white/80">Started {new Date(research.startDate).getFullYear()}</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t border-white/20">
                <h4 className="font-semibold mb-2">Interested in this research?</h4>
                <Button className="w-full bg-white text-primary hover:bg-white/90 transition-all duration-300">
                  Request Collaboration
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-[#A8A8A8]/20">
            <p className="text-primary font-semibold">Research not found</p>
            <Button 
              onClick={() => navigate("/research")} 
              className="mt-4 bg-gradient-to-r from-primary to-primary-dark text-white"
            >
              Browse All Research
            </Button>
          </div>
        </div>
      )}
      </div>
      
      {/* Related Research Section */}
      {!loading && research && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 mt-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-8 text-center">
              Related Research
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="h-40 bg-gradient-to-r from-primary/80 to-primary-dark/80 flex items-center justify-center p-6">
                    <h3 className="text-xl font-bold text-white text-center">Related Research Project {item}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground mb-4">A brief description of this related research project and its connection to the current research.</p>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {item === 1 ? "Ongoing" : item === 2 ? "Completed" : "Planning"}
                      </Badge>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark hover:bg-primary/5">
                        <span className="flex items-center">
                          View Details
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
