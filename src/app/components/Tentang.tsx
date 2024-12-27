'use client'

import Image from 'next/image'
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
          className="text-3xl font-bold text-center text-blue-600 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          ref={ref}
        >
          Tentang HMTI
        </motion.h2>
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start max-w-7xl mx-auto">
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full aspect-[10/10] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/tentang-hmti.jpg"
                alt="HMTI Activities"
                fill
                className="object-cover transform hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </motion.div>
          <div className="w-full lg:w-1/2 space-y-6">
            <motion.p
              className="text-lg text-justify text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Himpunan Mahasiswa Teknologi Informasi (HMTI) adalah wadah aspirasi dan pelayanan bagi mahasiswa Jurusan Teknologi Informasi. HMTI didirikan pada tanggal 02 Februari 2020 bertempat di Jakarta. Himpunan Mahasiswa Teknologi Informasi terbentuk dengan dilatar belakangi oleh kebutuhan mahasiswa program studi Teknologi Informasi untuk terciptanya lingkungan yang mendukung pengembangan skill mahasiswa pada program studi tersebut sebagai calon teknisi dan akademisi aktif yang akan turun ke tengah-tengah masyarakat.
            </motion.p>
            <motion.p
              className="text-lg text-justify text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Terbentuknya HMTI adalah sebagai salah satu wadah organisasi yang sangat dibutuhkan oleh seluruh mahasiswa Teknologi Informasi Universitas Bina Sarana Informatika untuk mencurahkan ide-ide brilian dan mengembangkan kemampuan mereka dalam menguasai materi-materi informatika, dan mengembangkan kreativitas yang tidak hanya bersifat teoritis, sehingga mereka menjadi akademisi yang profesional dan patut diteladani.
            </motion.p>
            <motion.p
              className="text-lg text-justify text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Memperhatikan realita kemampuan mahasiswa dalam mengelola kepribadian serta kemampuan intelektual dalam sisi akademisi aktif dilingkungan perkuliahan, baik dalam segi teknisi informasi, berkomunikasi atau public speaking dan lain-lain, maka dari itu dengan keinginan luhur dan dukungan dari seluruh mahasiswa Teknologi Informasi Universitas Bina Sarana Informatika memutuskan satu kesepakatan untuk membentuk sebuah organisasi yang bernama HMTI sebagai wadah diskusi mahasiswa Teknologi Informasi dan pengembangan softskill secara produktif.
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}

