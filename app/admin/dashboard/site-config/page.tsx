'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash } from 'react-icons/fi';
import Image from 'next/image';

interface Slide {
  image: string;
  alt: string;
}

interface Address {
  "@type": string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  streetAddress: string;
  addressCountry: string;
}

interface ParentOrganization {
  "@type": string;
  name: string;
  url: string;
}

interface Author {
  name: string;
  url: string;
}

interface OpenGraphImage {
  url: string;
  width: number;
  height: number;
  alt: string;
}

interface TwitterData {
  card: string;
  title: string;
  description: string;
  creator: string;
  images: string[];
}

interface OpenGraphData {
  type: string;
  locale: string;
  url: string;
  title: string;
  description: string;
  siteName: string;
  images: OpenGraphImage[];
}

interface LeadershipMember {
  name: string;
  position: string;
  department: string;
  imagePath: string;
}

interface StatItem {
  value: number;
  title: string;
  icon: string;
}

interface AchievementItem {
  title: string;
  description: string;
  badge: string;
  color: string;
  date: string;
}

interface ProgramItem {
  title: string;
  description: string;
  icon: string;
  image: string;
  color: string;
  bgColor: string;
}

interface SiteConfig {
  title: string;
  description: string;
  url: string;
  siteName: string;
  locale: string;
  type: string;
  logo: string;
  foundingDate: string;
  organizationType: string;
  keywords: string[];
  authors: Author[];
  creator: string;
  publisher: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  address: Address;
  parentOrganization: ParentOrganization;
  twitter: TwitterData;
  openGraph: OpenGraphData;
  verification: {
    google: string;
    yandex: string;
  };
  slides: Slide[];
  leadershipTeam: LeadershipMember[];
  stats: StatItem[];
  achievements: AchievementItem[];
  programs: ProgramItem[];
}

export default function SiteConfigPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetch('/api/site-config')
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load config:', err);
        toast.error('Failed to load configuration');
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;

    try {
      // Ensure stats and achievements are properly formatted
      const preparedConfig = {
        ...config,
        stats: Array.isArray(config.stats) ? config.stats.map(stat => ({
          ...stat,
          value: typeof stat.value === 'string' ? parseInt(stat.value, 10) || 0 : stat.value
        })) : [],
        achievements: Array.isArray(config.achievements) ? config.achievements : [],
        programs: Array.isArray(config.programs) ? config.programs : []
      };

      console.log('Submitting config data:', preparedConfig);
      
      const response = await fetch('/api/site-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preparedConfig),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('Server returned error:', result);
        throw new Error(result.error || 'Failed to update configuration');
      }
      
      toast.success('Configuration updated successfully');
    } catch (error) {
      console.error('Error updating config:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update configuration');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
    </div>
  );
  
  if (!config) return (
    <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
      <p className="text-red-600 dark:text-red-400">Error loading configuration</p>
    </div>
  );

  const TabButton = ({ name, label }: { name: string; label: string }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`px-4 py-2 rounded-lg transition-colors ${
        activeTab === name 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex space-x-2 overflow-x-auto pb-2">
        <TabButton name="general" label="General" />
        <TabButton name="seo" label="SEO & Meta" />
        <TabButton name="social" label="Social Media" />
        <TabButton name="organization" label="Organization" />
        <TabButton name="hero" label="Hero Slides" />
        <TabButton name="programs" label="Program Highlights" />
        <TabButton name="leadership" label="Leadership Team" />
        <TabButton name="achievements" label="Achievements" />
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-white mb-4">General Settings</h2>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Site Name</label>
                <input
                  type="text"
                  value={config.siteName}
                  onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Logo URL</label>
                <input
                  type="text"
                  value={config.logo}
                  onChange={(e) => setConfig({ ...config, logo: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Founding Date</label>
                <input
                  type="date"
                  value={config.foundingDate}
                  onChange={(e) => setConfig({ ...config, foundingDate: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-white mb-4">SEO Settings</h2>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title</label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  className="w-full p-2 border rounded h-24 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Keywords</label>
                <div className="space-y-2">
                  {config.keywords.map((keyword, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => {
                          const newKeywords = [...config.keywords];
                          newKeywords[index] = e.target.value;
                          setConfig({ ...config, keywords: newKeywords });
                        }}
                        className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newKeywords = config.keywords.filter((_, i) => i !== index);
                          setConfig({ ...config, keywords: newKeywords });
                        }}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setConfig({ ...config, keywords: [...config.keywords, ''] })}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <FiPlus /> Add Keyword
                  </button>
                </div>
              </div>
              
              <div className="mt-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Site Verification</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Google Verification</label>
                    <input
                      type="text"
                      value={config.verification?.google || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        verification: {
                          ...config.verification,
                          google: e.target.value
                        }
                      })}
                      placeholder="Google verification code"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Yandex Verification</label>
                    <input
                      type="text"
                      value={config.verification?.yandex || ''}
                      onChange={(e) => setConfig({
                        ...config,
                        verification: {
                          ...config.verification,
                          yandex: e.target.value
                        }
                      })}
                      placeholder="Yandex verification code"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-white mb-4">Social Media</h2>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Facebook</label>
                <input
                  type="url"
                  value={config.socialMedia.facebook}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    socialMedia: { ...config.socialMedia, facebook: e.target.value }
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Instagram</label>
                <input
                  type="url"
                  value={config.socialMedia.instagram}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    socialMedia: { ...config.socialMedia, instagram: e.target.value }
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Twitter</label>
                <input
                  type="url"
                  value={config.socialMedia.twitter}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    socialMedia: { ...config.socialMedia, twitter: e.target.value }
                  })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          )}

          {activeTab === 'organization' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-white mb-4">Organization Details</h2>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">City</label>
                    <input
                      type="text"
                      value={config.address.addressLocality}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        address: { ...config.address, addressLocality: e.target.value }
                      })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Region</label>
                    <input
                      type="text"
                      value={config.address.addressRegion}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        address: { ...config.address, addressRegion: e.target.value }
                      })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Postal Code</label>
                    <input
                      type="text"
                      value={config.address.postalCode}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        address: { ...config.address, postalCode: e.target.value }
                      })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Street Address</label>
                    <input
                      type="text"
                      value={config.address.streetAddress}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        address: { ...config.address, streetAddress: e.target.value }
                      })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Parent Organization</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      type="text"
                      value={config.parentOrganization.name}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        parentOrganization: { ...config.parentOrganization, name: e.target.value }
                      })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">URL</label>
                    <input
                      type="url"
                      value={config.parentOrganization.url}
                      onChange={(e) => setConfig({ 
                        ...config, 
                        parentOrganization: { ...config.parentOrganization, url: e.target.value }
                      })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'programs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-white">Program Highlights</h2>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {config.programs?.length || 0} program{(config.programs?.length || 0) !== 1 ? 's' : ''}
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300">
                Program highlights are featured on the homepage and showcase the main activities of the organization.
                Each program can have a custom icon, image, and color scheme.
              </p>
              
              <div className="space-y-6">
                {config.programs && config.programs.map((program, index) => (
                  <div key={index} className="p-5 border rounded-xl shadow-sm dark:border-gray-700 transition-all hover:shadow-md">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${program.bgColor || 'bg-blue-50'}`}>
                          {program.icon ? (
                            <Image src={program.icon} alt="Program icon" width={20} height={20} className="w-5 h-5" />
                          ) : (
                            <div className="w-5 h-5 bg-gray-300 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <h3 className="font-medium text-lg text-gray-900 dark:text-white">
                          {program.title || `Program ${index + 1}`}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            // Move program up
                            if (index > 0) {
                              const newPrograms = [...config.programs];
                              [newPrograms[index], newPrograms[index - 1]] = [newPrograms[index - 1], newPrograms[index]];
                              setConfig({ ...config, programs: newPrograms });
                            }
                          }}
                          disabled={index === 0}
                          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${index === 0 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-600 dark:text-gray-300'}`}
                          title="Move up"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            // Move program down
                            if (index < config.programs.length - 1) {
                              const newPrograms = [...config.programs];
                              [newPrograms[index], newPrograms[index + 1]] = [newPrograms[index + 1], newPrograms[index]];
                              setConfig({ ...config, programs: newPrograms });
                            }
                          }}
                          disabled={index === config.programs.length - 1}
                          className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${index === config.programs.length - 1 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-600 dark:text-gray-300'}`}
                          title="Move down"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const newPrograms = config.programs.filter((_, i) => i !== index);
                            setConfig({ ...config, programs: newPrograms });
                          }}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                          title="Delete program"
                        >
                          <FiTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title</label>
                          <input
                            type="text"
                            value={program.title}
                            onChange={(e) => {
                              const newPrograms = [...config.programs];
                              newPrograms[index] = { ...program, title: e.target.value };
                              setConfig({ ...config, programs: newPrograms });
                            }}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="e.g., MUBES, Sosialisasi, LDK"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
                          <textarea
                            value={program.description}
                            onChange={(e) => {
                              const newPrograms = [...config.programs];
                              newPrograms[index] = { ...program, description: e.target.value };
                              setConfig({ ...config, programs: newPrograms });
                            }}
                            rows={3}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Brief description of the program"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Icon Path</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={program.icon}
                              onChange={(e) => {
                                const newPrograms = [...config.programs];
                                newPrograms[index] = { ...program, icon: e.target.value };
                                setConfig({ ...config, programs: newPrograms });
                              }}
                              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="/icons/program.svg"
                            />
                            {program.icon && (
                              <div className="flex-shrink-0 w-10 h-10 border rounded flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                                <Image src={program.icon} alt="Program icon" width={20} height={20} className="w-5 h-5" onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.src = '/icons/error.svg';
                                }} />
                              </div>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Path to SVG icon (e.g., /icons/program.svg)</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Image Path</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={program.image}
                              onChange={(e) => {
                                const newPrograms = [...config.programs];
                                newPrograms[index] = { ...program, image: e.target.value };
                                setConfig({ ...config, programs: newPrograms });
                              }}
                              className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder="/images/program1.jpg"
                            />
                            {program.image && (
                              <div className="flex-shrink-0 w-10 h-10 border rounded overflow-hidden">
                                <Image src={program.image} alt="Program image" width={40} height={40} className="w-full h-full object-cover" onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.src = '/images/program-placeholder.jpg';
                                }} />
                              </div>
                            )}
                          </div>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Path to background image (e.g., /images/program1.jpg)</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Gradient Color</label>
                            <input
                              type="text"
                              value={program.color}
                              onChange={(e) => {
                                const newPrograms = [...config.programs];
                                newPrograms[index] = { ...program, color: e.target.value };
                                setConfig({ ...config, programs: newPrograms });
                              }}
                              placeholder="from-blue-600 to-cyan-500"
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            {program.color && (
                              <div className={`mt-2 h-2 w-full rounded-full bg-gradient-to-r ${program.color}`}></div>
                            )}
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Background Color</label>
                            <input
                              type="text"
                              value={program.bgColor}
                              onChange={(e) => {
                                const newPrograms = [...config.programs];
                                newPrograms[index] = { ...program, bgColor: e.target.value };
                                setConfig({ ...config, programs: newPrograms });
                              }}
                              placeholder="bg-blue-50"
                              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                            {program.bgColor && (
                              <div className={`mt-2 h-6 w-full rounded ${program.bgColor}`}></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div className="mt-6 pt-4 border-t dark:border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</h4>
                      </div>
                      <div className={`${program.bgColor || 'bg-blue-50'} rounded-lg p-4 flex items-center gap-4 max-w-md`}>
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg shadow-md flex-shrink-0">
                          <div className={`absolute inset-0 bg-gradient-to-br ${program.color || 'from-blue-600 to-cyan-500'}`} style={{ mixBlendMode: 'multiply' }} />
                          {program.image ? (
                            <Image src={program.image} alt="Program image" width={64} height={64} className="h-full w-full object-cover" onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              const target = e.currentTarget as HTMLImageElement;
                              target.src = '/images/program-placeholder.jpg';
                            }} />
                          ) : (
                            <div className="h-full w-full bg-gray-300 animate-pulse"></div>
                          )}
                          {program.icon && (
                            <div className="absolute top-1 right-1 bg-white/90 rounded-full p-1 shadow-sm">
                              <Image src={program.icon} alt="Program icon" width={12} height={12} className="w-3 h-3" onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                const target = e.currentTarget as HTMLImageElement;
                                target.src = '/icons/error.svg';
                              }} />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{program.title || 'Program Title'}</h3>
                          <p className="text-sm text-gray-700 line-clamp-2">{program.description || 'Program description will appear here.'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => {
                    const newPrograms = config.programs || [];
                    setConfig({
                      ...config,
                      programs: [...newPrograms, { 
                        title: '', 
                        description: '', 
                        icon: '/icons/program.svg',
                        image: '/images/program-placeholder.jpg',
                        color: 'from-blue-600 to-cyan-500',
                        bgColor: 'bg-blue-50'
                      }]
                    });
                  }}
                  className="w-full p-3 border-2 border-dashed rounded-lg hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiPlus className="h-5 w-5" />
                    <span>Add New Program</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-white mb-4">Hero Section Slides</h2>
              <div className="space-y-4">
                {config.slides.map((slide: Slide, index: number) => (
                  <div key={index} className="p-4 border rounded dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">Slide {index + 1}</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const newSlides = config.slides.filter((_, i: number) => i !== index);
                          setConfig({ ...config, slides: newSlides });
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FiTrash />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Image Path</label>
                        <input
                          type="text"
                          value={slide.image}
                          onChange={(e) => {
                            const newSlides = [...config.slides];
                            newSlides[index] = { ...slide, image: e.target.value };
                            setConfig({ ...config, slides: newSlides });
                          }}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Alt Text</label>
                        <input
                          type="text"
                          value={slide.alt}
                          onChange={(e) => {
                            const newSlides = [...config.slides];
                            newSlides[index] = { ...slide, alt: e.target.value };
                            setConfig({ ...config, slides: newSlides });
                          }}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => {
                    setConfig({
                      ...config,
                      slides: [...config.slides, { image: '', alt: '' }]
                    });
                  }}
                  className="w-full p-2 border-2 border-dashed rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiPlus />
                    <span>Add New Slide</span>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'leadership' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-white mb-4">Leadership Team</h2>
              <div className="space-y-4">
                {config.leadershipTeam && config.leadershipTeam.map((member, index) => (
                  <div key={index} className="p-4 border rounded dark:border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-medium text-gray-900 dark:text-white">{member.name || `Member ${index + 1}`}</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const newTeam = config.leadershipTeam.filter((_, i) => i !== index);
                          setConfig({ ...config, leadershipTeam: newTeam });
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FiTrash />
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Name</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => {
                            const newTeam = [...config.leadershipTeam];
                            newTeam[index] = { ...member, name: e.target.value };
                            setConfig({ ...config, leadershipTeam: newTeam });
                          }}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Position</label>
                        <input
                          type="text"
                          value={member.position}
                          onChange={(e) => {
                            const newTeam = [...config.leadershipTeam];
                            newTeam[index] = { ...member, position: e.target.value };
                            setConfig({ ...config, leadershipTeam: newTeam });
                          }}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Department</label>
                        <input
                          type="text"
                          value={member.department}
                          onChange={(e) => {
                            const newTeam = [...config.leadershipTeam];
                            newTeam[index] = { ...member, department: e.target.value };
                            setConfig({ ...config, leadershipTeam: newTeam });
                          }}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Image Path</label>
                        <input
                          type="text"
                          value={member.imagePath}
                          onChange={(e) => {
                            const newTeam = [...config.leadershipTeam];
                            newTeam[index] = { ...member, imagePath: e.target.value };
                            setConfig({ ...config, leadershipTeam: newTeam });
                          }}
                          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => {
                    const newLeadershipTeam = config.leadershipTeam || [];
                    setConfig({
                      ...config,
                      leadershipTeam: [...newLeadershipTeam, { 
                        name: '', 
                        position: '', 
                        department: '',
                        imagePath: '' 
                      }]
                    });
                  }}
                  className="w-full p-2 border-2 border-dashed rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white transition-colors"
                >
                  <div className="flex items-center justify-center gap-2">
                    <FiPlus />
                    <span>Add New Leadership Member</span>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-white mb-4">Statistics</h2>
                <div className="space-y-4">
                  {config.stats && config.stats.map((stat, index) => (
                    <div key={index} className="p-4 border rounded dark:border-gray-700">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">{stat.title || `Stat ${index + 1}`}</h3>
                        <button
                          type="button"
                          onClick={() => {
                            const newStats = config.stats.filter((_, i) => i !== index);
                            setConfig({ ...config, stats: newStats });
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FiTrash />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title</label>
                          <input
                            type="text"
                            value={stat.title}
                            onChange={(e) => {
                              const newStats = [...config.stats];
                              newStats[index] = { ...stat, title: e.target.value };
                              setConfig({ ...config, stats: newStats });
                            }}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Value</label>
                          <input
                            type="number"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...config.stats];
                              newStats[index] = { ...stat, value: parseInt(e.target.value) || 0 };
                              setConfig({ ...config, stats: newStats });
                            }}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Icon (SVG path)</label>
                          <textarea
                            value={stat.icon}
                            onChange={(e) => {
                              const newStats = [...config.stats];
                              newStats[index] = { ...stat, icon: e.target.value };
                              setConfig({ ...config, stats: newStats });
                            }}
                            rows={3}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => {
                      const newStats = config.stats || [];
                      setConfig({
                        ...config,
                        stats: [...newStats, { 
                          title: '', 
                          value: 0, 
                          icon: '<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0z" /></svg>' 
                        }]
                      });
                    }}
                    className="w-full p-2 border-2 border-dashed rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FiPlus />
                      <span>Add New Statistic</span>
                    </div>
                  </button>
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t dark:border-gray-700">
                <h2 className="text-xl font-semibold text-blue-900 dark:text-white mb-4">Achievement Items</h2>
                <div className="space-y-4">
                  {config.achievements && config.achievements.map((achievement, index) => (
                    <div key={index} className="p-4 border rounded dark:border-gray-700">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">{achievement.title || `Achievement ${index + 1}`}</h3>
                        <button
                          type="button"
                          onClick={() => {
                            const newAchievements = config.achievements.filter((_, i) => i !== index);
                            setConfig({ ...config, achievements: newAchievements });
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FiTrash />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Title</label>
                          <input
                            type="text"
                            value={achievement.title}
                            onChange={(e) => {
                              const newAchievements = [...config.achievements];
                              newAchievements[index] = { ...achievement, title: e.target.value };
                              setConfig({ ...config, achievements: newAchievements });
                            }}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Description</label>
                          <textarea
                            value={achievement.description}
                            onChange={(e) => {
                              const newAchievements = [...config.achievements];
                              newAchievements[index] = { ...achievement, description: e.target.value };
                              setConfig({ ...config, achievements: newAchievements });
                            }}
                            rows={2}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Badge</label>
                          <input
                            type="text"
                            value={achievement.badge}
                            onChange={(e) => {
                              const newAchievements = [...config.achievements];
                              newAchievements[index] = { ...achievement, badge: e.target.value };
                              setConfig({ ...config, achievements: newAchievements });
                            }}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Color (CSS class)</label>
                          <input
                            type="text"
                            value={achievement.color}
                            onChange={(e) => {
                              const newAchievements = [...config.achievements];
                              newAchievements[index] = { ...achievement, color: e.target.value };
                              setConfig({ ...config, achievements: newAchievements });
                            }}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Date</label>
                          <input
                            type="text"
                            value={achievement.date}
                            onChange={(e) => {
                              const newAchievements = [...config.achievements];
                              newAchievements[index] = { ...achievement, date: e.target.value };
                              setConfig({ ...config, achievements: newAchievements });
                            }}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => {
                      const newAchievements = config.achievements || [];
                      setConfig({
                        ...config,
                        achievements: [...newAchievements, { 
                          title: '', 
                          description: '', 
                          badge: '',
                          color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
                          date: '' 
                        }]
                      });
                    }}
                    className="w-full p-2 border-2 border-dashed rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-white transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FiPlus />
                      <span>Add New Achievement</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t dark:border-gray-700">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}