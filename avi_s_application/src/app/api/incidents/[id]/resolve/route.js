import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;

    // First get the current resolved status
    const { data: currentIncident, error: fetchError } = await supabase
      .from('incidents')
      .select('resolved')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching incident:', fetchError);
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      );
    }

    // Toggle the resolved status
    const { data, error } = await supabase
      .from('incidents')
      .update({ resolved: !currentIncident.resolved })
      .eq('id', id)
      .select('*, camera:cameras(*)')
      .single();

    if (error) {
      console.error('Error updating incident:', error);
      return NextResponse.json(
        { error: 'Failed to update incident' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
