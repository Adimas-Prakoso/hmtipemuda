"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";
import { EventType, events as initialEvents } from "../../data/events";
import EventsAdmin from "./EventsAdmin";

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
      <div className="bg-blue-800 bg-opacity-50 rounded-lg px-3 py-2 min-w-[60px]">
        <div className="text-2xl font-bold">{timeLeft.days}</div>
        <div className="text-xs uppercase">Hari</div>
      </div>
      <div className="bg-blue-800 bg-opacity-50 rounded-lg px-3 py-2 min-w-[60px]">
        <div className="text-2xl font-bold">{timeLeft.hours}</div>
        <div className="text-xs uppercase">Jam</div>
      </div>
      <div className="bg-blue-800 bg-opacity-50 rounded-lg px-3 py-2 min-w-[60px]">
        <div className="text-2xl font-bold">{timeLeft.minutes}</div>
        <div className="text-xs uppercase">Menit</div>
      </div>
      <div className="bg-blue-800 bg-opacity-50 rounded-lg px-3 py-2 min-w-[60px]">
        <div className="text-2xl font-bold">{timeLeft.seconds}</div>
        <div className="text-xs uppercase">Detik</div>
      </div>
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
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow ${isFeature ? 'md:col-span-2 lg:col-span-2' : ''}`}
    >
      <div className={`p-6 flex flex-col h-full ${isFeature ? 'md:flex-row gap-6' : ''}`}>
        <div className={`${isFeature ? 'md:w-1/2' : 'w-full'}`}>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{formattedDate}</span>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{event.title}</h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{event.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{event.location}</span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">{event.description}</p>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {event.category}
            </span>
            {event.featured && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                Featured
              </span>
            )}
          </div>
        </div>
        
        {isFeature && (
          <div className="md:w-1/2 flex flex-col justify-center">
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Segera daftar untuk mengikuti event ini!
            </p>
            <Link 
              href={event.registrationLink || `/events/${event.id}`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Daftar Sekarang
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const UpcomingEventsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [events, setEvents] = useState<EventType[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    // Check if user is admin (this is a simple example, in a real app you'd use authentication)
    const adminStatus = localStorage.getItem("hmtiAdmin");
    if (adminStatus === "true") {
      setIsAdmin(true);
    }
    
    // Load events from localStorage if available, otherwise use initial events
    const storedEvents = localStorage.getItem("hmtiEvents");
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      setEvents(initialEvents);
    }
  }, []);
  
  const handleUpdateEvents = (updatedEvents: EventType[]) => {
    setEvents(updatedEvents);
  };
  
  const toggleAdmin = () => {
    // Simple admin toggle for demo purposes
    if (!isAdmin) {
      const password = prompt("Masukkan password admin:");
      if (password === "admin123") { // In a real app, use proper authentication
        localStorage.setItem("hmtiAdmin", "true");
        setIsAdmin(true);
        setShowAdmin(true);
      } else {
        alert("Password salah!");
      }
    } else {
      setShowAdmin(!showAdmin);
    }
  };

  // Find the nearest upcoming event for countdown
  const upcomingEvent = events.find(event => new Date(event.date) > new Date());
  const featuredEvent = events.find(event => event.featured);

  return (
    <section className="bg-gray-50 dark:bg-gray-900" ref={ref}>
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-12">
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Jangan lewatkan berbagai event menarik yang diselenggarakan oleh HMTI untuk mengembangkan skill dan jaringan Anda.
            </p>
          </div>
          {isAdmin && (
            <button 
              onClick={toggleAdmin}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showAdmin ? "Tutup Admin" : "Kelola Events"}
            </button>
          )}
          {!isAdmin && (
            <button 
              onClick={toggleAdmin}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Admin
            </button>
          )}
        </div>
        
        {showAdmin && isAdmin && (
          <div className="mb-12">
            <EventsAdmin onUpdateEvents={handleUpdateEvents} />
          </div>
        )}
        
        {upcomingEvent && (
          <div 
            className={`mb-12 transition-opacity duration-1000 ${isInView ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 md:p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Upcoming Event</h3>
                <p className="text-blue-100">Mark your calendar for our next event!</p>
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
                    Daftar Sekarang
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
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvent && (
            <EventCard event={featuredEvent} isFeature={true} />
          )}
          
          {events
            .filter(event => (!featuredEvent || event.id !== featuredEvent.id) && new Date(event.date) > new Date())
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(0, featuredEvent ? 5 : 6)
            .map(event => (
              <EventCard key={event.id} event={event} />
            ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/events" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
          >
            View All Events
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEventsSection;
