import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import themeClasses from '../../../lib/theme-utils';
import ImageSlider from './ImageSlider';
import landingImage from '../../../assets/photos/landing.jpg';

export default function HeroSection() {
  return (
    <div 
      className="relative bg-cover bg-center min-h-[600px] w-full mt-5"
      style={{ 
        backgroundImage: `url('${landingImage}')`,
      }}
    >
      {/* Rest of your component remains the same */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-13 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="mb-4 text-white font-bold text-4xl md:text-5xl">
              Department of Computer Science and Engineering
            </h1>
            <p className="mb-8 text-gray-200">
              University of Dhaka - A leading academic institution in Bangladesh
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className={themeClasses.primaryButton} asChild>
                <Link to="/directory">University Directory</Link>
              </Button>
              <Button variant="outline" size="lg" className={`${themeClasses.primaryGradient} border-white text-white hover:text-white`} asChild>
                <Link to="/events">Upcoming Events</Link>
              </Button>
            </div>
          </div>
          <div className={`hidden md:block relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg border-4 ${themeClasses.borderAccentYellow}`}>
            <ImageSlider />
          </div>
        </div>
      </div>
    </div>
  );
}
