'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface ContactDetail {
  id: string;
  contact_name: string;
  contact_role: string;
  phone: string;
  email: string;
  address: string;
  company: string;
}

const fallbackContact: ContactDetail = {
  id: 'fallback',
  contact_name: 'Mr. Ankur Srivastava',
  contact_role: 'Lead Contact — Boothify',
  phone: '+91 79820 32246',
  email: 'contact@boothify.in',
  address: '',
  company: 'Bharat Network Group',
};

const fallbackCities = [
  'Delhi',
  'Mumbai',
  'Lucknow',
  'Chennai',
  'Bengaluru',
  'Ahmedabad',
  'Hyderabad',
  'Jaipur',
  'Chandigarh',
  'Noida',
];

const eventTypes = [
  'Exhibition Booth',
  'Stage Production',
  'Brand Activation',
  'Conference / Summit',
  'Custom Stall',
  'Experiential Marketing',
  'Other',
];

export default function ContactSection() {
  const [contact, setContact] =
    useState<ContactDetail>(fallbackContact);

  const [cities, setCities] = useState<string[]>(fallbackCities);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    eventType: '',
    message: '',
  });

  useEffect(() => {
    async function fetchContactData() {
      try {
        const supabase = createClient();

        const [contactResult, citiesResult] = await Promise.all([
          supabase
            .from('contact_details')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .maybeSingle(),

          supabase
            .from('cities')
            .select('name')
            .eq('is_active', true)
            .order('display_order', { ascending: true }),
        ]);

        if (!contactResult.error && contactResult.data) {
          setContact(contactResult.data);
        }

        if (
          !citiesResult.error &&
          citiesResult.data &&
          citiesResult.data.length > 0
        ) {
          setCities(citiesResult.data.map((city) => city.name));
        }
      } catch (err) {
        console.error('Failed to load contact information:', err);
      }
    }

    fetchContactData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError('');

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from('form_responses')
        .insert({
          name: form.name,
          email: form.email,
          phone: form.phone,
          city: form.city,
          event_type: form.eventType,
          message: form.message,
          status: 'new',
        });

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="section-pad px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
    >
      {/* BG blob */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] blob-vibrant pointer-events-none opacity-30" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] blob-vibrant pointer-events-none opacity-20" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="section-label mb-5 inline-flex">
            Get In Touch
          </span>

          <h2 className="text-section-title font-800 text-gray-900">
            Ready to Build Something
            <br className="hidden md:block" />
            {' '}Extraordinary?
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left — Contact info */}
          <div className="flex flex-col gap-6">

            {/* Lead contact card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">

              <p className="text-xs font-700 uppercase tracking-widest text-violet-600 mb-5">
                Lead Contact
              </p>

              <div className="flex items-start gap-4 mb-7">

                <div className="w-14 h-14 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>

                <div>
                  <p className="font-700 text-gray-900 text-xl">
                    {contact.contact_name}
                  </p>

                  <p className="text-gray-500 text-sm mt-1">
                    {contact.contact_role}
                  </p>

                  <p className="text-xs text-violet-500 mt-1 font-600">
                    Part of {contact.company || 'Bharat Network Group'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">

                <a
                  href={`tel:${contact.phone?.replace(/\s+/g, '')}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>

                  <span className="font-600 text-gray-800 group-hover:text-violet-600 transition-colors">
                    {contact.phone}
                  </span>
                </a>

                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>

                  <span className="font-600 text-gray-800 group-hover:text-violet-600 transition-colors">
                    {contact.email}
                  </span>
                </a>

              </div>
            </div>

            {/* Cities quick list */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">

              <p className="text-xs font-700 uppercase tracking-wider text-gray-400 mb-3">
                Serving
              </p>

              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <span
                    key={city}
                    className="text-xs font-600 text-gray-700 bg-white border border-gray-200 rounded-full px-3 py-1"
                  >
                    {city}
                  </span>
                ))}
              </div>

            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">

            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-4">

                <div className="w-16 h-16 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                </div>

                <h3 className="text-xl font-700 text-gray-900">
                  Message Sent!
                </h3>

                <p className="text-gray-500 text-sm max-w-xs">
                  Thank you for reaching out. {contact.contact_name} will get
                  back to you within 24 hours.
                </p>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: '',
                      email: '',
                      phone: '',
                      city: '',
                      eventType: '',
                      message: '',
                    });
                  }}
                  className="btn-primary mt-2 text-sm"
                >
                  Send Another
                </button>

              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5"
              >

                <div className="grid sm:grid-cols-2 gap-5">

                  <div>
                    <label className="form-label">
                      Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="John Smith"
                      className="form-input"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="example@gmail.com"
                      className="form-input"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                </div>

                <div className="grid sm:grid-cols-2 gap-5">

                  <div>
                    <label className="form-label">
                      Phone *
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      className="form-input"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      City
                    </label>

                    <select
                      name="city"
                      className="form-input"
                      value={form.city}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select City
                      </option>

                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                <div>
                  <label className="form-label">
                    Event Type
                  </label>

                  <select
                    name="eventType"
                    className="form-input"
                    value={form.eventType}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Event Type
                    </option>

                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label">
                    Message
                  </label>

                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us about your project..."
                    className="form-input resize-none"
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>

                {error && (
                  <p className="text-red-600 text-sm">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60"
                >
                  {submitting
                    ? 'Sending...'
                    : 'Send Message →'}
                </button>

              </form>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}