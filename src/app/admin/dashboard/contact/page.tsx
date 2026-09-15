'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../AdminLayout';
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

export default function ContactPage() {
  const [contact, setContact] = useState<ContactDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ contact_name: '', contact_role: '', phone: '', email: '', address: '', company: '' });
  const supabase = createClient();

  useEffect(() => {
    async function fetchContact() {
      const { data } = await supabase.from('contact_details').select('*').eq('is_active', true).limit(1).maybeSingle();
      if (data) {
        setContact(data);
        setForm({ contact_name: data.contact_name, contact_role: data.contact_role, phone: data.phone, email: data.email, address: data.address || '', company: data.company });
      }
      setLoading(false);
    }
    fetchContact();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.contact_name.trim() || !form.email.trim()) { setError('Name and email are required.'); return; }
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      if (contact) {
        const { error: err } = await supabase.from('contact_details').update(form).eq('id', contact.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('contact_details').insert({ ...form, is_active: true });
        if (err) throw err;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-800 text-gray-900">Contact Details</h1>
          <p className="text-gray-500 text-sm mt-1">Edit the contact information shown in the Contact section.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          {loading ? (
            <div className="py-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-600 text-gray-600 mb-1.5">Contact Name *</label>
                  <input type="text" name="contact_name" value={form.contact_name} onChange={handleChange} placeholder="Mr. Ankur Srivastava" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
                <div>
                  <label className="block text-xs font-600 text-gray-600 mb-1.5">Role / Designation</label>
                  <input type="text" name="contact_role" value={form.contact_role} onChange={handleChange} placeholder="Lead Contact — Boothify" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-600 text-gray-600 mb-1.5">Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 79820 32246" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
                <div>
                  <label className="block text-xs font-600 text-gray-600 mb-1.5">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="contact@boothify.in" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Company</label>
                <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Bharat Network Group" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Address (optional)</label>
                <textarea name="address" value={form.address} onChange={handleChange} rows={3} placeholder="Office address..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none" />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              {saved && <p className="text-emerald-600 text-sm font-600">✓ Contact details saved successfully!</p>}
              <button type="submit" disabled={saving} className="self-start px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
