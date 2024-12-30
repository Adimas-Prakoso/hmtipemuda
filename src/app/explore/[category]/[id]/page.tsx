'use client'

import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import ReactMarkdown from 'react-markdown'

interface ItemDetail {
  title: string
  description: string
  date: string
  image: string
  category: string
  content: string
}

type ItemsData = {
  [key: string]: ItemDetail
}

// This would typically come from an API or database
const getItemDetails = (category: string, id: string): ItemDetail | null => {
  // Mock data - in a real app, this would fetch from an API
  const items: ItemsData = {
    'workshop-1': {
      title: 'Workshop React & Next.js',
      description: 'Belajar membangun aplikasi web modern dengan React dan Next.js bersama praktisi industri',
      date: '15 Januari 2024',
      image: '/images/workshop1.jpg',
      category: 'workshop',
      content: `
# Tentang Workshop

Workshop ini dirancang untuk membantu Anda memahami fundamental React dan Next.js, framework populer untuk membangun aplikasi web modern.

## Yang Akan Dipelajari

* Fundamental React & Hooks
* Server Side Rendering dengan Next.js
* Routing dan API Routes
* State Management
* Best Practices dan Tips

## Persyaratan

* Laptop dengan spesifikasi minimum
* Pengetahuan dasar JavaScript
* Text editor (VS Code direkomendasikan)
`
    },
    'berita-2': {
      title: 'HMTI Gelar Kompetisi Coding',
      description: 'Kompetisi coding tahunan untuk mahasiswa teknik informatika se-Indonesia',
      date: '20 Januari 2024',
      image: '/images/berita1.jpg',
      category: 'berita',
      content: `
# Kompetisi Coding HMTI 2024

HMTI kembali menggelar kompetisi coding tahunan yang ditujukan untuk mahasiswa teknik informatika se-Indonesia. Event ini merupakan ajang bergengsi yang telah sukses diselenggarakan selama 5 tahun berturut-turut.

## Kategori Lomba

* Web Development
* Mobile App Development
* Data Science
* Game Development

## Total Hadiah

Puluhan juta rupiah dan kesempatan magang di perusahaan teknologi terkemuka.
`
    },
    'acara-3': {
      title: 'Tech Talk: AI & Machine Learning',
      description: 'Diskusi mendalam tentang perkembangan AI dan Machine Learning terkini',
      date: '25 Januari 2024',
      image: '/images/acara1.jpg',
      category: 'acara',
      content: `
# Tech Talk: AI & Machine Learning

Bergabunglah dalam diskusi mendalam tentang perkembangan terkini di bidang Artificial Intelligence dan Machine Learning bersama para ahli dan praktisi industri.

## Topik Pembahasan

* Tren AI terkini
* Implementasi Machine Learning di industri
* Karir di bidang AI & ML
* Studi kasus dan demo

## Pembicara

* Dr. Budi Santoso - AI Researcher
* Rina Wijaya - ML Engineer at Tech Corp
* Ahmad Fadli - Data Scientist
`
    }
  }

  const key = `${category}-${id}`
  return items[key] || null
}

export default function ItemDetailPage() {
  const params = useParams()
  const router = useRouter()
  const item = getItemDetails(params.category as string, params.id as string)

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Item tidak ditemukan</h1>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="mb-8 flex items-center text-blue-600 hover:underline pt-10"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali
            </button>

            {/* Hero Image */}
            <div className="relative h-96 rounded-xl overflow-hidden mb-8">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 100vw"
                priority
              />
              <div className="absolute top-4 right-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium text-white
                  ${item.category === 'berita' ? 'bg-green-500' :
                    item.category === 'workshop' ? 'bg-blue-500' : 'bg-purple-500'}`}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-4">{item.title}</h1>
              <div className="flex items-center text-gray-500 mb-8">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {item.date}
              </div>
              <div className="prose prose-blue max-w-none text-black">
                <ReactMarkdown>{item.content}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}
