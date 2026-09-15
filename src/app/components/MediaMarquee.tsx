import React from 'react';

const mediaNames = [
  'Economic Times',
  'Forbes India',
  'Hindustan Times',
  'Times of India',
  'NDTV',
  'Business Standard',
  'Mint',
  'Outlook Business',
  'The Hindu BusinessLine',
  'Financial Express',
  'Entrepreneur Inc',
];

const mediaDouble = [...mediaNames, ...mediaNames];

export default function MediaMarquee() {
  return (
    <div className="bg-white border-b border-gray-100 py-2.5 overflow-hidden flex items-center shadow-sm">
      {/* Fixed label */}
      <div className="flex-shrink-0 flex items-center gap-3 px-5 border-r border-gray-100 h-full">
        <span className="text-[10px] font-800 uppercase tracking-[0.18em] text-violet-600 whitespace-nowrap">
          As Covered By
        </span>
      </div>
      {/* Scrolling names */}
      <div className="flex-1 marquee-wrapper">
        <div className="animate-marquee-left-fast flex items-center gap-0">
          {mediaDouble?.map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-6 text-[11px] font-700 tracking-widest uppercase whitespace-nowrap text-gray-400 hover:text-gray-700 transition-colors"
            >
              <span className="text-violet-400 text-base leading-none">◆</span>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}