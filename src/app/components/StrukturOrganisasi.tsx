'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useInView } from 'react-intersection-observer'
import { useState } from 'react'

const anggota = [
  { 
    nama: 'Sandra Bagus Nugroho', 
    jabatan: 'Ketua HMTI Cabang Pemuda', 
    gambar: '/images/anggota/Sandra_Bagus_Nugroho.jpg' 
  },
  {
    nama: "Khalisa Salsabilah",
    jabatan: "Sekretaris 1 (BPH = SEKJEN)",
    gambar: "/images/anggota/Khalisa_Salsabilah.jpg"
  },
  {
    nama: "Galih Min Fadlil",
    jabatan: "Sekretaris 2 (BPH = SEKJEN)",
    gambar: "/images/anggota/Galih_Min_Fadlil.jpg"
  },
  {
    nama: "Aisyah Shinta Balqis",
    jabatan: "Bendahara 1 (BPH = BENDAHARA)",
    gambar: "/images/anggota/Aisyah_Shinta_Balqis.png"
  },
  {
    nama: "SALSABILLAH",
    jabatan: "Bendahara 2 (BPH = BENDAHARA)",
    gambar: "/images/anggota/SALSABILLAH.jpg"
  },
  {
    nama: "Muhammad Maulana",
    jabatan: "KADIV (Kominfo)",
    gambar: "/images/anggota/Muhammad_Maulana.png"
  },
  {
    nama: "Fendi Ferdiansyah",
    jabatan: "WAKADIV (Kominfo)",
    gambar: "/images/anggota/Fendi_Ferdiansyah.png"
  },
  {
    nama: "Adimas Prakoso",
    jabatan: "KADIV Litbang (Fullstack + App)",
    gambar: "/images/anggota/Adimas_Prakoso.png"
  },
  {
    nama: "Jestson Alberto Tumanggor",
    jabatan: "WAKADIV Litbang (Networking)",
    gambar: "/images/anggota/Jeston_Alberto_Tumanggor.png"
  },
  {
    nama: "Azril Ibnu Sabil",
    jabatan: "KADIV PSDM",
    gambar: "/images/anggota/Azril_Ibnu_Sabil.jpg"
  },
  {
    nama: "Ade Ikhsanudin Setiawan Wardhana",
    jabatan: "WAKADIV (PSDM)",
    gambar: "/images/anggota/Ade_Ikhsanudin_Setiawan_Wardhana.jpg"
  },
  {
    nama: "Eka Abidah Ardelia",
    jabatan: "KADIV HUMAS",
    gambar: "/images/anggota/Eka_Abidah_Ardelia.jpg"
  }
]

function ImageModal({ isOpen, onClose, image, nama }: { isOpen: boolean; onClose: () => void; image: string; nama: string }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="relative w-full h-[80vh]">
          <Image
            src={image}
            alt={nama}
            fill
            className="object-contain"
            sizes="(max-width: 1536px) 100vw, 1536px"
            priority
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
          <h3 className="text-xl font-bold">{nama}</h3>
        </div>
      </div>
    </div>
  );
}

export default function StrukturOrganisasi() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [selectedImage, setSelectedImage] = useState<{ image: string; nama: string } | null>(null);

  return (
    <section id="struktur-organisasi" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Struktur Organisasi</h2>
          <p className="text-gray-600">Tim kami yang berdedikasi untuk kemajuan HMTI</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {anggota.map((item, index) => (
            <motion.div
              key={item.nama}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300"
              onClick={() => setSelectedImage({ image: item.gambar, nama: item.nama })}
            >
              <div className="relative h-64">
                <Image
                  src={item.gambar}
                  alt={item.nama}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority={index < 4}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{item.nama}</h3>
                <p className="text-gray-600 text-sm">{item.jabatan}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          image={selectedImage?.image || ''}
          nama={selectedImage?.nama || ''}
        />
      </div>
    </section>
  )
}
