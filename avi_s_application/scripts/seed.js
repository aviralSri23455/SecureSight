const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample camera data
const cameras = [
  { name: 'Shop Floor A', location: 'North Wing, First Floor' },
  { name: 'Vault', location: 'Basement Level' },
  { name: 'Main Entrance', location: 'Ground Floor, Front' },
  { name: 'Parking Lot', location: 'Outdoor, East Side' },
];

// Sample incident data
const incidentTypes = [
  'Unauthorised Access',
  'Gun Threat',
  'Face Recognised',
  'Suspicious Package',
  'Perimeter Breach',
];

// Generate random date within last 24 hours
function getRandomDate() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return new Date(
    yesterday.getTime() + Math.random() * (now.getTime() - yesterday.getTime())
  );
}

// Generate random duration between 1 and 30 minutes
function getRandomDuration() {
  return Math.floor(Math.random() * 29 + 1) * 60 * 1000; // 1-30 minutes in ms
}

async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // 1. Clear existing data
    console.log('Clearing existing data...');
    await supabase.from('incidents').delete().neq('id', 0);
    await supabase.from('cameras').delete().neq('id', 0);

    // 2. Insert cameras
    console.log('Inserting cameras...');
    const { data: insertedCameras, error: cameraError } = await supabase
      .from('cameras')
      .insert(cameras)
      .select();

    if (cameraError) throw cameraError;
    console.log(`Inserted ${insertedCameras.length} cameras`);

    // 3. Generate and insert incidents
    const incidents = [];
    const incidentCount = 12 + Math.floor(Math.random() * 10); // 12-22 incidents

    for (let i = 0; i < incidentCount; i++) {
      const camera_id = insertedCameras[Math.floor(Math.random() * insertedCameras.length)].id;
      const tStart = getRandomDate();
      const tEnd = new Date(tStart.getTime() + getRandomDuration());
      
      incidents.push({
        camera_id,
        type: incidentTypes[Math.floor(Math.random() * incidentTypes.length)],
        t_start: tStart.toISOString(),
        t_end: tEnd.toISOString(),
        thumbnail_url: `https://picsum.photos/seed/${Date.now() + i}/300/200`,
        resolved: Math.random() > 0.5, // 50% chance of being resolved
        description: 'Sample security incident detected',
      });
    }

    console.log('Inserting incidents...');
    const { data: insertedIncidents, error: incidentError } = await supabase
      .from('incidents')
      .insert(incidents)
      .select();

    if (incidentError) throw incidentError;
    console.log(`Inserted ${insertedIncidents.length} incidents`);

    console.log('\n✅ Database seeded successfully!');
    console.log(`🌐 Visit your Supabase dashboard: ${supabaseUrl}`);
  } catch (error) {
    console.error('❌ Error seeding database:');
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
