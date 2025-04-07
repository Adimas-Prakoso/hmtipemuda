"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";

const CampusLocationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const contactInfo = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      ),
      title: "Alamat",
      content: "Jl. Kamal Raya No.18, RT.6/RW.3, Cengkareng Barat, Kecamatan Cengkareng, Kota Jakarta Barat, DKI Jakarta 11730",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
        </svg>
      ),
      title: "Kontak",
      content: "+62 21 5437-5700",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
      title: "Email",
      content: "info@bsi.ac.id",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
      title: "Jam Operasional",
      content: "Senin - Jumat: 08:00 - 16:00",
    },
  ];

  const transportOptions = [
    {
      title: "Transportasi Umum",
      options: [
        "Bus Transjakarta: Halte Kamal Raya (5 menit berjalan kaki)",
        "KRL Commuter Line: Stasiun Kalideres (15 menit dengan ojek online)",
        "Ojek Online: Tersedia di sekitar kampus"
      ]
    },
    {
      title: "Arah dari Landmark Terdekat",
      options: [
        "10 menit dari Mall Kalideres",
        "15 menit dari Terminal Kalideres",
        "25 menit dari Bandara Soekarno-Hatta"
      ]
    }
  ];

  return (
    <section ref={ref} id="lokasi" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4"
          >
            Lokasi Kampus
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Kampus <span className="text-blue-600">UBSI Pemuda</span>
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
            Lokasi strategis dan mudah dijangkau di Jakarta Barat
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Map column - takes 3/5 of the width on large screens */}
          <motion.div 
            className="lg:col-span-3 rounded-xl overflow-hidden shadow-lg h-[400px] md:h-[500px]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5399071854526!2d106.8840800114891!3d-6.192259360642775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f4eba2c078a3%3A0x3e10b38445474a73!2sUniversitas%20BSI%20Kampus%20Pemuda!5e0!3m2!1sid!2sid!4v1743989957653!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Kampus UBSI Pemuda"
              className="w-full h-full"
            />
          </motion.div>

          {/* Info column - takes 2/5 of the width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-700 p-2 rounded-md mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </span>
                Informasi Kontak
              </h3>
              
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 bg-blue-50 p-2 rounded-md text-blue-700 mr-3">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Transportation Options */}
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-700 p-2 rounded-md mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H18a1 1 0 001-1V5a1 1 0 00-1-1H3z" />
                  </svg>
                </span>
                Akses & Transportasi
              </h3>
              
              <div className="space-y-4">
                {transportOptions.map((category, index) => (
                  <div key={index} className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">{category.title}</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {category.options.map((option, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{option}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Direction Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex justify-center mt-6"
            >
              <Link 
                href="https://maps.google.com/maps/dir//Universitas+BSI+Kampus+Pemuda+Jl.+Kayu+Jati+V+No.2+RT.8%2FRW.5,+Rawamangun+Kec.+Pulo+Gadung,+Kota+Jakarta+Timur,+Daerah+Khusus+Ibukota+Jakarta+13220/@-6.1922647,106.8866603,16z/data=!4m5!4m4!1m0!1m2!1m1!1s0x2e69f4eba2c078a3:0x3e10b38445474a73" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
                </svg>
                Petunjuk Arah
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusLocationSection;
