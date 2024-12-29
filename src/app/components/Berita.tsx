'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const newsItems = [
  {
    title: 'Lorem ipsum dolor sit amet',
    date: 'Example Date',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: '/news1.jpg',
  },
  {
    title: 'Dorem ipsum dolor sit amet',
    date: 'Example Date',
    description: 'Dorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: '/news2.jpg',
  },
  {
    title: 'Example ipsum dolor sit amet',
    date: 'Example Date',
    description: 'Example ipsum dolor sit amet, consectetur adipiscing elit.',
    image: '/news3.jpg',
  },
  {
    title: 'Lorem ipsum dolor sit amet',
    date: 'Example Date',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: '/news4.jpg',
  },
]

export default function News() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map((item) => (
        <motion.div
          key={item}
          className="bg-white rounded-lg shadow-md overflow-hidden"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-full h-48 bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  )

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
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newsItems.length === 0 ? (
              <motion.div
                className="col-span-full text-center py-8"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-600 text-lg">Tidak ada berita saat ini.</p>
              </motion.div>
            ) : (
              newsItems.map((item, index) => (
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
              ))
            )}
          </div>
        )}
      </div>
    </section>
  )
}
