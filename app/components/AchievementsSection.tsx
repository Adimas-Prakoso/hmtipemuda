"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect, JSX } from "react";
import { useInView } from "framer-motion";

const AnimatedCounter = ({ value, title, icon }: { value: number; title: string; icon: JSX.Element }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef(null);
  const isInView = useInView(counterRef, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (isInView) {
      const duration = 2000; // 2 seconds
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;
      
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(value * progress);
        
        if (frame === totalFrames) {
          clearInterval(counter);
          setCount(value);
        } else {
          setCount(currentCount);
        }
      }, frameDuration);
      
      return () => clearInterval(counter);
    }
  }, [isInView, value]);
  
  return (
    <div ref={counterRef} className="flex flex-col items-center">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full p-4 mb-4 shadow-lg">
        {icon}
      </div>
      <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
        {count}
        {title.includes("Kegiatan") && <span>+</span>}
      </h3>
      <p className="text-gray-600 font-medium text-center">{title}</p>
    </div>
  );
};

const AchievementsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const stats = [
    {
      value: 250,
      title: "Anggota",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      )
    },
    {
      value: 45,
      title: "Kegiatan",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      value: 12,
      title: "Penghargaan",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    },
    {
      value: 3,
      title: "Tahun",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      )
    }
  ];
  
  const achievements = [
    {
      title: "Kompetisi Nasional",
      description: "Juara 1 dalam Kompetisi Pemrograman Nasional antar Universitas 2022",
      badge: "Prestasi",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      date: "Mei 2022"
    },
    {
      title: "Kolaborasi Industri",
      description: "Kerja sama dengan 5 perusahaan teknologi terkemuka untuk program magang mahasiswa",
      badge: "Kemitraan",
      color: "bg-gradient-to-r from-green-500 to-teal-500",
      date: "Agustus 2022"
    },
    {
      title: "Penghargaan Inovasi",
      description: "Penghargaan dari Kemenristekdikti untuk solusi teknologi inovatif",
      badge: "Penghargaan",
      color: "bg-gradient-to-r from-amber-500 to-orange-500",
      date: "November 2022"
    }
  ];
  
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
    hidden: { y: 30, opacity: 0 },
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
    <section ref={ref} id="achievements" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4"
          >
            Pencapaian Kami
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Prestasi & <span className="text-blue-600">Statistik</span>
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
            Berbagai pencapaian dan kontribusi kami dalam pengembangan 
            mahasiswa Teknologi Informasi dan kemajuan teknologi
          </motion.p>
        </div>
        
        {/* Statistics Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 max-w-6xl mx-auto mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <AnimatedCounter value={stat.value} title={stat.title} icon={stat.icon} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Achievements Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <div className="relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:to-blue-300 before:z-0">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative z-10 mb-8 last:mb-0"
              >
                <div className="md:flex items-center justify-between">
                  {/* Timeline element */}
                  <div className="flex items-center md:w-1/2 md:pr-10 md:text-right md:flex-row-reverse">
                    <div className="flex-shrink-0 mr-4 md:ml-4 md:mr-0">
                      <div className={`${achievement.color} w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="font-semibold text-gray-900">{achievement.date}</div>
                      <div className="text-sm text-gray-600">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${achievement.color} mr-2`}>
                          {achievement.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 md:w-1/2 md:ml-10 mt-3 md:mt-0">
                    <h4 className="font-bold text-xl text-gray-900 mb-1">{achievement.title}</h4>
                    <p className="text-gray-700">{achievement.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
