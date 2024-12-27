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
            <p className="text-lg text-black">
            Menjadikan HMTI sebagai wadah aspirasi dan pelayanan demi mewujudkan mahasiswa teknologi informasi yang aktif, kreatif, kompetitif, bertanggungjawab, dan berwawasan luas agar mampu bersaing dalam perkembangan teknologi.
            </p>
          </motion.div>
          <motion.div className="w-full md:w-1/2" variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Misi Kami</h3>
            <ul className="list-disc list-inside text-black text-lg space-y-2">
              <li>Meningkatkan kontribusi HMTI kepada lingkungan kampus serta masyarakat luas terutama dibidang Teknologi Informasi.</li>
              <li>Menciptakan prestasi atau akademisi yang kreatif dan inovatif dari berbagai aspek, baik akademik ataupun non akademik.</li>
              <li>Menanamkan sikap disiplin dan bertanggung jawab dalam berorganisasi kepada setiap anggota.</li>
              <li>Menciptakan ikatan yang kuat dan rasa memiliki terhadap himpunan serta menjadikan HMTI sebagai keluarga.</li>
              <li>Menjalin hubungan baik dan kerja sama dengan organisasi mahasiswa lainnya serta menjaga nama baik himpunan dan almamater.</li>
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

