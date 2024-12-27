'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import 'swiper/css'
import 'swiper/css/navigation'

const kegiatan = [
  {
    nama: 'Konferensi IT Tahunan',
    deskripsi: 'Acara dua hari yang menampilkan pembicara utama, workshop, dan kesempatan networking.',
    gambar: '/kegiatan1.jpg',
  },
  {
    nama: 'Hackathon',
    deskripsi: 'Kompetisi coding 24 jam untuk memecahkan masalah dunia nyata menggunakan teknologi.',
    gambar: '/kegiatan2.jpg',
  },
  {
    nama: 'Workshop Teknologi',
    deskripsi: 'Sesi hands-on rutin tentang berbagai teknologi dan bahasa pemrograman.',
    gambar: '/kegiatan3.jpg',
  },
  {
    nama: 'Kunjungan Industri',
    deskripsi: 'Kunjungan ke perusahaan teknologi terkemuka untuk mendapatkan wawasan industri.',
    gambar: '/kegiatan4.jpg',
  },
]

export default function Kegiatan() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="kegiatan" className="py-20 bg-gradient-to-r from-blue-50 to-white">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          className="text-3xl font-bold text-center text-blue-600 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Kegiatan Kami
        </motion.h2>
        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {kegiatan.map((kegiatan, index) => (
            <SwiperSlide key={index}>
              <motion.div
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Image
                  src={kegiatan.gambar}
                  alt={kegiatan.nama}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-blue-600 mb-2">{kegiatan.nama}</h3>
                  <p className="text-gray-700">{kegiatan.deskripsi}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

