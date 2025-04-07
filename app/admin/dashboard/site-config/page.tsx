'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash } from 'react-icons/fi';

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
        achievements: Array.isArray(config.achievements) ? config.achievements : []
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