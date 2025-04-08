"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// Countdown timer component
const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };
    
    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [targetDate]);
  
  return (
    <div className="flex justify-center gap-2 sm:gap-3 text-center">
      <div className="bg-white rounded-lg shadow-sm px-2 py-1 sm:px-3 sm:py-2 min-w-[40px] sm:min-w-[50px]">
        <div className="font-bold text-lg sm:text-xl text-blue-600">{timeLeft.days}</div>
        <div className="text-xs text-gray-500">Hari</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm px-2 py-1 sm:px-3 sm:py-2 min-w-[40px] sm:min-w-[50px]">
        <div className="font-bold text-lg sm:text-xl text-blue-600">{timeLeft.hours}</div>
        <div className="text-xs text-gray-500">Jam</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm px-2 py-1 sm:px-3 sm:py-2 min-w-[40px] sm:min-w-[50px]">
        <div className="font-bold text-lg sm:text-xl text-blue-600">{timeLeft.minutes}</div>
        <div className="text-xs text-gray-500">Menit</div>
      </div>
      <div className="bg-white rounded-lg shadow-sm px-2 py-1 sm:px-3 sm:py-2 min-w-[40px] sm:min-w-[50px]">
        <div className="font-bold text-lg sm:text-xl text-blue-600">{timeLeft.seconds}</div>
        <div className="text-xs text-gray-500">Detik</div>
      </div>
    </div>
  );
};

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { DetailedEventType } from "../../../data/types";

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<DetailedEventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (params.id) {
      const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
      
      // Fetch event data from API
      async function fetchEventData() {
        try {
          const response = await fetch('/api/events');
          
          if (!response.ok) {
            throw new Error('Failed to fetch events');
          }
          
          const data = await response.json();
          
          // Find the event in the events array
          const basicEvent = data.events?.find((e: { id: string }) => e.id === eventId);
          
          // Get detailed event data
          const detailedEventData = data.detailedEvents?.[eventId];
          
          if (detailedEventData) {
            setEvent(detailedEventData);
          } else if (basicEvent) {
            // If we only have basic event data, use that
            setEvent(basicEvent);
          }
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching event data:', error);
          setLoading(false);
        }
      }
      
      fetchEventData();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Event Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">Maaf, event yang Anda cari tidak tersedia.</p>
            <Link 
              href="/events"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Kembali ke Daftar Event
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isRegistrationOpen = new Date() < new Date(event.registrationDeadline);
  const isFull = event.currentParticipants >= event.maxParticipants;
  const registrationDeadlineDate = new Date(event.registrationDeadline);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mt-20">
              <div className="flex items-center gap-2 text-blue-100 mb-4">
                <Link href="/events" className="hover:text-white transition-colors">
                  Events
                </Link>
                <span>/</span>
                <span>{event.category}</span>
              </div>
              
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
              >
                {event.title}
              </motion.h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {eventDate.toLocaleDateString('id-ID', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="bg-blue-800 bg-opacity-50 rounded-lg px-4 py-3 text-center">
                  <div className="text-sm text-blue-100">Peserta</div>
                  <div className="font-bold text-lg">{event.currentParticipants}/{event.maxParticipants}</div>
                </div>
                <div className="bg-blue-800 bg-opacity-50 rounded-lg px-4 py-3 text-center">
                  <div className="text-sm text-blue-100">Deadline Pendaftaran</div>
                  <div className="font-bold text-lg">
                    {registrationDeadlineDate.toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'short'
                    })}
                  </div>
                </div>
                <div className="bg-blue-800 bg-opacity-50 rounded-lg px-4 py-3 text-center">
                  <div className="text-sm text-blue-100">Biaya</div>
                  <div className="font-bold text-lg">
                    {typeof event.price === 'number' 
                      ? `Rp ${event.price.toLocaleString('id-ID')}`
                      : event.price}
                  </div>
                </div>
              </div>
              
              {/* Countdown Timer */}
              {isRegistrationOpen && (
                <div className="mt-6 bg-blue-800 bg-opacity-30 rounded-lg p-4">
                  <div className="text-center text-white mb-3">
                    <div className="text-sm font-medium">Pendaftaran ditutup dalam:</div>
                  </div>
                  <CountdownTimer targetDate={registrationDeadlineDate} />
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Content Section */}
        <section className="py-8 sm:py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                {/* Tabs */}
                <div className="flex overflow-x-auto border-b">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-4 py-3 font-medium text-sm sm:text-base whitespace-nowrap ${
                      activeTab === "overview"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("agenda")}
                    className={`px-4 py-3 font-medium text-sm sm:text-base whitespace-nowrap ${
                      activeTab === "agenda"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Agenda
                  </button>
                  <button
                    onClick={() => setActiveTab("speakers")}
                    className={`px-4 py-3 font-medium text-sm sm:text-base whitespace-nowrap ${
                      activeTab === "speakers"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Pembicara
                  </button>
                  <button
                    onClick={() => setActiveTab("faq")}
                    className={`px-4 py-3 font-medium text-sm sm:text-base whitespace-nowrap ${
                      activeTab === "faq"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    FAQ
                  </button>
                </div>
                
                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "overview" && (
                    <div>
                      {/* Image Gallery */}
                      {event.images && event.images.length > 0 && (
                        <div className="mb-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {event.images.map((image, index) => (
                              <div key={index} className="relative rounded-lg overflow-hidden h-64 shadow-md">
                                <Image
                                  src={image.startsWith('http') ? image : image.startsWith('/') ? image : `/${image}`}
                                  alt={`${event.title} - Gambar ${index + 1}`}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  className="object-cover"
                                  priority={index === 0}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Event</h2>
                      <p className="text-gray-700 mb-6 whitespace-pre-line">{event.description}</p>
                      
                      {event.prerequisites && event.prerequisites.length > 0 && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Persyaratan</h3>
                          <ul className="list-disc list-inside space-y-1 text-gray-700">
                            {event.prerequisites.map((prerequisite, index) => (
                              <li key={index}>{prerequisite}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Manfaat</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {event.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Penyelenggara</h3>
                        <p className="text-gray-700">{event.organizer}</p>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "agenda" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Agenda</h2>
                      <div className="space-y-4">
                        {event.agenda.map((item, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="w-24 flex-shrink-0 text-gray-600 font-medium">
                              {item.time}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{item.title}</h3>
                              {item.description && (
                                <p className="text-gray-700 text-sm mt-1">{item.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "speakers" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Pembicara</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {event.speakers.map((speaker, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
                              {speaker.image ? (
                                <Image 
                                  src={speaker.image} 
                                  alt={speaker.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                              <p className="text-blue-600 text-sm mb-2">{speaker.role}</p>
                              <p className="text-gray-700 text-sm">{speaker.bio}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "faq" && (
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Pertanyaan Umum</h2>
                      <div className="space-y-4">
                        {event.faqs.map((faq, index) => (
                          <div key={index} className="border-b border-gray-100 pb-4">
                            <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Registration Section */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Pendaftaran</h2>
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <span className="text-gray-700">
                        {event.currentParticipants} dari {event.maxParticipants} peserta terdaftar
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${(event.currentParticipants / event.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700 mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>
                        Pendaftaran ditutup pada {registrationDeadlineDate.toLocaleDateString('id-ID', { 
                          day: 'numeric', 
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {isRegistrationOpen && !isFull ? (
                      <Link 
                        href={`/events/register/${event.id}`}
                        className="inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                      >
                        Daftar Sekarang
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                    ) : (
                      <button 
                        disabled
                        className="inline-flex justify-center items-center gap-2 bg-gray-300 text-gray-500 font-medium py-3 px-6 rounded-lg cursor-not-allowed"
                      >
                        {isFull ? "Kuota Penuh" : "Pendaftaran Ditutup"}
                      </button>
                    )}
                    
                    <Link 
                      href={`https://wa.me/${event.contactPerson.whatsapp?.replace(/\+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                      Hubungi Panitia
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
