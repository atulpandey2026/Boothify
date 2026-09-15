'use client';

import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../AdminLayout';
import { createClient } from '@/lib/supabase/client';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  alt_text: string;
  category: string;
  category_label: string;
  display_order: number;
  is_active: boolean;
  site: string;
}

const categories = [
  { value: 'stages', label: 'Stage' },
  { value: 'booths', label: 'Booth' },
  { value: 'mezzanines', label: 'Mezzanine' },
  { value: 'experiences', label: 'Experience' },
];

export default function PortfolioAdminPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('booths');
  const [altText, setAltText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function fetchItems() {
    const { data, error: fetchError } = await supabase.from('portfolio_items').select('*').eq('site', 'boothify').order('display_order', { ascending: true });
    if (fetchError) setError(fetchError.message);
    setItems((data || []) as PortfolioItem[]);
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  function resetForm() {
    setTitle(''); setDescription(''); setCategory('booths'); setAltText(''); setImageUrl(''); setDisplayOrder(''); setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) { setPreview(URL.createObjectURL(file)); setImageUrl(''); }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError(''); setSuccess('');
    try {
      if (!title.trim()) throw new Error('Please enter a work/project title.');
      const file = fileInputRef.current?.files?.[0];
      let finalUrl = imageUrl.trim();
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `boothify/portfolio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('portfolio-images').upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        finalUrl = supabase.storage.from('portfolio-images').getPublicUrl(path).data.publicUrl;
      }
      if (!finalUrl) throw new Error('Please upload an image or enter an image URL.');
      const label = categories.find((c) => c.value === category)?.label || 'Experience';
      const { error: insertError } = await supabase.from('portfolio_items').insert({ title: title.trim(), description: description.trim(), image_url: finalUrl, alt_text: altText.trim() || title.trim(), category, category_label: label, display_order: Number(displayOrder) || (items.length + 1), is_active: true, site: 'boothify' });
      if (insertError) throw insertError;
      setSuccess('Our Finest Work item added successfully.'); resetForm(); await fetchItems();
    } catch (err: any) { setError(err?.message || 'Could not save portfolio item.'); }
    finally { setSaving(false); }
  }

  async function toggleActive(item: PortfolioItem) {
    const { error: updateError } = await supabase.from('portfolio_items').update({ is_active: !item.is_active }).eq('id', item.id).eq('site', 'boothify');
    if (updateError) setError(updateError.message); else await fetchItems();
  }

  async function handleDelete(item: PortfolioItem) {
    if (!confirm(`Delete “${item.title}”?`)) return;
    if (item.image_url.includes('/storage/v1/object/public/portfolio-images/')) {
      const path = item.image_url.split('/storage/v1/object/public/portfolio-images/')[1];
      if (path) await supabase.storage.from('portfolio-images').remove([decodeURIComponent(path)]);
    }
    const { error: deleteError } = await supabase.from('portfolio_items').delete().eq('id', item.id).eq('site', 'boothify');
    if (deleteError) setError(deleteError.message); else await fetchItems();
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6"><h1 className="text-2xl font-800 text-gray-900">Our Finest Work</h1><p className="text-gray-500 text-sm mt-1">Manage the projects displayed in the Home Page portfolio section.</p></div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="text-base font-700 text-gray-900 mb-1">Add New Work</h2>
          <p className="text-xs text-gray-400 mb-5">Use an image from your computer or paste an image URL.</p>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className="block text-xs font-600 text-gray-600 mb-1.5">Title *</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Premium Exhibition Booth" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
              <div><label className="block text-xs font-600 text-gray-600 mb-1.5">Category *</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300">{categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
            </div>
            <div><label className="block text-xs font-600 text-gray-600 mb-1.5">Description</label><textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description of this project" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
            <div className="grid lg:grid-cols-2 gap-5">
              <div><label className="block text-xs font-600 text-gray-600 mb-1.5">1. Choose image from computer</label><input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleFileChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-600 file:bg-violet-50 file:text-violet-700" /></div>
              <div><label className="block text-xs font-600 text-gray-600 mb-1.5">2. Or use image URL</label><input type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); if (e.target.value) setPreview(e.target.value); }} placeholder="https://example.com/project.jpg" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
            </div>
            {preview && <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 h-48"><img src={preview} alt="Preview" className="w-full h-full object-cover" /></div>}
            <div className="grid sm:grid-cols-2 gap-4"><div><label className="block text-xs font-600 text-gray-600 mb-1.5">Alt Text</label><input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the project image" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div><div><label className="block text-xs font-600 text-gray-600 mb-1.5">Display Order</label><input type="number" min="1" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} placeholder={`Next: ${items.length + 1}`} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div></div>
            {error && <p className="text-sm text-red-600">{error}</p>}{success && <p className="text-sm text-emerald-600 font-600">✓ {success}</p>}
            <button disabled={saving} className="px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 disabled:opacity-50">{saving ? 'Saving...' : 'Add Work'}</button>
          </form>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-base font-700 text-gray-900">All Work ({items.length})</h2></div>
          {loading ? <div className="p-8 text-center text-gray-400 text-sm">Loading...</div> : items.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No work items yet.</div> : (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
                  <div className="aspect-[4/3] bg-gray-100"><img src={item.image_url} alt={item.alt_text} className="w-full h-full object-cover" /></div>
                  <div className="p-4"><div className="flex items-center justify-between gap-3"><span className="text-[10px] font-700 uppercase tracking-wider text-violet-600">{item.category_label}</span><button onClick={() => toggleActive(item)} className={`px-3 py-1 rounded-full text-xs font-600 ${item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{item.is_active ? 'Active' : 'Inactive'}</button></div><h3 className="text-sm font-700 text-gray-900 mt-2">{item.title}</h3>{item.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>}<p className="text-[10px] text-gray-400 mt-2">Display order: {item.display_order}</p><button onClick={() => handleDelete(item)} className="mt-3 text-xs font-600 text-red-500 hover:text-red-700">Delete</button></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
