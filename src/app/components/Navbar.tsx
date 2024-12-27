'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white bg-opacity-90 shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Image src="/logo.png" alt="Logo HMTI" width={50} height={50} />
          <span className="ml-2 text-xl font-bold text-blue-600">HMTI Hastabrata</span>
        </motion.div>
        <div className="flex items-center space-x-4">
          {['Tentang', 'Visi & Misi', 'Organisasi', 'Divisi', 'Kegiatan'].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
            >
              <Link href={`#${item.toLowerCase().replace(' & ', '-')}`} className="text-blue-600 hover:text-blue-800">
                {item}
              </Link>
            </motion.div>
          ))}
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Masuk
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

