"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Import event type
import { EventType } from "../../data/types";

// EventCard component (similar to the one in UpcomingEventsSection)
const EventCard = ({ event }: { event: EventType }) => (
  <motion.div 
    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }}
    transition={{ duration: 0.2 }}
    className="rounded-xl overflow-hidden border border-gray-100 bg-white shadow-md flex flex-col h-full hover:shadow-lg transition-all duration-300"
  >
    {/* Date Tag */}
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 sm:p-4 text-white flex flex-col items-center justify-center w-full">
      <span className="text-xs sm:text-sm font-medium">{new Date(event.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
      <span className="text-2xl sm:text-3xl font-bold">{new Date(event.date).getDate()}</span>
      <span className="text-xs sm:text-sm">{new Date(event.date).getFullYear()}</span>
    </div>
    
    {/* Content */}
    <div className="p-4 sm:p-5 flex-grow flex flex-col">
      <div className="mb-3 sm:mb-4">
        <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1 line-clamp-2">
          {event.title}
        </h3>
        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 sm:py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 sm:h-3 sm:w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {event.time}
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 sm:py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 sm:h-3 sm:w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {event.location}
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 sm:py-1 rounded-full">
            {event.category}
          </span>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm line-clamp-3">{event.description}</p>
      </div>
      
      {event.registrationLink && (
        <div className="mt-auto pt-3 sm:pt-4">
          <Link 
            href={event.registrationLink}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-blue-700 hover:text-blue-800 group transition-all duration-300"
          >
            Lihat Detail
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  </motion.div>
);

export default function EventsPage() {
  // State for events data
  const [allEvents, setAllEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch events from API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setAllEvents(data.events || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, []);

  // Sort events by date (upcoming first)
  const sortedEvents = [...allEvents].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // State for category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Get unique categories
  const categories = ["all", ...new Set(allEvents.map(event => event.category))];
  
  // Filter events by category
  const filteredEvents = selectedCategory === "all" 
    ? sortedEvents 
    : sortedEvents.filter(event => event.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mt-20">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4"
              >
                Events & Kegiatan
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 px-2"
              >
                Temukan berbagai kegiatan menarik yang diselenggarakan oleh HMTI Pemuda
              </motion.p>
            </div>
          </div>
        </section>
        
        {/* Events Section */}
        <section className="py-10 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Category Filter */}
            <div className="mb-6 sm:mb-10 overflow-x-auto pb-2 -mx-4 px-4">
              <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-2 min-w-max sm:min-w-0">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category === "all" ? "Semua Kategori" : category}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Events Grid */}
            {loading ? (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 sm:py-12">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Error</h3>
                <p className="text-sm sm:text-base text-gray-500">{error}</p>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Tidak ada event yang ditemukan</h3>
                <p className="text-sm sm:text-base text-gray-500">Tidak ada event dalam kategori yang dipilih. Silakan pilih kategori lain.</p>
              </div>
            )}
            

          </div>
        </section>
        

      </main>
      
      <Footer />
    </div>
  );
}
