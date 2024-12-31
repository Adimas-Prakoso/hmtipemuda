'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ClientSelect from '@/components/ClientSelect'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

interface CampusOption {
  value: string
  label: string
}

const campusOptions: CampusOption[] = [
  { value: 'Kampus Rektorat', label: 'Kampus Rektorat' },
  { value: 'Kampus Bekasi', label: 'Kampus Bekasi' },
  { value: 'Kampus BSD', label: 'Kampus BSD' },
  { value: 'Kampus Cengkareng', label: 'Kampus Cengkareng' },
  { value: 'Kampus Cibitung', label: 'Kampus Cibitung' },
  { value: 'Kampus Ciledug', label: 'Kampus Ciledug' },
  { value: 'Kampus Cikarang', label: 'Kampus Cikarang' },
  { value: 'Kampus Ciputat', label: 'Kampus Ciputat' },
  { value: 'Kampus Dewi Sartika', label: 'Kampus Dewi Sartika' },
  { value: 'Kampus Fatmawati', label: 'Kampus Fatmawati' },
  { value: 'Kampus Jatiwaringin', label: 'Kampus Jatiwaringin' },
  { value: 'Kampus Kaliabang', label: 'Kampus Kaliabang' },
  { value: 'Kampus Kalimalang', label: 'Kampus Kalimalang' },
  { value: 'Kampus Kramat 98', label: 'Kampus Kramat 98' },
  { value: 'Kampus Margonda', label: 'Kampus Margonda' },
  { value: 'Kampus Pemuda', label: 'Kampus Pemuda' },
  { value: 'Kampus Salemba', label: 'Kampus Salemba' },
  { value: 'Kampus Slipi', label: 'Kampus Slipi' },
  { value: 'Kampus Tangerang', label: 'Kampus Tangerang' },
  { value: 'Kampus Bogor', label: 'Kampus Bogor' },
  { value: 'Kampus Cilebut', label: 'Kampus Cilebut' },
  { value: 'Kampus Cikampek', label: 'Kampus Cikampek' },
  { value: 'Kampus Karawang', label: 'Kampus Karawang' },
  { value: 'Kampus Pontianak', label: 'Kampus Pontianak' },
  { value: 'Kampus Purwokerto', label: 'Kampus Purwokerto' },
  { value: 'Kampus Sukabumi', label: 'Kampus Sukabumi' },
  { value: 'Kampus Solo', label: 'Kampus Solo' },
  { value: 'Kampus Tasikmalaya', label: 'Kampus Tasikmalaya' },
  { value: 'Kampus Tegal', label: 'Kampus Tegal' },
  { value: 'Kampus Yogyakarta', label: 'Kampus Yogyakarta' },
]

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    email: '',
    campus: '',
    address: '',
    phone: '',
    gender: '',
    semester: '',
    reason: '',
    password: '',
    confirmPassword: '',
  })
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setPhoto(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok')
      setLoading(false)
      return
    }

    if (!photo) {
      setError('Foto diri dengan background merah wajib diupload')
      setLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach((key) => {
        if (key !== 'confirmPassword') {
          formDataToSend.append(key, formData[key as keyof typeof formData])
        }
      })
      if (photo) {
        formDataToSend.append('photo', photo)
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formDataToSend,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat mendaftar')
      }

      router.push('/login?registered=true')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCampusChange = (selectedOption: CampusOption | null) => {
    setFormData(prev => ({
      ...prev,
      campus: selectedOption ? selectedOption.value : ''
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="bg-white rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="md:flex">
            {/* Left side - Form */}
            <div className="md:w-2/3 px-8 py-12 lg:px-12">
              <div className="flex items-center justify-center md:justify-start mb-8">
                <Image
                  src="/logo.png"
                  alt="Logo HMTI"
                  width={60}
                  height={60}
                  className="mr-4"
                />
                <h2 className="text-3xl font-bold text-gray-900">
                  Daftar Anggota Baru
                </h2>
              </div>

              <form onSubmit={handleSubmit} id="register-form" className="space-y-6">
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md" role="alert">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Jenis Kelamin
                    </label>
                    <select
                      name="gender"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Pilih Jenis Kelamin</option>
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Kelas
                    </label>
                    <input
                      type="text"
                      name="class"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      value={formData.class}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Semester
                    </label>
                    <select
                      name="semester"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      value={formData.semester}
                      onChange={handleChange}
                    >
                      <option value="">Pilih Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Asal Kampus
                    </label>
                    <ClientSelect<CampusOption>
                      instanceId="campus-select"
                      options={campusOptions}
                      value={campusOptions.find(option => option.value === formData.campus)}
                      onChange={handleCampusChange}
                      placeholder="Pilih Kampus"
                      required
                      className="mt-1"
                      classNames={{
                        control: (state) => 
                          'px-3 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm ' +
                          (state.isFocused ? 'border-blue-500 ring-1 ring-blue-500' : ''),
                        input: () => 'text-gray-900',
                        option: (state) => 
                          'px-3 py-2 text-gray-900 ' +
                          (state.isFocused ? 'bg-blue-50' : '') +
                          (state.isSelected ? 'bg-blue-100' : ''),
                        placeholder: () => 'text-gray-500',
                        singleValue: () => 'text-gray-900',
                      }}
                      styles={{
                        menu: (base) => ({
                          ...base,
                          color: '#111827', // text-gray-900
                        }),
                        option: (base) => ({
                          ...base,
                          color: '#111827', // text-gray-900
                        })
                      }}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Alamat
                    </label>
                    <textarea
                      name="address"
                      rows={3}
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Nomor Telepon
                    </label>
                    <PhoneInput
                      country={'id'}
                      value={formData.phone}
                      onChange={phone => setFormData(prev => ({ ...prev, phone }))}
                      inputClass="!w-full !px-3 !py-2 !text-gray-900 !bg-white !border !border-gray-300 !rounded-md !shadow-sm focus:!outline-none focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent"
                      containerClass="!mt-1 !w-full"
                      buttonClass="!border !border-gray-300 !rounded-l-md !px-3 !shadow-sm hover:!bg-gray-50"
                      dropdownClass="!shadow-lg !w-[300px]"
                      searchClass="!px-3 !py-2 !border-b !text-gray-900"
                      inputProps={{
                        required: true,
                        name: 'phone'
                      }}
                      disableSearchIcon={true}
                      enableSearch={true}
                      searchPlaceholder="Cari negara..."
                    />
                    <style jsx global>{`
                      .react-tel-input {
                        width: 100%;
                      }
                      .react-tel-input input {
                        width: 100% !important;
                        padding-left: 80px !important;
                        height: 42px !important;
                      }
                      .react-tel-input .selected-flag {
                        width: 42px !important;
                        padding: 0 0 0 5px !important;
                      }
                      .react-tel-input .country-list {
                        min-width: 300px !important;
                        margin-top: 1px;
                      }
                      .react-tel-input .country-list .country {
                        display: flex;
                        align-items: center;
                        padding: 10px 12px;
                      }
                      .react-tel-input .country-list .country .country-name {
                        color: #111827;
                        font-weight: 500;
                        margin-right: 6px;
                        min-width: 200px;
                      }
                      .react-tel-input .country-list .country .dial-code {
                        color: #3B82F6;
                      }
                      .react-tel-input .country-list .country .dial-code::before {
                        content: "(";
                      }
                      .react-tel-input .country-list .country .dial-code::after {
                        content: ")";
                      }
                      .react-tel-input .selected-flag:hover,
                      .react-tel-input .selected-flag:focus,
                      .react-tel-input .selected-flag.open {
                        background-color: transparent !important;
                      }
                      .react-tel-input .country-list .country:hover {
                        background-color: #F3F4F6;
                      }
                      .react-tel-input .country-list .country.highlight {
                        background-color: #EFF6FF;
                      }
                      .react-tel-input .search-box {
                        padding: 10px 12px;
                        border-bottom: 1px solid #E5E7EB;
                      }
                      .react-tel-input .search-box input[type="search"] {
                        width: 100%;
                        padding: 8px 12px;
                        border: 1px solid #E5E7EB;
                        border-radius: 6px;
                        font-size: 14px;
                        background-image: none !important;
                        color: #111827 !important;
                      }
                      .react-tel-input .search-box input[type="search"],
                      .react-tel-input .search-box input[type="search"]::placeholder,
                      .react-tel-input .search-box input[type="search"]::-webkit-input-placeholder,
                      .react-tel-input .search-box input[type="search"]::-moz-placeholder,
                      .react-tel-input .search-box input[type="search"]:-ms-input-placeholder,
                      .react-tel-input .search-box input[type="search"]::-ms-input-placeholder {
                        color: #111827 !important;
                      }
                      .react-tel-input .search-box input[type="search"] {
                        background-color: white !important;
                      }
                      .react-tel-input .search-box input:focus {
                        outline: none;
                        border-color: #3B82F6;
                        ring: 2px;
                        ring-color: #93C5FD;
                      }
                    `}</style>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Alasan Masuk HMTI
                    </label>
                    <textarea
                      name="reason"
                      rows={4}
                      required
                      placeholder="Ceritakan alasan kamu ingin bergabung dengan HMTI..."
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      value={formData.reason}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mt-6 hidden md:block">
                  <motion.button
                    type="submit"
                    form="register-form"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mendaftar...
                      </div>
                    ) : (
                      'Daftar Sekarang'
                    )}
                  </motion.button>
                </div>

                <div className="mt-4 text-center hidden md:block">
                  <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">
                    Sudah punya akun? Masuk di sini
                  </Link>
                </div>
              </form>
            </div>

            {/* Right side - Photo Upload */}
            <div className="md:w-1/3 bg-gray-50 px-8 py-12">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Foto Diri (Background Merah)
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-blue-500 transition-colors">
                    <div className="space-y-1 text-center">
                      {photoPreview ? (
                        <div className="relative">
                          <Image
                            src={photoPreview}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="mx-auto rounded-md object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setPhoto(null)
                              setPhotoPreview('')
                            }}
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 015.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="photo" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span>Upload foto</span>
                              <input
                                id="photo"
                                name="photo"
                                type="file"
                                accept="image/*"
                                required
                                className="sr-only"
                                onChange={handlePhotoChange}
                              />
                            </label>
                            <p className="pl-1">atau drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF sampai 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-md shadow-sm">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Ketentuan Foto:</h3>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Background warna merah</li>
                    <li>• Foto formal</li>
                    <li>• Maksimal ukuran 10MB</li>
                    <li>• Format PNG, JPG, atau GIF</li>
                  </ul>
                </div>

                <div className="block md:hidden">
                  <motion.button
                    type="submit"
                    form="register-form"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Mendaftar...
                      </div>
                    ) : (
                      'Daftar Sekarang'
                    )}
                  </motion.button>
                </div>

                <div className="text-center block md:hidden">
                  <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">
                    Sudah punya akun? Masuk di sini
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
