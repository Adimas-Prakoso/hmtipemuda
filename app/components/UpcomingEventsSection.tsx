"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";
import { EventType } from "../../data/types";

// Utility function to calculate time remaining
const useCountdown = (targetDate: string) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return timeLeft;
};

// CountdownTimer component
const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
  const timeLeft = useCountdown(targetDate);
  
  return (
    <div className="flex justify-center gap-3 sm:gap-4 text-center">
      <motion.div 
        className="bg-blue-800 bg-opacity-50 rounded-lg px-3 py-2 min-w-[60px] shadow-md"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="text-2xl font-bold">{timeLeft.days}</div>
        <div className="text-xs uppercase">Hari</div>
      </motion.div>
      <motion.div 
        className="bg-blue-800 bg-opacity-50 rounded-lg px-3 py-2 min-w-[60px] shadow-md"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
      >
        <div className="text-2xl font-bold">{timeLeft.hours}</div>
        <div className="text-xs uppercase">Jam</div>
      </motion.div>
      <motion.div 
        className="bg-blue-800 bg-opacity-50 rounded-lg px-3 py-2 min-w-[60px] shadow-md"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
      >
        <div className="text-2xl font-bold">{timeLeft.minutes}</div>
        <div className="text-xs uppercase">Menit</div>
      </motion.div>
      <motion.div 
        className="bg-blue-800 bg-opacity-50 rounded-lg px-3 py-2 min-w-[60px] shadow-md"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, delay: 0.15 }}
      >
        <div className="text-2xl font-bold">{timeLeft.seconds}</div>
        <div className="text-xs uppercase">Detik</div>
      </motion.div>
    </div>
  );
};

// EventCard component
const EventCard = ({ event, isFeature = false }: { event: EventType, isFeature?: boolean }) => {
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  // Calculate days remaining until the event
  const today = new Date();
  const isPastEvent = eventDate < today;
  const diffTime = Math.abs(eventDate.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return (
    <motion.div 
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md transition-all duration-300 h-full border border-gray-100 dark:border-gray-700 ${isFeature ? 'md:col-span-2 lg:col-span-2' : ''}`}
    >
      {/* Event date badge */}
      <div className="relative">
        <div className={`absolute top-4 right-4 text-white text-xs font-bold px-2 py-1 rounded-full ${isPastEvent ? 'bg-gray-500' : 'bg-blue-600'}`}>
          {isPastEvent ? 'Selesai' : `${diffDays} hari lagi`}
        </div>
      </div>
      
      <div className={`p-6 flex flex-col h-full ${isFeature ? 'md:flex-row gap-6' : ''}`}>
        <div className={`${isFeature ? 'md:w-1/2' : 'w-full'}`}>
          {/* Category badge */}
          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {event.category}
            </span>
            {event.featured && (
              <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                Unggulan
              </span>
            )}
          </div>
          
          {/* Event title */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:line-clamp-none transition-all duration-200">
            {event.title}
          </h3>
          
          {/* Event date and time */}
          <div className="flex flex-col space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{formattedDate}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{event.location}</span>
            </div>
          </div>
          
          {/* Event description */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 flex-grow line-clamp-3 text-sm">
            {event.description}
          </p>
        </div>
        
        {/* Call to action */}
        <div className={`${isFeature ? 'md:w-1/2 flex flex-col justify-center' : 'mt-auto'}`}>
          {isFeature ? (
            <>
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Segera daftar untuk mengikuti event ini!
              </p>
              <Link 
                href={event.registrationLink || `/events/${event.id}`}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto"
              >
                Lihat Detail
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </>
          ) : (
            <Link 
              href={event.registrationLink || `/events/${event.id}`}
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-blue-600 border border-blue-200 font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all duration-300 w-full"
            >
              Lihat Detail
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const UpcomingEventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to refresh events from API and update cache
  const refreshEventsCache = async () => {
    try {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setEvents(data.events || []);
      
      // Update localStorage cache with timestamp
      localStorage.setItem("hmtiEvents", JSON.stringify(data.events || []));
      localStorage.setItem("hmtiEventsTimestamp", new Date().getTime().toString());
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Gagal memuat events terbaru.');
      setIsLoading(false);
    }
  };
  
  // Main function to fetch events with caching strategy
  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to get from localStorage first for faster initial load
      const storedEvents = localStorage.getItem("hmtiEvents");
      const storedTimestamp = localStorage.getItem("hmtiEventsTimestamp");
      
      // Check if we have valid cached data less than 5 minutes old
      const now = new Date().getTime();
      const isRecentCache = storedTimestamp && (now - parseInt(storedTimestamp)) < 5 * 60 * 1000;
      
      if (storedEvents && isRecentCache) {
        setEvents(JSON.parse(storedEvents));
        setIsLoading(false);
        
        // Still fetch in background to update cache
        refreshEventsCache();
      } else {
        // No recent cache, fetch from API
        await refreshEventsCache();
      }
    } catch (err) {
      console.error('Error in events loading:', err);
      setError('Gagal memuat events. Silakan refresh halaman.');
      setIsLoading(false);
    }
  };
  
  // Using useCallback to memoize the fetchEvents function
  const memoizedFetchEvents = useCallback(fetchEvents, []);
  
  useEffect(() => {
    memoizedFetchEvents();
  }, [memoizedFetchEvents]);

  // Get upcoming events and sort them by date
  const upcomingEvents = events
    .filter(event => new Date(event.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
  // The first upcoming event for countdown
  const upcomingEvent = upcomingEvents[0];
  
  // Get the next 3 upcoming events (excluding the first one that's already shown in Event Terdekat)
  const topThreeEvents = upcomingEvents.length > 1 
    ? upcomingEvents.slice(1, 4) 
    : [];
  
  // Featured event (if any)
  const featuredEvent = events.find(event => event.featured);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="events-section" className="bg-gray-50 dark:bg-gray-900" ref={ref}>
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Acara Yang Akan Datang</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Jangan lewatkan berbagai event menarik yang diselenggarakan oleh HMTI untuk mengembangkan skill dan jaringan Anda.
          </p>
        </motion.div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20 space-y-4">
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
              className="relative h-16 w-16"
            >
              <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-t-4 border-b-4 border-blue-500"></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 rounded-full border-r-4 border-l-4 border-blue-300 rotate-45"></div>
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-gray-600 dark:text-gray-300 font-medium"
            >
              Memuat event...
            </motion.p>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-12 px-4"
          >
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-md w-full border-t-4 border-red-500">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <svg className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Terjadi Kesalahan</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  memoizedFetchEvents();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Coba Lagi
              </motion.button>
            </div>
          </motion.div>
        )}
        
        {/* Main upcoming event with countdown - only show when not loading and no error */}
        {!isLoading && !error && upcomingEvent && (
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-6">
                <motion.h3 
                  className="text-2xl font-bold mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  Event Terdekat
                </motion.h3>
                <motion.p 
                  className="text-blue-100"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Catat tanggalnya untuk event kami berikutnya!
                </motion.p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <h4 className="text-xl font-semibold mb-2">{upcomingEvent.title}</h4>
                  <p className="mb-4 text-blue-100">{upcomingEvent.description}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>
                        {new Date(upcomingEvent.date).toLocaleDateString('id-ID', { 
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
                      <span>{upcomingEvent.time}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={upcomingEvent.registrationLink || `/events/${upcomingEvent.id}`}
                    className="inline-flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Lihat Detail
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
                
                <div>
                  <p className="text-center text-lg font-medium mb-4">Event akan dimulai dalam:</p>
                  <CountdownTimer targetDate={upcomingEvent.date} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Top 3 upcoming events */}
        {!isLoading && !error && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {topThreeEvents.length > 0 ? (
              topThreeEvents.map((event, index) => (
                <motion.div key={event.id} variants={itemVariants}>
                  <EventCard 
                    event={event} 
                    isFeature={index === 0 && featuredEvent?.id === event.id}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Tidak ada event mendatang</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Kunjungi lagi nanti untuk informasi event terbaru.</p>
              </div>
            )}
          </motion.div>
        )}
        
        {!isLoading && !error && (
          <motion.div 
            className="text-center mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link 
                href="/events" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                onClick={(e) => {
                  // If we're on the home page, prevent default navigation and scroll smoothly
                  if (window.location.pathname === '/') {
                    e.preventDefault();
                    const eventsSection = document.getElementById('events-section');
                    if (eventsSection) {
                      window.scrollTo({
                        top: eventsSection.offsetTop,
                        behavior: 'smooth'
                      });
                    } else {
                      // If events section not found on this page, navigate normally
                      window.location.href = '/events';
                    }
                  }
                }}
              >
                <span>Lihat Semua Event</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
