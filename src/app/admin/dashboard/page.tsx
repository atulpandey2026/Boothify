'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { createClient } from '@/lib/supabase/client';

interface Stats {
  hero: number;
  portfolio: number;
  events: number;
  logos: number;
  testimonials: number;
  photos: number;
  cities: number;
  responses: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ hero: 0, portfolio: 0, events: 0, logos: 0, testimonials: 0, photos: 0, cities: 0, responses: 0 });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStats() {
      try {
        const [hero, portfolio, events, logos, testimonials, photos, cities, responses] = await Promise.all([
          supabase.from('hero_images').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('portfolio_items').select('*', { count: 'exact', head: true }).eq('site', 'boothify').eq('is_active', true),
          supabase.from('event_updates').select('*', { count: 'exact', head: true }).eq('site', 'boothify').eq('is_active', true),
          supabase.from('clientele_logos').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('testimonials').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('gallery_photos').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('cities').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('form_responses').select('*', { count: 'exact', head: true }),
        ]);
        setStats({
          hero: hero.count || 0,
          portfolio: portfolio.count || 0,
          events: events.count || 0,
          logos: logos.count || 0,
          testimonials: testimonials.count || 0,
          photos: photos.count || 0,
          cities: cities.count || 0,
          responses: responses.count || 0,
        });
      } catch (err) {
        console.error('Stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Hero Images', value: stats.hero, href: '/admin/dashboard/hero', color: 'bg-indigo-50 text-indigo-700', icon: '🖼️' },
    { label: 'Our Finest Work', value: stats.portfolio, href: '/admin/dashboard/portfolio', color: 'bg-fuchsia-50 text-fuchsia-700', icon: '✨' },
    { label: 'Event Updates', value: stats.events, href: '/admin/dashboard/event-updates', color: 'bg-cyan-50 text-cyan-700', icon: '📅' },
    { label: 'Clientele Logos', value: stats.logos, href: '/admin/dashboard/logos', color: 'bg-violet-50 text-violet-700', icon: '🏷️' },
    { label: 'Testimonials', value: stats.testimonials, href: '/admin/dashboard/testimonials', color: 'bg-pink-50 text-pink-700', icon: '💬' },
    { label: 'Gallery Photos', value: stats.photos, href: '/admin/dashboard/gallery', color: 'bg-emerald-50 text-emerald-700', icon: '🖼️' },
    { label: 'Cities', value: stats.cities, href: '/admin/dashboard/cities', color: 'bg-amber-50 text-amber-700', icon: '📍' },
    { label: 'Form Responses', value: stats.responses, href: '/admin/dashboard/responses', color: 'bg-blue-50 text-blue-700', icon: '📋' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-800 text-gray-900">Welcome back 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your Boothify website content from here.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {cards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-2xl font-800 text-gray-900">
                  {loading ? <span className="inline-block w-8 h-6 bg-gray-100 rounded animate-pulse" /> : card.value}
                </p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="text-base font-700 text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: 'Manage Hero Images', href: '/admin/dashboard/hero' },
              { label: 'Manage Our Finest Work', href: '/admin/dashboard/portfolio' },
              { label: 'Manage Event Updates', href: '/admin/dashboard/event-updates' },
              { label: 'Add Logo', href: '/admin/dashboard/logos' },
              { label: 'Add Testimonial', href: '/admin/dashboard/testimonials' },
              { label: 'Upload Photo', href: '/admin/dashboard/gallery' },
              { label: 'Manage Cities', href: '/admin/dashboard/cities' },
              { label: 'Edit Contact', href: '/admin/dashboard/contact' },
              { label: 'View Responses', href: '/admin/dashboard/responses' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200 text-sm font-600 text-gray-700 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-colors"
              >
                {action.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
