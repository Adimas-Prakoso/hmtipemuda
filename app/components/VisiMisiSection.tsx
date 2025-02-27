"use client";

import { motion } from "framer-motion";

const VisiMisiSection = () => {
  // Animation variants for content elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { 
            staggerChildren: 0.2,
            when: "beforeChildren"
          }
        }
      }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center w-full h-full overflow-y-auto md:overflow-visible py-4 pt-16 md:pt-20"
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden"
      }}
    >
      {/* Visi & Misi Content - Full width on mobile, half width on desktop */}
      <motion.div 
        variants={itemVariants}
        className="space-y-6 md:space-y-10 col-span-1 md:col-span-1 order-1 pt-16"
      >
        <div className="text-center md:text-left relative mt-4 md:mt-0">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Visi & Misi
          </h2>
          <div className="w-24 h-1.5 mx-auto md:mx-0 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"></div>
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-50 rounded-full opacity-70 blur-xl hidden md:block"></div>
        </div>
        
        <div className="space-y-6 md:space-y-10">
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-white to-blue-50 p-5 md:p-7 rounded-xl shadow-lg border border-blue-100 relative"
            style={{ willChange: "transform" }}
          >
            <div className="flex items-start mb-4">
              <div className="bg-blue-600 p-2 rounded-lg shadow-md mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-blue-600">Visi</h3>
            </div>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed pl-0 md:pl-12 italic font-medium">
              &ldquo;Menjadi wadah kolaboratif yang menginspirasi dan mengembangkan potensi mahasiswa Teknologi Informasi, 
              serta mencetak generasi unggul yang mampu berkontribusi dalam perkembangan teknologi di era digital.&rdquo;
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            className="bg-gradient-to-br from-white to-blue-50 p-5 md:p-7 rounded-xl shadow-lg border border-blue-100 relative"
            style={{ willChange: "transform" }}
          >
            <div className="flex items-start mb-4">
              <div className="bg-blue-600 p-2 rounded-lg shadow-md mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-blue-600">Misi</h3>
            </div>
            <ul className="text-gray-700 text-sm md:text-base list-none pl-0 md:pl-12 space-y-3 md:space-y-4">
              {[
                "Memfasilitasi pengembangan kemampuan akademik dan soft skill mahasiswa TI melalui seminar, workshop, dan pelatihan berkualitas.",
                "Membangun jaringan kerjasama dengan berbagai stakeholder untuk memperluas kesempatan bagi mahasiswa.",
                "Menciptakan lingkungan belajar yang kondusif dan inovatif untuk mendorong kreativitas dan pemecahan masalah.",
                "Membentuk karakter kepemimpinan dan profesionalisme pada setiap anggota himpunan.",
                "Berperan aktif dalam kegiatan pengabdian masyarakat untuk meningkatkan literasi teknologi di lingkungan sekitar."
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-3 mt-1 flex-shrink-0">
                    <div className="h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-600"></div>
                    </div>
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Nilai-Nilai Kami Card - Hidden on mobile, visible on desktop */}
      <motion.div 
        variants={itemVariants}
        className="hidden md:flex items-center justify-center order-2 mt-6 md:mt-0"
      >
        <div className="relative w-full max-w-sm md:max-w-md">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-500 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-white p-5 md:p-8 rounded-xl shadow-xl border border-blue-50">
            <div className="text-center mb-6 md:mb-8">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-3 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">Nilai-Nilai Kami</h3>
              <div className="w-12 h-1 mx-auto bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mt-2"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {[
                {
                  title: "Integritas",
                  desc: "Menjunjung tinggi kejujuran dan etika profesional",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )
                },
                {
                  title: "Inovasi",
                  desc: "Selalu mencari cara baru dan kreatif",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )
                },
                {
                  title: "Kolaborasi",
                  desc: "Bekerja sama untuk hasil yang lebih baik",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                },
                {
                  title: "Responsif",
                  desc: "Cepat beradaptasi dengan perubahan teknologi",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  className="text-center p-3 md:p-4 bg-gradient-to-br from-white to-blue-50 rounded-lg shadow-md border border-blue-50"
                >
                  <div className="mx-auto h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2 text-blue-600">
                    {item.icon}
                  </div>
                  <h4 className="font-semibold text-sm md:text-base text-blue-600">{item.title}</h4>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 italic">
                &quot;Komitmen kami adalah menghasilkan mahasiswa yang berkualitas dan berintegritas.&quot;
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default VisiMisiSection;
