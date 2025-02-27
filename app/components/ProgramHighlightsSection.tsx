"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const ProgramHighlightsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const programs = [
    {
      title: "Workshop & Pelatihan",
      description: "Program pengembangan keterampilan teknis dan soft skill untuk mahasiswa TI melalui hands-on training.",
      icon: "/icons/workshop.svg", 
      image: "/images/program1.jpg",
      color: "from-blue-600 to-cyan-500"
    },
    {
      title: "Kompetisi IT",
      description: "Ajang untuk menguji dan mengembangkan kemampuan mahasiswa dalam berbagai bidang teknologi informasi.",
      icon: "/icons/competition.svg",
      image: "/images/program2.jpg",
      color: "from-indigo-600 to-blue-500"
    },
    {
      title: "Seminar & Webinar",
      description: "Menambah wawasan dari para ahli dan praktisi industri teknologi informasi terkini.",
      icon: "/icons/seminar.svg",
      image: "/images/program3.jpg",
      color: "from-cyan-500 to-teal-500"
    },
    {
      title: "Pengabdian Masyarakat",
      description: "Menerapkan ilmu teknologi informasi untuk membantu masyarakat dan lingkungan sekitar.",
      icon: "/icons/community.svg",
      image: "/images/program4.jpg",
      color: "from-teal-500 to-green-500"
    }
  ];

  return (
    <section ref={ref} id="programs" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Program Unggulan
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-24 h-1.5 mx-auto bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Berbagai kegiatan untuk mengembangkan potensi dan kreativitas mahasiswa Teknologi Informasi
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gray-800 bg-opacity-30 z-10" />
                <div className={`absolute inset-0 opacity-80 bg-gradient-to-br ${program.color}`} style={{ mixBlendMode: 'multiply' }} />
                <Image
                  src={program.image}
                  alt={program.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 z-20">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <Image src={program.icon} alt="" width={24} height={24} />
                  </div>
                </div>
              </div>
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">{program.title}</h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
              </div>
              <div className="px-6 pb-6 mt-auto">
                <Link 
                  href={`/program/${program.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900 group/link"
                >
                  <span>Pelajari Selengkapnya</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 ml-1 transition-transform duration-300 group-hover/link:translate-x-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-16 text-center"
        >
          <Link 
            href="/program" 
            className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-blue-800 to-blue-600 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-500 transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <span className="text-base font-semibold">Lihat Semua Program</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProgramHighlightsSection;
