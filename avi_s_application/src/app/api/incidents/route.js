import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic'; // Ensure this route is dynamic
export const revalidate = 0; // Prevent static generation

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const resolved = searchParams.get('resolved');

    let query = supabase
      .from('incidents')
      .select(`
        *,
        camera:cameras(*)
      `)
      .order('t_start', { ascending: false });

    if (resolved === 'false') {
      query = query.eq('resolved', false);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching incidents:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
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
