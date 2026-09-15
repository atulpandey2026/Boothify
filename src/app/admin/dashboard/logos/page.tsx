'use client';

import React, { useEffect, useState, useRef } from 'react';
import AdminLayout from '../AdminLayout';
import { createClient } from '@/lib/supabase/client';

interface Logo {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  display_order: number;
  is_active: boolean;
}

export default function LogosPage() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function fetchLogos() {
    const { data, error } = await supabase
      .from('clientele_logos')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error) setLogos(data || []);
    setLoading(false);
  }

  useEffect(() => { fetchLogos(); }, []);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) { setError('Please enter a client name.'); return; }
    const file = fileInputRef.current?.files?.[0];
    setUploading(true);
    setError('');
    try {
      let logoUrl = '';
      if (file) {
        const ext = file.name.split('.').pop();
        const path = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('clientele-logos').upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('clientele-logos').getPublicUrl(path);
        logoUrl = publicUrl;
      }
      const { error: insertError } = await supabase.from('clientele_logos').insert({
        name: newName.trim(),
        logo_url: logoUrl,
        website_url: newWebsite.trim(),
        display_order: logos.length + 1,
        is_active: true,
      });
      if (insertError) throw insertError;
      setNewName('');
      setNewWebsite('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchLogos();
    } catch (err: any) {
      setError(err?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string, logoUrl: string) {
    if (!confirm('Delete this logo?')) return;
    if (logoUrl) {
      const path = logoUrl.split('/clientele-logos/')[1];
      if (path) await supabase.storage.from('clientele-logos').remove([path]);
    }
    await supabase.from('clientele_logos').delete().eq('id', id);
    await fetchLogos();
  }

  async function toggleActive(id: string, current: boolean) {
    await supabase.from('clientele_logos').update({ is_active: !current }).eq('id', id);
    await fetchLogos();
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-800 text-gray-900">Clientele Logos</h1>
          <p className="text-gray-500 text-sm mt-1">Upload and manage client logos shown in the Clientele section.</p>
        </div>

        {/* Add form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="text-base font-700 text-gray-900 mb-4">Add New Logo</h2>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Client Name *</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Tata Group"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">Website URL (optional)</label>
                <input
                  type="url"
                  value={newWebsite}
                  onChange={(e) => setNewWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-600 text-gray-600 mb-1.5">Logo Image (optional)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-600 file:bg-violet-50 file:text-violet-700"
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={uploading}
              className="self-start px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 disabled:opacity-50 transition-colors"
            >
              {uploading ? 'Uploading...' : 'Add Logo'}
            </button>
          </form>
        </div>

        {/* Logos list */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-base font-700 text-gray-900">All Logos ({logos.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
          ) : logos.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No logos yet. Add your first one above.</div>
          ) : (
            <ul className="divide-y divide-gray-50">
              {logos.map((logo) => (
                <li key={logo.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {logo.logo_url ? (
                      <img src={logo.logo_url} alt={logo.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-xs font-700 text-gray-400">{logo.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-600 text-gray-900 truncate">{logo.name}</p>
                    {logo.website_url && (
                      <a href={logo.website_url} target="_blank" rel="noreferrer" className="text-xs text-violet-500 hover:underline truncate block">{logo.website_url}</a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(logo.id, logo.is_active)}
                      className={`px-3 py-1 rounded-full text-xs font-600 transition-colors ${logo.is_active ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {logo.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDelete(logo.id, logo.logo_url)}
                      className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" /><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6" />
                        <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                      </svg>
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
