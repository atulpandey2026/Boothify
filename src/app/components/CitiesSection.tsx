'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface City {
  id: string;
  name: string;
  emoji: string;
  color: string;
  is_active: boolean;
  display_order: number;
}

const fallbackCities: City[] = [
  { id: '1', name: 'Delhi', emoji: '🏛️', color: '#7C3AED', is_active: true, display_order: 1 },
  { id: '2', name: 'Noida', emoji: '🏢', color: '#EC4899', is_active: true, display_order: 2 },
  { id: '3', name: 'Chandigarh', emoji: '🌺', color: '#F59E0B', is_active: true, display_order: 3 },
  { id: '4', name: 'Lucknow', emoji: '🌹', color: '#06B6D4', is_active: true, display_order: 4 },
  { id: '5', name: 'Jaipur', emoji: '🏰', color: '#D946EF', is_active: true, display_order: 5 },
  { id: '6', name: 'Ahmedabad', emoji: '🏺', color: '#F97316', is_active: true, display_order: 6 },
  { id: '7', name: 'Mumbai', emoji: '🌊', color: '#10B981', is_active: true, display_order: 7 },
  { id: '8', name: 'Hyderabad', emoji: '💎', color: '#3B82F6', is_active: true, display_order: 8 },
  { id: '9', name: 'Bengaluru', emoji: '🌿', color: '#8B5CF6', is_active: true, display_order: 9 },
  { id: '10', name: 'Chennai', emoji: '🎭', color: '#EF4444', is_active: true, display_order: 10 },
];

export default function CitiesSection() {
  const [cities, setCities] = useState<City[]>(fallbackCities);

  useEffect(() => {
    async function fetchCities() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from('cities')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          setCities(data);
        }
      } catch (error) {
        console.error('Failed to load cities:', error);
      }
    }

    fetchCities();
  }, []);

  const cityCount = cities.length;

  return (
    <section
      id="cities"
      className="section-pad px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-label mb-5 inline-flex">
            Our Reach
          </span>

          <h2 className="text-section-title font-800 text-gray-900">
            Pan-India Operations
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            <span className="text-violet-600 font-700">
              {cityCount} cities.
            </span>{' '}
            One unified vision.
          </p>
        </div>

        {/* Cities layout */}
        <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="max-w-3xl mx-auto">

            <h3 className="text-2xl font-800 text-gray-900 mb-3 text-center">
              Serving {cityCount} Major Cities
            </h3>

            <p className="text-gray-500 leading-relaxed mb-8 text-center">
              With teams on the ground across India&apos;s biggest metros and
              tier-1 cities, Boothify delivers the same premium quality
              whether you&apos;re exhibiting in Delhi or launching a brand
              activation in Chennai.
            </p>

            {/* City badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-200"
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: city.color || '#7C3AED',
                    }}
                  />

                  <span className="text-sm font-600 text-gray-800">
                    {city.emoji} {city.name}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}