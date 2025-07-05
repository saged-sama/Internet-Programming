
import HeroSection from './components/HeroSection';
import AnnouncementsSection from './components/AnnouncementsSection';
import AcademicResourcesSection from './components/AcademicResourcesSection';
import EventsSection from './components/EventsSection';

/**
 * LandingPage component for the University of Dhaka CSE Department portal.
 * Displays the homepage with various sections including hero, announcements,
 * academic resources, and upcoming events.
 */
export default function LandingPage() {
  return (
<div>
      <HeroSection />
      <AnnouncementsSection />
      <AcademicResourcesSection />
      <EventsSection /></div>
  );
}
