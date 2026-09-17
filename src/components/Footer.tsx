import React from 'react';
import AppImage from '@/components/ui/AppImage';

const cities = ['Delhi', 'Mumbai', 'Lucknow', 'Chennai', 'Bengaluru', 'Ahmedabad', 'Hyderabad', 'Jaipur', 'Chandigarh', 'Noida'];

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/boothify-bng',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: '#',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-10 mb-12">
          {/* Left: Logo + tagline + cities */}
          <div className="flex flex-col gap-5 max-w-sm">
            <div className="relative w-40 h-11">
              <AppImage
                src="/assets/images/Boothify_Logo-1788613263291.webp"
                alt="Boothify logo — pixel art orange lettering"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              India&apos;s Premier Experiential Company.<br />
              Part of <span className="text-violet-600 font-600">Bharat Network Group</span>.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {cities?.map((c) => (
                <span key={c} className="text-[11px] font-500 text-gray-500 bg-gray-50 border border-gray-200 rounded-full px-2.5 py-0.5">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Links + Social */}
          <div className="flex flex-col sm:flex-row gap-10">
            <div className="flex flex-col gap-3">
              <p className="text-xs font-700 uppercase tracking-widest text-gray-400 mb-1">Company</p>
              <a href="#services" className="nav-link text-sm">Services</a>
              <a href="#work" className="nav-link text-sm">Our Work</a>
              <a href="#process" className="nav-link text-sm">Process</a>
              <a href="#cities" className="nav-link text-sm">Cities</a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-700 uppercase tracking-widest text-gray-400 mb-1">Connect</p>
              <a href="#contact" className="nav-link text-sm">Contact</a>
              <a href="tel:+918882002378" className="nav-link text-sm">+918882002378 </a>
              <a href="mailto:contact@boothify.in" className="nav-link text-sm">contact@boothify.in</a>
              <a href="#" className="nav-link text-sm">Privacy Policy</a>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-xs font-700 uppercase tracking-widest text-gray-400 mb-1">Follow Us</p>
              <div className="flex gap-3">
                {socialLinks?.map((s) => (
                  <a
                    key={s?.label}
                    href={s?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s?.label}
                    className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-colors"
                  >
                    {s?.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-400 text-xs">
            © 2026 Boothify. Part of Bharat Network Group. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-xs text-gray-400 hover:text-violet-600 transition-colors">Privacy</a>
            <a href="#" className="text-xs text-gray-400 hover:text-violet-600 transition-colors">Terms</a>
            <a href="#contact" className="text-xs text-gray-400 hover:text-violet-600 transition-colors">Contact</a>
            <a href="/admin/login" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Admin</a>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping-slow" />
              <span className="text-xs text-gray-400">Active across 10 cities</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
