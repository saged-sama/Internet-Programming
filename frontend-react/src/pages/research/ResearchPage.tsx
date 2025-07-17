import { useState } from "react";
import { ProjectsShowcase } from "../../components/projects/ProjectsShowcase";
import { AddProjectForm } from "../../components/projects/AddProjectForm";
import { Button } from "../../components/ui/button";
import { Plus, Search, ArrowRight, BookOpen, Microscope, Beaker, Users, Award } from "lucide-react";
import ResearchLabImage from "../../assets/photos/ResearchLab2.jpg";

export function ResearchPage() {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProjectAdded = () => {
    // Trigger refresh of projects list
    setRefreshTrigger(prev => prev + 1);
  };

  // Check if user is faculty (for showing add button)
  const getUserRole = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role;
    }
    return null;
  };

  const isAllowedToAdd = getUserRole() !== 'student';

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
          backgroundImage: `url(${ResearchLabImage})`,
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
                <span className="bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent">
                  Research &
                </span>
                <br />
                <span className="text-white">Projects</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#D3D3D3] mb-6 font-light">
                Explore our cutting-edge research initiatives
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group bg-gradient-to-r from-accent to-accent-light text-primary px-6 py-3 rounded-full font-bold text-base hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-accent/50">
                  <span className="flex items-center space-x-2">
                    <span>Explore Projects</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="group bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-6 py-3 rounded-full font-bold text-base hover:bg-white/30 transition-all duration-300">
                  <span className="flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Search Research</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto py-12 space-y-12">
        {/* Research Categories */}
        <div className="mb-12">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold bg-primary bg-clip-text text-transparent mb-4">
              Research Areas
            </h2>
            <p className="text-lg text-primary-dark max-w-3xl mx-auto leading-relaxed">
              Explore our cutting-edge research projects that are advancing the frontiers of computer science and technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Microscope, title: "AI & Machine Learning", color: "from-primary to-primary-dark", count: 12 },
              { icon: Beaker, title: "Data Science", color: "from-accent to-accent-light", count: 8 },
              { icon: BookOpen, title: "Software Engineering", color: "from-primary to-primary-dark", count: 15 },
              { icon: Users, title: "Human-Computer Interaction", color: "from-accent to-accent-light", count: 6 }
            ].map((category, index) => (
              <div key={index} className="group relative">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#A8A8A8]/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className={`bg-gradient-to-r ${category.color} w-16 h-16 rounded-xl flex items-center justify-center shadow-lg mb-4 mx-auto`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-primary text-center mb-2">{category.title}</h3>
                  <p className="text-center text-muted-foreground">{category.count} Projects</p>
                  <div className="mt-4 flex items-center justify-center text-primary font-semibold group-hover:text-primary-dark transition-colors">
                    <span className="text-sm">View Projects</span>
                    <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent mb-2">
                Featured Projects
              </h2>
              <p className="text-muted-foreground">Discover our latest research initiatives</p>
            </div>
            
            {/* Add button - only show for faculty/admin */}
            {isAllowedToAdd && (
              <Button 
                onClick={() => setIsAddProjectOpen(true)}
                className="bg-gradient-to-r from-accent to-accent-light text-primary hover:shadow-lg hover:shadow-accent/30 transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Project
              </Button>
            )}
          </div>
        </div>

        <ProjectsShowcase refreshTrigger={refreshTrigger} />
      </div>

      {/* Featured Researcher */}
      <div className="bg-gradient-to-r from-primary to-primary-dark py-16 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-4">Featured Researcher</h2>
              <h3 className="text-2xl font-semibold text-accent mb-2">Dr. Sarah Johnson</h3>
              <p className="text-xl text-white/80 mb-6">AI & Machine Learning Expert</p>
              <p className="text-white/90 mb-6 leading-relaxed">
                Dr. Johnson's groundbreaking work in neural networks has revolutionized how we approach complex data analysis and pattern recognition in healthcare applications.  
              </p>
              <button className="group bg-white text-primary px-6 py-3 rounded-full font-bold text-base hover:scale-105 transition-all duration-300 shadow-xl">
                <span className="flex items-center space-x-2">
                  <span>View Profile</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-accent/30 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-64 h-64 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
                  <Award className="w-24 h-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Project Dialog */}
      <AddProjectForm 
        isOpen={isAddProjectOpen}
        onClose={() => setIsAddProjectOpen(false)}
        onProjectAdded={handleProjectAdded}
      />
    </div>
  );
}