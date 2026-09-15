'use client';

import React, { useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { createClient } from '@/lib/supabase/client';

interface GalleryPhoto {
  id: string;
  title: string;
  photo_url: string;
  alt_text: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

const fallbackGallery: GalleryPhoto[] = [
  { id: 'portfolio-1', title: 'Concert Night Production', photo_url: 'https://images.unsplash.com/photo-1720292060310-c7a938601ae6', alt_text: 'Concert stage with vivid colored lights', category: 'stage', display_order: 1, is_active: true },
  { id: 'portfolio-2', title: 'Tech Expo Pavilion', photo_url: 'https://img.rocket.new/generatedImages/rocket_gen_img_15bf5c87e-1772256249267.png', alt_text: 'Bright exhibition hall with conference booth pavilions', category: 'exhibition', display_order: 2, is_active: true },
  { id: 'portfolio-3', title: 'International Trade Expo Booth', photo_url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800', alt_text: 'Modern trade show exhibition booth', category: 'stall', display_order: 3, is_active: true },
  { id: 'portfolio-4', title: 'Grand Ballroom Gala', photo_url: 'https://images.unsplash.com/photo-1713096591935-a506ca209159', alt_text: 'Elegant ballroom event', category: 'general', display_order: 4, is_active: true },
  { id: 'portfolio-5', title: 'Brand Activation Hub', photo_url: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200', alt_text: 'Vibrant brand activation space', category: 'activation', display_order: 5, is_active: true },
  { id: 'portfolio-6', title: 'Summit Leadership Forum', photo_url: 'https://img.rocket.new/generatedImages/rocket_gen_img_1448ec0fc-1772647999669.png', alt_text: 'Professional conference stage', category: 'stage', display_order: 6, is_active: true },
];

export default function GallerySection() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(fallbackGallery);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;
    async function loadPhotos() {
      const { data, error } = await supabase
        .from('gallery_photos')
        .select('id,title,photo_url,alt_text,category,display_order,is_active')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      if (mounted && !error && data && data.length > 0) setPhotos(data as GalleryPhoto[]);
    }
    loadPhotos();
    return () => { mounted = false; };
  }, []);

  return (
    <section id="gallery" className="section-pad px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="section-label mb-4 inline-flex">Behind The Scenes</span>
            <h2 className="text-section-title font-800 text-gray-900">Gallery</h2>
            <p className="text-gray-500 mt-3 max-w-2xl">A glimpse of the exhibitions, stages, activations and experiences we bring to life.</p>
          </div>
          <a href="#contact" className="btn-ghost self-start md:self-auto">Plan Your Experience →</a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className={`img-zoom-wrap rounded-2xl overflow-hidden relative group bg-gray-100 ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`} style={{ minHeight: index === 0 ? '520px' : '250px' }}>
              <AppImage src={photo.photo_url} alt={photo.alt_text || photo.title || 'Boothify gallery photo'} fill className="object-cover" sizes={index === 0 ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 50vw, 25vw'} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[10px] font-700 uppercase tracking-wider text-violet-200">{photo.category}</span>
                <h3 className="text-sm md:text-base font-700 text-white mt-1">{photo.title || 'Boothify Experience'}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
