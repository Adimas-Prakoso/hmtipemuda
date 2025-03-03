"use client";

import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import ActivityCard from "./components/ActivityCard";
import EventCard from "./components/EventCard";
import { useEffect, useRef, useState } from "react";
import { FiMenu, FiChevronsLeft, FiSun, FiMoon, FiUsers, FiCalendar } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { HiOutlineDocumentReport } from "react-icons/hi";

const statData = [
  {
    title: "Total Users",
    value: "1,234",
    icon: FiUsers,
    trend: { value: 12, isPositive: true },
    className: "from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10"
  },
  {
    title: "Total Events",
    value: "42",
    icon: FiCalendar,
    trend: { value: 8, isPositive: true },
    className: "from-green-500/5 to-green-600/5 dark:from-green-500/10 dark:to-green-600/10"
  },
  {
    title: "Active Users",
    value: "891",
    icon: FiUsers,
    trend: { value: 3, isPositive: true },
    className: "from-purple-500/5 to-purple-600/5 dark:from-purple-500/10 dark:to-purple-600/10"
  },
  {
    title: "Total Reports",
    value: "156",
    icon: HiOutlineDocumentReport,
    trend: { value: 2, isPositive: false },
    className: "from-red-500/5 to-red-600/5 dark:from-red-500/10 dark:to-red-600/10"
  }
];

const activities = [
  {
    type: "register" as const,
    title: "New user registered",
    time: "2 minutes ago"
  },
  {
    type: "event" as const,
    title: "Event created: Workshop Web Development",
    time: "1 hour ago"
  },
  {
    type: "report" as const,
    title: "Report submitted",
    time: "3 hours ago"
  }
];

const events = [
  {
    title: "Web Development Workshop",
    datetime: "March 15, 2025 • 09:00 AM",
    type: "Workshop",
    participants: 50,
    status: "upcoming" as const
  },
  {
    title: "Mobile App Development Seminar",
    datetime: "March 20, 2025 • 13:00 PM",
    type: "Seminar",
    participants: 75,
    status: "upcoming" as const
  }
];

export default function AdminDashboard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });

  const adminMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setIsAdminMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex min-h-screen transition-all duration-300 ${isDarkMode ? "dark bg-gray-900" : "bg-blue-50"}`}>
      <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} isDarkMode={isDarkMode} />
      <main className="flex-1 p-8">
        <div className="sticky top-0 z-10 -mx-8 mb-8 backdrop-blur">
          <div className="border-b bg-white/50 px-8 py-5 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleSidebar}
                  className="rounded-lg p-2 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-800"
                  aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                >
                  <div className="relative h-5 w-5">
                    <FiMenu 
                      className={`absolute transition-all duration-300 ${
                        isExpanded ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                      }`}
                    />
                    <FiChevronsLeft 
                      className={`absolute transition-all duration-300 ${
                        isExpanded ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                      }`}
                    />
                  </div>
                </button>
                <div className="relative" ref={adminMenuRef}>
                  <button
                    onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                    className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-blue-100 dark:hover:bg-gray-800"
                  >
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-blue-200 ring-2 ring-white dark:from-gray-700 dark:to-gray-800 dark:ring-gray-900">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                        alt="Admin avatar"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-blue-900 dark:text-white">John Admin</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">admin@hmtipemuda.org</p>
                    </div>
                  </button>
                  {isAdminMenuOpen && (
                    <div className="absolute left-0 mt-2 w-48 animate-slideDown rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/5">
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium text-blue-900 dark:text-white">John Admin</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">ID: ADM-001</p>
                      </div>
                      <hr className="my-1 dark:border-gray-700" />
                      <button
                        className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700"
                        onClick={() => console.log('Logout clicked')}
                      >
                        <BiLogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h1 className="text-2xl font-bold text-blue-900 dark:text-white">Dashboard</h1>

              <div className="flex items-center">
                <button
                  onClick={toggleDarkMode}
                  className="group rounded-lg p-2 text-blue-600 hover:bg-blue-100 dark:text-yellow-400 dark:hover:bg-gray-800"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? (
                    <FiSun className="h-5 w-5 transition-transform group-hover:rotate-45" />
                  ) : (
                    <FiMoon className="h-5 w-5 transition-transform group-hover:-rotate-12" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          {statData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <ActivityCard activities={activities} />
          <EventCard events={events} />
        </div>
      </main>
    </div>
  );
}
