'use client';

import { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { IoMdAdd, IoMdTrash } from 'react-icons/io';
import { IoToggle } from 'react-icons/io5';
import { toast } from 'react-hot-toast';

// Interface for WhatsApp session
interface SessionConfig {
  id: string;
  name: string;
  enabled: boolean;
  createdAt: string;
  status?: 'connecting' | 'connected' | 'disconnected';
  qrCode?: string | null;
}

// Interface for command configuration
interface CommandConfig {
  type: 'text' | 'image' | 'video' | 'api';
  response: string;
  caseInsensitive: boolean;
  mediaUrl?: string;
  caption?: string;
  apiUrl?: string;
  apiResponsePath?: string;
}

// Interface for new command
interface Command {
  command: string;
  type: 'text' | 'image' | 'video' | 'api';
  response: string;
  caseInsensitive?: boolean;
  mediaUrl?: string;
  caption?: string;
  apiUrl?: string;
  apiResponsePath?: string;
}

// Interface for WhatsApp groups
interface GroupConfig {
  id: string;
  name: string;
  enabled: boolean;
}

export default function WhatsAppPage() {
  const [sessions, setSessions] = useState<SessionConfig[]>([]);
  const [commands, setCommands] = useState<Record<string, CommandConfig>>({});
  const [groups, setGroups] = useState<GroupConfig[]>([]);
  const [newCommand, setNewCommand] = useState<Command>({ command: '', type: 'text', response: '', caseInsensitive: false, mediaUrl: '', caption: '', apiUrl: '', apiResponsePath: 'result' });
  // commandType is now managed directly in newCommand.type
  const [newSessionName, setNewSessionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sessions');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check dark mode from localStorage or system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      setIsDarkMode(savedMode ? JSON.parse(savedMode) : false);
    }
  }, []);

  // Fetch WhatsApp data
  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/whatsapp');
      const data = await response.json();
      
      if (data.success) {
        setSessions(data.sessions || []);
        setCommands(data.commands || {});
        setGroups(data.groups || []);
        
        // Set active session if none is selected and sessions exist
        if (!activeSessionId && data.sessions && data.sessions.length > 0) {
          setActiveSessionId(data.sessions[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching WhatsApp data:', error);
      toast.error('Failed to fetch WhatsApp data');
    }
  }, [activeSessionId]);

  // Create a new session
  const createSession = async () => {
    if (!newSessionName.trim()) {
      toast.error('Session name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'createSession',
          name: newSessionName.trim(),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        setNewSessionName('');
        fetchData();
        
        // Set the new session as active
        if (data.session) {
          setActiveSessionId(data.session.id);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  // Delete a session
  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteSession',
          sessionId,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        
        // If the active session was deleted, set another one as active
        if (activeSessionId === sessionId) {
          setActiveSessionId(null);
        }
        
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    } finally {
      setLoading(false);
    }
  };

  // Connect to WhatsApp
  const connectToWhatsApp = async (sessionId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'connect',
          sessionId
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error connecting to WhatsApp:', error);
      toast.error('Failed to connect to WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect from WhatsApp
  const disconnectFromWhatsApp = async (sessionId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'disconnect',
          sessionId
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error disconnecting from WhatsApp:', error);
      toast.error('Failed to disconnect from WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  // Toggle session enabled status
  const toggleSession = async (sessionId: string, currentEnabled: boolean) => {
    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'toggleSession',
          sessionId,
          enabled: !currentEnabled,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error toggling session:', error);
      toast.error('Failed to toggle session');
    } finally {
      setLoading(false);
    }
  };

  // Rename a session
  const renameSession = async (sessionId: string, newName: string) => {
    if (!newName.trim()) {
      toast.error('Session name cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'renameSession',
          sessionId,
          name: newName.trim(),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error renaming session:', error);
      toast.error('Failed to rename session');
    } finally {
      setLoading(false);
    }
  };

  // Add a new command
  const addCommand = async () => {
    if (!newCommand.command) {
      toast.error('Command is required');
      return;
    }
    
    // Validate based on command type
    if (newCommand.type === 'text' && !newCommand.response) {
      toast.error('Text response is required');
      return;
    }
    
    if ((newCommand.type === 'image' || newCommand.type === 'video') && !newCommand.mediaUrl) {
      toast.error(`${newCommand.type.charAt(0).toUpperCase() + newCommand.type.slice(1)} URL/path is required`);
      return;
    }
    
    if (newCommand.type === 'api' && !newCommand.apiUrl) {
      toast.error('API URL is required');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addCommand',
          command: newCommand.command,
          type: newCommand.type,
          response: newCommand.response,
          caseInsensitive: newCommand.caseInsensitive,
          mediaUrl: (newCommand.type === 'image' || newCommand.type === 'video') ? newCommand.mediaUrl : undefined,
          caption: (newCommand.type === 'image' || newCommand.type === 'video') ? newCommand.caption : undefined,
          apiUrl: newCommand.type === 'api' ? newCommand.apiUrl : undefined,
          apiResponsePath: newCommand.type === 'api' ? newCommand.apiResponsePath : undefined,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        setNewCommand({ 
          command: '', 
          type: 'text', 
          response: '', 
          caseInsensitive: false, 
          mediaUrl: '', 
          caption: '', 
          apiUrl: '', 
          apiResponsePath: 'result' 
        });
        // Type is already reset in newCommand
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error adding command:', error);
      toast.error('Failed to add command');
    } finally {
      setLoading(false);
    }
  };

  // Toggle case-insensitive matching for a command
  const toggleCaseInsensitive = async (command: string, currentValue: boolean) => {
    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateCommand',
          command,
          caseInsensitive: !currentValue,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error updating command:', error);
      toast.error('Failed to update command');
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle group enabled status
  const toggleGroup = async (groupId: string, currentEnabled: boolean) => {
    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'toggleGroup',
          groupId,
          enabled: !currentEnabled,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error toggling group:', error);
      toast.error('Failed to toggle group');
    } finally {
      setLoading(false);
    }
  };

  // Delete a command
  const deleteCommand = async (command: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'deleteCommand',
          command,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error deleting command:', error);
      toast.error('Failed to delete command');
    } finally {
      setLoading(false);
    }
  };

  // Media sending functionality is now handled through the command system

  // Function to test API response
  const testApiResponse = async () => {
    if (!newCommand.apiUrl) {
      toast.error('Please enter an API URL');
      return;
    }
    
    setLoading(true);
    try {
      // First log the request for debugging
      console.log('Testing API:', {
        apiUrl: newCommand.apiUrl,
        apiResponsePath: newCommand.apiResponsePath || 'result'
      });
      
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'testApiResponse',
          apiUrl: newCommand.apiUrl,
          apiResponsePath: newCommand.apiResponsePath || 'result',
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API test response:', data);
      
      if (data.success) {
        toast.success(`API Response: ${data.response.substring(0, 100)}${data.response.length > 100 ? '...' : ''}`);
      } else {
        toast.error(data.message || 'API test failed');
      }
    } catch (error) {
      console.error('Error testing API response:', error);
      toast.error(`Failed to test API response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Set up polling for status updates
  useEffect(() => {
    fetchData();
    
    const interval = setInterval(fetchData, 5000);
    
    // Clean up function
    return () => {
      clearInterval(interval);
    };
  }, [fetchData]); // Include fetchData in the dependency array

  // Get active session
  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Add styles for dark mode
  const darkModeStyles = {
    backgroundColor: 'bg-gray-800',
    cardBg: 'bg-gray-700',
    textColor: 'text-white',
    mutedTextColor: 'text-gray-300',
    borderColor: 'border-gray-600',
    hoverBgColor: 'hover:bg-gray-600',
    inputBg: 'bg-gray-700',
    shadow: 'shadow-lg shadow-gray-900/20'
  };

  const lightModeStyles = {
    backgroundColor: 'bg-gray-50',
    cardBg: 'bg-white',
    textColor: 'text-gray-900',
    mutedTextColor: 'text-gray-500',
    borderColor: 'border-gray-200',
    hoverBgColor: 'hover:bg-gray-100',
    inputBg: 'bg-white',
    shadow: 'shadow-lg shadow-gray-200/50'
  };

  const currentStyles = isDarkMode ? darkModeStyles : lightModeStyles;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark text-white' : 'text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">

        
        {/* Tabs */}
        <div className="flex justify-center mb-8 bg-white dark:bg-gray-800 rounded-xl p-2 shadow-md">
          <div className="flex space-x-2">
            <button
              className={`px-6 py-2.5 font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'sessions'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('sessions')}
            >
              Sessions
            </button>
            <button
              className={`px-6 py-2.5 font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'commands'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('commands')}
            >
              Commands
            </button>
            <button
              className={`px-6 py-2.5 font-medium rounded-lg transition-all duration-200 ${
                activeTab === 'groups'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab('groups')}
            >
              Groups
            </button>
          </div>
        </div>
        
        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session List */}
            <div className={`rounded-xl p-6 ${currentStyles.shadow} ${currentStyles.cardBg}`}>
              <h2 className={`text-xl font-semibold mb-4 ${currentStyles.textColor}`}>WhatsApp Sessions</h2>
              {/* Remove duplicate tab buttons */}
              
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
                <h2 className={`text-xl font-semibold ${currentStyles.textColor}`}>WhatsApp Sessions</h2>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="New session name"
                      value={newSessionName}
                      onChange={(e) => setNewSessionName(e.target.value)}
                      className={`border ${currentStyles.borderColor} ${currentStyles.inputBg} rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-full`}
                    />
                  </div>
                  <button
                    onClick={createSession}
                    disabled={loading || !newSessionName.trim()}
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 flex items-center transition-all duration-200 shadow-md hover:shadow-lg`}
                  >
                    <IoMdAdd className="mr-1" /> Add Session
                  </button>
                </div>
              </div>
              
              {sessions.length === 0 ? (
                <div className="text-center py-12 px-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <p className={`${currentStyles.mutedTextColor} text-lg`}>
                    No WhatsApp sessions found. Create a new session to get started.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className={`border ${currentStyles.borderColor} rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
                        activeSessionId === session.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : `${currentStyles.cardBg} ${currentStyles.hoverBgColor}`
                      }`}
                      onClick={() => setActiveSessionId(session.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 animate-pulse ${
                              session.status === 'connected' ? 'bg-green-500 shadow-sm shadow-green-500/50' :
                              session.status === 'connecting' ? 'bg-yellow-500 shadow-sm shadow-yellow-500/50' : 'bg-red-500 shadow-sm shadow-red-500/50'
                            }`}></div>
                            <h4 className={`font-medium ${currentStyles.textColor}`}>{session.name}</h4>
                          </div>
                          <p className={`text-xs ${currentStyles.textColor} mt-1`}>
                            Created: {new Date(session.createdAt).toLocaleString()}
                          </p>
                          <p className={`text-xs ${currentStyles.textColor}`}>
                            Status: <span className="capitalize">{session.status}</span>
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newName = prompt('Enter new session name:', session.name);
                              if (newName !== null) {
                                renameSession(session.id, newName);
                              }
                            }}
                            className="text-blue-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            title="Rename session"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSession(session.id, session.enabled);
                            }}
                            className={`p-1.5 rounded-full ${session.enabled ? 'text-green-500 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30' : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'} transition-colors`}
                            title={session.enabled ? 'Disable session' : 'Enable session'}
                          >
                            <IoToggle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSession(session.id);
                            }}
                            className="text-red-500 hover:text-red-600 p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete session"
                          >
                            <IoMdTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Active Session */}
            <div className={`rounded-xl p-6 ${currentStyles.shadow} ${currentStyles.cardBg}`}>
              {activeSession ? (
                <>
                  <h2 className={`text-xl font-semibold mb-4 ${currentStyles.textColor}`}>Session: {activeSession.name}</h2>
                  
                  <div className="flex items-center mb-4">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      activeSession.status === 'connected' ? 'bg-green-500' :
                      activeSession.status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="capitalize">{activeSession.status}</span>
                  </div>
                  
                  {activeSession.status === 'disconnected' ? (
                    <button
                      onClick={() => connectToWhatsApp(activeSession.id)}
                      disabled={loading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      Connect to WhatsApp
                    </button>
                  ) : (
                    <button
                      onClick={() => disconnectFromWhatsApp(activeSession.id)}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                    >
                      Disconnect
                    </button>
                  )}
                  
                  {/* QR Code Display */}
                  {activeSession.qrCode && (
                    <div className="mt-6">
                      <h3 className={`text-lg font-medium mb-2 ${currentStyles.textColor}`}>Scan QR Code</h3>
                      <div className="bg-white p-6 inline-block rounded-lg shadow-md border border-gray-100 dark:border-gray-700">
                        <QRCodeSVG value={activeSession.qrCode} size={200} />
                      </div>
                      <p className={`mt-3 text-sm ${currentStyles.mutedTextColor}`}>Open WhatsApp on your phone, tap Menu or Settings and select WhatsApp Web. Point your phone to this screen to capture the QR code.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 px-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <p className={`${currentStyles.mutedTextColor} text-lg`}>
                    {sessions.length > 0
                      ? 'Select a session from the list to manage it'
                      : 'Create a new session to get started'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Commands Tab */}
        {activeTab === 'commands' && (
          <div className={`rounded-xl p-6 shadow-sm ${currentStyles.backgroundColor}`}>
            <h2 className={`text-xl font-semibold mb-4 ${currentStyles.textColor}`}>Command Management</h2>
            
            <div className="mb-6">
              <h3 className={`text-lg font-medium mb-2 ${currentStyles.textColor}`}>Add New Command</h3>
              <div className="flex flex-col space-y-3">
                <input
                  type="text"
                  placeholder="Command (e.g., 'Hai')"
                  value={newCommand.command}
                  onChange={(e) => setNewCommand({ ...newCommand, command: e.target.value })}
                  className={`border ${currentStyles.borderColor} dark:bg-gray-700 rounded-md px-3 py-2`}
                />
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${currentStyles.textColor}`}>Response Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['text', 'image', 'video', 'api'].map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          setNewCommand({ ...newCommand, type: type as 'text' | 'image' | 'video' | 'api' });
                        }}
                        className={`px-3 py-2 rounded-lg capitalize transition-all ${newCommand.type === type ? 'bg-blue-600 text-white' : `${currentStyles.cardBg} ${currentStyles.borderColor} border`}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                
                {newCommand.type === 'text' && (
                  <div>
                    <label className={`block mb-1 text-sm font-medium ${currentStyles.textColor}`}>Text Response</label>
                    <textarea
                      placeholder="Response (e.g., 'Hello')"
                      value={newCommand.response}
                      onChange={(e) => setNewCommand({ ...newCommand, response: e.target.value })}
                      className={`w-full border ${currentStyles.borderColor} dark:bg-gray-700 rounded-md px-3 py-2 min-h-[80px]`}
                    />
                  </div>
                )}
                
                {(newCommand.type === 'image' || newCommand.type === 'video') && (
                  <div className="space-y-3">
                    <div>
                      <label className={`block mb-1 text-sm font-medium ${currentStyles.textColor}`}>
                        {newCommand.type === 'image' ? 'Image URL/Path' : 'Video URL/Path'}
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter ${newCommand.type} URL or path in public folder (e.g., /images/file.jpg)`}
                        value={newCommand.mediaUrl}
                        onChange={(e) => setNewCommand({ ...newCommand, mediaUrl: e.target.value })}
                        className={`w-full border ${currentStyles.borderColor} dark:bg-gray-700 rounded-md px-3 py-2`}
                      />
                      <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">You can use a URL (https://...) or a path to a file in the public folder</p>
                    </div>
                    <div>
                      <label className={`block mb-1 text-sm font-medium ${currentStyles.textColor}`}>Caption (optional)</label>
                      <textarea
                        placeholder="Enter caption for the media"
                        value={newCommand.caption}
                        onChange={(e) => setNewCommand({ ...newCommand, caption: e.target.value })}
                        className={`w-full border ${currentStyles.borderColor} dark:bg-gray-700 rounded-md px-3 py-2 min-h-[60px]`}
                      />
                    </div>
                  </div>
                )}
                
                {newCommand.type === 'api' && (
                  <div className="space-y-3">
                    <div>
                      <label className={`block mb-1 text-sm font-medium ${currentStyles.textColor}`}>API URL</label>
                      <input
                        type="text"
                        placeholder="e.g., https://api.lolhuman.xyz/api/random/faktaunik?apikey=yourapikey"
                        value={newCommand.apiUrl}
                        onChange={(e) => setNewCommand({ ...newCommand, apiUrl: e.target.value })}
                        className={`w-full border ${currentStyles.borderColor} dark:bg-gray-700 rounded-md px-3 py-2`}
                      />
                    </div>
                    <div>
                      <label className={`block mb-1 text-sm font-medium ${currentStyles.textColor}`}>Response Path</label>
                      <input
                        type="text"
                        placeholder="e.g., result or data.items[0].text"
                        value={newCommand.apiResponsePath}
                        onChange={(e) => setNewCommand({ ...newCommand, apiResponsePath: e.target.value })}
                        className={`w-full border ${currentStyles.borderColor} dark:bg-gray-700 rounded-md px-3 py-2`}
                      />
                      <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Specify the path to extract from the API response (e.g., &quot;result&quot; or &quot;data.content&quot;)</p>
                    </div>
                    <div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Test API button clicked');
                          if (newCommand.apiUrl) {
                            testApiResponse();
                          } else {
                            toast.error('Please enter an API URL');
                          }
                        }}
                        disabled={loading || !newCommand.apiUrl}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Testing...' : 'Test API'}
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="case-insensitive-new"
                    checked={newCommand.caseInsensitive}
                    onChange={(e) => setNewCommand({ ...newCommand, caseInsensitive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                  <label htmlFor="case-insensitive-new" className={`text-sm ${currentStyles.textColor}`}>
                    Case insensitive (respond to both upper and lowercase)
                  </label>
                </div>
                <button
                  onClick={addCommand}
                  disabled={loading || !newCommand.command || 
                    (newCommand.type === 'text' && !newCommand.response) || 
                    ((newCommand.type === 'image' || newCommand.type === 'video') && !newCommand.mediaUrl) || 
                    (newCommand.type === 'api' && !newCommand.apiUrl)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50 flex items-center justify-center"
                >
                  <IoMdAdd className="mr-1" /> Add Command
                </button>
              </div>
            </div>
            
            <div>
              <h3 className={`text-lg font-medium mb-2 ${currentStyles.textColor}`}>Existing Commands</h3>
              {Object.keys(commands).length === 0 ? (
                <p className={`text-gray-500 dark:text-gray-400 ${currentStyles.textColor}`}>No commands added yet</p>
              ) : (
                <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                  {Object.entries(commands).map(([command, config]) => (
                    <div key={command} className={`border ${currentStyles.borderColor} rounded-md p-3`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-medium ${currentStyles.textColor}`}>Command: &quot;{command}&quot;</h4>
                          <div className="flex items-center mt-1 mb-2">
                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${config.type === 'text' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' : 
                              config.type === 'image' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                              config.type === 'video' ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100' : 
                              'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'}`}>
                              {config.type.charAt(0).toUpperCase() + config.type.slice(1)}
                            </span>
                          </div>
                          
                          {config.type === 'text' && (
                            <p className={`text-sm ${currentStyles.textColor} mt-1`}>Response: &quot;{config.response}&quot;</p>
                          )}
                          
                          {(config.type === 'image' || config.type === 'video') && (
                            <>
                              <p className={`text-xs ${currentStyles.textColor} mt-1`}>Media URL: {config.mediaUrl}</p>
                              {config.caption && (
                                <p className={`text-xs ${currentStyles.textColor} mt-1`}>Caption: &quot;{config.caption}&quot;</p>
                              )}
                            </>
                          )}
                          
                          {config.type === 'api' && (
                            <>
                              <p className={`text-xs ${currentStyles.textColor} mt-1`}>API URL: {config.apiUrl}</p>
                              <p className={`text-xs ${currentStyles.textColor} mt-1`}>Response Path: {config.apiResponsePath || 'result'}</p>
                            </>
                          )}
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => toggleCaseInsensitive(command, config.caseInsensitive)}
                              className={`flex items-center text-xs px-2 py-1 rounded ${config.caseInsensitive ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                              title={config.caseInsensitive ? 'Case insensitive enabled' : 'Case insensitive disabled'}
                            >
                              <IoToggle className={`mr-1 ${config.caseInsensitive ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`} />
                              {config.caseInsensitive ? 'Case insensitive: ON' : 'Case insensitive: OFF'}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCommand(command)}
                          className="text-red-500 hover:text-red-600"
                          title="Delete command"
                        >
                          <IoMdTrash size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            

          </div>
        )}
        
        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <div className={`rounded-xl p-6 shadow-sm ${currentStyles.backgroundColor}`}>
            <h2 className={`text-xl font-semibold mb-4 ${currentStyles.textColor}`}>WhatsApp Groups</h2>
            
            {groups.length === 0 ? (
              <div className="text-center py-8">
                <p className={`text-gray-500 dark:text-gray-400 ${currentStyles.textColor}`}>
                  {sessions.some(s => s.status === 'connected') ?
                    'No groups found. Join a WhatsApp group to see it here.' :
                    'Connect to WhatsApp first to see your groups.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {groups.map((group) => (
                  <div key={group.id} className={`border ${currentStyles.borderColor} rounded-md p-3`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className={`font-medium truncate max-w-xs ${currentStyles.textColor}`}>{group.name}</h4>
                        <p className={`text-xs ${currentStyles.textColor} mt-1`}>
                          {group.enabled ?
                            'Will respond to commands in this group' :
                            'Will not respond to commands in this group'}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleGroup(group.id, group.enabled)}
                        disabled={loading}
                        className={`flex items-center text-xs px-3 py-1.5 rounded-full transition-colors ${group.enabled ?
                          'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 hover:bg-green-200 dark:hover:bg-green-700' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                      >
                        <IoToggle className={`mr-1.5 text-lg ${group.enabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`} />
                        {group.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
