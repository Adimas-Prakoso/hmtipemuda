'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import 'swiper/css'
import 'swiper/css/effect-fade'

export default function Hero() {
  const router = useRouter()
  const backgrounds = [
    '/images/hero1.jpg',
    '/images/hero2.jpg',
    '/images/hero3.jpg',
  ]

  return (
    <section className="relative h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="absolute inset-0 h-full w-full"
      >
        {backgrounds.map((bg, index) => (
          <SwiperSlide key={index} className="h-full w-full">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat brightness-[0.4]"
              style={{
                backgroundImage: `url(${bg})`,
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-20">
        <motion.div
          className="text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Selamat Datang di HMTI Hastabrata</h1>
          <p className="text-lg md:text-xl mb-8">Memberdayakan Pemuda melalui Teknologi dan Inovasi</p>
          <motion.button
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/explore')}
          >
            Pelajari Lebih Lanjut
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
