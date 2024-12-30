'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Home } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowVerification(true);
      } else {
        setError(data.message || 'Terjadi kesalahan saat login');
      }
    } catch (error: unknown) {
      setError('Terjadi kesalahan saat login');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard');
      } else {
        setError(data.message || 'Terjadi kesalahan saat verifikasi');
      }
    } catch (error: unknown) {
      setError('Terjadi kesalahan saat verifikasi');
      console.error('Verification error:', error);
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
            Selamat datang kembali di portal HMTI Pemuda
          </motion.p>
        </div>
      </motion.div>

      {/* Right side - Login form */}
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
              {showVerification ? 'Verifikasi Email' : 'Masuk'}
            </h2>
            <p className="text-sm text-gray-600">
              {showVerification 
                ? 'Masukkan kode verifikasi yang telah dikirim ke email Anda'
                : 'Masuk ke akun Anda untuk melanjutkan'}
            </p>
          </motion.div>

          {!showVerification ? (
            <motion.form 
              className="mt-8 space-y-5"
              onSubmit={handleLogin}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
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
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors duration-200 text-black text-sm"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 h-5 w-5" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors duration-200 text-black text-sm"
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                  >
                    Lupa Password?
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

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
                    Masuk
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.form 
              className="mt-8 space-y-5"
              onSubmit={handleVerification}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div>
                <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700">
                  Kode Verifikasi
                </label>
                <input
                  id="verification-code"
                  name="verification-code"
                  type="text"
                  required
                  maxLength={6}
                  className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg text-center text-3xl tracking-[1em] focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:bg-gray-50 transition-colors duration-200 font-mono text-sm"
                  placeholder="······"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                />
              </div>

              {error && (
                <motion.div 
                  className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-100"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="group relative w-full flex items-center justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                disabled={isLoading || verificationCode.length !== 6}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Verifikasi
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </motion.button>

              <p className="mt-2 text-sm text-gray-600 text-center">
                Tidak menerima kode? {' '}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-all duration-200"
                  onClick={handleLogin}
                  disabled={isLoading}
                >
                  Kirim ulang
                </button>
              </p>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
