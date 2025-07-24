import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    console.log('Attempting to resolve incident ID:', id);

    // First, get the current incident to verify it exists
    const { data: currentIncident, error: fetchError } = await supabase
      .from('incidents')
      .select('resolved')
      .eq('id', id)
      .single();

    if (fetchError || !currentIncident) {
      console.error('Error fetching incident:', fetchError || 'Incident not found');
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    console.log('Current incident status - resolved:', currentIncident.resolved);
    
    // First, update the incident status
    const { error: updateError } = await supabase
      .from('incidents')
      .update({ 
        resolved: !currentIncident.resolved
      })
      .eq('id', id);

    if (updateError) {
      console.error('Error updating incident:', updateError);
      return NextResponse.json(
        { error: `Failed to update incident: ${updateError.message}` },
        { status: 500 }
      );
    }

    // Then fetch the updated incident with camera data
    const { data: updatedIncident, error: fetchUpdatedError } = await supabase
      .from('incidents')
      .select('*, camera:cameras(*)')
      .eq('id', id)
      .single();

    if (fetchUpdatedError) {
      console.error('Error fetching updated incident:', fetchUpdatedError);
      return NextResponse.json(
        { 
          success: true, 
          message: 'Incident status updated, but could not fetch updated details',
          resolved: !currentIncident.resolved
        },
        { status: 200 }
      );
    }

    console.log('Successfully updated incident:', updatedIncident);
    return NextResponse.json(updatedIncident);
    
  } catch (error) {
    console.error('Unexpected error in PATCH /api/incidents/[id]/resolve:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
