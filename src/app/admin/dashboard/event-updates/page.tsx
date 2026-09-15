'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../AdminLayout';
import { createClient } from '@/lib/supabase/client';

interface EventUpdate {
  id: string;
  event_name: string;
  event_date: string;
  location: string;
  display_order: number;
  is_active: boolean;
  site: string;
}

const emptyForm = { event_name: '', event_date: '', location: '', display_order: '' };

export default function EventUpdatesPage() {
  const [items, setItems] = useState<EventUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const supabase = createClient();

  async function fetchItems() {
    const { data, error: fetchError } = await supabase
      .from('event_updates')
      .select('*')
      .eq('site', 'boothify')
      .order('display_order', { ascending: true });
    if (fetchError) setError(fetchError.message);
    setItems((data || []) as EventUpdate[]);
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditId(null);
    setError('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (!form.event_name.trim() || !form.event_date.trim() || !form.location.trim()) {
        throw new Error('Event name, date, and location are required.');
      }
      const payload = {
        event_name: form.event_name.trim(),
        event_date: form.event_date.trim(),
        location: form.location.trim(),
        display_order: Number(form.display_order) || (editId ? items.find((item) => item.id === editId)?.display_order || 1 : items.length + 1),
        site: 'boothify',
        is_active: true,
      };

      const wasEditing = Boolean(editId);
      if (editId) {
        const { error: updateError } = await supabase
          .from('event_updates')
          .update(payload)
          .eq('id', editId)
          .eq('site', 'boothify');
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('event_updates').insert(payload);
        if (insertError) throw insertError;
      }
      resetForm();
      setSuccess(wasEditing ? 'Event update updated successfully.' : 'Event update added successfully.');
      await fetchItems();
    } catch (err: any) {
      setError(err?.message || 'Could not save event update.');
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item: EventUpdate) {
    setEditId(item.id);
    setForm({ event_name: item.event_name, event_date: item.event_date, location: item.location, display_order: String(item.display_order) });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(item: EventUpdate) {
    if (!confirm(`Delete "${item.event_name}"?`)) return;
    const { error: deleteError } = await supabase.from('event_updates').delete().eq('id', item.id).eq('site', 'boothify');
    if (deleteError) setError(deleteError.message);
    else {
      setSuccess('Event update deleted.');
      await fetchItems();
    }
  }

  async function toggleActive(item: EventUpdate) {
    const { error: updateError } = await supabase
      .from('event_updates')
      .update({ is_active: !item.is_active })
      .eq('id', item.id)
      .eq('site', 'boothify');
    if (updateError) setError(updateError.message);
    else await fetchItems();
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-800 text-gray-900">Event Updates</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the three upcoming events shown on the right side of the Home Page hero section.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-700 text-gray-900">{editId ? 'Edit Event' : 'Add Upcoming Event'}</h2>
              <p className="text-xs text-gray-400 mt-1">Only the first three active events are displayed in the hero card.</p>
            </div>
            {editId && <button type="button" onClick={resetForm} className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-600 text-gray-600 hover:bg-gray-50">Cancel</button>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Event Name *</label>
                <input name="event_name" value={form.event_name} onChange={handleChange} placeholder="Event Name 1" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Date *</label>
                <input name="event_date" value={form.event_date} onChange={handleChange} placeholder="Date" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Location *</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>
            </div>
            <div className="max-w-xs">
              <label className="block text-xs font-600 text-gray-600 mb-1.5">Display Order</label>
              <input type="number" min="1" name="display_order" value={form.display_order} onChange={handleChange} placeholder={`Next: ${items.length + 1}`} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-600 font-600">✓ {success}</p>}
            <button type="submit" disabled={saving} className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 disabled:opacity-50">
              {saving ? 'Saving...' : editId ? 'Update Event' : 'Add Event'}
            </button>
          </form>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-700 text-gray-900">Upcoming Events ({items.length})</h2>
            <span className="text-xs text-gray-400">Boothify</span>
          </div>
          {loading ? <div className="p-8 text-center text-gray-400 text-sm">Loading...</div> : items.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No events yet.</div> : (
            <ul className="divide-y divide-gray-50">
              {items.map((item) => (
                <li key={item.id} className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center text-sm font-800 flex-shrink-0">{item.display_order}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-700 text-gray-900">{item.event_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.event_date}, {item.location}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleActive(item)} className={`px-3 py-1 rounded-full text-xs font-600 ${item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{item.is_active ? 'Active' : 'Inactive'}</button>
                      <button onClick={() => startEdit(item)} className="p-2 rounded-lg text-gray-400 hover:bg-violet-50 hover:text-violet-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(item)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600">
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
