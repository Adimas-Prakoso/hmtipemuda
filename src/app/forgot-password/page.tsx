'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Mail, ArrowRight, Home } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.message || 'Terjadi kesalahan');
      }
    } catch (error: unknown) {
      setError('Terjadi kesalahan saat mengirim permintaan');
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white relative">
      {/* Mobile Logo Section */}
      <motion.div
        className="md:hidden w-full bg-blue-600 px-6 pt-12 pb-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <Image 
            src="/logo.png" 
            alt="HMTI Logo" 
            width={80} 
            height={80} 
            className="mx-auto mb-4 drop-shadow-lg" 
          />
          <h1 className="text-2xl font-bold text-white">HMTI Pemuda</h1>
        </div>
      </motion.div>

      {/* Desktop Left side */}
      <motion.div 
        className="hidden md:flex md:w-1/2 lg:w-[45%] xl:w-[40%] bg-gradient-to-br from-blue-600 to-blue-800 p-8 lg:p-12 items-center justify-center relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <motion.button
          className="absolute top-8 left-8 inline-flex items-center text-white/80 hover:text-white transition-colors duration-200"
          onClick={() => router.push('/')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ x: -5 }}
        >
          <Home className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Kembali ke Beranda</span>
        </motion.button>
        <div className="relative text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Image 
              src="/logo.png" 
              alt="HMTI Logo" 
              width={180}
              height={180}
              className="mx-auto mb-8 drop-shadow-2xl hover:scale-105 transition-transform duration-300" 
            />
          </motion.div>
          <motion.h1 
            className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            HMTI Pemuda
          </motion.h1>
          <motion.p 
            className="text-base lg:text-lg text-blue-100"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Reset password akun Anda
          </motion.p>
        </div>
      </motion.div>

      {/* Right side - Form */}
      <motion.div 
        className="w-full md:w-1/2 lg:w-[55%] xl:w-[60%] flex items-start md:items-center justify-center p-6 md:p-8 lg:p-12 bg-white"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md space-y-6">
          <motion.div 
            className="text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Lupa Password
            </h2>
            <p className="text-sm text-gray-600">
              {success 
                ? 'Instruksi reset password telah dikirim ke email Anda'
                : 'Masukkan email Anda untuk menerima instruksi reset password'}
            </p>
          </motion.div>

          <motion.form 
            className="mt-8 space-y-5"
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {!success && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 h-5 w-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors duration-200 text-sm"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <motion.div 
                className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            {success ? (
              <div className="space-y-4">
                <motion.div 
                  className="text-green-500 text-sm text-center bg-green-50 p-4 rounded-lg border border-green-100"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p>Email instruksi reset password telah dikirim.</p>
                  <p className="mt-1">Silakan cek inbox email Anda.</p>
                </motion.div>
                <motion.button
                  type="button"
                  className="w-full flex items-center justify-center py-2.5 px-4 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  onClick={() => router.push('/login')}
                  whileHover={{ x: -5 }}
                >
                  Kembali ke halaman login
                </motion.button>
              </div>
            ) : (
              <motion.button
                type="submit"
                className="group relative w-full flex items-center justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Kirim Instruksi
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </motion.button>
            )}
          </motion.form>

          {!success && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
                onClick={() => router.push('/login')}
              >
                Kembali ke halaman login
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
