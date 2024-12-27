'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

type DivisiId = 'it' | 'acara' | 'humas' | 'akademik'

interface DivisiCardProps {
  id: DivisiId
  nama: string
  deskripsi: string
  tugas: string[]
  ikon: string
  activeId: DivisiId | null
  onToggle: (id: DivisiId) => void
}

const DivisiCard = ({ id, nama, deskripsi, tugas, ikon, activeId, onToggle }: DivisiCardProps) => {
  const isExpanded = activeId === id

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <div className="p-6 cursor-pointer" onClick={() => onToggle(id)}>
        <div className="text-4xl mb-4">{ikon}</div>
        <h3 className="text-xl font-semibold text-blue-600 mb-2">{nama}</h3>
        <p className="text-gray-600 mb-4">{deskripsi}</p>
        <motion.div
          className="text-blue-500 font-medium"
          initial={false}
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          {isExpanded ? '▲' : '▼'}
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3 } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
            className="px-6 pb-6 overflow-hidden"
          >
            <h4 className="font-semibold mb-2">Tugas Utama:</h4>
            <ul className="list-disc list-inside space-y-1">
              {tugas.map((tugas, index) => (
                <li key={index} className="text-gray-700">{tugas}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Divisi() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [activeId, setActiveId] = useState<DivisiId | null>(null)

  const handleToggle = (id: DivisiId) => {
    setActiveId(activeId === id ? null : id)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <section id="divisi" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          className="text-4xl font-bold text-center text-blue-600 mb-12"
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
          <DivisiCard
            id="it"
            nama="Pengembangan IT"
            deskripsi="Mengembangkan solusi teknologi inovatif untuk mendukung kegiatan organisasi."
            tugas={[
              'Mengembangkan dan memelihara website HMTI',
              'Membuat aplikasi mobile untuk acara',
              'Memberikan dukungan teknis untuk divisi lain',
            ]}
            ikon="💻"
            activeId={activeId}
            onToggle={handleToggle}
          />
          <DivisiCard
            id="acara"
            nama="Acara & Program"
            deskripsi="Merancang dan mengeksekusi berbagai acara dan program untuk anggota HMTI."
            tugas={[
              'Menyelenggarakan workshop dan seminar teknologi',
              'Merencanakan dan melaksanakan konferensi IT tahunan',
              'Mengkoordinasikan acara sosial untuk anggota',
            ]}
            ikon="🎉"
            activeId={activeId}
            onToggle={handleToggle}
          />
          <DivisiCard
            id="humas"
            nama="Hubungan Masyarakat"
            deskripsi="Membangun dan memelihara hubungan dengan pihak eksternal dan internal."
            tugas={[
              'Mengelola akun media sosial',
              'Menjalin hubungan dengan organisasi eksternal',
              'Membuat materi promosi untuk acara',
            ]}
            ikon="🤝"
            activeId={activeId}
            onToggle={handleToggle}
          />
          <DivisiCard
            id="akademik"
            nama="Akademik"
            deskripsi="Mendukung pengembangan akademik anggota HMTI."
            tugas={[
              'Mengorganisir kelompok belajar dan sesi bimbingan',
              'Berkoordinasi dengan fakultas untuk dukungan akademik',
              'Memelihara perpustakaan sumber daya untuk anggota',
            ]}
            ikon="📚"
            activeId={activeId}
            onToggle={handleToggle}
          />
        </motion.div>
      </div>
    </section>
  )
}
