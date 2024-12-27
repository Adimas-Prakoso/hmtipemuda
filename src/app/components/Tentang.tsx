'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Tentang() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="tentang" className="py-20 bg-gradient-to-r from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center text-blue-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          ref={ref}
        >
          Tentang HMTI
        </motion.h2>
        <motion.p
          className="text-lg text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Himpunan Mahasiswa Teknologi Informasi (HMTI) adalah organisasi mahasiswa yang didedikasikan untuk mendorong pertumbuhan, inovasi, dan kepemimpinan di kalangan mahasiswa Teknologi Informasi. Kami berusaha menjembatani kesenjangan antara pengetahuan akademis dan aplikasi dunia nyata, mempersiapkan anggota kami untuk karir yang sukses di industri teknologi yang terus berkembang.
        </motion.p>
      </div>
    </section>
  )
}

