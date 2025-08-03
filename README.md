# Secure Sight

 -  SecureSight is a CCTV monitoring software where you can connect upto 3 CCTV feeds — computer vision models help detect certain activity on the feeds (e.g. unauthorised access, gun threats, etc).
-  Navbar
- Incident Player (left-side)
-  Incident List (right-side)
- Incident timeline (bottom)

## 🚀 Features

- **Next.js 14** - Latest version with improved performance and features
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Supabase Realtime** - Real-time database updates with PostgreSQL
- **Real-time Dashboard** - Monitor security incidents in real-time
- **Incident Management** - Track and resolve security incidents efficiently
- **Responsive Design** - Works on desktop and mobile devices

## 📋 Prerequisites

- Node.js (v23.x or higher)
- npm (v9.x or higher) or yarn (v1.22.x or higher)
- Supabase account (free tier available)
- VS Code 

## 🛠️ Getting Started

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd securewatch_pro_old/avi_s_application
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Enable Realtime in Supabase:
   - Go to your Supabase dashboard
   - Navigate to Database → Replication
   - Toggle on the `incidents` table for real-time updates

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:your_localhost](http://localhost:_your_localhost) in your browser to view the application.

## 🔄 Real-time Functionality

SecureSight leverages Supabase Realtime to provide instant updates across all connected clients. The system is designed to handle high-frequency updates with minimal latency.

### How Real-time Updates Work

1. **Event Types**
   - `INSERT`: New incidents are added to the dashboard in real-time and you will recived message in console  
   - `UPDATE`: Existing incidents are updated across all clients and you will recived message in console 
   - `DELETE`: Removed incidents are instantly and you will recived message in console 

2. **Verification in Browser Console**
   When real-time events are received, you'll see detailed logs:
   ```javascript
   // Example INSERT event
   {
     schema: 'public',
     table: 'incidents',
     commit_timestamp: '2025-07-23T17:45:33.869Z',
     eventType: 'INSERT',
     new: {
       camera_id: 10,
       description: 'Test incident',
       id: 31,
       resolved: false,
       // ... other fields
     }
   }
   ```

3. **Testing Real-time Updates**
   - **Insert Test**: Add a new incident in Supabase Table Editor
   - **Update Test**: Modify an existing incident's status (see below)
   - **Delete Test**: Remove an incident from the table

### Updating Incidents in Supabase

#### Using Table Editor UI:
1. Go to your Supabase dashboard
2. Navigate to Table Editor > `incidents` table
3. To update a field:
   - Click on the cell you want to change
   - Edit the value directly
   - Click outside the cell to save
4. For the `resolved` field:
   - Click the toggle switch to change between `true`/`false`
   - Changes save automatically

#### Using SQL (Alternative):
```sql
-- Update a specific incident
UPDATE incidents
SET resolved = true,
    description = 'Updated description'
WHERE id = 5;

-- Mark all incidents as resolved
UPDATE incidents
SET resolved = true;
```
### How to Get Back the deleted row from the incidents table 

- If you deleted the row with id = 5 from the incidents table and want to recreate (revert) it, you can manually insert the same data again using the SQL Editor.

```sql
INSERT INTO incidents (
  id, camera_id, type, t_start, t_end, thumbnail_url
) VALUES (
  5, 10, 'Unauthorised Access', '2025-07-22 11:59:11.354+00', '2025-07-22 09:19:54.344+00', 'https://picsum.photos'
);

```

### Managing IDs for Demo

#### 1. Check Existing IDs
```sql
-- See all incident IDs
SELECT id FROM incidents ORDER BY id;

-- Find the highest current ID
SELECT MAX(id) FROM incidents;

-- Find gaps in ID sequence (useful for reusing deleted IDs)
WITH seq AS (
  SELECT generate_series(1, (SELECT MAX(id) FROM incidents)) as id
)
SELECT seq.id 
FROM seq 
LEFT JOIN incidents i ON seq.id = i.id 
WHERE i.id IS NULL;
```

#### 2. Insert New Rows (Without Specifying ID)
```sql
-- Let Supabase auto-generate the next available ID (Recommended)
INSERT INTO incidents (camera_id, type, t_start, t_end, thumbnail_url, description)
VALUES (1, 'Unauthorised Access', NOW(), NOW() + interval '5 minutes', 'https://picsum.photos/200/300', 'Demo incident');
```

#### 3. Insert with Specific ID (Only if you're sure it's available)
```sql
-- First check if ID exists
SELECT id FROM incidents WHERE id = 10;

-- If no results, it's safe to insert
INSERT INTO incidents (id, camera_id, type, t_start, t_end, thumbnail_url)
VALUES (10, 1, 'Demo Type', NOW(), NOW() + interval '5 minutes', 'https://picsum.photos/200/300')
ON CONFLICT (id) DO NOTHING;  -- Prevents errors if ID exists
```

#### 4. Reset Auto-increment Counter (If Needed)
```sql
-- Reset the sequence to the next available ID
-- Replace 'incidents_id_seq' with your actual sequence name
SELECT setval('incidents_id_seq', (SELECT MAX(id) FROM incidents));
```

#### Verifying Updates:
1. After making changes, check your browser console for:
   ```javascript
   {
     eventType: 'UPDATE',
     new: { /* updated fields */ },
     old: { /* previous values */ }
   }
   ```
2. The console should update automatically to reflect the changes

### Implementation Details

1. **Subscription Setup** (`src/app/dashboard/page.jsx`)
   ```javascript
   const subscription = supabase
     .channel('incidents_changes')
     .on('postgres_changes',
       {
         event: '*',
         schema: 'public',
         table: 'incidents'
       },
       (payload) => {
         // Handle real-time updates
         fetchIncidents().then(() => fetchTimelineData());
       }
     )
     .subscribe();
   ```

2. **Data Flow**
   - Initial load via REST API
   - Subsequent updates via WebSocket
   - Automatic reconnection on network issues
   - Optimistic UI updates for better UX

### Troubleshooting

1. **No Real-time Updates?**
   - Verify Supabase Realtime is enabled for the `incidents` table
   - Check browser console for WebSocket connection errors
   - Ensure your `.env.local` has correct Supabase credentials

2. **Common Issues**
   - `RealtimeSubscriptionError`: Verify table name and permissions
   - Missing updates: Check network tab for WebSocket activity
   - Stale data: Force refresh the page to re-establish connection

### Enabling/Disabling Realtime

1. **In Supabase Dashboard**:
   - Go to Database → Replication
   - Toggle the `incidents` table switch
   - Changes take effect immediately

2. **In Application**:
   - Real-time is enabled by default
   - The system automatically reconnects if the connection is lost

## 📁 Project Structure

```
avi_s_application/
├── public/                # Static assets (images, fonts, etc.)
│   └── images/            # Image assets
├── src/
│   ├── app/               # App router components
│   │   ├── api/           # API routes
│   │   │   ├── incidents/ # Incident management endpoints
│   │   │   └── timeline/  # Timeline data endpoints
│   │   ├── dashboard/     # Dashboard pages
│   │   ├── api/           # API routes
│   │   ├── layout.jsx     # Root layout component
│   │   └── page.jsx       # Landing page
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Common components
│   │   └── ui/            # UI components
│   ├── lib/               # Utility functions and helpers
│   └── styles/            # Global styles and Tailwind configuration
├── scripts/               # Utility scripts
├── .gitignore
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies and scripts
├── postcss.config.js     # PostCSS configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## 🧩 Development

### Available Scripts

- `npm run dev` - Start development server on port 4028
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier

### Styling

This project uses Tailwind CSS with the following features:
- Utility-first CSS approach
- Custom theme configuration
- Responsive design utilities
- Dark mode support
- Custom animations and transitions

## 🌐 API Integration

The application integrates with backend services through API routes located in `src/app/api/`. These routes handle:
- Incident management
- Real-time data fetching
- User authentication (if applicable)

## 📱 Deployment

To create a production build:
```bash
npm run build
npm run start
```

For more deployment options, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## Ouput Screen Shot 

![Alt text](./Screen%20Shot%20Images/supa%20ss-1.PNG)
![Alt text](./Screen%20Shot%20Images/supa%20ss-2.PNG)





