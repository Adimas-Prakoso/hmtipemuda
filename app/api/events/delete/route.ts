import { NextRequest, NextResponse } from 'next/server';
import { loadEventsData, saveEventsData } from '../../../../utils/eventUtils';

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }
    
    // Load current events data
    const { events, detailedEvents } = loadEventsData();
    
    // Remove event from events array
    const updatedEvents = events.filter(event => event.id !== id);
    
    // Create a new detailedEvents object without the deleted event
    const updatedDetailedEvents = { ...detailedEvents };
    if (updatedDetailedEvents[id]) {
      delete updatedDetailedEvents[id];
    }
    
    // Save the updated data
    const success = saveEventsData(updatedEvents, updatedDetailedEvents);
    
    if (success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to save updated events' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
