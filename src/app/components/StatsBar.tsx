'use client';

import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { end: 35, suffix: '+', label: 'Events Executed' },
  { end: 175, suffix: '+', label: 'Experiences Built' },
  { end: 1500, suffix: '+', label: 'Visitors Engaged' },
  { end: 10, suffix: '', label: 'Cities' },
];

function CountUp({ end, suffix, active }: { end: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!active || hasRun.current) return;
    hasRun.current = true;
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [active, end]);

  return (
    <span className="stat-number">
      {count}{suffix}
    </span>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setActive(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="bg-white border-y border-gray-100 py-14 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2 group">
              <CountUp end={stat.end} suffix={stat.suffix} active={active} />
              <span className="text-xs font-700 text-gray-500 tracking-widest uppercase">
                {stat.label}
              </span>
              <div className="w-8 h-0.5 bg-violet-200 group-hover:bg-violet-500 group-hover:w-12 transition-all duration-300 mt-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
