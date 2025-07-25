import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    // Use static searchParams method instead of accessing request.url directly
    const searchParams = request.nextUrl.searchParams;
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
