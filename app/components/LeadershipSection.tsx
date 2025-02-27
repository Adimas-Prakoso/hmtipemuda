"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const LeadershipSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Leadership team data with image paths
  const leadershipTeam = [
    {
      name: "Ahmad Fauzi",
      position: "Ketua HMTI",
      department: "Kepemimpinan",
      imagePath: "/images/anggota/ahmad-fauzi.jpg",
    },
    {
      name: "Dina Aulia",
      position: "Wakil Ketua",
      department: "Kepemimpinan",
      imagePath: "/images/anggota/dina-aulia.jpg",
    },
    {
      name: "Rizky Pratama",
      position: "Sekretaris",
      department: "Kesekretariatan",
      imagePath: "/images/anggota/rizky-pratama.jpg",
    },
    {
      name: "Indah Permata",
      position: "Bendahara",
      department: "Keuangan",
      imagePath: "/images/anggota/indah-permata.jpg",
    },
  ];

  // Handle image load error just once per image
  const handleImageError = (imagePath: string) => {
    if (!failedImages[imagePath]) {
      setFailedImages(prev => ({...prev, [imagePath]: true}));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  return (
    <section ref={ref} id="leadership" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4"
          >
            Pengurus Organisasi
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Pengurus Inti <span className="text-blue-600">HMTI</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: "6rem" } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="h-1.5 mx-auto bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mb-6"
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto text-lg text-gray-600"
          >
            Mengenal lebih dekat para pengurus HMTI yang memimpin dan menjalankan 
            organisasi dengan penuh dedikasi dan semangat
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto"
        >
          {leadershipTeam.map((leader, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              whileHover={{ y: -8 }}
            >
              <div className="h-64 relative overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                {/* Show image if available, otherwise show initials */}
                {!failedImages[leader.imagePath] ? (
                  <Image
                    src={leader.imagePath}
                    alt={`Foto ${leader.name}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() => handleImageError(leader.imagePath)}
                    // Only try to load the image once
                    unoptimized={!!failedImages[leader.imagePath]} 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl font-bold text-blue-300 select-none">
                      {leader.name.charAt(0)}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm font-light">{leader.department}</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                <p className="text-blue-600 font-medium text-sm mb-4">{leader.position}</p>
                <div className="w-8 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Link 
            href="/anggota" 
            className="inline-flex items-center px-6 py-3.5 bg-blue-900 hover:bg-blue-800 text-white text-lg font-semibold rounded-lg shadow transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <span>Lihat Semua Anggota</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LeadershipSection;
