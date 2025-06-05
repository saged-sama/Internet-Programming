import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import Layout from '../../components/layout/Layout';
import { useState, useEffect } from 'react';

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    {
      url: "https://images.pexels.com/photos/13108628/pexels-photo-13108628.jpeg",
      alt: "University of Dhaka Campus"
    },
    {
      url: "https://images.unsplash.com/photo-1562774053-701939374585",
      alt: "Computer Science Lab"
    },
    {
      url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1",
      alt: "University Library"
    },
    {
      url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66",
      alt: "Graduation Ceremony"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-full w-full">
      {images.map((image, index) => (
        <div 
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={image.url} 
            alt={image.alt} 
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Navigation dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-[#ECB31D]' : 'bg-white bg-opacity-50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#13274D] to-[#31466F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Department of Computer Science and Engineering</h1>
              <p className="text-lg mb-8">University of Dhaka - A leading academic institution in Bangladesh</p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[#ECB31D] hover:bg-[#F5C940] text-[#13274D] font-medium" asChild>
                  <Link to="/directory">Faculty Directory</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-[#ECB31D] text-[#ECB31D] hover:bg-[#ECB31D] hover:text-[#13274D]" asChild>
                  <Link to="/events">Upcoming Events</Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative h-[400px] overflow-hidden rounded-lg shadow-lg border-4 border-[#ECB31D]">
              <ImageSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Announcements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#13274D]">Important Announcements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Fall 2025 Registration Now Open",
                date: "June 1, 2025",
                category: "Academic",
                description: "Registration for Fall 2025 semester is now open for CSE students. Please log in to the student portal to register for courses."
              },
              {
                title: "New Research Collaboration Opportunities",
                date: "May 28, 2025",
                category: "Research",
                description: "The department has established new research collaborations with leading international universities. Applications for joint research projects are now being accepted."
              },
              {
                title: "Lab Facility Updates",
                date: "May 25, 2025",
                category: "Facilities",
                description: "The Computer Systems Lab will be upgraded with new equipment from June 15 to June 30. Alternative lab spaces will be available during this period."
              }
            ].map((announcement, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-t-[#13274D] hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-flex items-center rounded-full bg-[#F5C940] bg-opacity-20 px-2.5 py-0.5 text-xs font-medium text-[#13274D]">
                    {announcement.category}
                  </span>
                  <span className="text-sm text-gray-500">{announcement.date}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#13274D]">{announcement.title}</h3>
                <p className="text-gray-600 mb-4">{announcement.description}</p>
                <Button variant="link" className="p-0 text-[#13274D] hover:text-[#31466F]" asChild>
                  <Link to="/notices">Read more</Link>
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" className="border-[#13274D] text-[#13274D] hover:bg-[#13274D] hover:text-white" asChild>
              <Link to="/notices">View All Notices</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#13274D]">Academic Resources</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                title: "Course Materials",
                icon: "📚",
                description: "Access syllabi, lecture notes, and resources",
                link: "/courses"
              },
              {
                title: "Research Papers",
                icon: "📝",
                description: "Browse departmental research publications",
                link: "/research"
              },
              {
                title: "Faculty Profiles",
                icon: "👨‍🏫",
                description: "Learn about our faculty members",
                link: "/directory"
              },
              {
                title: "Lab Schedules",
                icon: "💻",
                description: "View lab availability and schedules",
                link: "/labs"
              }
            ].map((link, index) => (
              <Link 
                key={index} 
                to={link.link} 
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md hover:border-[#ECB31D] transition-all text-center"
              >
                <div className="text-4xl mb-4 text-[#ECB31D]">{link.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-[#13274D]">{link.title}</h3>
                <p className="text-gray-600 text-sm">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#13274D]">Departmental Events</h2>
            <Button variant="outline" className="border-[#13274D] text-[#13274D] hover:bg-[#13274D] hover:text-white" asChild>
              <Link to="/events">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "CSE Orientation Day",
                date: "August 25, 2025",
                time: "9:00 AM - 12:00 PM",
                location: "CSE Auditorium",
                image: "https://placehold.co/300x200?text=CSE+Orientation"
              },
              {
                title: "Workshop: Modern Web Technologies",
                date: "June 15, 2025",
                time: "2:00 PM - 5:00 PM",
                location: "CSE Building, Lab 305",
                image: "https://placehold.co/300x200?text=Web+Workshop"
              },
              {
                title: "Annual CSE Research Symposium",
                date: "July 10-12, 2025",
                time: "All Day",
                location: "DU Conference Center",
                image: "https://placehold.co/300x200?text=CSE+Research"
              }
            ].map((event, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border-t-4 border-t-[#13274D] overflow-hidden hover:shadow-md transition-shadow">
                <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-[#13274D]">{event.title}</h3>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="w-4 h-4 mr-2 text-[#ECB31D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg className="w-4 h-4 mr-2 text-[#ECB31D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <svg className="w-4 h-4 mr-2 text-[#ECB31D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  <Button className="bg-[#13274D] hover:bg-[#31466F] text-white" asChild>
                    <Link to={`/events/${index + 1}`}>Register Now</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}