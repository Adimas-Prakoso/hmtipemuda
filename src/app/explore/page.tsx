'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

interface CardItem {
  id: string
  title: string
  description: string
  date: string
  image: string
  category: 'berita' | 'workshop' | 'acara'
}

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const [activeFilter, setActiveFilter] = useState<'all' | 'berita' | 'workshop' | 'acara'>('all')

  // Update activeFilter when URL parameter changes
  useEffect(() => {
    const filter = searchParams.get('filter') as typeof activeFilter
    if (filter && ['berita', 'workshop', 'acara'].includes(filter)) {
      setActiveFilter(filter)
    } else {
      setActiveFilter('all')
    }
  }, [searchParams])

  const items: CardItem[] = [
    {
      id: '1',
      title: 'Workshop React & Next.js',
      description: 'Belajar membangun aplikasi web modern dengan React dan Next.js bersama praktisi industri',
      date: '15 Januari 2024',
      image: '/images/workshop1.jpg',
      category: 'workshop'
    },
    {
      id: '2',
      title: 'HMTI Gelar Kompetisi Coding',
      description: 'Kompetisi coding tahunan untuk mahasiswa teknik informatika se-Indonesia',
      date: '20 Januari 2024',
      image: '/images/berita1.jpg',
      category: 'berita'
    },
    {
      id: '3',
      title: 'Tech Talk: AI & Machine Learning',
      description: 'Diskusi mendalam tentang perkembangan AI dan Machine Learning terkini',
      date: '25 Januari 2024',
      image: '/images/acara1.jpg',
      category: 'acara'
    },
    // Add more items as needed
  ]

  const filteredItems = activeFilter === 'all' 
    ? items 
    : items.filter(item => item.category === activeFilter)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 pt-12">
            {['all', 'berita', 'workshop', 'acara'].map((filter, index) => (
              <motion.div
                key={filter}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={filter === 'all' ? '/explore' : `/explore?filter=${filter}`}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Link href={`/explore/${item.category}/${item.id}`} key={item.id}>
                <motion.div
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="relative h-48">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium text-white
                        ${item.category === 'berita' ? 'bg-green-500' :
                          item.category === 'workshop' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {item.date}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
