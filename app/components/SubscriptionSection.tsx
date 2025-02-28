"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface FormData {
  email: string;
  whatsapp: string;
}

const SubscriptionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [formData, setFormData] = useState<FormData>({
    email: "",
    whatsapp: ""
  });
  const [errors, setErrors] = useState<{
    email?: string;
    whatsapp?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const validateForm = () => {
    const newErrors: {
      email?: string;
      whatsapp?: string;
    } = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    
    // WhatsApp validation
    if (!formData.whatsapp) {
      newErrors.whatsapp = "Nomor WhatsApp wajib diisi";
    } else if (!/^(^\+62|62|^08)(\d{3,4}-?){2}\d{3,4}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = "Format nomor WhatsApp tidak valid (gunakan format 08xx atau +62xx)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Terima kasih! Anda berhasil berlangganan untuk mendapatkan notifikasi event terbaru.",
        });
        // Reset form
        setFormData({ email: "", whatsapp: "" });
      } else {
        setSubmitStatus({
          success: false,
          message: data.error || "Terjadi kesalahan. Silakan coba lagi.",
        });
      }
    } catch {
      setSubmitStatus({
        success: false,
        message: "Terjadi kesalahan jaringan. Silakan coba lagi nanti.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={ref} id="subscribe" className="py-24 bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Column - Illustration */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-10 text-white flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-3xl font-bold mb-6">Tetap Terhubung</h3>
                <p className="mb-8 text-blue-50">
                  Dapatkan informasi terbaru seputar event dan kegiatan HMTI 
                  langsung ke email dan WhatsApp Anda.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-blue-500 p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p>Notifikasi event terbaru</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-500 p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p>Pengingat kegiatan</p>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-blue-500 p-2 rounded-full mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p>Materi & informasi eksklusif</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Form */}
            <div className="p-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Subscribe</h3>
                <p className="text-gray-600 mb-8">
                  Daftar sekarang untuk mendapatkan notifikasi event HMTI
                </p>

                {submitStatus && (
                  <div 
                    className={`p-4 mb-6 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="nama@email.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="tel"
                      id="whatsapp"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className={`block w-full px-4 py-3 border ${errors.whatsapp ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="08xxxxxxxxxx"
                    />
                    {errors.whatsapp && (
                      <p className="mt-1 text-sm text-red-600">{errors.whatsapp}</p>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                      Saya setuju menerima notifikasi event via email dan WhatsApp
                    </label>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex justify-center items-center px-6 py-3.5 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg transform transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Memproses...
                        </>
                      ) : "Subscribe"}
                    </button>
                  </div>
                </form>
                <p className="mt-4 text-xs text-gray-500 text-center">
                  Kami tidak akan mengirimkan spam. Anda dapat berhenti berlangganan kapan saja.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionSection;
