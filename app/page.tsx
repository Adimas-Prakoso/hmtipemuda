import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import ProgramHighlightsSection from './components/ProgramHighlightsSection';
import LeadershipSection from './components/LeadershipSection';
import AchievementsSection from './components/AchievementsSection';
import UpcomingEventsSection from './components/UpcomingEventsSection';
import CampusLocationSection from './components/CampusLocationSection';
import SubscriptionSection from './components/SubscriptionSection';
import siteData from '@/data/site.json';

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection slides={siteData.slides} />
      <AboutSection />
      <ProgramHighlightsSection />
      <LeadershipSection />
      <AchievementsSection />
      <UpcomingEventsSection />
      <CampusLocationSection />
      <SubscriptionSection />
    </main>
  );
}