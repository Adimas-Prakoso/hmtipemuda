import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Tentang from './components/Tentang'
import VisiMisi from './components/VisiMisi'
import StrukturOrganisasi from './components/StrukturOrganisasi'
import Divisi from './components/Divisi'
import Kegiatan from './components/Kegiatan'
import News from './components/Berita'
import LocationMap from './components/LocationMap'
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
      <section id="lokasi" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-12">Lokasi Kampus</h2>
          <div className="max-w-4xl mx-auto">
            <LocationMap latitude={-6.192258649131116} longitude={106.88666163697157} />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}

