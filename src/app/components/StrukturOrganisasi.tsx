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
        staggerChildren: 0.1,
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
          className="text-3xl font-bold text-center text-blue-600 mb-12"
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
              <motion.div key={index} className="flex flex-col items-center" variants={itemVariants}>
                <div className="w-px h-16 bg-blue-600"></div>
                <motion.div
                  className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Image
                    src={anggota.gambar}
                    alt={anggota.nama}
                    width={100}
                    height={100}
                    className="rounded-full mb-4"
                  />
                  <h3 className="text-xl font-semibold text-blue-600">{anggota.nama}</h3>
                  <p className="text-gray-600">{anggota.jabatan}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )}

Selanjutnya, mari kita perbarui komponen Divisi:

```tsx file="app/components/Divisi.tsx"
'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import 'swiper/css'
import 'swiper/css/navigation'

const divisi = [
  {
    nama: 'Pengembangan IT',
    tugas: [
      'Mengembangkan dan memelihara website HMTI',
      'Membuat aplikasi mobile untuk acara',
      'Memberikan dukungan teknis untuk divisi lain',
    ],
  },
  {
    nama: 'Acara & Program',
    tugas: [
      'Menyelenggarakan workshop dan seminar teknologi',
      'Merencanakan dan melaksanakan konferensi IT tahunan',
      'Mengkoordinasikan acara sosial untuk anggota',
    ],
  },
  {
    nama: 'Hubungan Masyarakat',
    tugas: [
      'Mengelola akun media sosial',
      'Menjalin hubungan dengan organisasi eksternal',
      'Membuat materi promosi untuk acara',
    ],
  },
  {
    nama: 'Akademik',
    tugas: [
      'Mengorganisir kelompok belajar dan sesi bimbingan',
      'Berkoordinasi dengan fakultas untuk dukungan akademik',
      'Memelihara perpustakaan sumber daya untuk anggota',
    ],
  },
]

export default function Divisi() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="divisi" className="py-20 bg-white">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          className="text-3xl font-bold text-center text-blue-600 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Divisi Kami
        </motion.h2>
        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {divisi.map((divisi, index) => (
            <SwiperSlide key={index}>
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-md p-6 h-full"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-4">{divisi.nama}</h3>
                <ul className="list-disc list-inside space-y-2">
                  {divisi.tugas.map((tugas, taskIndex) => (
                    <li key={taskIndex} className="text-gray-700">{tugas}</li>
                  ))}
                </ul>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

