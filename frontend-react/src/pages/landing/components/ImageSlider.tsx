import { useState, useEffect } from 'react';
import SliderDot from './SliderDot';
import sliderImages from '../../../assets/sliderImages.json';

interface Image {
  url: string;
  alt: string;
}

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full">
      {sliderImages.map((sliderImage: Image, index: number) => (
        <div 
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={sliderImage.url} 
            alt={sliderImage.alt} 
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      {/* Navigation dots */}
      <div className="absolute left-0 right-0 flex justify-center gap-3 pb-4">
        {sliderImages.map((_: Image, index: number) => (
          <SliderDot
            key={index}
            active={index === currentIndex}
            onClick={() => setCurrentIndex(index)}
            ariaLabel={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
