'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ClientLogo {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  display_order: number;
  is_active: boolean;
}

const fallbackClientele = [
  { name: 'Tata Group', abbr: 'TATA', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { name: 'Reliance Industries', abbr: 'RIL', color: 'bg-violet-50 text-violet-700 border-violet-200' },
  { name: 'Infosys', abbr: 'INFY', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { name: 'HDFC Bank', abbr: 'HDFC', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { name: 'Mahindra', abbr: 'M&M', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { name: 'Wipro', abbr: 'WPRO', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  { name: 'Bajaj Auto', abbr: 'BAJAJ', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { name: 'Maruti Suzuki', abbr: 'MSIL', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { name: 'ITC Limited', abbr: 'ITC', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  { name: 'Godrej Group', abbr: 'GODREJ', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  { name: 'Asian Paints', abbr: 'APNT', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200' },
  { name: 'Hindustan Unilever', abbr: 'HUL', color: 'bg-lime-50 text-lime-700 border-lime-200' },
];

export default function ClienteleSection() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogos() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from('clientele_logos')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          setLogos(data);
        }
      } catch (error) {
        console.error('Failed to load clientele logos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLogos();
  }, []);

  const getLogoSrc = (logoUrl: string) => {
    const value = (logoUrl || '').trim();
    if (/^https?:\/\//i.test(value)) {
      return `/api/image-proxy?url=${encodeURIComponent(value)}`;
    }
    return value;
  };

  const databaseLogos = logos.map((logo) => ({
    name: logo.name,
    abbr: logo.name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .slice(0, 6)
      .toUpperCase(),
    logo_url: logo.logo_url,
    image_src: getLogoSrc(logo.logo_url),
    website_url: logo.website_url,
  }));

  const displayLogos =
    !loading && databaseLogos.length > 0
      ? databaseLogos
      : fallbackClientele;

  const logosDouble = [...displayLogos, ...displayLogos];

  return (
    <section
      id="clientele"
      className="section-pad px-4 sm:px-6 lg:px-8 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-label mb-5 inline-flex">
            Trusted By
          </span>

          <h2 className="text-section-title font-800 text-gray-900">
            Our Clientele
          </h2>

          <p className="text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
            India&apos;s most iconic brands trust Boothify to represent them
            on the world stage.
          </p>
        </div>

        {/* Row 1 */}
        <div className="marquee-wrapper mb-6">
          <div className="animate-marquee-left flex items-center gap-6">

            {logosDouble.map((client, i) => {
              const isDatabaseLogo = 'logo_url' in client;

              const content = (
                <div
                  className={`flex-shrink-0 flex items-center justify-center gap-3 border rounded-xl px-8 py-6 min-w-[220px] ${
                    !isDatabaseLogo
                      ? client.color
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {isDatabaseLogo && client.logo_url ? (
                    <img
                      src={client.image_src}
                      alt={client.name}
                      className="max-h-20 max-w-[180px] object-contain"
                    />
                  ) : (
                    <>
                      <span className="text-xl font-800 tracking-tight">
                        {client.abbr}
                      </span>

                      <span className="text-sm font-500 opacity-70 hidden sm:block">
                        {client.name}
                      </span>
                    </>
                  )}
                </div>
              );

              if (isDatabaseLogo && client.website_url) {
                return (
                  <a
                    key={`${client.name}-${i}`}
                    href={client.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <React.Fragment key={`${client.name}-${i}`}>
                  {content}
                </React.Fragment>
              );
            })}

          </div>
        </div>

        {/* Row 2 */}
        <div className="marquee-wrapper">
          <div className="animate-marquee-right flex items-center gap-6">

            {[...logosDouble].reverse().map((client, i) => {
              const isDatabaseLogo = 'logo_url' in client;

              const content = (
                <div
                  className={`flex-shrink-0 flex items-center justify-center gap-3 border rounded-xl px-8 py-6 min-w-[220px] ${
                    !isDatabaseLogo
                      ? client.color
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {isDatabaseLogo && client.logo_url ? (
                    <img
                      src={client.image_src}
                      alt={client.name}
                      className="max-h-20 max-w-[180px] object-contain"
                    />
                  ) : (
                    <>
                      <span className="text-xl font-800 tracking-tight">
                        {client.abbr}
                      </span>

                      <span className="text-sm font-500 opacity-70 hidden sm:block">
                        {client.name}
                      </span>
                    </>
                  )}
                </div>
              );

              if (isDatabaseLogo && client.website_url) {
                return (
                  <a
                    key={`${client.name}-reverse-${i}`}
                    href={client.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {content}
                  </a>
                );
              }

              return (
                <React.Fragment key={`${client.name}-reverse-${i}`}>
                  {content}
                </React.Fragment>
              );
            })}

          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          {[
            {
              label: '173+ Events',
              sub: 'Successfully delivered',
              color: 'text-violet-600',
            },
            {
              label: '50+ Brands',
              sub: 'Repeat clients',
              color: 'text-pink-600',
            },
            {
              label: '10 Cities',
              sub: 'Pan-India presence',
              color: 'text-amber-600',
            },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <p className={`text-xl font-800 ${item.color}`}>
                {item.label}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {item.sub}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
