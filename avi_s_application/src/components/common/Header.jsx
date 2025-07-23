'use client';
import React from 'react';
import Dropdown from '../ui/Dropdown';

const Header = () => {
  const navigationItems = [
    {
      icon: '/images/img_mdi_view_dashboard.svg',
      label: 'Dashboard',
      href: '/dashboard'
    },
    {
      icon: '/images/img_bxs_cctv.svg',
      label: 'Cameras',
      href: '/cameras'
    },
    {
      icon: '/images/img_material_symbol.svg',
      label: 'Scenes',
      href: '/scenes'
    },
    {
      icon: '/images/img_ri_alert_fill.svg',
      label: 'Incidents',
      href: '/incidents'
    },
    {
      icon: '/images/img_mdi_users.svg',
      label: 'Users',
      href: '/users'
    }
  ];

  return (
    <header className="relative w-full">
      {/* Background gradient */}
      <div className="absolute inset-0 w-full h-[40px]">
        <img 
          src="/images/img_gradient.png" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Header content */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end px-4 sm:px-6 lg:px-8 pt-4 pb-4 sm:pt-6 sm:pb-6 border-b border-[#ffffff26]">
        {/* Logo */}
        <div className="mb-4 sm:mb-0">
          <img 
            src="/images/img_header_logo.png" 
            alt="Logo" 
            className="w-[120px] h-[26px]"
          />
        </div>

        {/* Navigation - Hidden on mobile, shown on larger screens */}
        <nav className="hidden lg:flex flex-row gap-4 xl:gap-6">
          {navigationItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="flex items-center gap-2 px-2 py-2 text-white hover:bg-white hover:bg-opacity-10 rounded transition-all duration-200"
            >
              <img 
                src={item.icon} 
                alt="" 
                className="w-4 h-4"
              />
              <span className="text-xs font-bold font-plus-jakarta">
                {item.label}
              </span>
            </a>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button className="lg:hidden p-2 text-white hover:bg-white hover:bg-opacity-10 rounded">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* User profile section */}
        <div className="flex items-center gap-2 sm:gap-3 mt-4 sm:mt-0">
          <img 
            src="/images/img_image.png" 
            alt="Profile" 
            className="w-8 h-8 rounded-full"
          />
          <div className="w-32 sm:w-36">
            <Dropdown
              placeholder="Mohammed Ajhas"
              rightImage={{
                src: "/images/img_arrowdown.svg",
                width: 16,
                height: 16
              }}
              options={[
                { label: 'Profile', value: 'profile' },
                { label: 'Settings', value: 'settings' },
                { label: 'Logout', value: 'logout' }
              ]}
              className="text-xs"
            >
              ajhas@mandlac.com
            </Dropdown>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;