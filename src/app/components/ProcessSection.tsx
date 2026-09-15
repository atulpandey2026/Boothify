import React from 'react';

const steps = [
  {
    num: '01',
    title: 'Discovery',
    description: 'We learn your brand, objectives, and vision through a deep-dive consultation.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    iconBg: 'bg-violet-100 text-violet-600 group-hover:bg-violet-600 group-hover:text-white',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.34-4.34" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Design',
    description: 'Our creatives craft 3D concepts, mood boards, and detailed renderings for your approval.',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    iconBg: 'bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Build',
    description: 'Expert fabricators bring designs to life with precision craftsmanship and premium materials.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    iconBg: 'bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Launch',
    description: 'On-site installation, live event management, and post-event breakdown — fully handled.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    ),
  },
];

export default function ProcessSection() {
  return (
    <section id="process" className="section-pad px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Background blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] blob-vibrant pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label mb-5 inline-flex">How We Work</span>
          <h2 className="text-section-title font-800 text-gray-900">
            Dream It. Design It. Build It. Launch It.
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto leading-relaxed">
            A proven four-step process that takes your vision from brief to reality.
          </p>
        </div>

        {/* Steps — horizontal cards with connectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps?.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector arrow (desktop only) */}
              {i < steps?.length - 1 && (
                <div className="hidden lg:flex absolute top-8 right-0 translate-x-1/2 z-20 items-center justify-center w-8">
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                    <path d="M0 8h20M16 2l6 6-6 6" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}

              <div className={`bg-white border ${step?.border} rounded-2xl p-7 h-full flex flex-col gap-5 hover:shadow-md transition-all duration-300 group`}>
                {/* Step number + icon */}
                <div className="flex items-center justify-between">
                  <span className={`text-4xl font-800 ${step?.color} opacity-20 leading-none`}>{step?.num}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${step?.iconBg}`}>
                    {step?.icon}
                  </div>
                </div>
                <h3 className="text-xl font-700 text-gray-900">{step?.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1">{step?.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}