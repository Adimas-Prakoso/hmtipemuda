import { NextRequest, NextResponse } from 'next/server';
import { makeWASocket, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys';
import { useMultiFileAuthState as baileysUseMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { promises as fs } from 'fs';
import path from 'path';
import axios from 'axios';

// Base path for WhatsApp sessions
const SESSIONS_BASE_DIR = path.join(process.cwd(), 'data', 'whatsapp-sessions');

// Path to store command configurations
const COMMANDS_PATH = path.join(process.cwd(), 'data', 'whatsapp-commands.json');

// Path to store group configurations
const GROUPS_PATH = path.join(process.cwd(), 'data', 'whatsapp-groups.json');

// Path to store session configurations
const SESSIONS_CONFIG_PATH = path.join(process.cwd(), 'data', 'whatsapp-sessions-config.json');

// Initialize commands storage with case-insensitive option
interface CommandConfig {
  type: 'text' | 'image' | 'video' | 'api';
  response: string;
  caseInsensitive: boolean;
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

// Interface for WhatsApp session
interface SessionConfig {
  id: string;
  name: string;
  enabled: boolean;
  commandsEnabled: boolean; // Whether this session should respond to commands
  createdAt: string;
}

// Interface for WhatsApp session state
interface SessionState {
  sock: ReturnType<typeof makeWASocket> | null;
  qrCode: string | null;
  connectionState: 'connecting' | 'connected' | 'disconnected';
}

let commands: { [key: string]: CommandConfig } = {};
let groups: GroupConfig[] = [];
let sessions: SessionConfig[] = [];
const sessionStates: Map<string, SessionState> = new Map();

// Load commands from file
async function loadCommands() {
  try {
    await fs.mkdir(path.dirname(COMMANDS_PATH), { recursive: true });
    const data = await fs.readFile(COMMANDS_PATH, 'utf-8').catch(() => '{}');
    commands = JSON.parse(data);
  } catch (error) {
    console.error('Error loading commands:', error);
    commands = {};
  }
}

// Save commands to file
async function saveCommands() {
  try {
    await fs.mkdir(path.dirname(COMMANDS_PATH), { recursive: true });
    await fs.writeFile(COMMANDS_PATH, JSON.stringify(commands, null, 2));
  } catch (error) {
    console.error('Error saving commands:', error);
  }
}

// Load groups from file
async function loadGroups() {
  try {
    await fs.mkdir(path.dirname(GROUPS_PATH), { recursive: true });
    const data = await fs.readFile(GROUPS_PATH, 'utf-8').catch(() => '[]');
    groups = JSON.parse(data);
  } catch (error) {
    console.error('Error loading groups:', error);
    groups = [];
  }
}

// Save groups to file
async function saveGroups() {
  try {
    await fs.mkdir(path.dirname(GROUPS_PATH), { recursive: true });
    await fs.writeFile(GROUPS_PATH, JSON.stringify(groups, null, 2));
  } catch (error) {
    console.error('Error saving groups:', error);
  }
}

// Load sessions from file
async function loadSessions() {
  try {
    await fs.mkdir(path.dirname(SESSIONS_CONFIG_PATH), { recursive: true });
    const data = await fs.readFile(SESSIONS_CONFIG_PATH, 'utf-8').catch(() => '[]');
    sessions = JSON.parse(data);
    
    // Initialize session states
    sessions.forEach(session => {
      if (!sessionStates.has(session.id)) {
        sessionStates.set(session.id, {
          sock: null,
          qrCode: null,
          connectionState: 'disconnected'
        });
      }
    });
  } catch (error) {
    console.error('Error loading sessions:', error);
    sessions = [];
  }
}

// Save sessions to file
async function saveSessions() {
  try {
    await fs.mkdir(path.dirname(SESSIONS_CONFIG_PATH), { recursive: true });
    await fs.writeFile(SESSIONS_CONFIG_PATH, JSON.stringify(sessions, null, 2));
  } catch (error) {
    console.error('Error saving sessions:', error);
  }
}

// Initialize commands, groups, and sessions on startup
loadCommands();
loadGroups();
loadSessions();

// Get session directory path
function getSessionDir(sessionId: string) {
  return path.join(SESSIONS_BASE_DIR, sessionId);
}

// Connect to WhatsApp for a specific session
async function connectToWhatsApp(sessionId: string) {
  try {
    const sessionDir = getSessionDir(sessionId);
    
    // Create session directory if it doesn't exist
    await fs.mkdir(sessionDir, { recursive: true });
    
    const { state, saveCreds } = await baileysUseMultiFileAuthState(sessionDir);
    const { version } = await fetchLatestBaileysVersion();
    
    // Get or create session state
    let sessionState = sessionStates.get(sessionId);
    if (!sessionState) {
      sessionState = {
        sock: null,
        qrCode: null,
        connectionState: 'disconnected'
      };
      sessionStates.set(sessionId, sessionState);
    }
    
    // Create a new socket connection
    sessionState.sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
      browser: ["HMTI BOT", "Ubuntu", "1.0"]
    });
    
    sessionState.connectionState = 'connecting';
    
    // Handle connection updates
    sessionState.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        sessionState!.qrCode = qr;
        sessionState!.connectionState = 'connecting';
      }
      
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        
        if (shouldReconnect) {
          sessionState!.connectionState = 'connecting';
          connectToWhatsApp(sessionId);
        } else {
          sessionState!.connectionState = 'disconnected';
          sessionState!.qrCode = null;
          // Delete session if logged out
          try {
            await fs.rm(sessionDir, { recursive: true, force: true });
          } catch (error) {
            console.error(`Error deleting session ${sessionId}:`, error);
          }
        }
      } else if (connection === 'open') {
        sessionState!.connectionState = 'connected';
        sessionState!.qrCode = null;
      }
    });
    
    // Save credentials when updated
    sessionState.sock.ev.on('creds.update', saveCreds);
    
    // Handle incoming messages
    sessionState.sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const message of messages) {
        if (message.key.fromMe) continue;
        
        // Mark message as read (blue checkmarks)
        if (message.key.remoteJid) {
          await sessionState?.sock?.readMessages([message.key]);
        }
        
        // Find the current session in the sessions array
        const currentSession = sessions.find(s => s.id === sessionId);
        
        // If commands are disabled for this session, only mark as read but don't process commands
        if (!currentSession?.commandsEnabled) {
          console.log(`Commands disabled for session ${sessionId}, not processing commands`);
          continue;
        }
        
        const messageText = message.message?.conversation ||
                           message.message?.extendedTextMessage?.text || '';
        
        // Check if the message is from a group
        const isGroup = message.key.remoteJid?.endsWith('@g.us') || false;
        
        // If it's a group message, check if the group is enabled for auto-replies
        if (isGroup) {
          const groupId = message.key.remoteJid;
          const group = groups.find(g => g.id === groupId);
          
          // If group exists but is disabled, skip processing commands
          if (group && !group.enabled) continue;
          
          // If group doesn't exist in our list, add it
          if (!group && groupId) {
            try {
              // Get group metadata to get the name
              const metadata = await sessionState?.sock?.groupMetadata(groupId);
              const newGroup: GroupConfig = {
                id: groupId,
                name: metadata?.subject || 'Unknown Group',
                enabled: true // Enable by default
              };
              groups.push(newGroup);
              await saveGroups();
            } catch (error) {
              console.error('Error fetching group metadata:', error);
            }
          }
        }
        
        // Check for exact match first
        if (commands[messageText]) {
          const commandConfig = commands[messageText];
          
          try {
            switch (commandConfig.type) {
              case 'text':
                // Send text response
                await sessionState?.sock?.sendMessage(message.key.remoteJid!, {
                  text: commandConfig.response
                });
                break;
                
              case 'image':
                // Send image with optional caption
                await sessionState?.sock?.sendMessage(message.key.remoteJid!, {
                  image: { url: commandConfig.mediaUrl || '' },
                  caption: commandConfig.caption || undefined
                });
                break;
                
              case 'video':
                // Send video with optional caption
                await sessionState?.sock?.sendMessage(message.key.remoteJid!, {
                  video: { url: commandConfig.mediaUrl || '' },
                  caption: commandConfig.caption || undefined
                });
                break;
                
              case 'api':
                if (commandConfig.apiUrl) {
                  // Fetch response from API
                  const apiResponse = await axios.get(commandConfig.apiUrl);
                  let responseContent = apiResponse.data;
                  
                  // Extract specific path from response if provided
                  if (commandConfig.apiResponsePath) {
                    const pathParts = commandConfig.apiResponsePath.split('.');
                    for (const part of pathParts) {
                      if (responseContent && typeof responseContent === 'object' && part in responseContent) {
                        responseContent = responseContent[part];
                      } else {
                        throw new Error(`Invalid API response path: ${commandConfig.apiResponsePath}`);
                      }
                    }
                  }
                  
                  // Send the extracted content as a text message
                  await sessionState?.sock?.sendMessage(message.key.remoteJid!, {
                    text: String(responseContent)
                  });
                } else {
                  throw new Error('API URL is required for API commands');
                }
                break;
                
              default:
                // Default to text response for backward compatibility
                await sessionState?.sock?.sendMessage(message.key.remoteJid!, {
                  text: commandConfig.response
                });
            }
          } catch (error) {
            console.error(`Error processing ${commandConfig.type} command:`, error);
            await sessionState?.sock?.sendMessage(message.key.remoteJid!, {
              text: 'Sorry, there was an error processing your command.'
            });
          }
          continue;
        }
        
        // Check for case-insensitive match if no exact match found
        const commandKeys = Object.keys(commands);
        for (const key of commandKeys) {
          if (commands[key].caseInsensitive && messageText.toLowerCase() === key.toLowerCase() && messageText !== key) {
            const commandConfig = commands[key];
            
            try {
              switch (commandConfig.type) {
                case 'text':
                  // Send text response
                  await sessionState?.sock?.sendMessage(message.key.remoteJid!, {
                    text: commandConfig.response
                  });
                  break;
                  
                case 'image':
                  // Send image with optional caption
                  await sessionState?.sock?.sendMessage(message.key.remoteJid!, {
                    image: { url: commandConfig.mediaUrl || '' },
                    caption: commandConfig.caption || undefined
                  });
                  break;
                  
                case 'video':
                  // Send video with optional caption
                  await sessionState?.sock?.sendMessage(message.key.remoteJid!, {
                    video: { url: commandConfig.mediaUrl || '' },
                    caption: commandConfig.caption || undefined
                  });
                  break;
                  
                case 'api':
                  if (commandConfig.apiUrl) {
                    // Fetch response from API
                    const apiResponse = await axios.get(commandConfig.apiUrl);
                    let responseContent = apiResponse.data;
                    
                    // Extract specific path from response if provided
                    if (commandConfig.apiResponsePath) {
                      const pathParts = commandConfig.apiResponsePath.split('.');
                      for (const part of pathParts) {
                        if (responseContent && typeof responseContent === 'object' && part in responseContent) {
                          responseContent = responseContent[part];
                        } else {
                          throw new Error(`Invalid API response path: ${commandConfig.apiResponsePath}`);
                        }
                      }
                    }
                    
                    // Send the extracted content as a text message
                    await sessionState?.sock?.sendMessage(message.key.remoteJid!, {
                      text: String(responseContent)
                    });
                  } else {
                    throw new Error('API URL is required for API commands');
                  }
                  break;
                  
                default:
                  // Default to text response for backward compatibility
                  await sessionState?.sock?.sendMessage(message.key.remoteJid!, {
                    text: commandConfig.response
                  });
              }
            } catch (error) {
              console.error(`Error processing ${commandConfig.type} command:`, error);
              await sessionState?.sock?.sendMessage(message.key.remoteJid!, {
                text: 'Sorry, there was an error processing your command.'
              });
            }
            break;
          }
        }
      }
    });
    
    // Listen for group updates to keep our list updated
    sessionState.sock.ev.on('group-participants.update', async (update) => {
      const groupId = update.id;
      if (!groups.some(g => g.id === groupId)) {
        try {
          const metadata = await sessionState?.sock?.groupMetadata(groupId);
          const newGroup: GroupConfig = {
            id: groupId,
            name: metadata?.subject || 'Unknown Group',
            enabled: true // Enable by default
          };
          groups.push(newGroup);
          await saveGroups();
        } catch (error) {
          console.error('Error updating group:', error);
        }
      }
    });
    
    return true;
  } catch (error) {
    console.error(`Error connecting to WhatsApp for session ${sessionId}:`, error);
    const sessionState = sessionStates.get(sessionId);
    if (sessionState) {
      sessionState.connectionState = 'disconnected';
    }
    return false;
  }
}

// GET endpoint to get connection status, QR code, commands, groups, and sessions
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('sessionId');
  
  if (sessionId) {
    // Return data for a specific session
    const sessionState = sessionStates.get(sessionId);
    if (!sessionState) {
      return NextResponse.json({ success: false, message: 'Session not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      status: sessionState.connectionState,
      qrCode: sessionState.qrCode,
      session: sessions.find(s => s.id === sessionId)
    });
  }
  
  // Return all data
  return NextResponse.json({
    success: true,
    sessions: sessions.map(session => {
      const state = sessionStates.get(session.id);
      return {
        ...session,
        status: state?.connectionState || 'disconnected',
        qrCode: state?.qrCode || null
      };
    }),
    commands: commands,
    groups: groups
  });
}

// POST endpoint to manage WhatsApp sessions, commands, and groups
export async function POST(request: NextRequest) {
  const data = await request.json();
  const { action } = data;
  
  switch (action) {
    case 'createSession': {
      const { name } = data;
      if (!name) {
        return NextResponse.json({ success: false, message: 'Session name is required' });
      }
      
      const sessionId = `session_${Date.now()}`;
      const newSession: SessionConfig = {
        id: sessionId,
        name,
        enabled: true,
        commandsEnabled: true, // Default to enabled
        createdAt: new Date().toISOString()
      };
      
      sessions.push(newSession);
      await saveSessions();
      
      // Initialize session state
      sessionStates.set(sessionId, {
        sock: null,
        qrCode: null,
        connectionState: 'disconnected'
      });
      
      return NextResponse.json({
        success: true,
        message: 'Session created successfully',
        session: newSession
      });
    }
    
    case 'deleteSession': {
      const { sessionId } = data;
      if (!sessionId) {
        return NextResponse.json({ success: false, message: 'Session ID is required' });
      }
      
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      if (sessionIndex === -1) {
        return NextResponse.json({ success: false, message: 'Session not found' });
      }
      
      // Disconnect if connected
      const sessionState = sessionStates.get(sessionId);
      if (sessionState && sessionState.sock) {
        sessionState.sock.end(undefined);
        sessionState.sock = null;
        sessionState.connectionState = 'disconnected';
        sessionState.qrCode = null;
      }
      
      // Remove session from list
      sessions.splice(sessionIndex, 1);
      await saveSessions();
      
      // Delete session directory
      try {
        const sessionDir = getSessionDir(sessionId);
        await fs.rm(sessionDir, { recursive: true, force: true });
      } catch (error) {
        console.error(`Error deleting session directory for ${sessionId}:`, error);
      }
      
      // Remove from session states
      sessionStates.delete(sessionId);
      
      return NextResponse.json({
        success: true,
        message: 'Session deleted successfully'
      });
    }
    
    case 'connect': {
      const { sessionId } = data;
      if (!sessionId) {
        return NextResponse.json({ success: false, message: 'Session ID is required' });
      }
      
      const sessionState = sessionStates.get(sessionId);
      if (!sessionState) {
        return NextResponse.json({ success: false, message: 'Session not found' });
      }
      
      if (sessionState.connectionState === 'disconnected') {
        await connectToWhatsApp(sessionId);
        return NextResponse.json({ success: true, message: 'Connecting to WhatsApp...' });
      }
      
      return NextResponse.json({ success: false, message: 'Already connecting or connected' });
    }
    
    case 'disconnect': {
      const { sessionId } = data;
      if (!sessionId) {
        return NextResponse.json({ success: false, message: 'Session ID is required' });
      }
      
      const sessionState = sessionStates.get(sessionId);
      if (!sessionState) {
        return NextResponse.json({ success: false, message: 'Session not found' });
      }
      
      if (sessionState.sock && sessionState.connectionState !== 'disconnected') {
        sessionState.sock.end(undefined);
        sessionState.sock = null;
        sessionState.connectionState = 'disconnected';
        sessionState.qrCode = null;
        return NextResponse.json({ success: true, message: 'Disconnected from WhatsApp' });
      }
      
      return NextResponse.json({ success: false, message: 'Not connected' });
    }
    
    case 'addCommand': {
      const { command, type, response, caseInsensitive, mediaUrl, caption, apiUrl, apiResponsePath } = data;
      if (!command) {
        return NextResponse.json({ success: false, message: 'Command is required' });
      }
      
      // Validate based on command type
      if (type === 'text' && !response) {
        return NextResponse.json({ success: false, message: 'Response is required for text commands' });
      }
      
      if ((type === 'image' || type === 'video') && !mediaUrl) {
        return NextResponse.json({ success: false, message: `Media URL is required for ${type} commands` });
      }
      
      if (type === 'api' && !apiUrl) {
        return NextResponse.json({ success: false, message: 'API URL is required for API commands' });
      }
      
      commands[command] = {
        type: type || 'text',
        response: response || '',
        caseInsensitive: caseInsensitive === true,
        mediaUrl: mediaUrl || '',
        caption: caption || '',
        apiUrl: apiUrl || '',
        apiResponsePath: apiResponsePath || 'result'
      };
      
      await saveCommands();
      return NextResponse.json({ success: true, message: 'Command added successfully' });
    }
    
    case 'updateCommand': {
      const { command, type, response, caseInsensitive, mediaUrl, caption, apiUrl, apiResponsePath } = data;
      if (!command || !commands[command]) {
        return NextResponse.json({ success: false, message: 'Command not found' });
      }
      
      commands[command] = {
        type: type !== undefined ? type : commands[command].type,
        response: response !== undefined ? response : commands[command].response,
        caseInsensitive: caseInsensitive !== undefined ? caseInsensitive : commands[command].caseInsensitive,
        mediaUrl: mediaUrl !== undefined ? mediaUrl : commands[command].mediaUrl,
        caption: caption !== undefined ? caption : commands[command].caption,
        apiUrl: apiUrl !== undefined ? apiUrl : commands[command].apiUrl,
        apiResponsePath: apiResponsePath !== undefined ? apiResponsePath : commands[command].apiResponsePath
      };
      
      await saveCommands();
      return NextResponse.json({ success: true, message: 'Command updated successfully' });
    }
    
    case 'deleteCommand': {
      const { command } = data;
      if (!command || !commands[command]) {
        return NextResponse.json({ success: false, message: 'Command not found' });
      }
      
      delete commands[command];
      await saveCommands();
      return NextResponse.json({ success: true, message: 'Command deleted successfully' });
    }
    
    case 'toggleGroup': {
      const { groupId, enabled } = data;
      if (!groupId) {
        return NextResponse.json({ success: false, message: 'Group ID is required' });
      }
      
      const groupIndex = groups.findIndex(g => g.id === groupId);
      if (groupIndex === -1) {
        return NextResponse.json({ success: false, message: 'Group not found' });
      }
      
      groups[groupIndex].enabled = enabled !== undefined ? enabled : !groups[groupIndex].enabled;
      await saveGroups();
      
      return NextResponse.json({
        success: true,
        message: `Group ${groups[groupIndex].enabled ? 'enabled' : 'disabled'} successfully`
      });
    }
    
    case 'toggleSession': {
      const { sessionId, enabled } = data;
      if (!sessionId) {
        return NextResponse.json({ success: false, message: 'Session ID is required' });
      }
      
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      if (sessionIndex === -1) {
        return NextResponse.json({ success: false, message: 'Session not found' });
      }
      
      sessions[sessionIndex].enabled = enabled !== undefined ? enabled : !sessions[sessionIndex].enabled;
      await saveSessions();
      
      return NextResponse.json({
        success: true,
        message: `Session ${sessions[sessionIndex].enabled ? 'enabled' : 'disabled'} successfully`
      });
    }
    
    case 'toggleSessionCommands': {
      const { sessionId, commandsEnabled } = data;
      if (!sessionId) {
        return NextResponse.json({ success: false, message: 'Session ID is required' });
      }
      
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      if (sessionIndex === -1) {
        return NextResponse.json({ success: false, message: 'Session not found' });
      }
      
      sessions[sessionIndex].commandsEnabled = commandsEnabled !== undefined ? commandsEnabled : !sessions[sessionIndex].commandsEnabled;
      await saveSessions();
      
      return NextResponse.json({
        success: true,
        message: `Command responses ${sessions[sessionIndex].commandsEnabled ? 'enabled' : 'disabled'} for this session`
      });
    }
    
    case 'renameSession': {
      const { sessionId, name } = data;
      if (!sessionId || !name) {
        return NextResponse.json({ success: false, message: 'Session ID and name are required' });
      }
      
      const sessionIndex = sessions.findIndex(s => s.id === sessionId);
      if (sessionIndex === -1) {
        return NextResponse.json({ success: false, message: 'Session not found' });
      }
      
      sessions[sessionIndex].name = name;
      await saveSessions();
      
      return NextResponse.json({
        success: true,
        message: 'Session renamed successfully'
      });
    }
    
    case 'send': {
      const { sessionId, to, type, content, caption, apiUrl, apiResponsePath } = data;
      if (!sessionId) {
        return NextResponse.json({ success: false, message: 'Session ID is required' });
      }
      
      if (!to) {
        return NextResponse.json({ success: false, message: 'Recipient is required' });
      }
      
      const sessionState = sessionStates.get(sessionId);
      if (!sessionState || !sessionState.sock || sessionState.connectionState !== 'connected') {
        return NextResponse.json({ success: false, message: 'Session not connected' });
      }
      
      try {
        // Handle API-based messages
        if (apiUrl) {
          const apiResponse = await axios.get(apiUrl);
          let responseContent = apiResponse.data;
          
          // Extract specific path from response if provided
          if (apiResponsePath) {
            const pathParts = apiResponsePath.split('.');
            for (const part of pathParts) {
              if (responseContent && typeof responseContent === 'object' && part in responseContent) {
                responseContent = responseContent[part];
              } else {
                throw new Error(`Invalid API response path: ${apiResponsePath}`);
              }
            }
          }
          
          // Send the extracted content as a text message
          await sessionState.sock.sendMessage(to, { text: String(responseContent) });
          return NextResponse.json({ success: true, message: 'API response sent successfully' });
        }
        
        // Handle different media types
        switch (type) {
          case 'text':
            if (!content) {
              return NextResponse.json({ success: false, message: 'Content is required for text messages' });
            }
            await sessionState.sock.sendMessage(to, { text: content });
            break;
            
          case 'image':
            if (!content) {
              return NextResponse.json({ success: false, message: 'Image URL or path is required' });
            }
            
            // Check if it's a URL or a local file
            if (content.startsWith('http')) {
              // It's a URL
              await sessionState.sock.sendMessage(to, {
                image: { url: content },
                caption: caption || ''
              });
            } else {
              // It's a local file
              const filePath = path.join(process.cwd(), 'public', content);
              const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
              
              if (!fileExists) {
                return NextResponse.json({ success: false, message: 'Image file not found' });
              }
              
              const fileBuffer = await fs.readFile(filePath);
              await sessionState.sock.sendMessage(to, {
                image: fileBuffer,
                caption: caption || ''
              });
            }
            break;
            
          case 'video':
            if (!content) {
              return NextResponse.json({ success: false, message: 'Video URL or path is required' });
            }
            
            // Check if it's a URL or a local file
            if (content.startsWith('http')) {
              // It's a URL
              await sessionState.sock.sendMessage(to, {
                video: { url: content },
                caption: caption || ''
              });
            } else {
              // It's a local file
              const filePath = path.join(process.cwd(), 'public', content);
              const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
              
              if (!fileExists) {
                return NextResponse.json({ success: false, message: 'Video file not found' });
              }
              
              const fileBuffer = await fs.readFile(filePath);
              await sessionState.sock.sendMessage(to, {
                video: fileBuffer,
                caption: caption || ''
              });
            }
            break;
            
          case 'file':
            if (!content) {
              return NextResponse.json({ success: false, message: 'File URL or path is required' });
            }
            
            // Check if it's a URL or a local file
            if (content.startsWith('http')) {
              // It's a URL
              await sessionState.sock.sendMessage(to, {
                document: { url: content },
                mimetype: 'application/octet-stream',
                fileName: caption || 'file'
              });
            } else {
              // It's a local file
              const filePath = path.join(process.cwd(), 'public', content);
              const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
              
              if (!fileExists) {
                return NextResponse.json({ success: false, message: 'File not found' });
              }
              
              const fileBuffer = await fs.readFile(filePath);
              await sessionState.sock.sendMessage(to, {
                document: fileBuffer,
                mimetype: 'application/octet-stream',
                fileName: caption || path.basename(content)
              });
            }
            break;
            
          case 'voice':
            if (!content) {
              return NextResponse.json({ success: false, message: 'Voice note URL or path is required' });
            }
            
            // Check if it's a URL or a local file
            if (content.startsWith('http')) {
              // It's a URL
              await sessionState.sock.sendMessage(to, {
                audio: { url: content },
                ptt: true
              });
            } else {
              // It's a local file
              const filePath = path.join(process.cwd(), 'public', content);
              const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
              
              if (!fileExists) {
                return NextResponse.json({ success: false, message: 'Voice note file not found' });
              }
              
              const fileBuffer = await fs.readFile(filePath);
              await sessionState.sock.sendMessage(to, {
                audio: fileBuffer,
                ptt: true
              });
            }
            break;
            
          default:
            return NextResponse.json({ success: false, message: 'Invalid message type' });
        }
        
        return NextResponse.json({ success: true, message: `${type} sent successfully` });
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, message: `Error sending message: ${errorMessage}` });
      }
    }
    
    case 'testApiResponse': {
      console.log('Received testApiResponse request:', data);
      const { apiUrl, apiResponsePath } = data;
      
      if (!apiUrl) {
        console.log('API URL is required');
        return NextResponse.json({ success: false, message: 'API URL is required' });
      }
      
      try {
        console.log(`Fetching API from URL: ${apiUrl}`);
        // Fetch response from API
        const apiResponse = await axios.get(apiUrl);
        let responseContent = apiResponse.data;
        console.log('API response received:', responseContent);
        
        // Extract specific path from response if provided
        if (apiResponsePath && apiResponsePath.trim() !== '') {
          console.log(`Extracting path: ${apiResponsePath}`);
          const pathParts = apiResponsePath.split('.');
          for (const part of pathParts) {
            if (responseContent && typeof responseContent === 'object' && part in responseContent) {
              responseContent = responseContent[part];
            } else {
              console.log(`Path part not found: ${part}`);
              throw new Error(`Invalid API response path: ${apiResponsePath}. Path part not found: ${part}`);
            }
          }
        }
        
        console.log('Final extracted response:', responseContent);
        return NextResponse.json({
          success: true,
          message: 'API test successful',
          response: String(responseContent)
        });
      } catch (error) {
        console.error('Error testing API:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ success: false, message: `Error testing API: ${errorMessage}` });
      }
    }
      
    default:
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  }
}
