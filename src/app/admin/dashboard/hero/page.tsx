'use client';

import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../AdminLayout';
import { createClient } from '@/lib/supabase/client';

interface HeroImage {
  id: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
  site: string;
}

export default function HeroImagesPage() {
  const [items, setItems] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function fetchItems() {
    const { data, error: fetchError } = await supabase.from('hero_images').select('*').eq('site', 'boothify').order('display_order', { ascending: true });
    if (fetchError) setError(fetchError.message);
    setItems((data || []) as HeroImage[]);
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  function resetForm() {
    setImageUrl('');
    setAltText('');
    setDisplayOrder('');
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setImageUrl('');
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const file = fileInputRef.current?.files?.[0];
      let finalUrl = imageUrl.trim();
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `boothify/hero-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('hero-images').upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        finalUrl = supabase.storage.from('hero-images').getPublicUrl(path).data.publicUrl;
      }
      if (!finalUrl) throw new Error('Please upload an image or enter an image URL.');
      const order = Number(displayOrder) || (items.length + 1);
      const { error: insertError } = await supabase.from('hero_images').insert({ image_url: finalUrl, alt_text: altText.trim() || 'Boothify event experience', display_order: order, is_active: true, site: 'boothify' });
      if (insertError) throw insertError;
      setSuccess('Hero image added successfully.');
      resetForm();
      await fetchItems();
    } catch (err: any) {
      setError(err?.message || 'Could not save hero image.');
    } finally { setSaving(false); }
  }

  async function toggleActive(item: HeroImage) {
    const { error: updateError } = await supabase.from('hero_images').update({ is_active: !item.is_active }).eq('id', item.id).eq('site', 'boothify');
    if (updateError) setError(updateError.message); else await fetchItems();
  }

  async function handleDelete(item: HeroImage) {
    if (!confirm('Delete this hero image?')) return;
    if (item.image_url.includes('/storage/v1/object/public/hero-images/')) {
      const path = item.image_url.split('/storage/v1/object/public/hero-images/')[1];
      if (path) await supabase.storage.from('hero-images').remove([decodeURIComponent(path)]);
    }
    const { error: deleteError } = await supabase.from('hero_images').delete().eq('id', item.id).eq('site', 'boothify');
    if (deleteError) setError(deleteError.message); else await fetchItems();
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-800 text-gray-900">Hero Images</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the rotating images shown in the Home Page hero section.</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="text-base font-700 text-gray-900 mb-1">Add Hero Image</h2>
          <p className="text-xs text-gray-400 mb-5">Choose an image from your computer OR paste an image URL. You can use either method.</p>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">1. Choose from computer</label>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleFileChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-600 file:bg-violet-50 file:text-violet-700" />
              </div>
              <div>
                <label className="block text-xs font-600 text-gray-600 mb-1.5">2. Or use image URL</label>
                <input type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); if (e.target.value) setPreview(e.target.value); }} placeholder="https://example.com/hero.jpg" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" />
              </div>
            </div>
            {preview && <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 h-48"><img src={preview} alt="Hero preview" className="w-full h-full object-cover" /></div>}
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-600 text-gray-600 mb-1.5">Alt Text</label><input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the hero image" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
              <div><label className="block text-xs font-600 text-gray-600 mb-1.5">Display Order</label><input type="number" min="1" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} placeholder={`Next: ${items.length + 1}`} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-600 font-600">✓ {success}</p>}
            <button disabled={saving} className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 disabled:opacity-50">{saving ? 'Saving...' : 'Add Hero Image'}</button>
          </form>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-base font-700 text-gray-900">All Hero Images ({items.length})</h2></div>
          {loading ? <div className="p-8 text-center text-gray-400 text-sm">Loading...</div> : items.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No hero images yet.</div> : (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
                  <div className="aspect-video bg-gray-100"><img src={item.image_url} alt={item.alt_text} className="w-full h-full object-cover" /></div>
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3"><span className="text-xs font-700 text-gray-500">Order #{item.display_order}</span><button onClick={() => toggleActive(item)} className={`px-3 py-1 rounded-full text-xs font-600 ${item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{item.is_active ? 'Active' : 'Inactive'}</button></div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.alt_text}</p>
                    <button onClick={() => handleDelete(item)} className="mt-4 text-xs font-600 text-red-500 hover:text-red-700">Delete image</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
