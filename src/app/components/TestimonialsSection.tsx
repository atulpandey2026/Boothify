'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Testimonial {
  id: string;
  quote: string;
  author_name: string;
  author_role: string;
  author_company: string;
  rating: number;
  is_active: boolean;
  display_order: number;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: '1',
    quote:
      'Boothify transformed our exhibition presence completely. The booth they designed for us at India International Trade Fair was the talk of the event — we had 3x more footfall than previous years.',
    author_name: 'Rajesh Sharma',
    author_role: 'Head of Marketing',
    author_company: 'Tata Consumer Products',
    rating: 5,
    is_active: true,
    display_order: 1,
  },
  {
    id: '2',
    quote:
      'From concept to execution in just 3 weeks — the team at Boothify is incredibly professional. Our brand activation in Mumbai was flawless. Highly recommend for any large-scale event.',
    author_name: 'Priya Mehta',
    author_role: 'Brand Director',
    author_company: 'Reliance Retail',
    rating: 5,
    is_active: true,
    display_order: 2,
  },
  {
    id: '3',
    quote:
      "The stage production for our annual summit was world-class. Lighting, trussing, AV — everything was perfect. Boothify's attention to detail is unmatched in the industry.",
    author_name: 'Arjun Kapoor',
    author_role: 'Events Manager',
    author_company: 'Infosys Limited',
    rating: 5,
    is_active: true,
    display_order: 3,
  },
  {
    id: '4',
    quote:
      "We've worked with Boothify across 5 cities for our product launch roadshow. Consistent quality, on-time delivery, and a team that truly understands brand storytelling.",
    author_name: 'Sunita Agarwal',
    author_role: 'VP Marketing',
    author_company: 'HDFC Bank',
    rating: 5,
    is_active: true,
    display_order: 4,
  },
  {
    id: '5',
    quote:
      'Our Mahindra booth at Auto Expo was a showstopper. The custom fabrication quality was exceptional and the team managed everything on-site without a single hiccup.',
    author_name: 'Vikram Singh',
    author_role: 'Product Marketing Lead',
    author_company: 'Mahindra & Mahindra',
    rating: 5,
    is_active: true,
    display_order: 5,
  },
  {
    id: '6',
    quote:
      "Boothify delivered a stunning experiential zone for our Godrej Nature's Basket activation. The creative team understood our brand DNA perfectly and brought it to life beautifully.",
    author_name: 'Meera Nair',
    author_role: 'Experiential Marketing Head',
    author_company: 'Godrej Group',
    rating: 5,
    is_active: true,
    display_order: 6,
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="#F59E0B"
          stroke="none"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>(fallbackTestimonials);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const supabase = createClient();

        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (!error && data && data.length > 0) {
          setTestimonials(data);
        }
      } catch (error) {
        console.error('Failed to load testimonials:', error);
      }
    }

    fetchTestimonials();
  }, []);

  return (
    <section
      id="testimonials"
      className="section-pad px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-label mb-5 inline-flex">
            Client Love
          </span>

          <h2 className="text-section-title font-800 text-gray-900">
            What Our Clients Say
          </h2>

          <p className="text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
            173+ events. Hundreds of happy clients. Here&apos;s what India&apos;s
            top brands say about working with Boothify.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="card-hover border rounded-2xl p-7 flex flex-col gap-5 bg-white border-gray-100"
            >
              {/* Quote */}
              <div className="text-5xl font-display font-900 leading-none text-violet-600 opacity-30">
                &ldquo;
              </div>

              {/* Stars */}
              <StarRating count={t.rating || 5} />

              {/* Quote text */}
              <p className="text-gray-700 text-sm leading-relaxed flex-1 -mt-2">
                {t.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-black/5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-800 text-violet-600 bg-violet-50 shadow-sm">
                  {t.author_name?.charAt(0)?.toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-700 text-gray-900">
                    {t.author_name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {t.author_role}
                    {t.author_company
                      ? `, ${t.author_company}`
                      : ''}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">
            Join 50+ brands who trust Boothify for their events
          </p>

          <a href="#contact" className="btn-primary inline-flex">
            Start Your Project →
          </a>
        </div>

      </div>
    </section>
  );
}