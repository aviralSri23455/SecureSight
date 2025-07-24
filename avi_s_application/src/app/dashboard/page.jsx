'use client';
import React, { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import Button from '../../components/ui/Button';
import { supabase } from '@/lib/supabase';
const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [selectedCamera, setSelectedCamera] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  // State for incidents with default empty array
  const [incidents, setIncidents] = useState([]);
  // State for cameras and timeline data
  const [cameras, setCameras] = useState([]);
  const [timelineMarkers, setTimelineMarkers] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);

  // Function to fetch incidents from the API
  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents');
      if (!response.ok) throw new Error('Failed to fetch incidents');
      const data = await response.json();
      setIncidents(data);
      return data;
    } catch (error) {
      console.error('Error fetching incidents:', error);
      return [];
    }
  };

  // Function to fetch cameras from the API
  const fetchCameras = async () => {
    try {
      const response = await fetch('/api/cameras');
      if (!response.ok) throw new Error('Failed to fetch cameras');
      const data = await response.json();
      setCameras(data);
      
      // Set the first camera as selected by default
      if (data.length > 0 && !selectedCamera) {
        setSelectedCamera(data[0].id);
      }
      return data;
    } catch (error) {
      console.error('Error fetching cameras:', error);
      return [];
    }
  };

  // Function to fetch timeline data from the API
  const fetchTimelineData = async () => {
    try {
      const response = await fetch('/api/timeline');
      if (!response.ok) throw new Error('Failed to fetch timeline data');
      const { markers, events } = await response.json();
      setTimelineMarkers(markers);
      setTimelineEvents(events);
      return { markers, events };
    } catch (error) {
      console.error('Error fetching timeline data:', error);
      return { markers: [], events: [] };
    }
  };

  // Set up real-time subscription with reconnection
  const setupRealtimeSubscription = () => {
    console.log('🔔 Setting up real-time subscription for incidents...');
    
    // Clean up any existing subscription
    const existingChannel = supabase.channel('incidents_changes');
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
    }

    // Simplified subscription
    const subscription = supabase
      .channel('incidents_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidents'
        },
        (payload) => {
          console.log('🔔 Realtime change received:', payload);
          // Refresh data when changes are detected
          fetchIncidents().then(() => fetchTimelineData());
        }
      )
      .subscribe();

    // Handle subscription status
    const status = subscription.subscribe((status, err) => {
      console.log('🔔 Subscription status:', status);
      if (err) {
        console.error('❌ Subscription error:', err);
        // Attempt to resubscribe on error
        setTimeout(setupRealtimeSubscription, 1000);
      }
    });

    return () => {
      console.log('🧹 Cleaning up subscription');
      subscription.unsubscribe();
      supabase.removeChannel(subscription);
    };
  };

  // Initial data fetch and subscription setup
  useEffect(() => {
    // Initial data load
    const loadData = async () => {
      try {
        await Promise.all([
          fetchIncidents(),
          fetchCameras(),
          fetchTimelineData()
        ]);
        
        // Set up real-time after initial load
        const cleanup = setupRealtimeSubscription();
        
        // Cleanup function
        return () => {
          if (cleanup) cleanup();
        };
      } catch (error) {
        console.error('Error during initial data load:', error);
      }
    };

    loadData();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(',', ' -'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper function to get incident icon
  const renderIncidentIcon = (type) => {
    switch(type) {
      case 'Unauthorised Access':
        return <img src="/images/img_bxs_door_open.svg" alt="" className="w-3 h-3" />;
      case 'Gun Threat':
        return <img src="/images/img_mdi_gun.svg" alt="" className="w-3 h-3" />;
      case 'Face Recognised':
        return <img src="/images/img_search_white_a700.svg" alt="" className="w-3 h-3" />;
      default:
        return <img src="/images/img_lucide_icons_alertcircle.svg" alt="" className="w-3 h-3" />;
    }
  };

  // Helper function to get incident color class
  const getIncidentColor = (type) => {
    switch(type) {
      case 'Unauthorised Access':
        return 'text-global-7';
      case 'Gun Threat':
        return 'text-button-3';
      case 'Face Recognised':
        return 'text-global-4';
      default:
        return 'text-global-9';
    }
  };

  // Helper function to get incident icon container class
  const getIncidentIcon = (type) => {
    switch(type) {
      case 'Unauthorised Access':
        return 'bg-global-6 rounded-full p-0.5';
      case 'Gun Threat':
        return 'bg-global-7 rounded-full p-0.5';
      case 'Face Recognised':
        return 'bg-global-4 rounded-full p-0.5';
      default:
        return 'bg-global-9 rounded-full p-0.5';
    }
  };

  // Get selected camera name for display
  const getSelectedCameraName = () => {
    try {
      if (!selectedCamera) return 'Select Camera';
      const camera = cameras.find(cam => cam && cam.id === selectedCamera);
      return camera && typeof camera === 'object' ? String(camera.name || 'Unnamed Camera') : 'Select Camera';
    } catch (error) {
      console.error('Error getting camera name:', error);
      return 'Select Camera';
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#151515_0%,#000000_100%)] flex flex-col">
      <Header />
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="w-full max-w-[1392px] mx-auto">
          {/* Main Content Stack */}
          <div className="relative">
            {/* Main Video Feed Section */}
            <div className="relative w-full lg:w-[56%] mb-6 lg:mb-0">
              <div 
                className="relative w-full h-[300px] sm:h-[400px] lg:h-[450px] rounded-lg overflow-hidden"
                style={{
                  backgroundImage: "url('/images/img_screenshot_20250710_at_70909pm_1.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Time overlay */}
                <div className="absolute top-4 left-4">
                  <Button
                    size="sm"
                    className="bg-button-2 text-button-2 px-3 py-1 text-xs font-dm-sans"
                    leftImage={{
                      src: "/images/img_lucide_icons_calendardays.svg",
                      width: 12,
                      height: 12
                    }}
                  >
                    {currentTime || '11/7/2025 - 03:12:37'}
                  </Button>
                </div>
                {/* Bottom overlay with camera info and thumbnails */}
                <div className="absolute bottom-0 left-0 right-0 bg-[linear-gradient(180deg,#00000000_0%,#00000066_100%)] p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    {/* Camera label */}
                    {cameras.length > 0 ? (
                      cameras.map((camera) => (
                        <Button
                          key={camera.id}
                          variant={selectedCamera === camera.id ? 'primary' : 'secondary'}
                          size="sm"
                          className="bg-global-2 text-global-4 border border-[#404040] px-4 py-1 text-sm font-inter"
                          leftImage={{
                            src: "/images/img_lucide_icons_disc.svg",
                            width: 12,
                            height: 12
                          }}
                          onClick={() => setSelectedCamera(camera.id)}
                        >
                          {camera.name}
                        </Button>
                      ))
                    ) : (
                      <div className="text-global-4 text-sm">Loading cameras...</div>
                    )}
                    {/* Camera thumbnails */}
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="bg-global-2 px-2 py-1 rounded text-xs text-global-4 mb-1">
                          <div className="flex items-center justify-between w-full">
                            <span>Camera - 02</span>
                            <img src="/images/img_lucide_icons.svg" alt="" className="w-2 h-2 ml-2" />
                          </div>
                        </div>
                        <img 
                          src="/images/img_screenshot_2025_07_10.png" 
                          alt="Camera 02" 
                          className="w-[120px] h-[66px] rounded border border-[#ffffff3f]"
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="bg-global-2 px-2 py-1 rounded text-xs text-global-4 mb-1">
                          <div className="flex items-center justify-between w-full">
                            <span>Camera - 02</span>
                            <img src="/images/img_lucide_icons.svg" alt="" className="w-2 h-2 ml-2" />
                          </div>
                        </div>
                        <img 
                          src="/images/img_screenshot_2025_07_10_66x120.png" 
                          alt="Camera 02" 
                          className="w-[120px] h-[66px] rounded border border-[#ffffff3f]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Incidents Panel */}
            <div className="absolute top-0 right-0 w-full lg:w-[40%] lg:pl-6">
              <div className="bg-global-3 rounded-lg p-4 sm:p-6 h-[300px] sm:h-[400px] lg:h-[450px] overflow-y-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-0">
                    <div className="w-6 h-6 bg-global-8 border-2 border-[#450a0a] rounded-xl flex items-center justify-center">
                      <img src="/images/img_featured_icon.svg" alt="" className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-semibold text-global-6 font-plus-jakarta">
                      15 Unresolved Incidents
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <button className="w-5 h-5 bg-global-6 rounded-lg flex items-center justify-center">
                        <img src="/images/img_lucide_icons_door_open.svg" alt="" className="w-3 h-3" />
                      </button>
                      <button className="w-5 h-5 bg-global-7 rounded-lg flex items-center justify-center">
                        <img src="/images/img_lucide_icons_plus.svg" alt="" className="w-3 h-3" />
                      </button>
                      <button className="w-5 h-5 bg-global-4 rounded-lg flex items-center justify-center">
                        <img src="/images/img_search.svg" alt="" className="w-3 h-3" />
                      </button>
                    </div>
                    <Button
                      size="sm"
                      className="bg-global-2 text-global-4 border border-[#404040] px-3 py-1 text-xs"
                      leftImage={{
                        src: "/images/img_lucide_icons_checkcheck.svg",
                        width: 12,
                        height: 12
                      }}
                    >
                      {getSelectedCameraName()}
                    </Button>
                  </div>
                </div>
                {/* Incidents List */}
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="flex items-center gap-4 p-3 hover:bg-global-2 rounded-lg transition-colors">
                      <img 
                        src="/images/img_screenshot_2025_07_10.png" 
                        alt={incident.type}
                        className="w-[120px] h-[66px] rounded border border-[#ffffff3f] flex-shrink-0 object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          <img 
                            src={
                              incident.type === 'Unauthorised Access' ? 
                                "/images/img_lucide_icons_door_open.svg" :
                              incident.type === 'Gun Threat' ?
                                "/images/img_ri_alert_fill.svg" :
                              incident.type === 'Face Recognised' ?
                                "/images/img_search_white_a700.svg" :
                                "/images/img_ri_alert_fill.svg"
                            } 
                            alt="" 
                            className="w-4 h-4" 
                          />
                          <span className={`text-sm font-bold ${
                            incident.type === 'Unauthorised Access' ? 'text-global-7' :
                            incident.type === 'Gun Threat' ? 'text-button-3' :
                            incident.type === 'Face Recognised' ? 'text-global-4' :
                            'text-global-9'
                          } font-inter`}>
                            {incident.type}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <img src="/images/img_vector.svg" alt="" className="w-2.5 h-2.5" />
                            <span className="text-xs text-global-9 font-inter">
                              {incident.camera?.name || 'Unknown Camera'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <img src="/images/img_search_white_a700.svg" alt="" className="w-2 h-2" />
                            <span className="text-xs font-bold text-global-9 font-inter">
                              {new Date(incident.t_start).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-global-8 hover:bg-global-11 hover:bg-opacity-10 rounded transition-colors">
                        <span>Resolve</span>
                        <img src="/images/img_arrow_right.svg" alt="" className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Video Controls */}
          <div className="mt-6 bg-global-3 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Playback controls */}
              <div className="flex items-center gap-4">
                <button className="w-5 h-5">
                  <img src="/images/img_video_player_button.svg" alt="Previous" className="w-full h-full" />
                </button>
                <button className="w-5 h-5">
                  <img src="/images/img_video_player_button_white_a700.svg" alt="Rewind" className="w-full h-full" />
                </button>
                <button className="w-9 h-9">
                  <img src="/images/img_video_player_button_white_a700_36x36.svg" alt="Play" className="w-full h-full" />
                </button>
                <button className="w-5 h-5">
                  <img src="/images/img_video_player_button_white_a700.svg" alt="Forward" className="w-full h-full" />
                </button>
                <button className="w-5 h-5">
                  <img src="/images/img_video_player_button.svg" alt="Next" className="w-full h-full" />
                </button>
              </div>
              {/* Time display */}
              <span className="text-sm text-global-9 font-plus-jakarta">
                03:12:37 (15-Jun-2025)
              </span>
              {/* Speed control */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-global-9 font-dm-sans">{playbackSpeed}</span>
                <button className="p-2">
                  <img src="/images/img_icon.svg" alt="Speed" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          {/* Camera List and Timeline */}
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            {/* Camera List */}
            <div className="w-full lg:w-[180px] bg-global-3 rounded-lg">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-base font-semibold text-global-9 font-plus-jakarta">
                  Camera List
                </h3>
              </div>
              <div className="divide-y divide-gray-700">
                {cameras.map((camera) => (
                  <button
                    key={camera.id}
                    onClick={() => setSelectedCamera(camera.id)}
                    className={`w-full flex items-center gap-3 p-4 text-left hover:bg-global-5 transition-colors ${
                      camera.active ? 'bg-global-5' : ''
                    }`}
                  >
                    <img src="/images/img_mdi_security_camera.svg" alt="" className="w-4 h-4" />
                    <span className="text-sm text-global-9 font-plus-jakarta">
                      {camera.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {/* Timeline */}
            <div className="flex-1 bg-global-3 rounded-lg p-4">
              {/* Current time marker */}
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute left-[212px] top-0 bg-global-11 text-global-1 px-2 py-1 rounded text-xs font-semibold">
                    03:12:37s
                  </div>
                </div>
              </div>
              {/* Timeline markers */}
              <div className="flex gap-6 mb-4 overflow-x-auto">
                {timelineMarkers.map((time, index) => (
                  <div key={index} className="flex flex-col items-start min-w-[66px]">
                    <span className="text-xs text-global-5 font-mono mb-2">{time}</span>
                    <div className="flex gap-1">
                      <div className="w-1 h-2.5 bg-global-5"></div>
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div key={i} className="w-1 h-1.5 bg-global-5 self-end"></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {/* Timeline events */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    className="bg-global-6 text-global-7 border-l-2 border-[#f97316] px-3 py-1 text-xs"
                    leftImage={{
                      src: "/images/img_lucide_icons_door_open.svg",
                      width: 12,
                      height: 12
                    }}
                  >
                    Unauthorised Access
                  </Button>
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      className="bg-global-4 text-global-3 border-l-2 border-[#3b82f6] px-3 py-1 text-xs"
                      leftImage={{
                        src: "/images/img_search.svg",
                        width: 12,
                        height: 12
                      }}
                    >
                      Face Recognised
                    </Button>
                    <span className="text-xs text-global-2 font-dm-sans">14:45</span>
                    <Button
                      size="sm"
                      className="bg-button-2 text-button-2 border-l-2 border-[#d6d3d1] px-3 py-1 text-xs"
                      rightImage={{
                        src: "/images/img_lucide_icons_trianglealert.svg",
                        width: 12,
                        height: 12
                      }}
                    >
                      4 Multiple Events
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    className="bg-global-7 text-button-3 border-l-2 border-[#f43f5e] px-3 py-1 text-xs"
                    leftImage={{
                      src: "/images/img_lucide_icons_siren.svg",
                      width: 12,
                      height: 12
                    }}
                  >
                    Gun Threat
                  </Button>
                </div>
                {/* Additional timeline rows */}
                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    className="bg-global-6 text-global-7 border-l-2 border-[#f97316] px-3 py-1 text-xs"
                    leftImage={{
                      src: "/images/img_lucide_icons_door_open.svg",
                      width: 12,
                      height: 12
                    }}
                  >
                    Unauthorised Access
                  </Button>
                  <Button
                    size="sm"
                    className="bg-global-4 text-global-3 border-l-2 border-[#3b82f6] px-3 py-1 text-xs"
                    leftImage={{
                      src: "/images/img_search.svg",
                      width: 12,
                      height: 12
                    }}
                  >
                    Face Recognised
                  </Button>
                </div>
                <div className="flex items-center justify-center">
                  <Button
                    size="sm"
                    className="bg-button-1 text-button-1 border-l-2 border-[#14b8a6] px-3 py-1 text-xs"
                    leftImage={{
                      src: "/images/img_lucide_icons_usersround.svg",
                      width: 12,
                      height: 12
                    }}
                  >
                    Traffic congestion
                  </Button>
                  <Button
                    size="sm"
                    className="bg-global-6 text-global-7 border-l-2 border-[#f97316] px-3 py-1 text-xs ml-auto"
                    leftImage={{
                      src: "/images/img_lucide_icons_door_open.svg",
                      width: 12,
                      height: 12
                    }}
                  >
                    Unauthorised Access
                  </Button>
                </div>
              </div>
              {/* Timeline indicator line */}
              <div className="mt-4 relative">
                <div className="absolute left-[236px] w-px h-[284px] bg-global-11"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;