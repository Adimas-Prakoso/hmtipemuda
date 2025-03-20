/**
 * WebSocket polyfill for Bun
 * 
 * This file provides a WebSocket polyfill for Bun that fixes compatibility issues
 * with the Baileys library, specifically adding the missing mask function and
 * patching other WebSocket-related functions.
 */

/**
 * Applies necessary patches to make Baileys work with Bun's WebSocket implementation
 */
export function applyWebSocketPolyfill() {
  try {
    // Check if we're in a Bun environment or if we're in a production environment
    const isBun = typeof process !== 'undefined' && process.versions && process.versions.bun;
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isBun || isProduction) {
      console.log(`${isBun ? 'Bun' : 'Production'} environment detected, applying WebSocket polyfill...`);
      
      // Get access to the global WebSocket object
      const globalWs = globalThis.WebSocket;
      
      // Add mask function to WebSocket.prototype if it doesn't exist
      if (typeof globalWs !== 'undefined') {
        console.log('Adding mask function to WebSocket.prototype');
        
        // Define the mask function that Baileys expects
        const maskFunction = function(source, mask, output, offset, length) {
          for (let i = 0; i < length; i++) {
            output[offset + i] = source[i] ^ mask[i & 3];
          }
          return output;
        };
        
        // First add it as a static method on the WebSocket constructor
        if (!globalWs.mask) {
          globalWs.mask = maskFunction;
        }
        
        // Then add it to the prototype
        if (!globalWs.prototype.mask) {
          globalWs.prototype.mask = maskFunction;
        }
        
        // Create a wrapper class that extends the original WebSocket
        const OriginalWebSocket = globalWs;
        class PolyfillWebSocket extends OriginalWebSocket {
          constructor(...args) {
            super(...args);
          }
          
          // Add the mask function to the instance
          mask(source, mask, output, offset, length) {
            for (let i = 0; i < length; i++) {
              output[offset + i] = source[i] ^ mask[i & 3];
            }
            return output;
          }
        }
        
        // Add the static mask method to the polyfill class
        PolyfillWebSocket.mask = function(source, mask, output, offset, length) {
          for (let i = 0; i < length; i++) {
            output[offset + i] = source[i] ^ mask[i & 3];
          }
          return output;
        };
        
        // Replace the global WebSocket with our polyfill
        globalThis.WebSocket = PolyfillWebSocket;
        
        console.log('WebSocket polyfill successfully applied');
      } else {
        console.log('WebSocket not found');
      }
    } else {
      console.log('Not running in Bun environment, skipping WebSocket polyfill');
    }
  } catch (error) {
    console.error('Error applying WebSocket polyfill:', error);
  }
}
