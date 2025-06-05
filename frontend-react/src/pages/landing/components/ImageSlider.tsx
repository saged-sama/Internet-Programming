import { useState, useEffect } from 'react';
import themeClasses from '../../../lib/theme-utils';

interface Image {
  url: string;
  alt: string;
}

const images: Image[] = [
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

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

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
            className={`w-3 h-3 rounded-full ${index === currentIndex ? themeClasses.bgAccentYellow : 'bg-white bg-opacity-50'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
