'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const divisi = [
  {
    nama: 'Pengembangan IT',
    deskripsi: 'Mengembangkan solusi teknologi inovatif untuk mendukung kegiatan organisasi.',
    tugas: [
      'Mengembangkan dan memelihara website HMTI',
      'Membuat aplikasi mobile untuk acara',
      'Memberikan dukungan teknis untuk divisi lain',
    ],
    ikon: '💻',
  },
  {
    nama: 'Acara & Program',
    deskripsi: 'Merancang dan mengeksekusi berbagai acara dan program untuk anggota HMTI.',
    tugas: [
      'Menyelenggarakan workshop dan seminar teknologi',
      'Merencanakan dan melaksanakan konferensi IT tahunan',
      'Mengkoordinasikan acara sosial untuk anggota',
    ],
    ikon: '🎉',
  },
  {
    nama: 'Hubungan Masyarakat',
    deskripsi: 'Membangun dan memelihara hubungan dengan pihak eksternal dan internal.',
    tugas: [
      'Mengelola akun media sosial',
      'Menjalin hubungan dengan organisasi eksternal',
      'Membuat materi promosi untuk acara',
    ],
    ikon: '🤝',
  },
  {
    nama: 'Akademik',
    deskripsi: 'Mendukung pengembangan akademik anggota HMTI.',
    tugas: [
      'Mengorganisir kelompok belajar dan sesi bimbingan',
      'Berkoordinasi dengan fakultas untuk dukungan akademik',
      'Memelihara perpustakaan sumber daya untuk anggota',
    ],
    ikon: '📚',
  },
]

export default function Divisi() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [expandedDivisi, setExpandedDivisi] = useState<number | null>(null)

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

  const handleDivisiClick = (index: number) => {
    setExpandedDivisi(expandedDivisi === index ? null : index)
  }

  return (
    <section id="divisi" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Divisi Kami
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {divisi.map((div, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl"
              variants={itemVariants}
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => handleDivisiClick(index)}
              >
                <div className="text-4xl mb-4">{div.ikon}</div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">{div.nama}</h3>
                <p className="text-gray-600 mb-4">{div.deskripsi}</p>
                <motion.div
                  className="text-blue-500 font-medium flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 mx-auto"
                  initial={false}
                  animate={{ 
                    rotate: expandedDivisi === index ? 180 : 0,
                    backgroundColor: expandedDivisi === index ? 'rgb(219 234 254)' : 'rgb(239 246 255)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.div>
              </div>
              <AnimatePresence mode="wait">
                {expandedDivisi === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <h4 className="font-semibold text-blue-600 mb-2">Tugas Utama:</h4>
                    <motion.ul
                      className="list-disc list-inside space-y-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {div.tugas.map((tugas, taskIndex) => (
                        <motion.li
                          key={taskIndex}
                          className="text-gray-700"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + taskIndex * 0.1 }}
                        >
                          {tugas}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

