import HeroSection from './components/HeroSection';
import Navbar from './components/Navbar';
import AboutSection from './components/AboutSection';

const slides = [
  { image: '/image1.jpg', alt: 'Image 1' },
  { image: '/image2.jpg', alt: 'Image 2' },
  { image: '/image3.jpg', alt: 'Image 3' },
];

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection slides={slides} />
      <AboutSection />
    </main>
  );
}
