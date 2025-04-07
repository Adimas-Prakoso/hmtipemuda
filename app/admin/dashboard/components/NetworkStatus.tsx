"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { FiWifi, FiWifiOff } from 'react-icons/fi';
import { measurePing, getConnectionQuality, getConnectionColor } from '../../../utils/networkUtils';

interface NetworkStatusProps {
  className?: string;
  refreshInterval?: number; // Refresh interval in milliseconds
}

const NetworkStatus = ({ className = '', refreshInterval = 2000 }: NetworkStatusProps) => {
  const [ping, setPing] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRealtime, setIsRealtime] = useState<boolean>(true);
  const pingHistory = useRef<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to check connection and measure ping wrapped in useCallback
  const checkConnection = useCallback(async () => {
    if (!isRealtime) return;
    
    try {
      const pingValue = await measurePing(undefined, 1); // Single ping sample for real-time updates
      setPing(pingValue);
      setIsOnline(true);
      
      // Keep a history of recent pings for smoothing
      pingHistory.current.push(pingValue);
      if (pingHistory.current.length > 5) {
        pingHistory.current.shift();
      }
    } catch (error) {
      console.error('Network check failed:', error);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, [isRealtime]); // Dependencies for the callback
  
  // Toggle real-time updates
  const toggleRealtime = () => {
    setIsRealtime(!isRealtime);
  };
  
  useEffect(() => {
    // Initial check
    checkConnection();
    
    // Set up real-time periodic checks
    if (isRealtime) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(checkConnection, refreshInterval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Handle online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      checkConnection();
    };
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshInterval, isRealtime, checkConnection]);
  
  // Calculate the average ping from history for smoother display
  const getDisplayPing = () => {
    if (!ping) return null;
    
    if (pingHistory.current.length === 0) {
      return ping;
    }
    
    // Calculate average ping from history
    const sum = pingHistory.current.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / pingHistory.current.length);
  };
  
  const displayPing = getDisplayPing();
  const quality = displayPing ? getConnectionQuality(displayPing) : 'poor';
  const colorClass = getConnectionColor(quality);
  
  return (
    <div className={`flex items-center gap-2 ${className}`} onClick={toggleRealtime} title={isRealtime ? "Click to pause real-time updates" : "Click to resume real-time updates"}>
      {isLoading ? (
        <div className="flex items-center text-gray-400">
          <FiWifi className="h-5 w-5 animate-pulse" />
          <span className="ml-1 text-sm font-medium">...</span>
        </div>
      ) : isOnline ? (
        <div className="flex items-center cursor-pointer">
          <FiWifi className={`h-5 w-5 ${colorClass} ${isRealtime ? 'animate-pulse' : ''}`} />
          <span className={`ml-1 text-sm font-medium ${colorClass}`}>{displayPing}ms</span>
        </div>
      ) : (
        <div className="flex items-center text-red-500 cursor-pointer">
          <FiWifiOff className="h-5 w-5" />
          <span className="ml-1 text-sm font-medium">Offline</span>
        </div>
      )}
    </div>
  );
};

export default NetworkStatus;
