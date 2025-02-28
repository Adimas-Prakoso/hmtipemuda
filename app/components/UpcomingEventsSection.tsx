"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";

interface EventType {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  featured: boolean;
  registrationLink?: string;
  category: string;
}

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
  
  const units = [
    { label: "Hari", value: timeLeft.days },
    { label: "Jam", value: timeLeft.hours },
    { label: "Menit", value: timeLeft.minutes },
    { label: "Detik", value: timeLeft.seconds }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
      {units.map((unit, index) => (
        <div key={index} className="flex flex-col items-center bg-white rounded-lg shadow-md p-2 md:p-3 w-16 md:w-24">
          <span className="text-lg md:text-2xl font-bold text-blue-700">{String(unit.value).padStart(2, '0')}</span>
          <span className="text-xs md:text-sm text-gray-600">{unit.label}</span>
        </div>
      ))}
    </div>
  );
};

// EventCard component
const EventCard = ({ event, isFeature = false }: { event: EventType, isFeature?: boolean }) => (
  <motion.div 
    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }}
    transition={{ duration: 0.2 }}
    className={`rounded-xl overflow-hidden border border-gray-100 bg-white shadow-md flex flex-col h-full ${isFeature ? "md:flex-row" : ""}`}
  >
    {/* Date Tag */}
    <div className={`bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white flex flex-col items-center justify-center ${isFeature ? "md:w-48" : "w-full"}`}>
      <span className="text-sm font-medium">{new Date(event.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
      <span className="text-3xl font-bold">{new Date(event.date).getDate()}</span>
      <span className="text-sm">{new Date(event.date).getFullYear()}</span>
      
      {isFeature && <div className="mt-3 p-1 px-3 bg-white/20 rounded-full text-xs backdrop-blur-sm">Event Terdekat</div>}
    </div>
    
    {/* Content */}
    <div className={`p-5 flex-grow flex flex-col ${isFeature ? "md:p-6" : ""}`}>
      <div className="mb-4">
        <h3 className={`font-bold text-gray-900 ${isFeature ? "text-xl md:text-2xl" : "text-lg"} mb-1`}>
          {event.title}
        </h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {event.time}
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {event.location}
          </span>
          <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {event.category}
          </span>
        </div>
        <p className={`text-gray-600 ${isFeature ? "md:text-base" : "text-sm"}`}>{event.description}</p>
      </div>
      
      {isFeature && (
        <div className="mt-4">
          <p className="font-medium text-gray-900 mb-2">Acara dimulai dalam:</p>
          <CountdownTimer targetDate={event.date} />
        </div>
      )}
      
      {event.registrationLink && (
        <div className={`mt-auto pt-4 ${isFeature ? "md:mt-4" : ""}`}>
          <Link 
            href={event.registrationLink}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-800 group transition-all duration-300"
          >
            Daftar Sekarang
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  </motion.div>
);

const UpcomingEventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  // Sample events data - this would ideally come from an API or data source
  const events: EventType[] = [
    {
      id: "ev1",
      title: "Workshop UI/UX Design for Beginner",
      date: "2023-12-15T10:00:00",
      time: "10:00 - 14:00",
      location: "Auditorium Kampus A",
      description: "Workshop interaktif yang membahas dasar-dasar UI/UX design dan implementasinya dalam pengembangan aplikasi modern.",
      featured: true,
      registrationLink: "/events/workshop-uiux",
      category: "Workshop",
    },
    {
      id: "ev2",
      title: "Seminar Artificial Intelligence",
      date: "2023-12-20T13:00:00",
      time: "13:00 - 16:00",
      location: "Aula Utama",
      description: "Seminar menghadirkan pakar AI untuk berbagi perkembangan terbaru dalam dunia kecerdasan buatan.",
      featured: false,
      registrationLink: "/events/seminar-ai",
      category: "Seminar",
    },
    {
      id: "ev3",
      title: "Coding Competition 2023",
      date: "2023-12-25T09:00:00",
      time: "09:00 - 17:00",
      location: "Lab Komputer",
      description: "Kompetisi pemrograman tahunan dengan berbagai kategori untuk menguji kemampuan coding mahasiswa.",
      featured: false,
      registrationLink: "/events/coding-competition",
      category: "Kompetisi",
    },
    {
      id: "ev4",
      title: "Pelatihan Cloud Computing",
      date: "2024-01-05T14:00:00",
      time: "14:00 - 16:30",
      location: "Ruang Multimedia",
      description: "Pelatihan dasar-dasar cloud computing dan cara menggunakan layanan AWS untuk mahasiswa.",
      featured: false,
      registrationLink: "/events/cloud-computing",
      category: "Pelatihan",
    }
  ];

  // Find the featured event (or use the closest upcoming one if none is marked as featured)
  const featuredEvent = events.find(event => event.featured) || 
    [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Other upcoming events (excluding featured)
  const upcomingEvents = events
    .filter(event => event.id !== featuredEvent.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }
    }
  };

  return (
    <section ref={ref} id="events" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block py-1 px-3 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4"
          >
            Event & Kegiatan
          </motion.span>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Acara <span className="text-blue-600">Mendatang</span>
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
            Berbagai event dan kegiatan yang akan datang dari HMTI untuk pengembangan 
            kompetensi dan networking mahasiswa
          </motion.p>
        </div>

        <div className="space-y-10 max-w-6xl mx-auto">
          {/* Featured Event */}
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            transition={{ delay: 0.5 }}
          >
            <EventCard event={featuredEvent} isFeature={true} />
          </motion.div>

          {/* Other Upcoming Events */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {upcomingEvents.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>

          {/* View All Events Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center pt-6"
          >
            <Link 
              href="/events" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-blue-200 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors duration-300 shadow-sm"
            >
              <span>Lihat Semua Event</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
