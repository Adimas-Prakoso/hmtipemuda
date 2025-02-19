'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center gap-3" aria-label="Home">
              <Image 
                src="/logo.png" 
                alt="Logo HMTI"
                width={120}
                height={40}
                className="h-10 w-auto"
                priority
              />
              <span className="text-blue-900 font-bold text-2xl tracking-tight">HMTI Pemuda</span>
            </Link>
          </div>

          {/* Desktop Navigation and Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link 
              href="/" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-900 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 ease-in-out"
              aria-current="page"
            >
              Beranda
            </Link>
            <Link 
              href="/about" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors duration-200"
            >
              Tentang
            </Link>
            <Link 
              href="/program" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors duration-200"
            >
              Program
            </Link>
            <Link 
              href="/contact" 
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-700 transition-colors duration-200"
            >
              Kontak
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-900 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 ease-in-out"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out"
            >
              Daftar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
              onClick={handleToggle}
            >
              <span className="sr-only">Buka menu utama</span>
              <motion.svg
                animate={isOpen ? "open" : "closed"}
                variants={{
                  open: { rotate: 180 },
                  closed: { rotate: 0 }
                }}
                transition={{ duration: 0.2 }}
                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </motion.svg>
              <motion.svg
                animate={isOpen ? "open" : "closed"}
                variants={{
                  open: { rotate: 180 },
                  closed: { rotate: 0 }
                }}
                transition={{ duration: 0.2 }}
                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </motion.svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
            id="mobile-menu"
          >
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pt-2 pb-3 space-y-1 border-t border-gray-200"
            >
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  href="/"
                  className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50"
                  aria-current="page"
                >
                  Beranda
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/about"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                >
                  Tentang
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link
                  href="/program"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                >
                  Program
                </Link>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  href="/contact"
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300"
                >
                  Kontak
                </Link>
              </motion.div>
              
              {/* Mobile Authentication Buttons */}
              <motion.div 
                className="pt-4 pb-3 border-t border-gray-200"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-center space-x-4">
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-base font-medium text-blue-900 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 ease-in-out"
                  >
                    Masuk
                  </Link>
                  <Link
                    href="/register"
                    className="block px-5 py-2.5 text-base font-medium text-white bg-blue-900 rounded-lg hover:bg-blue-800 hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 ease-in-out"
                  >
                    Daftar
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
