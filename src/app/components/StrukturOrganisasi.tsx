'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const anggota = [
  { nama: 'Budi Santoso', jabatan: 'Ketua', gambar: '/anggota1.jpg' },
  { nama: 'Siti Rahayu', jabatan: 'Wakil Ketua', gambar: '/anggota2.jpg' },
  { nama: 'Agus Setiawan', jabatan: 'Sekretaris', gambar: '/anggota3.jpg' },
  { nama: 'Dewi Lestari', jabatan: 'Bendahara', gambar: '/anggota4.jpg' },
  { nama: 'Rudi Hermawan', jabatan: 'Kepala Divisi IT', gambar: '/anggota5.jpg' },
  { nama: 'Rina Wati', jabatan: 'Kepala Divisi Acara', gambar: '/anggota6.jpg' },
]

export default function StrukturOrganisasi() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="organisasi" className="py-20 bg-gradient-to-r from-blue-50 to-white">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          className="text-4xl font-bold text-center text-blue-600 mb-12"
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Struktur Organisasi
        </motion.h2>
        <motion.div
          className="flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <div className="w-px h-16 bg-blue-600"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {anggota.map((anggota, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-px h-16 bg-blue-600"></div>
                <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center transform transition-all duration-300 hover:shadow-xl">
                  <div className="relative w-32 h-32 mb-4 overflow-hidden rounded-full">
                    <Image
                      src={anggota.gambar}
                      alt={anggota.nama}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">{anggota.nama}</h3>
                  <p className="text-gray-600 text-center">{anggota.jabatan}</p>
                  <motion.div
                    className="mt-4 opacity-0 transition-opacity duration-300"
                    whileHover={{ opacity: 1 }}
                  >
                    <a
                      href="#"
                      className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
                    >
                      Lihat Profil
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

