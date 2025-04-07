/**
 * Network utility functions for measuring ping and connection quality
 */

/**
 * Measure ping to a specified URL
 * @param url The URL to ping (defaults to current origin)
 * @param samples Number of ping samples to collect
 * @returns Promise resolving to ping in milliseconds
 */
export const measurePing = async (
  url: string = window.location.origin,
  samples: number = 3
): Promise<number> => {
  const results: number[] = [];
  
  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    
    try {
      // Add a cache-busting parameter to prevent caching
      const pingUrl = `${url}/api/ping?t=${Date.now()}`;
      const response = await fetch(pingUrl, { 
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const end = performance.now();
        results.push(end - start);
      }
    } catch (error) {
      console.error('Ping measurement error:', error);
      // If fetch fails, use a high ping value to indicate poor connection
      results.push(1000);
    }
    
    // Small delay between samples
    if (i < samples - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  // Calculate average ping, filtering out any extremely high values
  const validResults = results.filter(ping => ping < 2000);
  
  if (validResults.length === 0) {
    return 1000; // Default high ping if all measurements failed
  }
  
  // Return the average ping rounded to nearest integer
  return Math.round(validResults.reduce((sum, ping) => sum + ping, 0) / validResults.length);
};

/**
 * Get connection quality based on ping value
 * @param ping Ping value in milliseconds
 * @returns Connection quality as 'excellent', 'good', 'fair', or 'poor'
 */
export const getConnectionQuality = (ping: number): 'excellent' | 'good' | 'fair' | 'poor' => {
  if (ping < 50) return 'excellent';
  if (ping < 100) return 'good';
  if (ping < 300) return 'fair';
  return 'poor';
};

/**
 * Get color for connection quality
 * @param quality Connection quality
 * @returns Color code for the quality
 */
export const getConnectionColor = (quality: 'excellent' | 'good' | 'fair' | 'poor'): string => {
  switch (quality) {
    case 'excellent': return 'text-green-500';
    case 'good': return 'text-green-400';
    case 'fair': return 'text-yellow-400';
    case 'poor': return 'text-red-500';
    default: return 'text-gray-400';
  }
};
