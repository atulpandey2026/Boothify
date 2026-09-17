'use client';

import React from 'react';

const cities = [
  'Delhi', 'Mumbai', 'Lucknow', 'Chennai', 'Bengaluru',
  'Ahmedabad', 'Hyderabad', 'Jaipur', 'Chandigarh', 'Noida',
];

const citiesDouble = [...cities, ...cities];

export default function UtilityBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-10 flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(90deg, #7C3AED 0%, #EC4899 50%, #F59E0B 100%)' }}>
      <div className="flex items-center w-full h-full">
        {/* Contact phone — fixed left */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 border-r border-white/20 h-full">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <a href="tel:+9188820 02378" className="text-xs font-700 tracking-wide whitespace-nowrap hover:underline text-white">
            +9188820 02378
          </a>
        </div>

        {/* City ticker — scrolling */}
        <div className="flex-1 overflow-hidden marquee-wrapper">
          <div className="animate-marquee-left flex items-center gap-0">
            {citiesDouble?.map((city, i) => (
              <span key={i} className="inline-flex items-center gap-2 px-5 text-xs font-600 tracking-wider whitespace-nowrap text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
                {city}
              </span>
            ))}
          </div>
        </div>

        {/* Email — fixed right */}
        <div className="flex-shrink-0 flex items-center gap-2 px-4 border-l border-white/20 h-full">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
            <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <a href="mailto:contact@boothify.in" className="text-xs font-700 tracking-wide whitespace-nowrap hover:underline text-white hidden sm:inline">
            contact@boothify.in
          </a>
          <span className="text-xs font-700 tracking-widest uppercase whitespace-nowrap text-white/80 sm:hidden">
            10 Cities
          </span>
        </div>
      </div>
    </div>
  );
}
