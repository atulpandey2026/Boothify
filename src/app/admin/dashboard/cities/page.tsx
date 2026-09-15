'use client';

import React, { useEffect, useState } from 'react';
import AdminLayout from '../AdminLayout';
import { createClient } from '@/lib/supabase/client';

interface City {
  id: string;
  name: string;
  emoji: string;
  color: string;
  is_active: boolean;
  display_order: number;
}

const colorOptions = [
  { label: 'Violet', value: '#7C3AED' },
  { label: 'Pink', value: '#EC4899' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Cyan', value: '#06B6D4' },
  { label: 'Fuchsia', value: '#D946EF' },
  { label: 'Orange', value: '#F97316' },
  { label: 'Emerald', value: '#10B981' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Purple', value: '#8B5CF6' },
  { label: 'Red', value: '#EF4444' },
];

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🏙️');
  const [newColor, setNewColor] = useState('#7C3AED');
  const supabase = createClient();

  async function fetchCities() {
    const { data } = await supabase.from('cities').select('*').order('display_order', { ascending: true });
    setCities(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchCities(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) { setError('City name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const { error: err } = await supabase.from('cities').insert({
        name: newName.trim(),
        emoji: newEmoji.trim() || '🏙️',
        color: newColor,
        is_active: true,
        display_order: cities.length + 1,
      });
      if (err) throw err;
      setNewName('');
      setNewEmoji('🏙️');
      setNewColor('#7C3AED');
      await fetchCities();
    } catch (err: any) {
      setError(err?.message || 'Failed to add city.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this city?')) return;
    await supabase.from('cities').delete().eq('id', id);
    await fetchCities();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('cities').update({ is_active: !current }).eq('id', id);
    await fetchCities();
  }

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-800 text-gray-900">Cities</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the cities shown in the Pan-India Operations section.</p>
        </div>

        {/* Add form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="text-base font-700 text-gray-900 mb-4">Add New City</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">City Name *</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Pune" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Emoji</label>
                <input type="text" value={newEmoji} onChange={(e) => setNewEmoji(e.target.value)} placeholder="🏙️" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Color</label>
                <select value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">
                  {colorOptions.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={saving} className="self-start px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 disabled:opacity-50 transition-colors">
              {saving ? 'Adding...' : 'Add City'}
            </button>
          </form>
        </div>

        {/* Cities list */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-700 text-gray-900">All Cities ({cities.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : cities.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No cities yet.</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {cities.map((city) => (
                <li key={city.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: city.color + '20' }}>
                    {city.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-600 text-gray-900">{city.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: city.color }} />
                      <span className="text-xs text-gray-400">{city.color}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(city.id, city.is_active)} className={`px-3 py-1 rounded-full text-xs font-600 transition-colors ${city.is_active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {city.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => handleDelete(city.id)} className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
                    </button>
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
