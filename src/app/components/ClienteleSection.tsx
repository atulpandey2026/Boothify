'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ClientLogo {
  id?: string;
  name: string;
  logo_url: string;
  website_url?: string;
  display_order?: number;
  is_active?: boolean;
}

// Added logo_url to fallback items so images render even without Supabase data
const fallbackClientele = [
  { name: 'Tata Group', logo_url: 'https://logo.clearbit.com/tata.com', website_url: 'https://tata.com' },
  { name: 'Reliance Industries', logo_url: 'https://logo.clearbit.com/ril.com', website_url: 'https://ril.com' },
  { name: 'Infosys', logo_url: 'https://logo.clearbit.com/infosys.com', website_url: 'https://infosys.com' },
  { name: 'HDFC Bank', logo_url: 'https://logo.clearbit.com/hdfcbank.com', website_url: 'https://hdfcbank.com' },
  { name: 'Mahindra', logo_url: 'https://logo.clearbit.com/mahindra.com', website_url: 'https://mahindra.com' },
  { name: 'Wipro', logo_url: 'https://logo.clearbit.com/wipro.com', website_url: 'https://wipro.com' },
  { name: 'Bajaj Auto', logo_url: 'https://logo.clearbit.com/bajajauto.com', website_url: 'https://bajajauto.com' },
  { name: 'Maruti Suzuki', logo_url: 'https://logo.clearbit.com/marutisuzuki.com', website_url: 'https://marutisuzuki.com' },
  { name: 'ITC Limited', logo_url: 'https://logo.clearbit.com/itcportal.com', website_url: 'https://itcportal.com' },
  { name: 'Godrej Group', logo_url: 'https://logo.clearbit.com/godrej.com', website_url: 'https://godrej.com' },
  { name: 'Asian Paints', logo_url: 'https://logo.clearbit.com/asianpaints.com', website_url: 'https://asianpaints.com' },
  { name: 'Hindustan Unilever', logo_url: 'https://logo.clearbit.com/hul.co.in', website_url: 'https://hul.co.in' },
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

  const rawLogos = !loading && logos.length > 0 ? logos : fallbackClientele;

  const displayLogos = rawLogos.map((logo) => ({
    name: logo.name,
    logo_url: logo.logo_url,
    image_src: getLogoSrc(logo.logo_url),
    website_url: logo.website_url || '#',
  }));

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
        <div className="marquee-wrapper mb-5">
          <div className="animate-marquee-left flex items-center gap-5">

            {logosDouble.map((client, i) => {
              const content = (
                <div className="flex-shrink-0 flex items-center justify-center border rounded-xl p-3 min-w-[220px] h-[90px] bg-white border-gray-200">
                  <img
                    src={client.image_src}
                    alt={client.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              );

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
            })}

          </div>
        </div>

        {/* Row 2 */}
        <div className="marquee-wrapper">
          <div className="animate-marquee-right flex items-center gap-5">

            {[...logosDouble].reverse().map((client, i) => {
              const content = (
                <div className="flex-shrink-0 flex items-center justify-center border rounded-xl p-3 min-w-[220px] h-[90px] bg-white border-gray-200">
                  <img
                    src={client.image_src}
                    alt={client.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              );

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
