'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import { motion } from 'framer-motion'
import 'swiper/css'
import 'swiper/css/effect-fade'

export default function Hero() {
  const backgrounds = [
    '/hero-bg-1.jpg',
    '/hero-bg-2.jpg',
    '/hero-bg-3.jpg',
  ]

  return (
    <section className="relative h-screen">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="absolute inset-0"
      >
        {backgrounds.map((bg, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${bg})`,
                filter: 'brightness(0.6)',
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <motion.div
          className="text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold mb-4">Selamat Datang di HMTI Hastabrata</h1>
          <p className="text-xl mb-8">Memberdayakan Pemuda melalui Teknologi dan Inovasi</p>
          <motion.button
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Pelajari Lebih Lanjut
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

