/**
 * Direct patch for Baileys mask function
 * 
 * This file provides a direct patch for the mask function used by Baileys,
 * which is needed when running in Bun.
 */

/**
 * The mask function implementation that Baileys expects
 */
export function mask(source, mask, output, offset, length) {
  for (let i = 0; i < length; i++) {
    output[offset + i] = source[i] ^ mask[i & 3];
  }
  return output;
}

/**
 * Apply the mask patch directly to the global scope
 */
export function applyMaskPatch() {
  try {
    // Add the mask function to the global scope
    if (typeof global !== 'undefined') {
      global.mask = mask;
      
      // Also ensure t object exists with mask function
      if (!global.t) {
        global.t = {};
      }
      global.t.mask = mask;
    }
    
    // Add the mask function to globalThis
    if (typeof globalThis !== 'undefined') {
      globalThis.mask = mask;
      
      // Also ensure t object exists with mask function
      if (!globalThis.t) {
        globalThis.t = {};
      }
      globalThis.t.mask = mask;
    }
    
    // Add the mask function to WebSocket if it exists
    if (typeof WebSocket !== 'undefined') {
      WebSocket.mask = mask;
      WebSocket.prototype.mask = mask;
    }
    
    console.log('Mask function patch applied successfully');
    return true;
  } catch (error) {
    console.error('Failed to apply mask function patch:', error);
    return false;
  }
}
