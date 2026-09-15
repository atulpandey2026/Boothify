'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../AdminLayout';
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

const emptyForm = { quote: '', author_name: '', author_role: '', author_company: '', rating: 5 };

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const supabase = createClient();

  async function fetchItems() {
    const { data } = await supabase.from('testimonials').select('*').order('display_order', { ascending: true });
    setItems(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.quote.trim() || !form.author_name.trim()) { setError('Quote and author name are required.'); return; }
    setSaving(true);
    setError('');
    try {
      if (editId) {
        const { error: err } = await supabase.from('testimonials').update({ ...form, rating: Number(form.rating) }).eq('id', editId);
        if (err) throw err;
        setEditId(null);
      } else {
        const { error: err } = await supabase.from('testimonials').insert({ ...form, rating: Number(form.rating), is_active: true, display_order: items.length + 1 });
        if (err) throw err;
      }
      setForm(emptyForm);
      await fetchItems();
    } catch (err: any) {
      setError(err?.message || 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: Testimonial) {
    setEditId(item.id);
    setForm({ quote: item.quote, author_name: item.author_name, author_role: item.author_role, author_company: item.author_company, rating: item.rating });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditId(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    await fetchItems();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('testimonials').update({ is_active: !current }).eq('id', id);
    await fetchItems();
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-800 text-gray-900">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, and manage client testimonials shown on the website.</p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="text-base font-700 text-gray-900 mb-4">{editId ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-600 text-gray-600 mb-1.5">Quote *</label>
              <textarea
                name="quote"
                value={form.quote}
                onChange={handleChange}
                rows={3}
                placeholder="What did the client say?"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Author Name *</label>
                <input type="text" name="author_name" value={form.author_name} onChange={handleChange} placeholder="Rajesh Sharma" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Role / Designation</label>
                <input type="text" name="author_role" value={form.author_role} onChange={handleChange} placeholder="Head of Marketing" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Company</label>
                <input type="text" name="author_company" value={form.author_company} onChange={handleChange} placeholder="Tata Consumer Products" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Rating (1–5)</label>
                <select name="rating" value={form.rating} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : editId ? 'Update' : 'Add Testimonial'}
              </button>
              {editId && (
                <button type="button" onClick={cancelEdit} className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-600 text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-700 text-gray-900">All Testimonials ({items.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No testimonials yet.</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {items.map((item) => (
                <li key={item.id} className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-700 flex-shrink-0">
                      {item.author_name?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-600 text-gray-900">{item.author_name} <span className="font-400 text-gray-500">— {item.author_role}, {item.author_company}</span></p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.quote}</p>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleActive(item.id, item.is_active)} className={`px-3 py-1 rounded-full text-xs font-600 transition-colors ${item.is_active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button onClick={() => startEdit(item)} className="p-2 rounded-lg text-gray-400 hover:bg-violet-50 hover:text-violet-600 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
