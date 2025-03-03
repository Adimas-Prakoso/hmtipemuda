"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import Sidebar from "./components/Sidebar";
import StatCard from "./components/StatCard";
import { FiMenu, FiChevronsLeft, FiSun, FiMoon, FiUsers, FiCpu, FiHardDrive } from "react-icons/fi";
import { BiLogOut, BiMemoryCard } from "react-icons/bi";
import { TbWorld } from "react-icons/tb";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
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
  const [adminData, setAdminData] = useState({ id: '', nama: '', role: '' });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [visitorData, setVisitorData] = useState<VisitorStats | null>(null);

  const adminMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        const res = await fetch('/api/visitors?apikey=frUio9eKhk1UOSnsjhi7');
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

  // Prepare visitor chart data
  const visitorChartData = {
    labels: (visitorData?.stats.dailyVisits || []).map(d => d.readableDate),
    datasets: [
      {
        label: 'Daily Visitors',
        data: (visitorData?.stats.dailyVisits || []).map(d => d.total),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      }
    ]
  };

  const browserChartData = {
    labels: visitorData?.stats.browsers ? Object.keys(visitorData.stats.browsers) : [],
    datasets: [{
      data: visitorData?.stats.browsers ? Object.values(visitorData.stats.browsers) : [],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(147, 51, 234, 0.8)',
        'rgba(234, 88, 12, 0.8)',
        'rgba(22, 163, 74, 0.8)',
      ],
    }]
  };

  const systemStats = [
    {
      title: "CPU Usage",
      value: `${systemData?.cpu.usagePercent || 0}%`,
      icon: FiCpu,
      trend: { value: systemData?.cpu.cores || 0, text: "cores" },
      className: "from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10"
    },
    {
      title: "RAM Usage",
      value: `${systemData?.ram.usagePercent || 0}%`,
      icon: BiMemoryCard,
      trend: { value: systemData?.ram.total || "0 GB", text: "total" },
      className: "from-purple-500/5 to-purple-600/5 dark:from-purple-500/10 dark:to-purple-600/10"
    },
    {
      title: "Storage",
      value: `${systemData?.storage.percentUsed || 0}%`,
      icon: FiHardDrive,
      trend: { value: systemData?.storage.free || "0 GB", text: "free" },
      className: "from-green-500/5 to-green-600/5 dark:from-green-500/10 dark:to-green-600/10"
    },
    {
      title: "Total Visitors",
      value: visitorData?.total?.toString() || "0",
      icon: FiUsers,
      trend: { value: Object.keys(visitorData?.stats.countries || {}).length || 0, text: "countries" },
      className: "from-orange-500/5 to-orange-600/5 dark:from-orange-500/10 dark:to-orange-600/10"
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="fixed h-full">
        <Sidebar isExpanded={isExpanded} toggleSidebar={toggleSidebar} isDarkMode={isDarkMode} />
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
                        onClick={() => console.log('Logout clicked')}
                      >
                        <BiLogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-blue-900 dark:text-white">Dashboard</h1>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  <CurrentTime />
                </div>
              </div>

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

        {/* Main Content */}
        <main className="p-8 pt-28">
          <div className="grid gap-6 lg:grid-cols-4">
            {systemStats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {/* Visitor Chart */}
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-white">
                Daily Visitors
              </h3>
              <div className="h-[300px]">
                <Line 
                  data={visitorChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        },
                      },
                      x: {
                        grid: {
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        },
                      },
                    },
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Browser Distribution */}
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-white">
                Browser Distribution
              </h3>
              <div className="h-[300px] flex items-center justify-center">
                <Doughnut 
                  data={browserChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                        labels: {
                          color: isDarkMode ? '#fff' : '#1e3a8a',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>

            {/* Country Distribution */}
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-white">
                Visitor Countries
              </h3>
              <div className="space-y-4">
                {Object.entries(visitorData?.stats.countries || {})
                  .sort(([, a], [, b]) => b - a)
                  .map(([country, count]) => (
                    <div key={country} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TbWorld className="h-5 w-5 text-blue-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{country}</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* System Runtime */}
            <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-white">
                System Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">CPU Model</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {systemData?.cpu.model || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Total RAM</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {systemData?.ram.total || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Storage</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {systemData?.storage.total || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">Uptime</span>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {systemData?.runtime.uptime || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
