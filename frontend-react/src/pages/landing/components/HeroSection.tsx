import { Link } from 'react-router-dom';
import { Button } from '../../../components/ui/button';
import themeClasses from '../../../lib/theme-utils';
import ImageSlider from './ImageSlider';

export default function HeroSection() {
  return (
    <section className={themeClasses.primaryGradient}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="mb-4">
  Department of Computer Science and Engineering
</h1>
<p className="mb-8 text-muted-foreground">
  University of Dhaka - A leading academic institution in Bangladesh
</p>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" className={themeClasses.primaryButton} asChild>
            <Link to="/directory">Faculty Directory</Link>
          </Button>
          <Button variant="outline" size="lg" className={themeClasses.outlineButton} asChild>
            <Link to="/events">Upcoming Events</Link>
          </Button>
        </div>
      </div>
      <div className={`hidden md:block relative aspect-[4/3] overflow-hidden rounded-lg shadow-lg border-4 ${themeClasses.borderAccentYellow}`}>
        <ImageSlider />
      </div>
    </div>
  </div>
</section>
  );
}
