import { Elysia } from 'elysia'
import os from 'os'

// Track application start time
const startTime = new Date()

interface StorageError {
  error: string;
}

interface StorageData {
  total: string;
  used: string;
  free: string;
  percentUsed: number;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const app = new Elysia({ prefix: '/api' })
  .get('/system', async () => {
    try {
      // RAM information
      const totalMemory = os.totalmem();
      const freeMemory = os.freemem();
      const usedMemory = totalMemory - freeMemory;
      
      // CPU information
      const cpus = os.cpus();
      const cpuCount = cpus.length;
      const cpuModel = cpus[0].model;
      const loadAvg = os.loadavg()[0]; // 1 minute load average
      const cpuUsage = Math.min(Math.round((loadAvg / cpuCount) * 100), 100);
      
      // Storage information
      let storageInfo: StorageData | StorageError = { error: 'Storage information not available' };
      
      try {
        const si = await import('systeminformation');
        const fsSize = await si.fsSize();
        
        if (fsSize && Array.isArray(fsSize) && fsSize.length > 0) {
          const mainDisk = fsSize[0];
          storageInfo = {
            total: formatBytes(mainDisk.size),
            used: formatBytes(mainDisk.used),
            free: formatBytes(mainDisk.size - mainDisk.used),
            percentUsed: mainDisk.use
          };
        }
      } catch (error) {
        console.error('Error getting storage info:', error);
        storageInfo = { error: 'Storage information unavailable' };
      }
      
      // Calculate runtime
      const currentTime = new Date()
      const runtime = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000) // Convert to seconds

      return {
        success: true,
        data: {
          runtime: {
            startTime: startTime.toISOString(),
            uptime: `${Math.floor(runtime / 3600)}h ${Math.floor((runtime % 3600) / 60)}m ${runtime % 60}s`,
            uptimeSeconds: runtime
          },
          ram: {
            total: formatBytes(totalMemory),
            used: formatBytes(usedMemory),
            free: formatBytes(freeMemory),
            usagePercent: Math.round((usedMemory / totalMemory) * 100)
          },
          cpu: {
            model: cpuModel,
            cores: cpuCount,
            usagePercent: cpuUsage
          },
          storage: storageInfo,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error handling system info request:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to retrieve system information' 
        }), 
        { status: 500 }
      );
    }
  });

export const GET = app.handle
