import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Tentang from './components/Tentang'
import VisiMisi from './components/VisiMisi'
import StrukturOrganisasi from './components/StrukturOrganisasi'
import Divisi from './components/Divisi'
import Kegiatan from './components/Kegiatan'
import News from './components/Berita'
import LocationMap from './components/LocationMap';
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-white">
      <Navbar />
      <Hero />
      <Tentang />
      <VisiMisi />
      <StrukturOrganisasi />
      <Divisi />
      <Kegiatan />
      <News />
      <LocationMap />
      <Footer />
    </main>
  );
}
