"use client";

import { Line, Doughnut } from 'react-chartjs-2';
import { TbWorld } from "react-icons/tb";
import StatCard from "./StatCard";
import { FiUsers, FiCpu, FiHardDrive } from "react-icons/fi";
import { BiMemoryCard } from "react-icons/bi";
import FileManager from "./FileManager";
import dynamic from 'next/dynamic';

const SiteConfigPage = dynamic(() => import('../site-config/page'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
    </div>
  ),
});

const WhatsAppPage = dynamic(() => import('../whatsapp/page'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
    </div>
  ),
});

interface SystemData {
  cpu: {
    model: string;
    cores: number;
    usagePercent: number;
  };
  ram: {
    total: string;
    used: string;
    free: string;
    usagePercent: number;
  };
  storage: {
    total: string;
    used: string;
    free: string;
    percentUsed: number;
  };
  runtime: {
    startTime: string;
    uptime: string;
    uptimeSeconds: number;
  };
}

interface VisitorStats {
  total: number;
  stats: {
    browsers: Record<string, number>;
    operatingSystems: Record<string, number>;
    countries: Record<string, number>;
    dailyVisits: Array<{
      date: string;
      total: number;
      readableDate: string;
    }>;
  };
}

interface TabContentProps {
  activeTab: string;
  systemData: SystemData | null;
  visitorData: VisitorStats | null;
  isDarkMode: boolean;
}

interface DashboardContentProps {
  systemData: SystemData | null;
  visitorData: VisitorStats | null;
  isDarkMode: boolean;
}

const DashboardContent = ({ systemData, visitorData, isDarkMode }: DashboardContentProps) => {
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

  const visitorChartData = {
    labels: visitorData?.stats.dailyVisits.map(d => d.readableDate) || [],
    datasets: [
      {
        label: 'Daily Visitors',
        data: visitorData?.stats.dailyVisits.map(d => d.total) || [],
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

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-4">
        {systemStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
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

        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
          <h3 className="mb-4 text-lg font-semibold text-blue-900 dark:text-white">
            Visitor Countries
          </h3>
          <div className="space-y-4">
            {Object.entries(visitorData?.stats.countries || {})
              .sort(([, a], [, b]) => (b as number) - (a as number))
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
    </>
  );
};

const EventsContent = () => (
  <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
    <h3 className="text-lg font-semibold text-blue-900 dark:text-white mb-4">
      Events
    </h3>
    <p className="text-gray-600 dark:text-gray-300">Events content will be added here</p>
  </div>
);

const UsersContent = () => (
  <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
    <h3 className="text-lg font-semibold text-blue-900 dark:text-white mb-4">
      Users
    </h3>
    <p className="text-gray-600 dark:text-gray-300">Users content will be added here</p>
  </div>
);

const ReportsContent = () => (
  <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
    <h3 className="text-lg font-semibold text-blue-900 dark:text-white mb-4">
      Reports
    </h3>
    <p className="text-gray-600 dark:text-gray-300">Reports content will be added here</p>
  </div>
);

const FilesContent = () => (
  <FileManager />
);


export default function TabContent({ activeTab, systemData, visitorData, isDarkMode }: TabContentProps) {
  switch (activeTab) {
    case 'dashboard':
      return <DashboardContent systemData={systemData} visitorData={visitorData} isDarkMode={isDarkMode} />;
    case 'files':
      return <FilesContent />;
    case 'events':
      return <EventsContent />;
    case 'users':
      return <UsersContent />;
    case 'reports':
      return <ReportsContent />;
    case 'site config':
      return <SiteConfigPage />;
    case 'whatsapp':
      return <WhatsAppPage />;
    default:
      return <DashboardContent systemData={systemData} visitorData={visitorData} isDarkMode={isDarkMode} />;
  }
}