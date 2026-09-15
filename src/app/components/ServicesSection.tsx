import React from 'react';

interface Service {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  colSpan?: string;
}

const services: Service[] = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
    iconBg: 'bg-violet-100 text-violet-600',
    title: 'Exhibition Booth Design',
    description: 'Custom layouts, print production & full brand identity systems that make you the standout at any expo.',
    colSpan: 'md:col-span-2 lg:col-span-1',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    iconBg: 'bg-emerald-100 text-emerald-600',
    title: 'Brand Activations',
    description: 'Immersive campaigns that create lasting consumer connections and measurable brand recall.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    iconBg: 'bg-blue-100 text-blue-600',
    title: 'Stage Production',
    description: 'Technical staging, lighting rigs, trussing & live production management for world-class performances.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    iconBg: 'bg-pink-100 text-pink-600',
    title: 'Conferences & Summits',
    description: 'End-to-end event management for high-impact gatherings — from 50-person boardrooms to 5,000-seat summits.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    iconBg: 'bg-amber-100 text-amber-600',
    title: 'Custom Stall Fabrication',
    description: 'Precision-engineered structures built to your exact specification using premium materials and finishes.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    iconBg: 'bg-cyan-100 text-cyan-600',
    title: 'Experiential Marketing',
    description: 'Transforming spaces into unforgettable brand stories that audiences remember long after the event ends.',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-pad px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-label mb-5 inline-flex">Our Expertise</span>
          <h2 className="text-section-title font-800 text-gray-900">
            What We Deliver
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Six core capabilities, one unified mission — to build experiences that move people.
          </p>
        </div>

        {/* Services grid — asymmetric bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <div
              key={i}
              className={`card-hover bg-white border border-gray-100 rounded-2xl p-7 flex flex-col gap-4 shadow-sm ${service.colSpan ?? ''}`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${service.iconBg}`}>
                {service.icon}
              </div>
              <h3 className="text-lg font-700 text-gray-900 leading-tight">
                {service.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">
                {service.description}
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs font-700 text-violet-600 hover:gap-2.5 transition-all duration-200 uppercase tracking-wider mt-1"
              >
                Learn More
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}