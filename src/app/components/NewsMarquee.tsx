import React from 'react';

const newsItems = [
  'Boothify redefines experiential marketing in India — Economic Times',
  'How Boothify is transforming event spaces across the country — Forbes India',
  "India\'s top booth design company expands to 10 cities — Hindustan Times",
  "Boothify named among India's most innovative event companies — Business Standard",
  'Leading experiential marketing firm completes 173+ events in record time — Times of India',
  "Bharat Network Group's Boothify sets new benchmarks in stall fabrication — Mint",
  "Boothify's stage productions steal the show at India's biggest expos — NDTV",
  'How experiential marketing is reshaping brand engagement — Outlook Business',
  'Boothify brings world-class booth design to Tier-1 Indian cities — Financial Express',
  'Boothify wins best exhibition design award at India Expo Summit — Entrepreneur Inc',
];

const newsDouble = [...newsItems, ...newsItems];

export default function NewsMarquee() {
  return (
    <div className="bg-gray-50 border-t border-gray-100 py-5 overflow-hidden">
      {/* Label row */}
      <div className="flex items-center gap-4 mb-3 px-6">
        <span className="text-[10px] font-800 uppercase tracking-[0.18em] text-violet-600 whitespace-nowrap">As Seen In</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      {/* Scrolling news items */}
      <div className="marquee-wrapper">
        <div className="animate-marquee-right flex items-center gap-0">
          {newsDouble?.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-8 text-xs font-500 whitespace-nowrap text-gray-400 hover:text-gray-700 transition-colors"
            >
              <span className="text-amber-500 font-700 text-base">★</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}