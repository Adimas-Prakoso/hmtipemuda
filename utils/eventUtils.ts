import fs from 'fs';
import path from 'path';
import { EventType, DetailedEventType } from '../data/types';

// Function to load events from JSON file
export function loadEventsData(): { 
  events: EventType[], 
  detailedEvents: Record<string, DetailedEventType> 
} {
  try {
    const filePath = path.join(process.cwd(), 'data', 'events.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent || '{}');
    
    return {
      events: data.events || [],
      detailedEvents: data.detailedEvents || {}
    };
  } catch (error) {
    console.error('Error loading events data:', error);
    return { events: [], detailedEvents: {} };
  }
}

// Function to save events to JSON file
export function saveEventsData(
  events: EventType[], 
  detailedEvents: Record<string, DetailedEventType>
): boolean {
  try {
    const filePath = path.join(process.cwd(), 'data', 'events.json');
    const data = { events, detailedEvents };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving events data:', error);
    return false;
  }
}

// Helper function to get event by ID
export function getEventById(id: string): EventType | undefined {
  const { events } = loadEventsData();
  return events.find(event => event.id === id);
}

// Helper function to get detailed event by ID
export function getDetailedEventById(id: string): DetailedEventType | undefined {
  const { detailedEvents } = loadEventsData();
  return detailedEvents[id];
}

// Helper function to get upcoming events
export function getUpcomingEvents(limit?: number): EventType[] {
  const { events } = loadEventsData();
  const now = new Date();
  const upcoming = events
    .filter(event => new Date(event.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return limit ? upcoming.slice(0, limit) : upcoming;
}

// Helper function to get events by category
export function getEventsByCategory(category: string): EventType[] {
  const { events } = loadEventsData();
  return events.filter(event => event.category === category);
}
