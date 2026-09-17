'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { createClient } from '@/lib/supabase/client';

interface HeroImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
  site: string;
}

interface EventUpdate {
  id: string;
  event_name: string;
  event_date: string;
  location: string;
  display_order: number;
  is_active: boolean;
  site: string;
}

const fallbackEventUpdates: EventUpdate[] = [
  { id: 'event-fallback-1', event_name: 'Event Name 1', event_date: 'Date', location: 'Location', display_order: 1, is_active: true, site: 'boothify' },
  { id: 'event-fallback-2', event_name: 'Event Name 2', event_date: 'Date', location: 'Location', display_order: 2, is_active: true, site: 'boothify' },
  { id: 'event-fallback-3', event_name: 'Event Name 3', event_date: 'Date', location: 'Location', display_order: 3, is_active: true, site: 'boothify' },
];

const fallbackHeroImages: HeroImage[] = [
  { id: 'fallback-1', image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&auto=format&fit=crop&q=80', alt_text: 'Large conference stage with dramatic lighting, speaker podium and thousands of attendees in a grand arena', display_order: 1, is_active: true, site: 'boothify' },
  { id: 'fallback-2', image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&auto=format&fit=crop&q=80', alt_text: 'Modern exhibition booth interior with bright lighting, branded display walls and professional setup', display_order: 2, is_active: true, site: 'boothify' },
  { id: 'fallback-3', image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&auto=format&fit=crop&q=80', alt_text: 'Concert stage with confetti explosion, vivid colored lights and massive crowd in dark arena atmosphere', display_order: 3, is_active: true, site: 'boothify' },
  { id: 'fallback-4', image_url: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&auto=format&fit=crop&q=80', alt_text: 'Elegant ballroom event with chandeliers, warm golden lighting and beautifully decorated tables for gala', display_order: 4, is_active: true, site: 'boothify' },
];

export default function HeroSection() {
  const [heroImages, setHeroImages] = useState<HeroImage[]>(fallbackHeroImages);
  const [eventUpdates, setEventUpdates] = useState<EventUpdate[]>(fallbackEventUpdates);
  const currentImg = useRef(0);
  const imgRefs = useRef<HTMLDivElement[]>([]);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;
    async function loadHeroImages() {
      const { data, error } = await supabase
        .from('hero_images')
        .select('id,image_url,alt_text,display_order,is_active,site')
        .eq('site', 'boothify')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (mounted && !error && data && data.length > 0) {
        setHeroImages(data as HeroImage[]);
      }
    }

    async function loadEventUpdates() {
      const { data, error } = await supabase
        .from('event_updates')
        .select('id,event_name,event_date,location,display_order,is_active,site')
        .eq('site', 'boothify')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(3);

      if (mounted && !error && data && data.length > 0) {
        setEventUpdates(data as EventUpdate[]);
      }
    }

    loadHeroImages();
    loadEventUpdates();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    currentImg.current = 0;
    imgRefs.current.forEach((el, index) => {
      if (el) el.style.opacity = index === 0 ? '1' : '0';
    });
  }, [heroImages]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      if (imgRefs.current[currentImg.current]) imgRefs.current[currentImg.current].style.opacity = '0';
      currentImg.current = (currentImg.current + 1) % heroImages.length;
      if (imgRefs.current[currentImg.current]) imgRefs.current[currentImg.current].style.opacity = '1';
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gray-900" style={{ borderBottomLeftRadius: '80px' }}>
      {heroImages.map((img, i) => (
        <div
          key={img.id}
          ref={(el) => { if (el) imgRefs.current[i] = el; }}
          className="absolute inset-0 transition-opacity duration-1500"
          style={{ opacity: i === 0 ? 1 : 0 }}
        >
          <AppImage src={img.image_url} alt={img.alt_text || 'Boothify event experience'} fill className="object-cover" priority={i === 0} sizes="100vw" />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90 z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />

      <div className="absolute top-32 right-6 md:right-12 z-30 hidden lg:block">
        <div className="glass-card rounded-2xl p-5 w-72">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping-slow" />
            <span className="text-xs font-700 text-violet-600 uppercase tracking-wider">Upcoming events</span>
          </div>
          <div className="space-y-3 text-xs text-gray-600">
            {eventUpdates.map((event) => (
              <div key={event.id}>
                <span className="block text-gray-900 font-600 mb-0.5">{event.event_name}</span>
                <p>{event.event_date}{event.location ? `, ${event.location}` : ''}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-20 flex flex-col justify-end min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 pt-48">
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-700 tracking-widest uppercase bg-white/10 backdrop-blur-sm text-white border border-white/20 px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping-slow" />
            India&apos;s Premier Experiential Company
          </span>
        </div>
        <h1 className="text-hero-display font-800 text-white max-w-3xl mb-6 leading-tight">
          We Build{' '}
          <span className="font-display italic font-900" style={{ background: 'linear-gradient(135deg, #A78BFA 0%, #F472B6 50%, #FCD34D 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            EXPERIENCES
          </span>
          <br />That Last.
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-xl mb-10 leading-relaxed font-400">
          From concept to execution — exhibitions, stages,<br className="hidden md:block" /> brand activations &amp; beyond.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#contact" className="btn-primary text-base py-4 px-8">Start Your Project →</a>
          <a href="#work" className="btn-ghost text-base py-4 px-8 border-white/30 text-white hover:border-violet-400 hover:text-violet-300">Explore Our Work &gt;</a>
        </div>
        <div className="mt-14 flex flex-wrap gap-8">
          {[
            { num: '30+', label: 'Events', color: '#A78BFA' },
            { num: '50+', label: 'Brands', color: '#F472B6' },
            { num: '10', label: 'Cities', color: '#FCD34D' },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span className="text-2xl font-800" style={{ color: s.color }}>{s.num}</span>
              <span className="text-sm text-white/60 font-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
