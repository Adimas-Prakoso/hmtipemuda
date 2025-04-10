"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { FiMenu, FiChevronsLeft, FiSun, FiMoon } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";

// Dynamically import components that use browser APIs
const Sidebar = dynamic(() => import("./components/Sidebar"), { ssr: false });
const TabContent = dynamic(() => import("./components/TabContent"), { ssr: false });
const NetworkStatus = dynamic(() => import("./components/NetworkStatus"), { ssr: false });

// We'll use a dynamic import for ChartJS initialization
const ChartJSInitializer = dynamic(
  () => import('./components/ChartJSInitializer'),
  { ssr: false }
);

const CurrentTime = () => {
  const [time, setTime] = useState<string>("");
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('id-ID'));
      setDate(now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span>{time}</span>
      <span>•</span>
      <span>{date}</span>
    </div>
  );
};

interface SystemData {
  runtime: {
    startTime: string;
    uptime: string;
    uptimeSeconds: number;
  };
  ram: {
    total: string;
    used: string;
    free: string;
    usagePercent: number;
  };
  cpu: {
    model: string;
    cores: number;
    usagePercent: number;
  };
  storage: {
    total: string;
    used: string;
    free: string;
    percentUsed: number;
  };
}

interface VisitorStats {
  total: number;
  stats: {
    browsers: Record<string, number>;
    operatingSystems: Record<string, number>;
    countries: Record<string, number>;
    dailyVisits: {
      date: string;
      total: number;
      readableDate: string;
    }[];
  };
}

export default function AdminDashboard() {
  // Render the ChartJSInitializer to initialize Chart.js on the client side
  const router = useRouter();
  const [adminData, setAdminData] = useState({ id: '', nama: '', role: '' });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [visitorData, setVisitorData] = useState<VisitorStats | null>(null);

  const adminMenuRef = useRef<HTMLDivElement>(null);

  // Handle sign out functionality
  const handleSignOut = async () => {
    try {
      // Call the logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Clear any client-side auth data
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict';
        
        // Redirect to login page
        router.push('/admin/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    // Initialize activeTab from localStorage if available
    if (typeof window !== 'undefined') {
      const selectedTab = localStorage.getItem('selectedTab');
      if (selectedTab) {
        // Clear the selected tab from localStorage after using it
        localStorage.removeItem('selectedTab');
        setActiveTab(selectedTab);
      }
      
      // Initialize dark mode from localStorage if available
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode) {
        setIsDarkMode(JSON.parse(savedMode));
      }
    }
    
    const fetchAdminData = async () => {
      try {
        const res = await fetch('/api/auth', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch admin data');
        const data = await res.json();
        setAdminData(data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        const res = await fetch('/api/system');
        if (!res.ok) throw new Error('Failed to fetch system data');
        const data = await res.json();
        setSystemData(data.data);
      } catch (error) {
        console.error('Error fetching system data:', error);
      }
    };

    const fetchVisitorData = async () => {
      try {
        // Use the APIKEY from .env file that you just created
        const res = await fetch('/api/visitors?apikey=JHvbsBssuxhKbshjJH');
        if (!res.ok) throw new Error('Failed to fetch visitor data');
        const data = await res.json();
        if (data.success) {
          setVisitorData(data);
        }
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    };

    // Initial fetch
    fetchSystemData();
    fetchVisitorData();

    // Set up polling intervals
    const systemInterval = setInterval(fetchSystemData, 5000); // Update every 5 seconds
    const visitorInterval = setInterval(fetchVisitorData, 30000); // Update every 30 seconds

    return () => {
      clearInterval(systemInterval);
      clearInterval(visitorInterval);
    };
  }, []);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <ChartJSInitializer />
      <div className="fixed h-full">
        <Sidebar
          isExpanded={isExpanded}
          toggleSidebar={toggleSidebar}
          isDarkMode={isDarkMode}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
      
      <div className={`flex-1 overflow-auto ${isDarkMode ? "dark bg-gray-900" : "bg-blue-50"}`} style={{ marginLeft: isExpanded ? '16rem' : '5rem' }}>
        {/* Fixed Header */}
        <div className="fixed top-0 right-0 left-0 z-50 bg-white/90 backdrop-blur-md shadow-sm dark:bg-gray-900/90" style={{ marginLeft: isExpanded ? '16rem' : '5rem' }}>
          <div className="border-b px-8 py-5 dark:border-gray-800">
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
                      <Image
                        src="/logo.png"
                        alt="HMTIPemuda Logo"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        width={32}
                        height={32}
                        priority
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-blue-900 dark:text-white">{adminData.nama}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">ID: {adminData.id}</p>
                    </div>
                  </button>
                  {isAdminMenuOpen && (
                    <div className="absolute left-0 mt-2 w-48 animate-slideDown rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 dark:bg-gray-800 dark:ring-white/5">
                      <div className="px-4 py-2">
                        <p className="text-sm font-medium text-blue-900 dark:text-white">{adminData.nama}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">ID: {adminData.id}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Role: {adminData.role}</p>
                      </div>
                      <hr className="my-1 dark:border-gray-700" />
                      <button
                        className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700"
                        onClick={handleSignOut}
                      >
                        <BiLogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-blue-900 dark:text-white capitalize">
                  {activeTab}
                </h1>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  <CurrentTime />
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Network Status Indicator */}
                <NetworkStatus className="px-3 py-2 rounded-lg bg-white/70 dark:bg-gray-800/70 shadow-md hover:shadow-lg transition-all duration-300" />
                
                {/* Theme Toggle Button */}
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

        {/* Main Content */}
        <main className="p-8 pt-28">
          <TabContent
            activeTab={activeTab}
            systemData={systemData}
            visitorData={visitorData}
            isDarkMode={isDarkMode}
          />
        </main>
      </div>
    </div>
  );
}
