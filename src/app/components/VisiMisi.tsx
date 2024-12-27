'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function VisiMisi() {
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
    <section id="visi-misi" className="py-20 bg-white">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          className="text-3xl font-bold text-center text-blue-600 mb-12"
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          Visi & Misi
        </motion.h2>
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0 md:space-x-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div className="w-full md:w-1/2" variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Visi Kami</h3>
            <p className="text-lg">
              Menjadi organisasi mahasiswa terkemuka yang memberdayakan dan membina calon profesional TI masa depan, mendorong inovasi, kepemimpinan, dan tanggung jawab sosial.
            </p>
          </motion.div>
          <motion.div className="w-full md:w-1/2" variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Misi Kami</h3>
            <ul className="list-disc list-inside text-lg space-y-2">
              <li>Menyediakan kesempatan untuk pertumbuhan pribadi dan profesional</li>
              <li>Mendorong kolaborasi dan berbagi pengetahuan antar anggota</li>
              <li>Menyelenggarakan acara dan lokakarya untuk meningkatkan keterampilan teknis</li>
              <li>Membangun hubungan yang kuat dengan mitra industri dan alumni</li>
              <li>Berkontribusi pada masyarakat melalui inisiatif berbasis teknologi</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

