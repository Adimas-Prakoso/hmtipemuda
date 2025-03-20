/**
 * Baileys polyfill for Bun
 * 
 * This file provides specific patches for the Baileys library to work with Bun.
 */

import { applyWebSocketPolyfill } from './websocket-polyfill.js';
import { applyMaskPatch, mask } from './baileys-mask-patch.js';

/**
 * Apply all necessary polyfills for Baileys to work with Bun
 */
export function applyBaileysPolyfills() {
  console.log('Applying Baileys polyfills for Bun...');
  
  // Apply WebSocket polyfill
  const wsPolyfillApplied = applyWebSocketPolyfill();
  
  // Apply the mask patch
  const maskPatchApplied = applyMaskPatch();
  
  // Define the mask function directly to ensure it's always available
  const maskFunction = function(source, mask, output, offset, length) {
    for (let i = 0; i < length; i++) {
      output[offset + i] = source[i] ^ mask[i & 3];
    }
    return output;
  };
  
  // Add any additional Baileys-specific polyfills here
  
  // Monkey patch the t.mask function that Baileys tries to use
  // This is a more direct approach to fix the specific error
  if (typeof globalThis !== 'undefined') {
    // Create a global t object with mask function if it doesn't exist
    if (!globalThis.t) {
      globalThis.t = {};
    }
    
    // Add mask function to t object - use both the imported mask and direct implementation
    globalThis.t.mask = mask || maskFunction;
    console.log('Added mask function to globalThis.t');
    
    // Add mask function to various objects that might be used by Baileys
    const objects = ['WebSocket', 'ws', 'socket', 'conn'];
    
    objects.forEach(objName => {
      if (globalThis[objName]) {
        // Add to the constructor
        globalThis[objName].mask = mask || maskFunction;
        
        // Add to the prototype if it exists
        if (globalThis[objName].prototype) {
          globalThis[objName].prototype.mask = mask || maskFunction;
        }
        
        console.log(`Added mask function to globalThis.${objName}`);
      }
    });
    
    // Add mask as a global function
    globalThis.mask = mask || maskFunction;
    console.log('Added mask function to globalThis');
  }
  
  // Create a t object with mask function if it doesn't exist
  if (typeof globalThis.t === 'undefined') {
    globalThis.t = { mask: mask || maskFunction };
    console.log('Created globalThis.t with mask function');
  } else if (typeof globalThis.t.mask === 'undefined') {
    globalThis.t.mask = mask || maskFunction;
    console.log('Added mask function to existing globalThis.t');
  }
  
  // Special handling for production environment
  if (process.env.NODE_ENV === 'production') {
    console.log('Production environment detected, applying additional patches...');
    
    // Create a global variable to ensure t.mask is available
    try {
      // Create a global t object with mask function
      const tObj = { mask: maskFunction };
      
      // Try to assign it to various global objects
      if (typeof global !== 'undefined') {
        global.t = tObj;
      }
      
      if (typeof globalThis !== 'undefined') {
        globalThis.t = tObj;
      }
      
      // Try to assign it to the window object if in browser environment
      if (typeof window !== 'undefined') {
        window.t = tObj;
      }
      
      console.log('Applied production-specific patches for t.mask');
    } catch (error) {
      console.warn('Failed to apply production-specific patches:', error);
    }
  }
  
  // Return success status
  return wsPolyfillApplied && maskPatchApplied;
}
