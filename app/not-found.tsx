"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-8 text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              404
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="mb-6 text-3xl font-semibold text-white">
              Oops! Halaman tidak ditemukan
            </h2>
            
            <p className="mb-8 text-gray-300">
              Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
              tabIndex={0}
              aria-label="Kembali ke Beranda"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              Kembali ke Beranda
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
