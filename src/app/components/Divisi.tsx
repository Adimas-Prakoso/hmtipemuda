'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const divisi = [
  {
    nama: 'Ketua',
    deskripsi: 'Memimpin dan mengarahkan seluruh kegiatan organisasi untuk mencapai tujuan bersama.',
    tugas: [
      'Memimpin dan mengarahkan seluruh kegiatan himpunan.',
      'Membentuk struktur organisasi yang efektif.',
      'Membagi tugas dan tanggung jawab kepada seluruh pengurus.',
      'Menyelenggarakan rapat-rapat secara berkala.',
      'Membuat keputusan-keputusan strategis untuk kemajuan himpunan.',
      'Mengkoordinasikan seluruh kegiatan dan program kerja himpunan.',
      'Melakukan evaluasi terhadap seluruh kegiatan yang telah dilaksanakan.',
      'Membuat laporan pertanggungjawaban kepada anggota himpunan.',
    ],
    ikon: '👑',
  },
  {
    nama: 'Sekjen',
    deskripsi: 'Memberikan dukungan administratif dan menjadi tangan kanan ketua dalam menjalankan organisasi.',
    tugas: [
      'Memberikan dukungan administratif dan operasional kepada Ketua.',
      'Menggantikan peran Ketua dalam rapat atau acara tertentu jika Ketua berhalangan hadir.',
      'Menyusun dan mendokumentasikan surat-menyurat organisasi.',
      'Mengelola dan menyimpan arsip-arsip penting, seperti notulen rapat, proposal, dan laporan kegiatan.',
      'Mengelola penyebaran informasi dan komunikasi internal melalui grup chat, email, atau media komunikasi lainnya.',
    ],
    ikon: '📝',
  },
  {
    nama: 'Bendahara',
    deskripsi: 'Mengelola dan mengatur keuangan organisasi secara profesional dan transparan.',
    tugas: [
      'Mengelola dan mengatur seluruh pemasukan dan pengeluaran keuangan himpunan.',
      'Mencatat semua transaksi keuangan, baik pemasukan maupun pengeluaran, secara rinci dan teratur.',
      'Menyusun laporan pertanggungjawaban keuangan setelah setiap kegiatan selesai.',
      'Berkoordinasi dengan Ketua dan Sekretaris terkait alokasi dana dan perencanaan keuangan.',
      'Menyimpan semua bukti transaksi dan dokumen keuangan dengan rapi dan mudah diakses untuk keperluan audit atau evaluasi.',
    ],
    ikon: '💰',
  },
  {
    nama: 'PSDM',
    deskripsi: 'Mengembangkan potensi anggota dan menciptakan lingkungan organisasi yang kondusif.',
    tugas: [
      'Mengelola proses rekrutmen dan seleksi anggota baru, termasuk penyusunan kriteria dan mekanisme penerimaan.',
      'Merencanakan dan melaksanakan program sosialisasi untuk memperkenalkan anggota baru pada visi, misi, budaya, dan kegiatan himpunan.',
      'Menciptakan lingkungan yang kondusif dan suportif agar anggota merasa nyaman dan termotivasi untuk berkontribusi.',
      'Memberikan bimbingan dan konseling bagi anggota yang membutuhkan, terkait dengan pengembangan diri maupun permasalahan organisasi.',
    ],
    ikon: '🎯',
  },
  {
    nama: 'Litbang',
    deskripsi: 'Melakukan penelitian dan pengembangan untuk kemajuan organisasi.',
    tugas: [
      'Melakukan penelitian tentang topik tertentu yang relevan dengan bidang studi atau isu-isu terkini.',
      'Melakukan evaluasi terhadap program kerja dan kinerja organisasi.',
      'Melakukan riset untuk mengidentifikasi kebutuhan atau masalah yang ada di internal organisasi.',
      'Menyusun rekomendasi untuk perbaikan.',
      'Mempublikasikan hasil penelitian yang telah dilakukan, baik dalam bentuk jurnal, laporan, atau media lain.',
    ],
    ikon: '🔬',
  },
  {
    nama: 'Kominfo',
    deskripsi: 'Mengelola komunikasi dan informasi organisasi baik internal maupun eksternal.',
    tugas: [
      'Mengelola akun media sosial himpunan secara aktif.',
      'Membuat konten menarik (teks, gambar, video) yang relevan dengan kegiatan himpunan.',
      'Menyusun dan menyebarkan informasi terkait kegiatan himpunan (laporan kegiatan).',
      'Membuat dokumentasi kegiatan (foto, video) untuk keperluan arsip dan publikasi.',
      'Mendesain materi publikasi (flyer, banner, poster).',
      'Mengkoordinasikan kegiatan promosi himpunan.',
    ],
    ikon: '📱',
  },
]

export default function Divisi() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [expandedDivisi, setExpandedDivisi] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const handleDivisiClick = (index: number) => {
    setExpandedDivisi(expandedDivisi === index ? null : index)
  }

  return (
    <section id="divisi" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4" ref={ref}>
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          Divisi Kami
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {divisi.map((div, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl h-fit"
              variants={itemVariants}
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => handleDivisiClick(index)}
              >
                <div className="text-4xl mb-4">{div.ikon}</div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">{div.nama}</h3>
                <p className="text-gray-600 mb-4">{div.deskripsi}</p>
                <motion.div
                  className="text-blue-500 font-medium flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 mx-auto"
                  initial={false}
                  animate={{ 
                    rotate: expandedDivisi === index ? 180 : 0,
                    backgroundColor: expandedDivisi === index ? 'rgb(219 234 254)' : 'rgb(239 246 255)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.div>
              </div>
              <AnimatePresence mode="wait">
                {expandedDivisi === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <h4 className="font-semibold text-blue-600 mb-2">Tugas Utama:</h4>
                    <motion.ul
                      className="list-disc list-inside space-y-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {div.tugas.map((tugas, taskIndex) => (
                        <motion.li
                          key={taskIndex}
                          className="text-gray-700"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + taskIndex * 0.1 }}
                        >
                          {tugas}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
