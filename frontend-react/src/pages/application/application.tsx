import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, FileText, Users, HelpCircle, CheckCircle, Clock, AlertTriangle, Download, Mail, Phone, Star, ArrowRight, Zap, Shield, Award, Globe } from 'lucide-react';

const ApplicationPage = () => {
  const [activeTab, setActiveTab] = useState('process');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "What are the minimum academic requirements for admission?",
      answer: "Applicants must have completed their higher secondary education (HSC) or equivalent with a minimum GPA of 3.5. For graduate programs, a bachelor's degree with a minimum CGPA of 3.0 is required."
    },
    {
      question: "When is the application deadline?",
      answer: "Application deadlines vary by program. Generally, Fall semester applications are due by March 31st, Spring semester by September 30th, and Summer semester by January 31st."
    },
    {
      question: "Is there an application fee?",
      answer: "Yes, there is a non-refundable application fee of 1,000 BDT for undergraduate programs and 1,500 BDT for graduate programs."
    },
    {
      question: "Can I apply for multiple programs?",
      answer: "Yes, you can apply for multiple programs, but each application requires a separate application fee and complete documentation."
    },
    {
      question: "What documents need to be submitted?",
      answer: "Required documents include academic transcripts, certificates, passport-size photographs, national ID copy, recommendation letters, and statement of purpose."
    },
    {
      question: "How long does the admission process take?",
      answer: "The admission process typically takes 4-6 weeks from the application deadline. You will be notified via email and SMS about your admission status."
    }
  ];

  const requirements = [
    { icon: FileText, title: "Academic Transcripts", description: "Official transcripts from all previous institutions attended", color: "from-[#31466F] to-[#13274D]" },
    { icon: Users, title: "Recommendation Letters", description: "Two recommendation letters from academic or professional references", color: "from-[#F5C940] to-[#ECB31D]" },
    { icon: Shield, title: "Statement of Purpose", description: "A detailed essay outlining your academic and career goals", color: "from-[#31466F] to-[#0E183C]" },
    { icon: Award, title: "National ID Copy", description: "Certified copy of your national identification document", color: "from-[#13274D] to-[#0E183C]" },
    { icon: Star, title: "Photographs", description: "Recent passport-size photographs (4 copies)", color: "from-[#F5C940] to-[#ECB31D]" },
    { icon: Globe, title: "Language Proficiency", description: "English language proficiency test scores (if applicable)", color: "from-[#31466F] to-[#13274D]" }
  ];

  const processSteps = [
    { step: 1, title: "Online Application", description: "Complete the online application form with all required information", icon: Globe, color: "from-[#31466F] to-[#13274D]" },
    { step: 2, title: "Document Submission", description: "Submit all required documents through the online portal or in person", icon: FileText, color: "from-[#F5C940] to-[#ECB31D]" },
    { step: 3, title: "Application Review", description: "Your application will be reviewed by the admissions committee", icon: Users, color: "from-[#31466F] to-[#0E183C]" },
    { step: 4, title: "Entrance Exam", description: "Take the required entrance examination (if applicable)", icon: Award, color: "from-[#13274D] to-[#0E183C]" },
    { step: 5, title: "Interview", description: "Attend an interview session with faculty members", icon: Users, color: "from-[#F5C940] to-[#ECB31D]" },
    { step: 6, title: "Admission Decision", description: "Receive your admission decision via email and SMS", icon: CheckCircle, color: "from-[#31466F] to-[#13274D]" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F0F0] via-[#F0F0F0] to-[#D3D3D3]">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-[#31466F]/20 to-[#13274D]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[#F5C940]/20 to-[#ECB31D]/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-r from-[#31466F]/20 to-[#0E183C]/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Hero Section with Parallax Effect - REDUCED HEIGHT */}
      <div
        className="relative h-[60vh] bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage: `url('src/assets/photos/Application.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#31466F]/80 via-[#13274D]/70 to-[#0E183C]/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-4 h-4 bg-[#F5C940] rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 left-20 w-6 h-6 bg-[#31466F] rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-40 right-40 w-5 h-5 bg-[#ECB31D] rounded-full animate-bounce delay-1000"></div>

        <div className="relative z-10 h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                <span className="bg-gradient-to-r from-[#F5C940] to-[#ECB31D] bg-clip-text text-transparent">
                  Apply
                </span>
                <br />
                <span className="text-white">Today</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#D3D3D3] mb-6 font-light">
                Transform your future with us
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="group bg-gradient-to-r from-[#F5C940] to-[#ECB31D] text-[#31466F] px-6 py-3 rounded-full font-bold text-base hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#F5C940]/50">
                  <span className="flex items-center space-x-2">
                    <span>Start Application</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
                <button className="group bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-6 py-3 rounded-full font-bold text-base hover:bg-white/30 transition-all duration-300">
                  <span className="flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download Brochure</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className="sticky top-0 h-screen bg-white/80 backdrop-blur-lg shadow-xl border-r border-[#A8A8A8]/20 flex flex-col items-stretch z-40"
          style={{ minWidth: "200px", maxWidth: "220px" }}
        >
          <div className="p-4 border-b border-[#A8A8A8]/20">
            <h3 className="text-lg font-bold text-[#31466F]">Application</h3>
            <p className="text-sm text-[#13274D]/70">Navigation</p>
          </div>
          
          <div className="flex flex-col p-3 flex-grow">
            {[
              { id: 'process', label: 'Process', icon: Zap },
              { id: 'deadline', label: 'Deadlines', icon: Calendar },
              { id: 'requirements', label: 'Requirements', icon: Shield },
              { id: 'faqs', label: 'FAQs', icon: HelpCircle }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`group flex items-center space-x-3 py-3 px-4 my-1 rounded-lg transition-all duration-300
                  ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-[#31466F] to-[#13274D] text-white shadow-lg'
                      : 'text-[#31466F] hover:bg-gradient-to-r hover:from-[#F5C940]/20 hover:to-[#ECB31D]/20'
                  }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === id ? 'animate-pulse' : 'group-hover:scale-110'} transition-transform`} />
                <span className="font-bold text-sm">{label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-auto p-4 border-t border-[#A8A8A8]/20">
            <button className="w-full bg-gradient-to-r from-[#F5C940] to-[#ECB31D] text-[#31466F] py-2 px-4 rounded-lg font-bold text-sm hover:shadow-md transition-all">
              Apply Now
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="container mx-auto px-4 py-10">
            {/* Application Process */}
            {activeTab === 'process' && (
              <div className="space-y-12">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-[#31466F] to-[#13274D] bg-clip-text text-transparent mb-4">
                    Application Journey
                  </h2>
                  <p className="text-lg text-[#13274D] max-w-3xl mx-auto leading-relaxed">
                    Experience a seamless application process designed to showcase your potential
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {processSteps.map((item, index) => (
                    <div key={index} className="group relative">
                      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#A8A8A8]/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                        <div className="flex items-center mb-4">
                          <div className={`bg-gradient-to-r ${item.color} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}>
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-xs font-bold text-[#13274D] uppercase tracking-wide mb-1">Step {item.step}</div>
                            <h3 className="text-xl font-bold text-[#31466F]">{item.title}</h3>
                          </div>
                        </div>
                        <p className="text-[#13274D] text-base leading-relaxed">{item.description}</p>
                        <div className="mt-4 flex items-center text-[#31466F] font-semibold group-hover:text-[#13274D] transition-colors">
                          <span className="text-sm">Learn More</span>
                          <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#31466F] to-[#13274D] rounded-2xl"></div>
                  <div className="relative bg-gradient-to-r from-[#31466F] to-[#13274D] rounded-2xl p-8 text-white shadow-2xl">
                    <div className="text-center">
                      <Star className="w-12 h-12 mx-auto mb-4 animate-spin" />
                      <h3 className="text-2xl font-bold mb-4">Ready to Begin?</h3>
                      <p className="text-lg mb-6 text-[#D3D3D3]">
                        Join thousands of successful applicants
                      </p>
                      <button className="bg-white text-[#31466F] px-8 py-3 rounded-full font-bold text-base hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-white/50">
                        Start Your Application
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Deadlines */}
            {activeTab === 'deadline' && (
              <div className="space-y-12">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-[#F5C940] to-[#ECB31D] bg-clip-text text-transparent mb-4">
                    Important Dates
                  </h2>
                  <p className="text-lg text-[#13274D] max-w-3xl mx-auto">
                    Don't miss your chance - plan ahead with our deadline calendar
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { season: 'Fall', date: 'March 31', start: 'August 1', color: 'from-[#31466F] to-[#13274D]', icon: '🍂' },
                    { season: 'Spring', date: 'September 30', start: 'January 15', color: 'from-[#F5C940] to-[#ECB31D]', icon: '🌸' },
                    { season: 'Summer', date: 'January 31', start: 'May 1', color: 'from-[#31466F] to-[#0E183C]', icon: '☀️' }
                  ].map((semester, index) => (
                    <div key={index} className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-white to-[#F0F0F0] rounded-2xl shadow-xl"></div>
                      <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-[#A8A8A8]/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                        <div className="text-center">
                          <div className="text-4xl mb-3">{semester.icon}</div>
                          <h3 className="text-xl font-bold text-[#31466F] mb-2">{semester.season} Semester</h3>
                          <div className={`bg-gradient-to-r ${semester.color} rounded-xl p-4 mb-4`}>
                            <p className="text-white text-sm font-semibold mb-1">Application Deadline</p>
                            <p className="text-white text-2xl font-bold">{semester.date}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-center space-x-2 text-[#13274D]">
                              <Clock className="w-4 h-4" />
                              <span className="font-semibold text-sm">Classes begin: {semester.start}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-[#F5C940]/20 to-[#ECB31D]/20 border-2 border-[#F5C940] rounded-2xl p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#F5C940] rounded-full p-2">
                      <AlertTriangle className="w-6 h-6 text-[#31466F]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#31466F] mb-2">⚡ Priority Alert</h3>
                      <p className="text-[#31466F] text-base leading-relaxed">
                        Late applications incur additional fees. Apply early to secure your spot and avoid disappointment!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Requirements */}
            {activeTab === 'requirements' && (
              <div className="space-y-12">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-[#31466F] to-[#13274D] bg-clip-text text-transparent mb-4">
                    What You Need
                  </h2>
                  <p className="text-lg text-[#13274D] max-w-3xl mx-auto">
                    Your complete checklist for a successful application
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {requirements.map((req, index) => (
                    <div key={index} className="group relative h-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-white to-[#F0F0F0] rounded-2xl shadow-xl"></div>

                      <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-[#A8A8A8]/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">                      
                        <div className="text-center flex flex-col flex-grow">
                          <div className={`bg-gradient-to-r ${req.color} w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                            <req.icon className="w-8 h-8 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-[#31466F] mb-3">{req.title}</h3>
                          <p className="text-[#13274D] text-sm leading-relaxed flex-grow">{req.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-[#31466F] to-[#13274D] rounded-2xl p-8 text-white shadow-2xl">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Need Assistance?</h3>
                    <p className="text-lg mb-6 text-[#D3D3D3]">
                      Our expert team is ready to guide you through every step
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button 
                        onClick={() => window.location.href = '/contact'} 
                        className="group bg-white text-[#31466F] px-6 py-3 rounded-full font-bold text-base hover:scale-105 transition-all duration-300 shadow-xl"
                      >
                        <span className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>Email Support</span>
                        </span>
                      </button>
                      <button 
                        onClick={() => window.location.href = '/contact'} 
                        className="group bg-[#F5C940] text-[#31466F] px-6 py-3 rounded-full font-bold text-base hover:scale-105 transition-all duration-300 shadow-xl"
                      >
                        <span className="flex items-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Call Now</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQs */}
            {activeTab === 'faqs' && (
              <div className="space-y-12">
                <div className="text-center mb-10">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-[#31466F] to-[#13274D] bg-clip-text text-transparent mb-4">
                    Got Questions?
                  </h2>
                  <p className="text-lg text-[#13274D] max-w-3xl mx-auto">
                    Find instant answers to everything you need to know
                  </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="group bg-white rounded-2xl shadow-lg border border-[#A8A8A8]/20 overflow-hidden hover:shadow-xl transition-all duration-300">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gradient-to-r hover:from-[#F5C940]/20 hover:to-[#ECB31D]/20 transition-all duration-300"
                      >
                        <span className="font-bold text-[#31466F] text-base">{faq.question}</span>
                        <div className={`transform transition-transform duration-300 ${expandedFAQ === index ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5 text-[#31466F]" />
                        </div>
                      </button>
                      {expandedFAQ === index && (
                        <div className="px-6 pb-4 bg-gradient-to-r from-[#F5C940]/20 to-[#ECB31D]/20">
                          <p className="text-[#31466F] leading-relaxed text-base">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-[#31466F] to-[#13274D] rounded-2xl p-8 text-white shadow-2xl">
                  <div className="text-center">
                    <HelpCircle className="w-12 h-12 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
                    <p className="text-lg mb-6 text-[#D3D3D3]">
                      Our admissions experts are here to help you succeed
                    </p>
                    <button className="bg-white text-[#31466F] px-8 py-3 rounded-full font-bold text-base hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-white/50">
                      Contact Admissions Team
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;