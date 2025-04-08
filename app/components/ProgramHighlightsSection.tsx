"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";

interface ProgramItem {
  title: string;
  description: string;
  icon: string;
  image: string;
  color: string;
  bgColor: string;
}

const ProgramHighlightsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [failedImages] = useState<{[key: string]: boolean}>({});
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/site-config')
      .then(res => res.json())
      .then(data => {
        if (data.programs && Array.isArray(data.programs)) {
          setPrograms(data.programs);
        } else {
          // Fallback to default programs if none are configured
          setPrograms([
    {
      title: "Sosialisasi",
      description: "Kegiatan pengenalan HMTI kepada mahasiswa baru dan penyebaran informasi program kerja kepada seluruh anggota.",
      icon: "/icons/sosialisasi.svg", 
      image: "/images/program1.jpg",
      color: "from-blue-600 to-cyan-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "MUBES",
      description: "Musyawarah Besar sebagai forum tertinggi dalam pengambilan keputusan strategis dan pemilihan pengurus HMTI.",
      icon: "/icons/mubes.svg",
      image: "/images/program2.jpg",
      color: "from-indigo-600 to-blue-500",
      bgColor: "bg-indigo-50"
    },
    {
      title: "LDK",
      description: "Latihan Dasar Kepemimpinan untuk mengembangkan jiwa kepemimpinan, manajemen organisasi, dan soft skill anggota.",
      icon: "/icons/ldk.svg",
      image: "/images/program3.jpg",
      color: "from-cyan-500 to-teal-500",
      bgColor: "bg-cyan-50"
    },
    {
      title: "RAKER",
      description: "Rapat Kerja pengurus untuk merumuskan program kerja, evaluasi kegiatan, dan menyusun strategi organisasi.",
      icon: "/icons/raker.svg",
      image: "/images/program4.jpg",
      color: "from-teal-500 to-green-500",
      bgColor: "bg-teal-50"
    }
          ]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load program data:', err);
        // Fallback to empty array if fetch fails
        setPrograms([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section ref={ref} id="programs" className="py-28 bg-white relative">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} id="programs" className="py-28 bg-white relative">
      {/* Background Pattern removed */}
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block mb-4"
          >
            <span className="px-5 py-2 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">Program Kerja</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Program Utama <span className="text-blue-600">HMTI</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: "6rem" } : { opacity: 0, width: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 mx-auto bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mb-6"
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Kegiatan-kegiatan utama yang diselenggarakan untuk mengembangkan organisasi dan anggota HMTI
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.95 }}
              transition={{ 
                duration: 0.7, 
                delay: index * 0.15 + 0.5,
                ease: [0.215, 0.61, 0.355, 1] // cubic-bezier easing for smoother animation
              }}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              className={`${program.bgColor} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 group h-full flex flex-col`}
            >
              <div className="relative h-52 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gray-800 bg-opacity-20 z-10" />
                <div className={`absolute inset-0 opacity-90 bg-gradient-to-br ${program.color}`} style={{ mixBlendMode: 'multiply' }} />
                <Image
                  src={failedImages[program.image] ? "/images/program-placeholder.svg" : program.image}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Icon with animated background */}
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg group-hover:bg-blue-50 transition-colors duration-300 
                    border border-white/50">
                    <motion.div 
                      whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image src={program.icon} alt="" width={24} height={24} />
                    </motion.div>
                  </div>
                </div>
                
                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5 z-20">
                  <h3 className="text-2xl md:text-2xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                    {program.title}
                  </h3>
                  {program.title === "MUBES" && 
                    <span className="text-sm text-blue-200">Musyawarah Besar</span>
                  }
                  {program.title === "LDK" && 
                    <span className="text-sm text-blue-200">Latihan Dasar Kepemimpinan</span>
                  }
                  {program.title === "RAKER" && 
                    <span className="text-sm text-blue-200">Rapat Kerja</span>
                  }
                </div>
              </div>
              
              <motion.div 
                className="p-6 flex-grow"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-gray-700 leading-relaxed">{program.description}</p>
                <div className="mt-4 w-8 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full group-hover:w-12 transition-all duration-300"></div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramHighlightsSection;
