import React from 'react';
import UtilityBar from './components/UtilityBar';
import MediaMarquee from './components/MediaMarquee';
import Header from '@/components/Header';
import HeroSection from './components/HeroSection';
import StatsBar from './components/StatsBar';
import PortfolioSection from './components/PortfolioSection';
import GallerySection from './components/GallerySection';
import ServicesSection from './components/ServicesSection';
import ProcessSection from './components/ProcessSection';
import CitiesSection from './components/CitiesSection';
import ClienteleSection from './components/ClienteleSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import NewsMarquee from './components/NewsMarquee';
import Footer from '@/components/Footer';
import AdminLoginTab from './components/AdminLoginTab';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Utility bar — fixed top, z-60 (40px tall) */}
      <UtilityBar />

      {/* Media coverage marquee — fixed below utility bar (44px below) */}
      <div
        className="fixed left-0 right-0 z-50"
        style={{ top: '40px' }}
      >
        <MediaMarquee />
      </div>

      {/* Header — fixed, offset by utility (40px) + media marquee (~44px) = 84px */}
      <Header />

      {/* Main content — offset by utility (40px) + media marquee (44px) = 84px */}
      <main style={{ paddingTop: '84px' }}>
        <HeroSection />
        <StatsBar />
        <PortfolioSection />
        <GallerySection />
        <ServicesSection />
        <ProcessSection />
        <ClienteleSection />
        <TestimonialsSection />
        <CitiesSection />
        <ContactSection />
        <NewsMarquee />
      </main>

      <Footer />

      {/* Admin Login Tab — fixed at bottom */}
      <AdminLoginTab />
    </div>
  );
}