import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';
import ProgramHighlightsSection from './components/ProgramHighlightsSection';

const slides = [
  { image: '/images/hero1.webp', alt: 'Image 1' },
  { image: '/images/hero2.webp', alt: 'Image 2' },
  // { image: '/images/hero3.webp', alt: 'Image 3' },
];

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection slides={slides} />
      <AboutSection />
      <ProgramHighlightsSection />
    </main>
  );
}
