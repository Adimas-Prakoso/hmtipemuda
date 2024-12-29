'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const kegiatan = [
  {
    nama: 'Sosialisasi',
    deskripsi: 'Mengadakan rapat sosialisasi tentang kegiatan himpunan.',
    gambar: '/images/sosialisasi.jpg',
  },
  {
    nama: 'Open Recruitment',
    deskripsi: 'Membuka kesempatan untuk bergabung dengan himpunan.',
    gambar: '/images/recruitment.jpg',
  },
  {
    nama: 'MUBES (Musyawarah Besar)',
    deskripsi: 'Forum terbuka untuk membahas dan menentukan arah kebijakan himpunan.',
    gambar: '/images/musyawarah.jpg',
  },
  {
    nama: 'LDK (Latihan Dasar Kepemimpinan)',
    deskripsi: 'Kegiatan outdoor untuk membangun teamwork dan meningkatkan kemampuan kepemimpinan.',
    gambar: '/images/ldk.jpg',
  },
  {
    nama: 'Raker',
    deskripsi: 'Rapat kerja untuk membahas dan menentukan program kerja himpunan.',
    gambar: '/images/raker.jpg',
  },
  
]

export default function Kegiatan() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="kegiatan" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Kegiatan Kami
        </motion.h2>
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-blue-600',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
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
            <div className="hidden md:block">
              <button className="swiper-button-prev !w-10 !h-10 !bg-white !shadow-lg !rounded-full !text-blue-600 hover:!bg-blue-50 transition-colors after:!text-xl group">
                <ChevronLeft className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:text-blue-700" />
              </button>
              <button className="swiper-button-next !w-10 !h-10 !bg-white !shadow-lg !rounded-full !text-blue-600 hover:!bg-blue-50 transition-colors after:!text-xl group">
                <ChevronRight className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:text-blue-700" />
              </button>
            </div>
          </Swiper>
        </div>
      </div>
    </section>
  )
}
