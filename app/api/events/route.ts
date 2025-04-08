import { NextRequest, NextResponse } from 'next/server';
import { loadEventsData, saveEventsData } from '../../../utils/eventUtils';

export async function POST(request: NextRequest) {
  try {
    const { events, detailedEvents } = await request.json();
    
    // Save events data using utility function
    const success = saveEventsData(events, detailedEvents);
    
    if (success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Failed to save events' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error saving events:', error);
    return NextResponse.json({ error: 'Failed to save events' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Load events data using utility function
    const data = loadEventsData();
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error reading events:', error);
    return NextResponse.json({ error: 'Failed to read events' }, { status: 500 });
  }
}
