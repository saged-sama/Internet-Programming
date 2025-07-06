import HeroSection from "./components/HeroSection";
import BigAchievements from "./components/BigAchievements";
import ProjectsShowcase from "./components/ProjectsShowcase";
import AwardsSection from "./components/AwardsSection";
import AnnouncementsSection from "./components/AnnouncementsSection";
import AcademicResourcesSection from "./components/AcademicResourcesSection";
import EventsSection from "./components/EventsSection";
import FeatureHighlights from "./components/FeatureHighlights";

/**
 * LandingPage component for the University of Dhaka CSE Department portal.
 * Displays the homepage with various sections including hero, big achievements,
 * projects showcase, awards, announcements, academic resources, and upcoming events.
 */
export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeatureHighlights />
      <BigAchievements />
      <ProjectsShowcase />
      <AwardsSection />
      <AnnouncementsSection />
      <AcademicResourcesSection />
      <EventsSection />
    </>
  );
}
