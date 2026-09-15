'use client';

import React, { useEffect, useRef, useState } from 'react';
import AdminLayout from '../AdminLayout';
import { createClient } from '@/lib/supabase/client';

interface Photo { id: string; title: string; photo_url: string; alt_text: string; category: string; is_active: boolean; display_order: number; }

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('general');
  const [altText, setAltText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function fetchPhotos() {
    const { data, error: fetchError } = await supabase.from('gallery_photos').select('*').order('display_order', { ascending: true });
    if (fetchError) setError(fetchError.message);
    setPhotos((data || []) as Photo[]); setLoading(false);
  }
  useEffect(() => { fetchPhotos(); }, []);

  function resetForm() { setTitle(''); setCategory('general'); setAltText(''); setImageUrl(''); setDisplayOrder(''); setPreview(''); if (fileInputRef.current) fileInputRef.current.value = ''; }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) { const file = e.target.files?.[0]; if (file) { setPreview(URL.createObjectURL(file)); setImageUrl(''); } }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault(); setUploading(true); setError(''); setSuccess('');
    try {
      const file = fileInputRef.current?.files?.[0];
      let finalUrl = imageUrl.trim();
      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `gallery-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('gallery-photos').upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        finalUrl = supabase.storage.from('gallery-photos').getPublicUrl(path).data.publicUrl;
      }
      if (!finalUrl) throw new Error('Please select a photo from your computer or enter an image URL.');
      const { error: insertError } = await supabase.from('gallery_photos').insert({ title: title.trim() || 'Boothify Experience', photo_url: finalUrl, alt_text: altText.trim() || title.trim() || 'Boothify gallery photo', category, is_active: true, display_order: Number(displayOrder) || (photos.length + 1) });
      if (insertError) throw insertError;
      setSuccess('Photo added successfully and will appear in the Home Page Gallery.'); resetForm(); await fetchPhotos();
    } catch (err: any) { setError(err?.message || 'Upload failed.'); }
    finally { setUploading(false); }
  }

  async function handleDelete(photo: Photo) {
    if (!confirm('Delete this photo?')) return;
    if (photo.photo_url.includes('/storage/v1/object/public/gallery-photos/')) {
      const path = photo.photo_url.split('/storage/v1/object/public/gallery-photos/')[1];
      if (path) await supabase.storage.from('gallery-photos').remove([decodeURIComponent(path)]);
    }
    const { error: deleteError } = await supabase.from('gallery_photos').delete().eq('id', photo.id);
    if (deleteError) setError(deleteError.message); else await fetchPhotos();
  }

  async function toggleActive(photo: Photo) {
    const { error: updateError } = await supabase.from('gallery_photos').update({ is_active: !photo.is_active }).eq('id', photo.id);
    if (updateError) setError(updateError.message); else await fetchPhotos();
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6"><h1 className="text-2xl font-800 text-gray-900">Gallery / Photos</h1><p className="text-gray-500 text-sm mt-1">Manage the photos shown in the Home Page Gallery.</p></div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
          <h2 className="text-base font-700 text-gray-900 mb-1">Add New Photo</h2><p className="text-xs text-gray-400 mb-5">You can upload from your computer OR use an external image URL.</p>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="grid sm:grid-cols-2 gap-4"><div><label className="block text-xs font-600 text-gray-600 mb-1.5">Title</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Photo title" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div><div><label className="block text-xs font-600 text-gray-600 mb-1.5">Category</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"><option value="general">General</option><option value="exhibition">Exhibition</option><option value="stage">Stage Production</option><option value="activation">Brand Activation</option><option value="stall">Custom Stall</option></select></div></div>
            <div><label className="block text-xs font-600 text-gray-600 mb-1.5">1. Choose photo from your computer</label><input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleFileChange} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-600 file:bg-violet-50 file:text-violet-700" /></div>
            <div><label className="block text-xs font-600 text-gray-600 mb-1.5">2. Or use image URL</label><input type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); if (e.target.value) setPreview(e.target.value); }} placeholder="https://example.com/photo.jpg" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div>
            {preview && <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 h-48"><img src={preview} alt="Photo preview" className="w-full h-full object-cover" /></div>}
            <div className="grid sm:grid-cols-2 gap-4"><div><label className="block text-xs font-600 text-gray-600 mb-1.5">Alt Text</label><input value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the image" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div><div><label className="block text-xs font-600 text-gray-600 mb-1.5">Display Order</label><input type="number" min="1" value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)} placeholder={`Next: ${photos.length + 1}`} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300" /></div></div>
            {error && <p className="text-red-600 text-sm">{error}</p>}{success && <p className="text-emerald-600 text-sm font-600">✓ {success}</p>}
            <button type="submit" disabled={uploading} className="self-start px-6 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-600 hover:bg-violet-700 disabled:opacity-50">{uploading ? 'Saving...' : 'Add Photo'}</button>
          </form>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden"><div className="px-6 py-4 border-b border-gray-100"><h2 className="text-base font-700 text-gray-900">All Photos ({photos.length})</h2></div>{loading ? <div className="p-8 text-center text-gray-400 text-sm">Loading...</div> : photos.length === 0 ? <div className="p-8 text-center text-gray-400 text-sm">No photos yet.</div> : <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{photos.map((photo) => <div key={photo.id} className="relative rounded-xl overflow-hidden border border-gray-100 bg-white"><div className="aspect-square bg-gray-50"><img src={photo.photo_url} alt={photo.alt_text || photo.title} className="w-full h-full object-cover" /></div><div className="p-3"><p className="text-xs font-600 text-gray-700 truncate">{photo.title || 'Untitled'}</p><p className="text-[10px] text-gray-400 capitalize">{photo.category} · Order {photo.display_order}</p><div className="flex gap-2 mt-2"><button onClick={() => toggleActive(photo)} className={`px-2.5 py-1 rounded-full text-[10px] font-600 ${photo.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{photo.is_active ? 'Active' : 'Inactive'}</button><button onClick={() => handleDelete(photo)} className="px-2.5 py-1 rounded-full text-[10px] font-600 bg-red-50 text-red-600">Delete</button></div></div></div>)}</div>}</div>
      </div>
    </AdminLayout>
  );
}
