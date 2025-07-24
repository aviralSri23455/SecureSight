import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Get timeline markers (hours of the day)
    const markers = Array.from({ length: 24 }, (_, i) => 
      i.toString().padStart(2, '0') + ':00'
    );

    // Get timeline events from incidents
    const { data: events, error } = await supabase
      .from('incidents')
      .select('*')
      .order('t_start', { ascending: true });

    if (error) {
      console.error('Error fetching timeline events:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map incidents to timeline events format
    const formattedEvents = events.map(incident => ({
      id: incident.id,
      type: incident.type,
      time: new Date(incident.t_start).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      color: getEventColor(incident.type)
    }));

    return NextResponse.json({
      markers,
      events: formattedEvents
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to determine event color based on type
function getEventColor(type) {
  const typeMap = {
    'Unauthorised Access': 'bg-global-7',
    'Gun Threat': 'bg-global-7',
    'Face Recognised': 'bg-global-4',
    'Multiple Events': 'bg-button-2'
  };
  
  return typeMap[type] || 'bg-gray-500';
}
