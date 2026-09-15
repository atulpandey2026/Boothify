'use client';

import React, { useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { createClient } from '@/lib/supabase/client';

type FilterKey = 'all' | 'stages' | 'booths' | 'mezzanines' | 'experiences';

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  category: FilterKey;
  categoryLabel: string;
  src: string;
  alt: string;
  display_order: number;
  is_active: boolean;
  site: string;
}

const fallbackPortfolioItems: PortfolioItem[] = [
  { id: 'fallback-1', title: 'Concert Night Production', category: 'stages', categoryLabel: 'Stage', src: 'https://images.unsplash.com/photo-1720292060310-c7a938601ae6', alt: 'Concert stage with vivid colored lights, smoke effects and large crowd in dark arena', display_order: 1, is_active: true, site: 'boothify' },
  { id: 'fallback-2', title: 'Tech Expo Pavilion', category: 'booths', categoryLabel: 'Booth', src: 'https://img.rocket.new/generatedImages/rocket_gen_img_15bf5c87e-1772256249267.png', alt: 'Bright exhibition hall with large conference booth pavilions and business visitors', display_order: 2, is_active: true, site: 'boothify' },
  { id: 'fallback-3', title: 'International Trade Expo Booth', category: 'booths', categoryLabel: 'Booth', src: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Modern trade show exhibition booth with branded panels and product displays in well-lit expo hall', display_order: 3, is_active: true, site: 'boothify' },
  { id: 'fallback-4', title: 'Grand Ballroom Gala', category: 'mezzanines', categoryLabel: 'Mezzanine', src: 'https://images.unsplash.com/photo-1713096591935-a506ca209159', alt: 'Elegant ballroom event with chandeliers, warm golden lighting and decorated tables for gala event', display_order: 4, is_active: true, site: 'boothify' },
  { id: 'fallback-5', title: 'Brand Activation Hub', category: 'experiences', categoryLabel: 'Experience', src: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200', alt: 'Vibrant brand activation space with colourful interactive displays and engaged consumers', display_order: 5, is_active: true, site: 'boothify' },
  { id: 'fallback-6', title: 'Summit Leadership Forum', category: 'stages', categoryLabel: 'Stage', src: 'https://img.rocket.new/generatedImages/rocket_gen_img_1448ec0fc-1772647999669.png', alt: 'Professional conference stage with speaker podium, dramatic lighting and large audience in dark auditorium', display_order: 6, is_active: true, site: 'boothify' },
  { id: 'fallback-7', title: 'Executive Lounge Design', category: 'mezzanines', categoryLabel: 'Mezzanine', src: 'https://images.unsplash.com/photo-1662261896074-2c455242bb9a', alt: 'Sophisticated executive lounge with modern furniture, ambient lighting and premium interior design', display_order: 7, is_active: true, site: 'boothify' },
  { id: 'fallback-8', title: 'Immersive Brand World', category: 'experiences', categoryLabel: 'Experience', src: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Immersive brand experience installation with glowing neon elements and interactive digital displays', display_order: 8, is_active: true, site: 'boothify' },
  { id: 'fallback-9', title: 'Custom Stall Fabrication', category: 'booths', categoryLabel: 'Booth', src: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Precision-engineered custom stall structure with backlit panels and branded signage at expo', display_order: 9, is_active: true, site: 'boothify' },
];

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'stages', label: 'Stages' },
  { key: 'booths', label: 'Stalls & Booths' },
  { key: 'mezzanines', label: 'Mezzanines' },
  { key: 'experiences', label: 'Experiences' },
];

function PortfolioCard({ item, large = false, tall = false }: { item: PortfolioItem; large?: boolean; tall?: boolean }) {
  return (
    <div className={`${large ? 'lg:col-span-2' : ''} ${tall ? 'lg:row-span-2' : ''} img-zoom-wrap rounded-2xl overflow-hidden relative group cursor-pointer`}>
      <AppImage src={item.src} alt={item.alt} fill className="object-cover" sizes={large ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 100vw, 33vw'} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 p-6 w-full">
        <span className="text-xs font-700 text-primary uppercase tracking-wider">{item.categoryLabel}</span>
        <h3 className="text-lg font-700 text-white mt-1">{item.title}</h3>
        {item.description && <p className="text-xs text-white/70 mt-1 line-clamp-2">{item.description}</p>}
      </div>
    </div>
  );
}

export default function PortfolioSection() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(fallbackPortfolioItems);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;
    async function loadPortfolio() {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('id,title,description,image_url,alt_text,category,display_order,is_active,site')
        .eq('site', 'boothify')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (!mounted || error || !data || data.length === 0) return;
      const mapped = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        category: (['stages', 'booths', 'mezzanines', 'experiences'].includes(item.category) ? item.category : 'experiences') as FilterKey,
        categoryLabel: item.category_label || ({ stages: 'Stage', booths: 'Booth', mezzanines: 'Mezzanine', experiences: 'Experience' }[item.category] || 'Experience'),
        src: item.image_url,
        alt: item.alt_text || item.title,
        display_order: item.display_order || 0,
        is_active: item.is_active,
      }));
      setPortfolioItems(mapped);
    }
    loadPortfolio();
    return () => { mounted = false; };
  }, []);

  const filtered = activeFilter === 'all' ? portfolioItems : portfolioItems.filter((item) => item.category === activeFilter);

  return (
    <section id="work" className="section-pad px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="section-label mb-4 inline-flex">Our Portfolio</span>
            <h2 className="text-section-title font-800 text-gray-900">Our Finest Work</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button key={f.key} onClick={() => setActiveFilter(f.key)} className={`px-4 py-2 rounded-full text-xs font-700 uppercase tracking-wider transition-all duration-200 ${activeFilter === f.key ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' : 'bg-white text-gray-500 border border-gray-200 hover:border-violet-400 hover:text-violet-600'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {activeFilter === 'all' && portfolioItems.length >= 9 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">
            <PortfolioCard item={portfolioItems[0]} large />
            <PortfolioCard item={portfolioItems[1]} tall />
            <PortfolioCard item={portfolioItems[2]} />
            <PortfolioCard item={portfolioItems[3]} />
            <PortfolioCard item={portfolioItems[4]} large />
            <PortfolioCard item={portfolioItems[5]} />
            <PortfolioCard item={portfolioItems[6]} />
            <PortfolioCard item={portfolioItems[7]} />
            <PortfolioCard item={portfolioItems[8]} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[320px]">
            {filtered.map((item) => <PortfolioCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </section>
  );
}
