'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white bg-opacity-90 shadow-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Image src="/logo.png" alt="Logo HMTI" width={50} height={50} />
            <span className="ml-2 text-xl font-bold text-blue-600">HMTI Pemuda</span>
          </motion.div>
          <div className="hidden md:flex items-center space-x-4">
            {['Tentang', 'Visi & Misi', 'Struktur', 'Divisi', 'Kegiatan'].map((item) => (
              <motion.div
                key={`nav-desktop-${item}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
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
            <motion.button
              className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Daftar
            </motion.button>
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-blue-600 hover:text-blue-800">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <motion.div
            className="mt-4 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {['Tentang', 'Visi & Misi', 'Organisasi', 'Divisi', 'Kegiatan'].map((item) => (
              <Link
                key={`nav-mobile-${item}`}
                href={`#${item.toLowerCase().replace(' & ', '-')}`}
                className="block py-2 text-blue-600 hover:text-blue-800"
                onClick={toggleMenu}
              >
                {item}
              </Link>
            ))}
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 mt-4">
              Masuk
            </button>
            <button className="w-full bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition duration-300 mt-2">
              Daftar
            </button>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}
