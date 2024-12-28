'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

const newsItems = [
  {
    title: 'Workshop Cybersecurity',
    date: '15 Agustus 2023',
    description: 'HMTI mengadakan workshop cybersecurity dengan pembicara ahli dari industri.',
    image: '/news1.jpg',
  },
  {
    title: 'Hackathon HMTI 2023',
    date: '22 September 2023',
    description: 'Kompetisi coding 24 jam untuk mahasiswa IT se-Indonesia.',
    image: '/news2.jpg',
  },
  {
    title: 'Kunjungan Industri ke Google Indonesia',
    date: '5 Oktober 2023',
    description: 'Anggota HMTI berkesempatan mengunjungi kantor Google Indonesia.',
    image: '/news3.jpg',
  },
  {
    title: 'Seminar Artificial Intelligence',
    date: '18 November 2023',
    description: 'Seminar tentang perkembangan terbaru di bidang AI dan Machine Learning.',
    image: '/news4.jpg',
  },
]

export default function News() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="berita" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Berita Terkini
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {newsItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-blue-600 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.date}</p>
                <p className="text-gray-700">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

